from api.database.mongo_client import MongoDBClient
from api.tools.database.models import (
    WhiteListURLData,
    WhiteListQueryParameters,
    URLEntry,
    AddEntryResponse,
    WhiteListQueryResponse,
    RegulationNode,
    ComplianceNode
)
from typing import List


async def get_whitelist_collection_operation(mongo_client: MongoDBClient) -> List:
    async with mongo_client.get_db("ReguMatch") as db:
        collection = db["whitelist_urls"]
        return await collection.find().to_list(length=None)


async def add_new_entry_to_whitelist_operation(
    mongo_client: MongoDBClient, entry: WhiteListURLData
) -> AddEntryResponse:
    async with mongo_client.get_db("ReguMatch") as db:
        collection = db["whitelist_urls"]

        country_name = entry.country_information.country_name
        province = entry.country_information.province or "all"
        category_name = entry.category_information.category_name
        subcategory = entry.category_information.subcategory or "all"
        urls = [url.model_dump() for url in entry.urls]

        response_doc = {
            "_id": country_name,
            province: {category_name: {subcategory: urls}},
        }

        try:
            country_doc = await collection.find_one({"_id": country_name})
            if not country_doc:
                # Create entire structure from scratch
                new_doc = {
                    "_id": country_name,
                    province: {category_name: {subcategory: urls}},
                }
                await collection.insert_one(new_doc)
                print("New country document created:", new_doc)

                return AddEntryResponse(
                    success=True,
                    message="New country document created",
                    response_document=new_doc,
                )

            if province not in country_doc:
                # Add new province
                await collection.update_one(
                    {"_id": country_name},
                    {"$set": {province: {category_name: {subcategory: urls}}}},
                )
                print(f"Added new province: {province}")
                return AddEntryResponse(
                    success=True,
                    message=f"Added new province: {province}",
                    response_document=response_doc,
                )

            if category_name not in country_doc[province]:
                # Add new category
                await collection.update_one(
                    {"_id": country_name},
                    {"$set": {f"{province}.{category_name}": {subcategory: urls}}},
                )
                print(f"Added new category: {category_name}")
                return AddEntryResponse(
                    success=True,
                    message=f"Added new category: {category_name}",
                    response_document=response_doc,
                )

            if subcategory not in country_doc[province][category_name]:
                # Add new subcategory
                await collection.update_one(
                    {"_id": country_name},
                    {"$set": {f"{province}.{category_name}.{subcategory}": urls}},
                )
                print(f"Added new subcategory: {subcategory}")
                return AddEntryResponse(
                    success=True,
                    message=f"Added new subcategory: {subcategory}",
                    response_document=response_doc,
                )

            existing_urls = country_doc[province][category_name][subcategory]
            existing_url_set = {url_obj["url"] for url_obj in existing_urls}
            new_urls = [url for url in urls if url["url"] not in existing_url_set]

            if not new_urls:
                print(f"All URLs already exist in whitelist")
                return AddEntryResponse(
                    success=True,
                    message=f"All URLs already exist in whitelist",
                    response_document=response_doc,
                )

            await collection.update_one(
                {"_id": country_name},
                {
                    "$push": {
                        f"{province}.{category_name}.{subcategory}": {"$each": new_urls}
                    }
                },
            )
            response_doc = {
                "_id": country_name,
                province: {category_name: {subcategory: new_urls}},
            }
            print(f"Added {len(new_urls)} new URL(s) to existing subcategory")
            return AddEntryResponse(
                success=True,
                message=f"Added {len(new_urls)} new URL(s) to existing subcategory",
                response_document=response_doc,
            )

        except Exception as e:
            return AddEntryResponse(
                success=False,
                message=f"Failed to add entry to whitelist: {str(e)}",
                response_document={},
                error=str(e),
            )


async def query_white_list_collection_operation(
    mongo_client: MongoDBClient, query_parameters: WhiteListQueryParameters
) -> WhiteListQueryResponse:
    """Query whitelist collection based on nested structure"""

    country_name = query_parameters.country_name
    province_name = query_parameters.province
    category_name = query_parameters.category_name
    subcategory_name = query_parameters.subcategory

    async with mongo_client.get_db("ReguMatch") as db:
        collection = db["whitelist_urls"]

        try:
            country_doc = await collection.find_one({"_id": country_name})

            if not country_doc:
                return WhiteListQueryResponse(
                    country_present=False,
                    filters_applied={
                        "province": bool(province_name),
                        "category": bool(category_name),
                        "subcategory": bool(subcategory_name),
                    },
                    filters_matched={
                        "province": False,
                        "category": False,
                        "subcategory": False,
                    },
                    query_parameters=query_parameters,
                    result_doc={},
                    total_urls_found=0,
                )

            result = {k: v for k, v in country_doc.items() if k != "_id"}

            filters_applied = {
                "province": bool(province_name),
                "category": bool(category_name),
                "subcategory": bool(subcategory_name),
            }

            filters_matched = {
                "province": False,
                "category": False,
                "subcategory": False,
            }

            # Apply province filter
            if province_name:
                if province_name in result:
                    result = {province_name: result[province_name]}
                    filters_matched["province"] = True
                else:
                    result = {}
            
            # Apply category filter
            if category_name and result:
                filtered = {}
                for prov, prov_data in result.items():
                    if category_name in prov_data:
                        filtered[prov] = {category_name: prov_data[category_name]}
                        filters_matched["category"] = True
                result = filtered

            # Apply subcategory filter
            if subcategory_name and result:
                filtered = {}
                for prov, prov_data in result.items():
                    prov_filtered = {}
                    for cat, cat_data in prov_data.items():
                        if subcategory_name in cat_data:
                            prov_filtered[cat] = {subcategory_name: cat_data[subcategory_name]}
                            filters_matched["subcategory"] = True
                    if prov_filtered:
                        filtered[prov] = prov_filtered
                result = filtered

            return WhiteListQueryResponse(
                success=True,
                country_present=True,
                filters_applied=filters_applied,
                filters_matched=filters_matched,
                query_parameters=query_parameters,
                result_doc=result,
            )

        except Exception as e:
            print(f"Error querying whitelist: {e}")
            return WhiteListQueryResponse(
                success=False,
                country_present=False,
                filters_applied={
                    "province": bool(province_name),
                    "category": bool(category_name),
                    "subcategory": bool(subcategory_name),
                },
                filters_matched={
                    "province": False,
                    "category": False,
                    "subcategory": False,
                },
                query_parameters=query_parameters,
                result_doc={},
                error=str(e),
            )
        
async def add_regulation_node(mongo_client: MongoDBClient, regulation_node: RegulationNode):
    pass
