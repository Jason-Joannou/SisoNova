from fastmcp import FastMCP
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import urllib
from typing import List, Optional
from ddgs import DDGS
import time
import random
import urllib3
import asyncio
from playwright.async_api import async_playwright
from api.tools.website_navigator.models import DuckDuckGoRequest, OpenWebsiteRequest
from api.tools.website_navigator.utils import (
    duck_duck_go_search_operation,
    open_website_operation,
)


# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


mcp = FastMCP(
    name="Web Scraper Service",
    instructions="Web scraping tools with JavaScript rendering support using Playwright for searching, opening websites, and navigating links",
)


@mcp.tool(
    name="duck_duck_go_search",
    description="""Search DuckDuckGo and get a list of results.

Args:
    query: Search query (e.g., "South Africa fishing regulations")
    num_results: Number of results to return (default: 10)

Returns a list of search results with titles, URLs, and snippets.
""",
)
async def duck_duck_go_search(query_parameters: DuckDuckGoRequest) -> str:
    """Search the web using DuckDuckGo"""

    results = duck_duck_go_search_operation(query_parameters=query_parameters)

    return json.dumps(results.model_dump(), indent=2)


@mcp.tool(
    name="open_website",
    description="""
Open ANY website and extract its content. Supports JavaScript-heavy websites.
Use this for opening initial pages OR navigating to links.

Args:
    url: The URL to open (must include https://)
    wait_seconds: Seconds to wait for JavaScript to load (default: 3)
    default_timeout: Maximum time to wait for page load in milliseconds (default: 30000)
    
Returns:
    - Page title
    - Main text content
    - All links found on the page (navigation and content links)
""",
)
async def open_website(parameters: OpenWebsiteRequest) -> str:
    response = await open_website_operation(
        url=parameters.url,
        wait_seconds=parameters.wait_seconds,
        default_timeout=parameters.default_timeout,
    )
    
    return json.dumps(response.model_dump(), indent=2)
