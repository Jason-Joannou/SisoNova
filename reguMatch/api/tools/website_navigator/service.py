from fastmcp import FastMCP
import json
import urllib3
from api.tools.website_navigator.models import DuckDuckGoRequest, OpenWebsiteRequest
from api.tools.website_navigator.utils import (
    duck_duck_go_search_operation,
    open_website_operation,
)
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


mcp = FastMCP(
    name="Web Research Service",
    instructions="""
Web research tools for finding compliance and regulatory information.

WHEN TO USE THESE TOOLS:
- User asks about regulations, compliance, or requirements
- Need to find official sources (government, banks, regulatory bodies)
- Need to verify information from authoritative websites
- User mentions specific organizations or websites to check

DO NOT rely solely on your training data for compliance information - always search for current, official sources.
""",
)


@mcp.tool(
    name="duck_duck_go_search",
    description="""
Search the web for current information on any topic.

**WHEN TO USE THIS:**
- User asks about regulations, compliance, requirements, or business processes
- Need to find official or authoritative sources
- User asks "what are the requirements for...", "how do I...", "what regulations apply to..."
- Need to verify or find up-to-date information
- ANY time you need information beyond your training data

**SEARCH TIPS:**
You can use site-specific searches to find authoritative sources faster:
- Example: "debtor financing site:absa.co.za" (searches only ABSA's website)
- Example: "fishing regulations site:gov.za" (searches government sites)

But you're NOT limited to this - use general searches when appropriate:
- Example: "South Africa debtor financing requirements" (broad search)
- Example: "commercial fishing compliance Western Cape" (general search)

**APPROACH:**
- Start with a general search to see what's available
- If you find relevant official sources, you can do follow-up targeted searches
- Evaluate search results and prioritize official/authoritative sources

Args:
    query: Your search query (can be general or site-specific)
    num_results: Number of results to return (default: 10)

Returns: List of search results with titles, URLs, and descriptions.

**USE THIS TOOL** whenever you need current information or to find authoritative sources.
""",
)
async def duck_duck_go_search(query_parameters: DuckDuckGoRequest) -> str:
    """Search the web using DuckDuckGo"""

    logger.info("Searching the web using DuckDuckGo...")
    results = duck_duck_go_search_operation(query_parameters=query_parameters)
    if not results.success:
        logger.error(f"Failed to search the web using DuckDuckGo: {results.error}")
        logger.error(f"Model dump: {results.model_dump()}")

    return json.dumps(results.model_dump(), indent=2)


@mcp.tool(
    name="open_website",
    description="""
Open a website and extract its forms and navigation links.

**WHEN TO USE THIS:**
- Found a relevant URL (from any source: search results, AI search, user-provided, etc.)
- Need to see what forms are available on a page (application forms, contact forms, etc.)
- Want to discover navigation links to explore related pages
- Need to understand the structure of a website

**WHAT THIS RETURNS:**
- Page title
- All HTML forms found on the page (raw HTML of each form)
- Page content in HTML
- All links on the page with their text and URLs

**WHAT THIS DOES NOT RETURN:**
- Does NOT parse form fields into structured data

**WORKFLOW:**
1. Use this to see what forms exist on a page
2. To see the content of the page in HTML
3. Use the returned links to navigate to other relevant pages
4. You may need to open multiple pages to find all information

Args:
    url: Full URL to open (must start with https://)
    wait_seconds: Time to wait for JavaScript (default: 3)
    default_timeout: Max page load time in ms (default: 30000)

Returns:
- page_title: The page title
- page_content: The HTML content of the page
- page_form_content: Array of HTML strings (one per form found)
- links: Array of {link: url, text: link_text} objects

**USE THIS** when you need to see forms or discover navigation links on a specific page.
""",
)
async def open_website(parameters: OpenWebsiteRequest) -> str:
    logger.info("Opening website...")
    response = await open_website_operation(
        url=parameters.url,
        wait_seconds=parameters.wait_seconds,
        default_timeout=parameters.default_timeout,
    )
    if not response.success:
        logger.error(f"Failed to open website: {response.error}")
        logger.error(f"Model dump: {response.model_dump()}")

    return json.dumps(response.model_dump(), indent=2)
