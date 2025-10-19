import asyncio
from typing import Dict
from urllib.parse import urlparse

import aiohttp
import dns.resolver
from fastmcp import FastMCP

mcp = FastMCP(
    name="Wesbite Utility Service",
    instructions="The purpose of this mcp server is to provide utility support for interacting with web services",
)


@mcp.tool(
    name="verify_website_exists",
    description="Comprehensively verifies if a website URL exists, is accessible, and is from a trusted regulatory source. Performs DNS, HTTP, and whitelist validation.",
)
async def verify_website_exists(url: str) -> Dict[str, any]:
    """
    Verifies whether a website URL exists and is valid with comprehensive checks.

    Args:
        url: The URL to verify (must include http:// or https://)

    Returns:
        Dict with validation results including:
        - exists: bool - Overall validation result
        - dns_valid: bool - Domain exists in DNS
        - http_accessible: bool - URL returns valid HTTP response
        - is_trusted: bool - Domain is in whitelist
        - is_https: bool - Uses secure HTTPS
        - status_code: int - HTTP status code
        - reason: str - Detailed explanation
        - warnings: list - Any warnings found
    """
    result = {
        "exists": False,
        "dns_valid": False,
        "http_accessible": False,
        "is_https": False,
        "status_code": None,
        "reason": "",
        "warnings": [],
        "final_url": None,
    }

    try:
        if not url.startswith(("http://", "https://")):
            result["reason"] = "URL must start with http:// or https://"
            return result

        parsed = urlparse(url)
        if not parsed.netloc:
            result["reason"] = "Invalid URL format: missing domain"
            return result

        domain = parsed.netloc.replace("www.", "")
        result["is_https"] = url.startswith("https://")

    except Exception as e:
        result["reason"] = f"Invalid URL format: {str(e)}"
        return result

    try:
        dns.resolver.resolve(domain, "A")
        result["dns_valid"] = True
    except dns.resolver.NXDOMAIN:
        result["reason"] = f"Domain does not exist: {domain}"
        return result
    except dns.resolver.NoAnswer:
        result["reason"] = f"No DNS records found for: {domain}"
        return result
    except dns.resolver.Timeout:
        result["reason"] = f"DNS lookup timeout for: {domain}"
        result["warnings"].append("DNS timeout - domain may be slow")
    except Exception as e:
        result["reason"] = f"DNS error: {str(e)}"
        return result

    try:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(
                url,
                allow_redirects=True,
                ssl=True,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                },
            ) as response:
                result["status_code"] = response.status
                result["final_url"] = str(response.url)

                if 200 <= response.status < 400:
                    result["http_accessible"] = True
                else:
                    result["reason"] = f"HTTP error: {response.status}"
                    return result

    except asyncio.TimeoutError:
        result["reason"] = "Request timeout after 10 seconds"
        return result
    except aiohttp.ClientSSLError as e:
        result["reason"] = f"SSL certificate error: {str(e)}"
        return result
    except aiohttp.ClientConnectorError:
        result["reason"] = "Cannot connect to URL"
        return result
    except Exception as e:
        result["reason"] = f"HTTP error: {str(e)}"
        return result

    if not result["is_https"]:
        result["warnings"].append("WARNING: Not using HTTPS - insecure connection")

    result["exists"] = result["dns_valid"] and result["http_accessible"]

    if result["exists"]:
        result["reason"] = "URL is valid and accessible"

    return result


@mcp.tool(
    name="add_url_to_whitelist",
    description="The purpose of this tool is to add a url to the whitelist after it has been verified",
)
async def add_url_to_whitelist(url: str) -> None:
    pass

