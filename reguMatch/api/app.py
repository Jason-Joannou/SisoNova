from fastmcp import FastMCP
from fastmcp.server.auth.auth import TokenVerifier, AccessToken
from api.tools.database.service import mcp as database_mcp
from api.tools.website_navigator.service import mcp as website_navigator_mcp
from api.tools.pdf_analyser.service import mcp as pdf_analyser_mcp
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

load_dotenv()

API_KEY = os.getenv("API_KEY", "dev-api-key-12345")


class BearerTokenAuthProvider(TokenVerifier):
    """Custom authentication provider that validates Bearer tokens."""

    def __init__(self, valid_tokens: list[str]):
        super().__init__()
        self.valid_tokens = set(valid_tokens)
        logger.info("Authentication provider initialized")

    async def verify_token(self, token: str) -> AccessToken | None:
        """Verify Bearer token."""
        if token in self.valid_tokens:
            logger.info("Token verification successful")
            return AccessToken(
                token=token,
                client_id="api_client",
                scopes=[],
                expires_at=None,
            )
        logger.info("Token verification failed")
        return None


logger.info("Initializing FastMCP server")
auth_provider = BearerTokenAuthProvider([API_KEY])

mcp = FastMCP(
    name="ReguMatch Compliance Research Service",
    auth=auth_provider,
    instructions="""
This MCP server provides tools for researching, extracting, and storing regulatory and compliance requirements.

## AVAILABLE SERVICES:

**Web Research Service (website-navigator):**
- duck_duck_go_search: Search for regulations and compliance information
- open_website: Extract content, forms, and links from webpages

**PDF Analysis Service (pdf-analyser):**
- download_and_analyze_pdf: Extract text from regulatory PDFs
- IMPORTANT: Only use URLs discovered through search or navigation - never construct URLs

**Database Service (database):**
- add_regulation_node: Store government regulations in knowledge graph
- add_compliance_node: Store non-government compliance requirements
- add_url_to_whitelist_collection: Track verified regulatory URLs
- query_white_list_collection: Query URLs by location/industry
- get_whitelist_collection: Retrieve all tracked URLs
- get_regulation_node: Retrieve stored regulations
- get_compliance_node: Retrieve stored compliance requirements

## STANDARD WORKFLOW:
1. Search for official sources using duck_duck_go_search
2. Navigate and extract content using open_website
3. Extract PDF documents using download_and_analyze_pdf
4. Structure and store information using add_regulation_node or add_compliance_node
5. Track verified URLs using add_url_to_whitelist_collection

## KEY RULES:
- Always search for current, official sources
- Never construct or guess URLs - only use discovered URLs
- Structure information consistently in the knowledge graph
- Prioritize official sources (government, regulatory bodies, financial institutions)
""",
)

logger.info("Mounting services")
mcp.mount(website_navigator_mcp, prefix="website-navigator", as_proxy=True)
mcp.mount(database_mcp, prefix="database", as_proxy=True)
mcp.mount(pdf_analyser_mcp, prefix="pdf-analyser", as_proxy=True)
logger.info("Services mounted")

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
