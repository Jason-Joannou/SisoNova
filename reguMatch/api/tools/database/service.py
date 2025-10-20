from fastmcp import FastMCP
from api.utils.config import WHITELIST_URL_COLLECTION_SCHEMA
import json


mcp = FastMCP(name="Database Service", instructions="The purpose of this mcp server is to provide database support")

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