import requests
from api.models.utils import URLVerificationResult


async def verify_website_exists(url: str) -> URLVerificationResult:
    """
    Simple check to verify that a website URL exists using requests.

    Args:
        url: The URL to verify (must include https://)

    Returns:
        URLVerificationResult with validation details
    """
    # Basic URL validation
    if not url.startswith("https://"):
        return URLVerificationResult(
            exists=False,
            dns_valid=False,
            http_accessible=False,
            is_trusted=False,
            is_https=False,
            status_code=0,
            reason="URL must start with https://",
            warnings=[]
        )

    try:
        # Use HEAD request (faster than GET, just checks if URL exists)
        response = requests.head(url, allow_redirects=True, timeout=10)
        
        # If we got a response, the URL exists
        return URLVerificationResult(
            exists=True,
            dns_valid=True,
            http_accessible=True,
            is_trusted=False,
            is_https=True,
            status_code=response.status_code,
            reason=f"URL exists (status: {response.status_code})",
            warnings=[]
        )
        
    except requests.ConnectionError:
        return URLVerificationResult(
            exists=False,
            dns_valid=False,
            http_accessible=False,
            is_trusted=False,
            is_https=True,
            status_code=0,
            reason="Cannot connect to URL (DNS or network error)",
            warnings=[]
        )
        
    except requests.Timeout:
        return URLVerificationResult(
            exists=False,
            dns_valid=False,
            http_accessible=False,
            is_trusted=False,
            is_https=True,
            status_code=0,
            reason="Request timeout after 10 seconds",
            warnings=[]
        )
        
    except Exception as e:
        return URLVerificationResult(
            exists=False,
            dns_valid=False,
            http_accessible=False,
            is_trusted=False,
            is_https=True,
            status_code=0,
            reason=f"Error: {str(e)}",
            warnings=[]
        )