from fastmcp import FastMCP
from fastmcp.server.auth.auth import TokenVerifier, AccessToken
from api.tools.database.service import mcp as database_mcp
from api.tools.website_navigator.service import mcp as website_navigator_mcp
from api.tools.central_knowledge_graph.service import mcp as central_knowledge_graph_mcp
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

API_KEY = os.getenv("API_KEY", "dev-api-key-12345")

class BearerTokenAuthProvider(TokenVerifier):
    """Custom authentication provider that validates Bearer tokens."""

    def __init__(self, valid_tokens: list[str]):
        super().__init__()
        self.valid_tokens = set(valid_tokens)
    async def verify_token(self, token: str) -> AccessToken | None:
        """Verify Bearer token."""
        if token in self.valid_tokens:
            return AccessToken(
                token=token,
                client_id="api_client",
                scopes=[],
                expires_at=None  # Tokens don't expire in this simple example
            )
        return None


# Initialize auth provider
auth_provider = BearerTokenAuthProvider([API_KEY])

# Create FastMCP server with authentication
mcp = FastMCP(
    "Basic MCP Server with Bearer Token Authentication",
    auth=auth_provider
)


@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

# mcp.mount(database_mcp, prefix="database", as_proxy=True)
mcp.mount(website_navigator_mcp, prefix="website-navigator", as_proxy=True)
mcp.mount(central_knowledge_graph_mcp, prefix="central-knowledge-graph", as_proxy=True)

if __name__ == "__main__":
    mcp.run(transport='streamable-http')