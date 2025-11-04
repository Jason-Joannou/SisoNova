import httpx
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

async def verify_url_exists(url: str, timeout: int = 10) -> Tuple[bool, str]:
    """
    Check if a URL returns a valid response.
    
    Returns:
        Tuple of (is_valid, message)
    """
    try:
        async with httpx.AsyncClient(
            timeout=timeout,
            follow_redirects=True,
            verify=False
        ) as client:
            response = await client.head(url)
            
            if response.status_code == 405:
                response = await client.get(url)
            
            if response.status_code == 200:
                return True, "URL is valid"
            else:
                return False, f"URL returned status code {response.status_code}"
                
    except Exception as e:
        return False, f"Could not access URL: {str(e)}"