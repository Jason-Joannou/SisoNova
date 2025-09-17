from fastmcp import FastMCP
from fastmcp.server.auth.auth import TokenVerifier, AccessToken
from api.tools.greetings import greeting_message
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

mcp.add_tool(greeting_message)

if __name__ == "__main__":
    mcp.run(transport='streamable-http')