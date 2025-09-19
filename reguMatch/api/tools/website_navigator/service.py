from fastmcp import FastMCP
from bs4 import BeautifulSoup
import aiohttp

mcp = FastMCP("Website Navigator")

@mcp.tool()
async def get_website_content(url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            html = await response.text()

    soup = BeautifulSoup(html, "html.parser")