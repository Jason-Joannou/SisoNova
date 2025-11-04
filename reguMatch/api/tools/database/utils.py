from api.database.mongo_client import MongoDBClient
from api.tools.database.models import (
    WhiteListURLData,
    WhiteListQueryParameters,
    URLEntry,
    AddEntryResponse,
    WhiteListQueryResponse,
    RegulationNode,
    ComplianceNode,
    AvailableKeysInCollectionResponse,
    DatabaseQueryParameters
)
from typing import List, Dict
from datetime import datetime
import flatdict


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
                    success=True,
                    message=f"Whitelist collection is empty",
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
                            prov_filtered[cat] = {
                                subcategory_name: cat_data[subcategory_name]
                            }
                            filters_matched["subcategory"] = True
                    if prov_filtered:
                        filtered[prov] = prov_filtered
                result = filtered

            return WhiteListQueryResponse(
                success=True,
                message=f"Retrieved {len(result)} country document(s) from whitelist",
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
                message=f"Failed to query whitelist: {str(e)}",
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


async def add_regulation_node_operation(
    mongo_client: MongoDBClient, regulation_node: RegulationNode
):
    try:
        async with mongo_client.get_db("ReguMatch") as db:
            collection = db["regulations"]

            # Base requirements
            country_name = regulation_node.location_information.country_name
            province_name = regulation_node.location_information.province
            category_name = regulation_node.industry_information.category_name
            subcategory_name = regulation_node.industry_information.subcategory

            regulation_compliance_type = (
                regulation_node.regulation_compliance_type.value
            )

            # Build regulation document
            regulation_doc = {
                "regulation_name": regulation_node.regulation_name,
                "regulation_description": regulation_node.regulation_description,
                "regulation_webpage": regulation_node.regulation_webpage,
                "regulation_pdf_urls": (
                    [
                        url_info.model_dump()
                        for url_info in regulation_node.regulation_pdf_urls
                    ]
                    if regulation_node.regulation_pdf_urls
                    else []
                ),
                "required_fields": (
                    [
                        field_info.model_dump()
                        for field_info in regulation_node.required_fields
                    ]
                    if regulation_node.required_fields
                    else []
                ),
                "required_licenses": (
                    [
                        license_info.model_dump()
                        for license_info in regulation_node.required_licenses
                    ]
                    if regulation_node.required_licenses
                    else []
                ),
                "required_certificates": (
                    [
                        certificate_info.model_dump()
                        for certificate_info in regulation_node.required_certificates
                    ]
                    if regulation_node.required_certificates
                    else []
                ),
                "required_fees": (
                    [
                        fee_info.model_dump()
                        for fee_info in regulation_node.required_fees
                    ]
                    if regulation_node.required_fees
                    else []
                ),
                "suggested_contacts": (
                    [
                        contact_info.model_dump()
                        for contact_info in regulation_node.suggested_contacts
                    ]
                    if regulation_node.suggested_contacts
                    else []
                ),
                "regulatory_body": regulation_node.regulatory_body,
                "regulatory_body_description": regulation_node.regulatory_body_description,
                "business_criteria": regulation_node.business_criteria.model_dump(),
            }

            # Check if country exists
            country_doc = await collection.find_one({"_id": country_name})

            if not country_doc:
                # Create entire structure from scratch
                new_doc = {
                    "_id": country_name,
                    "country_name": country_name,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat(),
                    province_name: {
                        "created_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat(),
                        category_name: {
                            "created_at": datetime.utcnow().isoformat(),
                            "updated_at": datetime.utcnow().isoformat(),
                            subcategory_name: {
                                "created_at": datetime.utcnow().isoformat(),
                                "updated_at": datetime.utcnow().isoformat(),
                                regulation_compliance_type: [regulation_doc],
                            },
                        },
                    },
                }
                await collection.insert_one(new_doc)

                return AddEntryResponse(
                    success=True,
                    message="New country document created",
                    response_document=new_doc,
                )

            if province_name not in country_doc:
                # Only set the new province branch
                new_doc = {
                    province_name: {
                        category_name: {
                            "created_at": datetime.utcnow().isoformat(),
                            "updated_at": datetime.utcnow().isoformat(),
                            subcategory_name: {
                                "created_at": datetime.utcnow().isoformat(),
                                "updated_at": datetime.utcnow().isoformat(),
                                regulation_compliance_type: [regulation_doc],
                            },
                        }
                    },
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat(),
                }
                await collection.update_one({"_id": country_name}, {"$set": new_doc})

                return AddEntryResponse(
                    success=True,
                    message=f"Pushing new province {province_name} to country {country_name}",
                    response_document=new_doc,
                )

            # Province exists - check category
            if category_name not in country_doc[province_name]:
                # Only set the new category branch
                new_doc = (
                    {
                        subcategory_name: {
                            regulation_compliance_type: [regulation_doc],
                            "created_at": datetime.utcnow().isoformat(),
                            "updated_at": datetime.utcnow().isoformat(),
                        }
                    },
                )

                await collection.update_one(
                    {"_id": country_name},
                    {
                        "$set": {
                            f"{province_name}.{category_name}": new_doc,
                            "updated_at": datetime.utcnow().isoformat(),
                        }
                    },
                )

                return AddEntryResponse(
                    success=True,
                    message=f"Pushing new category {category_name} to province {province_name}",
                    response_document=new_doc,
                )

            # Category exists - check subcategory
            if subcategory_name not in country_doc[province_name][category_name]:

                new_doc = {
                    regulation_compliance_type: [regulation_doc],
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat(),
                }
                await collection.update_one(
                    {"_id": country_name},
                    {
                        "$set": {
                            f"{province_name}.{category_name}.{subcategory_name}": new_doc,
                        }
                    },
                )

                return AddEntryResponse(
                    success=True,
                    message=f"Pushing new subcategory {subcategory_name} to category {category_name}",
                    response_document=new_doc,
                )

            # Everything exists - push to existing array
            path = f"{province_name}.{category_name}.{subcategory_name}.{regulation_compliance_type}"
            await collection.update_one(
                {"_id": country_name},
                {
                    "$push": {path: regulation_doc},
                    "$set": {"updated_at": datetime.utcnow().isoformat()},
                },
            )

            return AddEntryResponse(
                success=True,
                message=f"Pushing new regulation {regulation_compliance_type} to subcategory {subcategory_name}",
                response_document=regulation_doc,
            )

    except Exception as e:
        return AddEntryResponse(
            success=False,
            message=f"Error: {str(e)}",
            response_document={},
            error=str(e),
        )


async def add_compliance_node_operation(
    mongo_client: MongoDBClient, compliance_node: ComplianceNode
):
    try:
        async with mongo_client.get_db("ReguMatch") as db:
            collection = db["compliances"]

            country_name = compliance_node.location_information.country_name
            province_name = compliance_node.location_information.province
            category_name = compliance_node.industry_information.category_name
            subcategory_name = compliance_node.industry_information.subcategory
            regulation_compliance_type = (
                compliance_node.regulation_compliance_type.value
            )

            compliance_doc = {
                "compliance_name": compliance_node.compliance_name,
                "compliance_description": compliance_node.compliance_description,
                "compliance_webpage": compliance_node.compliance_webpage,
                "compliance_pdf_urls": (
                    [
                        url_info.model_dump()
                        for url_info in compliance_node.compliance_pdf_urls
                    ]
                    if compliance_node.compliance_pdf_urls
                    else []
                ),
                "required_fields": (
                    [
                        field_info.model_dump()
                        for field_info in compliance_node.required_fields
                    ]
                    if compliance_node.required_fields
                    else []
                ),
                "required_licenses": (
                    [
                        license_info.model_dump()
                        for license_info in compliance_node.required_licenses
                    ]
                    if compliance_node.required_licenses
                    else []
                ),
                "required_certificates": (
                    [
                        certificate_info.model_dump()
                        for certificate_info in compliance_node.required_certificates
                    ]
                    if compliance_node.required_certificates
                    else []
                ),
                "required_fees": (
                    [
                        fee_info.model_dump()
                        for fee_info in compliance_node.required_fees
                    ]
                    if compliance_node.required_fees
                    else []
                ),
                "suggested_contacts": (
                    [
                        contact_info.model_dump()
                        for contact_info in compliance_node.suggested_contacts
                    ]
                    if compliance_node.suggested_contacts
                    else []
                ),
                "business_criteria": compliance_node.business_criteria.model_dump(),
            }

            country_doc = await collection.find_one({"_id": country_name})

            if not country_doc:
                new_doc = {
                    "_id": country_name,
                    "country_name": country_name,
                    "created_at": datetime.utcnow().isoformat().isoformat(),
                    "updated_at": datetime.utcnow().isoformat(),
                    province_name: {
                        "created_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat(),
                        category_name: {
                            "created_at": datetime.utcnow().isoformat(),
                            "updated_at": datetime.utcnow().isoformat(),
                            subcategory_name: {
                                "created_at": datetime.utcnow().isoformat(),
                                "updated_at": datetime.utcnow().isoformat(),
                                regulation_compliance_type: [compliance_doc],
                            },
                        },
                    },
                }
                await collection.insert_one(new_doc)

                return AddEntryResponse(
                    success=True,
                    message="New country document created",
                    response_document=new_doc,
                )

            # Country exists - check province
            if province_name not in country_doc:
                new_doc = {
                    province_name: {
                        "created_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat(),
                        category_name: {
                            "created_at": datetime.utcnow().isoformat(),
                            "updated_at": datetime.utcnow().isoformat(),
                            subcategory_name: {
                                "created_at": datetime.utcnow().isoformat(),
                                "updated_at": datetime.utcnow().isoformat(),
                                regulation_compliance_type: [compliance_doc],
                            },
                        },
                    }
                }

                await collection.update_one(
                    {"_id": country_name},
                    {
                        "$set": new_doc,
                        "$set": {"updated_at": datetime.utcnow().isoformat()},
                    },
                )

                return AddEntryResponse(
                    success=True,
                    message=f"Pushing new province {province_name} to country {country_name}",
                    response_document=new_doc,
                )

            # Province exists - check category
            if category_name not in country_doc[province_name]:
                new_doc = {
                    category_name: {
                        "created_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat(),
                        subcategory_name: {
                            "created_at": datetime.utcnow().isoformat(),
                            "updated_at": datetime.utcnow().isoformat(),
                            regulation_compliance_type: [compliance_doc],
                        },
                    }
                }

                await collection.update_one(
                    {"_id": country_name},
                    {
                        "$set": {f"{province_name}.{category_name}": new_doc},
                        "$set": {"updated_at": datetime.utcnow().isoformat()},
                    },
                )

                return AddEntryResponse(
                    success=True,
                    message=f"Pushing new category {category_name} to province {province_name}",
                    response_document=new_doc,
                )

            # Category exists - check subcategory
            if subcategory_name not in country_doc[province_name][category_name]:
                new_doc = {
                    subcategory_name: {
                        "created_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat(),
                        regulation_compliance_type: [compliance_doc],
                    }
                }

                await collection.update_one(
                    {"_id": country_name},
                    {
                        "$set": {
                            f"{province_name}.{category_name}.{subcategory_name}": new_doc
                        },
                        "$set": {"updated_at": datetime.utcnow().isoformat()},
                    },
                )

                return AddEntryResponse(
                    success=True,
                    message=f"Pushing new subcategory {subcategory_name} to category {category_name}",
                    response_document=new_doc,
                )

            # Exists push to array
            await collection.update_one(
                {"_id": country_name},
                {
                    "$push": {
                        f"{province_name}.{category_name}.{subcategory_name}.{regulation_compliance_type}": compliance_doc
                    },
                    "$set": {"updated_at": datetime.utcnow().isoformat()},
                },
            )

            return AddEntryResponse(
                success=True,
                message=f"Pushing new compliance document to subcategory {subcategory_name}",
                response_document=compliance_doc,
            )

    except Exception as e:
        return AddEntryResponse(
            success=False,
            message=f"Error: {str(e)}",
            response_document={},
            error=str(e),
        )
    

async def get_available_keys_in_regulation_collection_operation(
    mongo_client: MongoDBClient,
    query_parameters: DatabaseQueryParameters
) -> AvailableKeysInCollectionResponse:
    
    try:
        async with mongo_client.get_db("ReguMatch") as db:
            collection = db["regulations"]
            country_name = query_parameters.location_information.country_name
            province_name = query_parameters.location_information.province

            country_doc = await collection.find_one({"_id": country_name})
            if not country_doc:
                return AvailableKeysInCollectionResponse(
                    success=True,
                    message=f"No collection found for country {country_name}",
                    keys=[],
                )
            
            flat_dict = flatdict.FlatDict(country_doc)
            available_keys = flat_dict.keys()
            if province_name:
                province_doc = country_doc.get(province_name)
                if not province_doc:
                    return AvailableKeysInCollectionResponse(
                        success=True,
                        message=f"No collection found for province {province_name}",
                        keys=available_keys,
                    )
                
                flat_dict = flatdict.FlatDict(province_doc)
                available_keys = flat_dict.keys()
                return AvailableKeysInCollectionResponse(
                    success=True,
                    message=f"Collection found for province {province_name}",
                    keys=available_keys,
                )
            
            return AvailableKeysInCollectionResponse(
                success=True,
                message=f"Collection found for country {country_name}",
                keys=available_keys,
            )
                
    except Exception as e:
        return AvailableKeysInCollectionResponse(
            success=False,
            message=f"Error: {str(e)}",
            keys=[],
            error=str(e),
        )
    
async def get_available_keys_in_compliance_collection_operation(
    mongo_client: MongoDBClient,
    query_parameters: DatabaseQueryParameters
) -> AvailableKeysInCollectionResponse:
    
    try:
        async with mongo_client.get_db("ReguMatch") as db:
            collection = db["compliances"]
            country_name = query_parameters.location_information.country_name
            province_name = query_parameters.location_information.province

            country_doc = await collection.find_one({"_id": country_name})
            if not country_doc:
                return AvailableKeysInCollectionResponse(
                    success=True,
                    message=f"No collection found for country {country_name}",
                    keys=[],
                )
            
            flat_dict = flatdict.FlatDict(country_doc)
            available_keys = flat_dict.keys()
            if province_name:
                province_doc = country_doc.get(province_name)
                if not province_doc:
                    return AvailableKeysInCollectionResponse(
                        success=True,
                        message=f"No collection found for province {province_name}",
                        keys=available_keys,
                    )
                
                flat_dict = flatdict.FlatDict(province_doc)
                available_keys = flat_dict.keys()
                return AvailableKeysInCollectionResponse(
                    success=True,
                    message=f"Collection found for province {province_name}",
                    keys=available_keys,
                )
            
            return AvailableKeysInCollectionResponse(
                success=True,
                message=f"Collection found for country {country_name}",
                keys=available_keys,
            )
                
    except Exception as e:
        return AvailableKeysInCollectionResponse(
            success=False,
            message=f"Error: {str(e)}",
            keys=[],
            error=str(e),
        )
    
