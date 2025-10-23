from api.models.utils import URLVerificationResult
from api.custom_exceptions.database import URLVerificationException
import requests

from fastmcp import FastMCP

mcp = FastMCP(
    name="Wesbite Utility Service",
    instructions="The purpose of this mcp server is to provide utility support for interacting with web services",
)


@mcp.tool(
    name="verify_website_exists",
    description="Verifies whether a website URL exists and is valid",
)
async def verify_website_exists(url: str) -> URLVerificationResult:
    try:
        if not url.startswith("https://"):
            raise URLVerificationException("URL must start with https://")
        response = requests.get(url)
        response.raise_for_status()  
        if response.ok:
            return URLVerificationResult(
                exists=True,
                is_https=True,
                status_code=response.status_code
            )
        raise URLVerificationResult(
            exists=False,
            is_https=True,
            status_code=response.status_code
        )
    except URLVerificationException as e:
        return URLVerificationResult(
            exists=False,
            is_https=False,
            status_code=0,
            error=str(e)
        )
    except requests.exceptions.RequestException as e:
        return URLVerificationResult(
            exists=False,
            is_https=False,
            status_code=0,
            error=str(e)
        )
    except Exception as e:
        return URLVerificationResult(
            exists=False,
            is_https=False,
            status_code=0,
            error=str(e)
        )

