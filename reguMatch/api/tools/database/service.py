from fastmcp import FastMCP
from api.utils.config import WHITELIST_URL_COLLECTION_SCHEMA
from contextlib import asynccontextmanager
import json
from api.models.database import WhiteListURLData, WhiteListQueryParameters
from api.database.mongo_client import MongoDBClient
from api.custom_exceptions.database import URLVerificationException
from api.tools.database.utils import verify_website_exists
from typing import List

# Import your query functions
from api.database.mongo_queries import (
    get_whitelist_collection as get_whitelist_collection_query,
    add_new_entry_to_whitelist,
    query_white_list_collection as query_whitelist_query
)

mongo_client = MongoDBClient()


@asynccontextmanager
async def database_lifespan(server):
    """Manage MongoDB connection lifecycle"""
    print("Starting Database Service - Connecting to MongoDB...")
    await mongo_client.connect()
    yield {}
    print("Shutting down Database Service - Disconnecting from MongoDB...")
    await mongo_client.disconnect()


mcp = FastMCP(
    name="Database Service",
    instructions="The purpose of this mcp server is to provide database support",
    lifespan=database_lifespan,
)


# Tools
@mcp.tool(
    name="add_url_to_whitelist_collection",
    description="""Add regulatory/compliance URLs to the whitelist for specific geographic and industry scopes.

IMPORTANT: URLs will be validated to verify they exist and are accessible. Please provide correct, working HTTPS URLs only. Invalid or inaccessible URLs will be rejected.

Scope Guidelines - CAREFULLY determine the correct scope:
- If a URL applies to ALL industries in a country (e.g., general labor laws, tax regulations), set category to a broad category like 'general_regulations' or 'labor_laws' and subcategory to null
- If a URL applies to an ENTIRE country (e.g., national government portals), set province to null
- If a URL applies to a SPECIFIC industry (e.g., fishing regulations), set the appropriate category
- If a URL applies to a SPECIFIC region (e.g., Western Cape regulations), set the appropriate province
- Only be specific when the URL content is actually specific to that scope

Examples:
- National Department of Labour → country: "south_africa", province: null, category: "labor_laws", subcategory: null
- Western Cape Fishing Regulations → country: "south_africa", province: "western_cape", category: "fishing", subcategory: "commercial_fishing"
- General Tax Authority → country: "south_africa", province: null, category: "taxation", subcategory: null

Scope behavior:
- Omit 'province' (or set to null) to apply URL to the entire country
- Omit 'subcategory' (or set to null) to apply URL to the entire industry category

Requirements:
- URLs must start with https://
- URLs must be accessible and return a valid response
- All identifiers must be in snake_case format (e.g., 'south_africa', 'labor_laws')

The tool will verify each URL before adding it to the whitelist. If verification fails, you will receive detailed error information.
""",
)
async def add_url_to_whitelist_collection(
    whitelist_entry_information: WhiteListURLData,
) -> str:
    """Add URL entry to whitelist collection"""
    try:
        verification_results = []
        verified_urls = []
        failed_url = None
        failed_verification = None

        # Verify each URL provided by the model
        for url_entry in whitelist_entry_information.urls:
            verification = await verify_website_exists(url_entry.url)

            if verification.exists == False:
                failed_url = url_entry.url
                failed_verification = verification

                verification_results.append(
                    {
                        "url": url_entry.url,
                        "status": "failed",
                        "verification": verification.model_dump(),
                    }
                )

                raise URLVerificationException(
                    f"URL verification failed for {url_entry.url}: {verification.reason}"
                )

            verification_results.append(
                {
                    "url": url_entry.url,
                    "status": "verified",
                    "verification": verification.model_dump(),
                }
            )

            verified_urls.append(url_entry.url)

        # Once verified, add to the database using the query function
        add_result = await add_new_entry_to_whitelist(
            mongo_client, whitelist_entry_information
        )

        return json.dumps(
            {
                "success": add_result.success,
                "message": add_result.message,
                "verified_urls": verified_urls,
                "total_urls": len(whitelist_entry_information.urls),
                "verified_count": len(verified_urls),
                "verification_results": verification_results,
                "database_response": add_result.model_dump(),
            },
            indent=2,
        )

    except URLVerificationException as e:
        print(f"URL verification exception: {e}")

        return json.dumps(
            {
                "success": False,
                "error_type": "URLVerificationException",
                "failed_url": failed_url,
                "verified_urls": verified_urls,
                "total_urls": len(whitelist_entry_information.urls),
                "verified_count": len(verified_urls),
                "verification_results": verification_results,
                "verification_details": (
                    failed_verification.model_dump() if failed_verification else None
                ),
                "message": str(e),
            },
            indent=2,
        )
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback

        traceback.print_exc()

        return json.dumps(
            {
                "success": False,
                "error_type": type(e).__name__,
                "message": f"An unexpected error occurred: {str(e)}",
                "error": str(e),
            },
            indent=2,
        )


@mcp.tool(
    name="query_white_list_collection",
    description="""Query the whitelist collection with flexible filtering.

You can provide ANY combination of parameters to filter the results:
- country_name (required): The country to query
- province (optional): Filter by specific province, or omit to search all provinces
- category_name (optional): Filter by specific category, or omit to search all categories
- subcategory (optional): Filter by specific subcategory, or omit to search all subcategories

Examples:
1. Get all data for a country: provide only country_name
2. Get all categories in a province: provide country_name + province
3. Get a category across all provinces: provide country_name + category_name
4. Get specific subcategory across all provinces: provide country_name + category_name + subcategory
5. Get everything in a province for a category: provide country_name + province + category_name

The response will show:
- Which filters were applied
- Which filters found matches
- The filtered nested structure
- Total number of URLs found
""",
)
async def query_white_list_collection(
    query_parameters: WhiteListQueryParameters,
) -> str:
    """Query whitelist collection with flexible filtering"""
    try:
        # Use the query function from queries.py
        result = await query_whitelist_query(mongo_client, query_parameters)

        return json.dumps(result.model_dump(),
            indent=2,
            default=str,
        )

    except Exception:

        return json.dumps(
            result.model_dump(),
            indent=2,
        )


@mcp.tool(
    name="get_whitelist_collection",
    description="""Get all URLs from the whitelist collection in MongoDB.

Returns all whitelisted regulatory/compliance URLs organized by country, province, category, and subcategory.
This retrieves the ENTIRE whitelist database - use query_white_list_collection for filtered results.
""",
)
async def get_whitelist_collection() -> str:
    """Get the current whitelist collection from MongoDB"""
    try:
        # Use the query function from queries.py
        documents = await get_whitelist_collection_query(mongo_client)

        if not documents:
            return json.dumps(
                {
                    "success": True,
                    "message": "Whitelist collection is empty",
                    "total_countries": 0,
                    "data": [],
                },
                indent=2,
            )

        return json.dumps(
            {
                "success": True,
                "message": f"Retrieved {len(documents)} country document(s) from whitelist",
                "total_countries": len(documents),
                "data": documents,
            },
            indent=2,
            default=str,
        )

    except Exception as e:
        print(f"Error retrieving whitelist collection: {e}")

        return json.dumps(
            {
                "success": False,
                "error_type": type(e).__name__,
                "message": f"Failed to retrieve whitelist collection: {str(e)}",
                "error": str(e),
            },
            indent=2,
        )