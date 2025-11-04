from fastmcp import FastMCP
from contextlib import asynccontextmanager
import json
from api.tools.database.models import (
    WhiteListURLData,
    WhiteListQueryParameters,
    ComplianceNode,
    RegulationNode,
    DatabaseQueryParameters,
)
from api.database.mongo_client import MongoDBClient

from api.tools.database.utils import (
    get_whitelist_collection_operation,
    add_new_entry_to_whitelist_operation,
    query_white_list_collection_operation,
    add_regulation_node_operation,
    add_compliance_node_operation,
    get_available_keys_in_compliance_collection_operation,
    get_available_keys_in_regulation_collection_operation,
    get_compliance_node_operation,
    get_regulation_node_operation,
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

IMPORTANT: Make sure to validate URLs before attempting to add them to the whitelist.

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

""",
)
async def add_url_to_whitelist_collection(
    whitelist_entry_information: WhiteListURLData,
) -> str:
    """Add URL entry to whitelist collection"""
    try:

        # Once verified, add to the database using the query function
        add_result = await add_new_entry_to_whitelist_operation(
            mongo_client, whitelist_entry_information
        )

        return json.dumps(
            add_result.model_dump(),
            indent=2,
        )

    except Exception as e:

        return json.dumps(
            add_result.model_dump(),
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
""",
)
async def query_white_list_collection(
    query_parameters: WhiteListQueryParameters,
) -> str:
    """Query whitelist collection with flexible filtering"""
    try:
        # Use the query function from queries.py
        result = await query_white_list_collection_operation(
            mongo_client, query_parameters
        )

        return json.dumps(
            result.model_dump(),
            indent=2,
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
        documents = await get_whitelist_collection_operation(mongo_client)

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


@mcp.tool(
    name="add_compliance_node",
    description="""Add a new compliance requirement to the knowledge graph database.

Use this tool to store non-government compliance requirements such as:
- Bank/financial institution requirements (e.g., ABSA Debtor Financing criteria)
- Industry standards and best practices
- Professional body requirements
- Insurance company requirements
- Trade association guidelines
- Certification requirements (e.g., ISO standards)

Structure: Country > Province > Industry Category > Sub-Category > COMPLIANCE

Required information:
- Location: country and province
- Industry: category and subcategory (e.g., "Financial Services" > "Debtor Financing")
- Compliance details: name, description, source webpage, issuing organization
- Business criteria: which businesses this applies to (size, type, sector, custom criteria)
- Required fields: what information/documentation is needed
- Required licenses: any licenses or certifications needed

Example: Adding "ABSA Debtor Financing Requirements" with minimum turnover R5m, 30-day debtor book criteria.

Returns: Success confirmation with the path where the compliance requirement was stored.
""",
)
async def add_compliance_node(compliance_node: ComplianceNode) -> str:
    response = await add_compliance_node_operation(mongo_client, compliance_node)
    return json.dumps(response.model_dump(), indent=2)


@mcp.tool(
    name="add_regulation_node",
    description="""Add a government regulation to the knowledge graph database.

Use this tool to store regulations such as:
- Acts and laws (e.g., Marine Living Resources Act)
- Government-mandated requirements
- Legal compliance obligations
- Licensing requirements from government bodies

Structure: Country > Province > Industry Category > Sub-Category > REGULATION

Required information:
- Location: country and province
- Industry: category and subcategory (e.g., "Fishing" > "Commercial Fishing")
- Regulation details: name, description, source webpage, regulatory body
- Business criteria: which businesses this applies to (size, type, sector)
- Required fields: what information businesses must provide
- Required licenses: what licenses are needed

Example: Adding "Marine Living Resources Act" for commercial fishing in Western Cape, South Africa.

Returns: Success confirmation with the path where the regulation was stored.
""",
)
async def add_regulation_node(regulation_node: RegulationNode) -> str:
    response = await add_regulation_node_operation(mongo_client, regulation_node)
    return json.dumps(response.model_dump(), indent=2)


@mcp.tool(
    name="get_available_keys_in_regulation_collection",
    description="""
Get all available keys (country, province, category, subcategory names) in the regulation collection.

**PURPOSE:**
- Discover what regulations are already stored in the database
- Find existing keys to maintain consistency when adding new regulations
- Avoid creating duplicate or similar keys (e.g., "commercial_fishing" vs "fishing_commercial")
- Understand the current structure of the knowledge base

**WHEN TO USE:**
- BEFORE adding a new regulation node - check if similar keys already exist
- When unsure about the correct naming convention for a location or industry
- To explore what regulations are available in a specific scope
- To maintain consistency across the knowledge base

**QUERY PARAMETERS:**
You can filter by any combination of:
- country_name: Required - the country to query (e.g., "south_africa")
- province: Optional - filter by specific province (e.g., "western_cape")

**WHAT THIS RETURNS:**
- All unique keys at each level of the hierarchy within your query scope
- Available countries, provinces, categories, and subcategories
- Helps you see what naming conventions are already in use

**EXAMPLE WORKFLOW:**
1. User wants to add "Cape Town fishing regulations"
2. First check: get_available_keys(country="south_africa", province="western_cape")
3. See existing keys: ["south_africa", "south_africa.western_cape", "south_africa.western_cape.fishing", "south_africa.western_cape.fishing.commercial_fishing"]
4. Use consistent naming: province="western_cape", subcategory="commercial_fishing"

**BEST PRACTICE:**
Always query available keys before adding new regulations to ensure naming consistency.
""",
)
async def get_available_keys_in_regulation_collection(
    query_parameters: DatabaseQueryParameters,
) -> str:
    response = await get_available_keys_in_regulation_collection_operation(
        mongo_client, query_parameters
    )
    return json.dumps(response.model_dump(), indent=2)


@mcp.tool(
    name="get_available_keys_in_compliance_collection",
    description="""
Get all available keys (country, province, category, subcategory names) in the compliance collection.

**PURPOSE:**
- Discover what compliance requirements are already stored in the database
- Find existing keys to maintain consistency when adding new compliance requirements
- Avoid creating duplicate or similar keys (e.g., "debtor_financing" vs "financing_debtor")
- Understand the current structure of the compliance knowledge base

**WHEN TO USE:**
- BEFORE adding a new compliance node - check if similar keys already exist
- When unsure about the correct naming convention for a location or industry
- To explore what compliance requirements are available in a specific scope
- To maintain consistency across the knowledge base

**QUERY PARAMETERS:**
You can filter by any combination of:
- country_name: Required - the country to query (e.g., "south_africa")
- province: Optional - filter by specific province (e.g., "gauteng")

**WHAT THIS RETURNS:**
- All unique keys at each level of the hierarchy within your query scope
- Available countries, provinces, categories, and subcategories
- Helps you see what naming conventions are already in use

**EXAMPLE WORKFLOW:**
1. User wants to add "Standard Bank business loan requirements"
2. First check: get_available_keys(country="south_africa", province="gauteng)
3. See existing keys: ["south_africa", "south_africa.gauteng", "south_africa.gauteng.financial_services", "south_africa.gauteng.financial_services.business_loans"]
4. Use consistent naming: subcategory="business_loans"

**BEST PRACTICE:**
Always query available keys before adding new compliance requirements to ensure naming consistency.
""",
)
async def get_available_keys_in_regulation_collection(
    query_parameters: DatabaseQueryParameters,
) -> str:
    response = await get_available_keys_in_compliance_collection_operation(
        mongo_client, query_parameters
    )
    return json.dumps(response.model_dump(), indent=2)


@mcp.tool(
    name="get_regulation_node",
    description="""
Get regulation nodes from the knowledge graph at the specified path.

**Parameters:**
- location_information: country_name (required), province (optional, use "all" for country-wide)
- industry_information: category_name, subcategory (optional, use "all" for category-wide)

**Returns:**
List of regulation objects with all details (name, description, required_fields, licenses, fees, contacts, etc.)

**Examples:**
- All fishing in Western Cape: province="western_cape", category="fishing", subcategory="all"
- Commercial fishing in Western Cape: province="western_cape", category="fishing", subcategory="commercial_fishing"
""",
)
async def get_regulation_node(query_parameters: DatabaseQueryParameters) -> str:
    response = await get_regulation_node_operation(mongo_client, query_parameters)
    return json.dumps(response.model_dump(), indent=2)


@mcp.tool(
    name="get_compliance_node",
    description="""
Get compliance requirement nodes from the knowledge graph at the specified path.

**Parameters:**
- location_information: country_name (required), province (optional, use "all" for country-wide)
- industry_information: category_name, subcategory (optional, use "all" for category-wide)

**Returns:**
List of compliance objects with all details (name, description, required_fields, licenses, fees, contacts, business_criteria, etc.)

**Examples:**
- All financial services in Gauteng: province="gauteng", category="financial_services", subcategory="all"
- Debtor financing in Gauteng: province="gauteng", category="financial_services", subcategory="debtor_financing"
""",
)
async def get_compliance_node(query_parameters: DatabaseQueryParameters) -> str:
    response = await get_compliance_node_operation(mongo_client, query_parameters)
    return json.dumps(response.model_dump(), indent=2)
