from fastmcp import FastMCP
from api.utils.config import WHITELIST_URL_COLLECTION_SCHEMA
import json
from api.tools.database.models import WhiteListURLData


mcp = FastMCP(name="Database Service", instructions="The purpose of this mcp server is to provide database support")

# Tools
@mcp.tool(
    name="add_url_to_whitelist_collection",
    description="""Add verified regulatory/compliance URLs to the whitelist for specific geographic and industry scopes.

Scope behavior:
- Omit 'province' (or set to null) to apply URL to the entire country
- Omit 'subcategory' (or set to null) to apply URL to the entire industry category

All identifiers must be in snake_case format (e.g., 'south_africa', 'commercial_fishing').""",
)
async def add_url_to_whitelist_collection(whitelist_entry_information: WhiteListURLData) -> str:
    """Add URL entry to whitelist collection"""
    print("Adding URL to whitelist collection...")
    print(json.dumps(whitelist_entry_information.model_dump(), indent=2))
    
    return json.dumps({
        "success": True,
        "message": "URL entry queued for addition to whitelist collection",
        "data": whitelist_entry_information.model_dump()
    }, indent=2, default=str)

# Resources
@mcp.resource(
    uri="schema://mongodb/reguMatch/whitelist_urls",
    name="Whitelist URLs Collection Schema",
    description="Schema definition for the whitelist_urls collection in the reguMatch MongoDB database. Defines the nested structure: country -> province -> category -> subcategory -> urls with snake_case formatting rules and validation requirements."
)
def get_whitelist_urls_schema() -> str:
    """
    Provides the complete schema definition for the whitelist_urls collection.
    
    This resource contains:
    - Structure definition with all hierarchy levels (country -> province -> category -> subcategory -> urls)
    - Field types and validation rules
    - Example data structure
    - Formatting rules (snake_case for all keys)
    
    Use this resource to understand the whitelist_urls data model before querying or validating entries.
    """
    
    return json.dumps(WHITELIST_URL_COLLECTION_SCHEMA, indent=2)