from api.database.mongo_client import MongoDBClient
from api.models.database import WhiteListURLData, WhiteListQueryParameters
from api.tools.database.models import AddEntryResponse
from typing import List

async def get_whitelist_collection(mongo_client: MongoDBClient) -> List:
    async with mongo_client.get_db("reguMatch") as db:
        collection = db["whitelist_urls"]
        return await collection.find().to_list(length=None)
    
async def add_new_entry_to_whitelist(mongo_client: MongoDBClient, entry: WhiteListURLData) -> AddEntryResponse:
    async with mongo_client.get_db("reguMatch") as db:
        collection = db["whitelist_urls"]

        country_name = entry.country_information.country_name
        province = entry.country_information.province or "all"
        category_name = entry.category_information.category_name
        subcategory = entry.category_information.subcategory or "all"
        urls = [url.model_dump() for url in entry.urls]

        response_doc = {
                    "_id": country_name,
                    province: {
                        category_name: {
                            subcategory: urls
                        }
                    }
                }

        try:
            country_doc = await collection.find_one({"_id": country_name})
            if not country_doc:
                # Create entire structure from scratch
                new_doc = {
                    "_id": country_name,
                    province: {
                        category_name: {
                            subcategory: urls
                        }
                    }
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
                    {"$set": {
                        province: {
                            category_name: {
                                subcategory: urls
                            }
                        }
                    }}
                )
                print(f"Added new province: {province}")
                return AddEntryResponse(
                    success=True,
                    message=f"Added new province: {province}",
                    response_document=response_doc
                )
            
            if category_name not in country_doc[province]:
                # Add new category
                await collection.update_one(
                    {"_id": country_name},
                    {"$set": {
                        f"{province}.{category_name}": {
                            subcategory: urls
                        }
                    }}
                )
                print(f"Added new category: {category_name}")
                return AddEntryResponse(
                    success=True,
                    message=f"Added new category: {category_name}",
                    response_document=response_doc
                )
            
            if subcategory not in country_doc[province][category_name]:
                # Add new subcategory
                await collection.update_one(
                    {"_id": country_name},
                    {"$set": {
                        f"{province}.{category_name}.{subcategory}": urls
                    }}
                )
                print(f"Added new subcategory: {subcategory}")
                return AddEntryResponse(
                    success=True,
                    message=f"Added new subcategory: {subcategory}",
                    response_document=response_doc
                )
            
            existing_urls = country_doc[province][category_name][subcategory]
            existing_url_set = {url_obj["url"] for url_obj in existing_urls}
            new_urls = [url for url in urls if url["url"] not in existing_url_set]

            if not new_urls:
                print(f"All URLs already exist in whitelist")
                return AddEntryResponse(
                    success=True,
                    message=f"All URLs already exist in whitelist",
                    response_document=response_doc
                )
            
            await collection.update_one(
                {"_id": country_name},
                {"$push": {
                    f"{province}.{category_name}.{subcategory}": {
                        "$each": new_urls
                    }
                }}
            )
            response_doc = {
                "_id": country_name,
                province: {
                    category_name: {
                        subcategory: new_urls
                    }
                }}
            print(f"Added {len(new_urls)} new URL(s) to existing subcategory")
            return AddEntryResponse(
                success=True,
                message=f"Added {len(new_urls)} new URL(s) to existing subcategory",
                response_document=response_doc
            )
            
        except Exception as e:
            return AddEntryResponse(
                success=False,
                message=f"Failed to add entry to whitelist: {str(e)}",
                response_document={},
                error=str(e)
            )
    
async def query_white_list_collection(
    mongo_client: MongoDBClient, 
    query_parameters: WhiteListQueryParameters
) -> List:
    """Query whitelist collection based on nested structure"""
    
    country_name = query_parameters.country_name
    province_name = query_parameters.province or "all"  # Default to "all" if None
    category_name = query_parameters.category_name
    subcategory_name = query_parameters.subcategory or "all"  # Default to "all" if None

    async with mongo_client.get_db("reguMatch") as db:
        collection = db["whitelist_urls"]

        try:
            # Get the country document
            country_doc = await collection.find_one({"_id": country_name})
            
            if not country_doc:
                return []  # Country not found
            
            # Remove MongoDB _id
            country_doc.pop("_id", None)
            
            results = []
            
            # Determine provinces to search
            provinces_to_search = (
                [province_name] if query_parameters.province 
                else list(country_doc.keys())  # Search all provinces
            )
            
            for province in provinces_to_search:
                if province not in country_doc:
                    continue
                
                province_data = country_doc[province]
                
                # Check if category exists
                if category_name not in province_data:
                    continue
                
                category_data = province_data[category_name]
                
                # Determine subcategories to search
                subcategories_to_search = (
                    [subcategory_name] if query_parameters.subcategory
                    else list(category_data.keys())  # Search all subcategories
                )
                
                for subcategory in subcategories_to_search:
                    if subcategory not in category_data:
                        continue
                    
                    urls = category_data[subcategory]
                    
                    # Add each URL with its context
                    for url_entry in urls:
                        results.append({
                            "country": country_name,
                            "province": province,
                            "category": category_name,
                            "subcategory": subcategory,
                            "url": url_entry.get("url"),
                            "description": url_entry.get("description"),
                            "added_at": url_entry.get("added_at"),
                            "modified_at": url_entry.get("modified_at")
                        })
            
            return results
            
        except Exception as e:
            print(f"Error querying whitelist: {e}")
            import traceback
            traceback.print_exc()
            return []
    