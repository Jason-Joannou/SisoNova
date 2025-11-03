from ddgs import DDGS
from api.tools.website_navigator.models import DuckDuckGoRequest, DuckDuckGoResponse
from playwright.async_api import async_playwright
from urllib.parse import urljoin, urlparse
import asyncio
import json
from api.tools.website_navigator.models import WebsiteLinks, OpenWebsiteResponse
from bs4 import BeautifulSoup

def duck_duck_go_search_operation(query_parameters: DuckDuckGoRequest) -> DuckDuckGoResponse:
    """Search the web using DuckDuckGo"""
    try:
        results = []
        
        ddgs = DDGS()

        query = query_parameters.query
        num_results = query_parameters.num_results
        
        search_results = ddgs.text(query, max_results=num_results)
        
        for res in search_results:
            results.append({
                "title": res.get("title", ""),
                "url": res.get("href", ""),
                "description": res.get("body", "")
            })
        
        return DuckDuckGoResponse(
            success=True,
            message=f"Successfully searched DuckDuckGo for '{query}'",
            query=query,
            result_count=len(results),
            results=results
        )
        
    except Exception as e:
        return DuckDuckGoResponse(
            success=False,
            message=f"Failed to search DuckDuckGo for '{query}'",
            query=query,
            result_count=0,
            results=[],
            error=str(e)
        )
    
async def open_website_operation(url: str, wait_seconds: int = 3, default_timeout: int = 30000) -> OpenWebsiteResponse:
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--no-sandbox',
                    '--disable-dev-shm-usage'
                ]
            )
            
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                ignore_https_errors=False
            )
            
            page = await context.new_page()
            
            page.set_default_timeout(default_timeout)
            
            await page.goto(url, wait_until='networkidle', timeout=default_timeout)
            
            
            title = await page.title()
            content = await page.content()
            
            soup = BeautifulSoup(content, 'html.parser')

            for element in soup(["script", "style", "img", "svg", "iframe", "footer"]):
                element.decompose()

            links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                link_text = link.get_text(strip=True)
                absolute_url = urljoin(url, href)
                
                if absolute_url.startswith('https://'):
                    links.append(WebsiteLinks(
                        link=absolute_url,
                        text=link_text
                    ))
            
            for element in soup(["header", "nav"]):
                element.decompose()

            page_content = soup.prettify()
            
            
            await browser.close()
            
            return OpenWebsiteResponse(
                success=True,
                message="Successfully rendered page with Playwright",
                url=url,
                page_title=title or "",
                page_text=page_content,
                links=links
            )
        
    except Exception as e:
        return OpenWebsiteResponse(
            success=False,
            message="Failed to render page with Playwright",
            page_title="",
            url=url,
            page_text="",
            links=[]
        )

async def main(url):
    return await open_website_operation(url)
    

if __name__ == "__main__":
    website = "https://www.samsa.org.za/"
    response = asyncio.run(main(website))
    print(response.page_text)
    print("BREAK")
    for link in response.links:
        print(link.model_dump())
    