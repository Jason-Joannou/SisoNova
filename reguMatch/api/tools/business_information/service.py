import aiohttp
from bs4 import BeautifulSoup
from fastmcp import FastMCP

mcp = FastMCP(
    name="Business Information Service",
    instructions="This server provides information relating to business registered in the SisoNova's system",
)
