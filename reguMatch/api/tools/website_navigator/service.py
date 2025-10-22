from fastmcp import FastMCP
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import List, Optional
from googlesearch import search
import urllib3
import asyncio
from playwright.async_api import async_playwright


# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


mcp = FastMCP(
    name="Web Scraper Service",
    instructions="Web scraping tools with JavaScript rendering support using Playwright for searching, opening websites, and navigating links"
)

# ============= 1. GOOGLE SEARCH =============

@mcp.tool(
    name="google_search",
    description="""Search Google and get a list of results.

Args:
    query: Search query (e.g., "South Africa fishing regulations")
    num_results: Number of results to return (default: 10)

Returns a list of search results with titles, URLs, and snippets.
"""
)
async def google_search(query: str, num_results: int = 10) -> str:
    """Search Google and return results"""
    try:
        results = []
        for url in search(query, num_results=num_results, lang="en"):
            results.append({"url": url})
        
        return json.dumps({
            "success": True,
            "query": query,
            "results_count": len(results),
            "results": results
        }, indent=2)
        
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": str(e),
            "message": "Failed to search Google. You may need to install: pip install googlesearch-python"
        }, indent=2)


@mcp.tool(
    name="open_website",
    description="""Open a website and extract its content. Supports JavaScript-heavy websites.

Args:
    url: The URL to open (must include https://)
    use_javascript: Set to true for JavaScript-heavy websites (default: false)
    wait_seconds: Seconds to wait for JavaScript to load (default: 5)

Returns:
    - Page title
    - Main text content
    - All links found on the page
    - Meta description
"""
)
async def open_website(url: str, use_javascript: bool = False, wait_seconds: int = 5) -> str:
    """Open a website and extract content"""
    
    # If JavaScript rendering is requested and Playwright is available
    if use_javascript and PLAYWRIGHT_AVAILABLE:
        return await open_website_with_js(url, wait_seconds)
    elif use_javascript and not PLAYWRIGHT_AVAILABLE:
        return json.dumps({
            "success": False,
            "error": "Playwright not installed",
            "message": "To use JavaScript rendering, install: pip install playwright && playwright install chromium",
            "fallback": "Attempting basic scraping..."
        }, indent=2)
    
    # Basic scraping (no JavaScript)
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        }
        
        session = requests.Session()
        response = session.get(
            url, 
            headers=headers, 
            timeout=30,
            verify=False,
            allow_redirects=True
        )
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title = soup.title.string if soup.title else "No title"
        
        meta_desc = ""
        meta_tag = soup.find('meta', attrs={'name': 'description'})
        if meta_tag:
            meta_desc = meta_tag.get('content', '')
        
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        text = text[:10000]
        
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            link_text = link.get_text(strip=True)
            absolute_url = urljoin(url, href)
            
            if absolute_url.startswith(('http://', 'https://')):
                links.append({
                    "url": absolute_url,
                    "text": link_text
                })
        
        seen = set()
        unique_links = []
        for link in links:
            if link['url'] not in seen:
                seen.add(link['url'])
                unique_links.append(link)
        
        # Check if content is empty (likely JavaScript site)
        if len(text.strip()) < 100 and len(unique_links) < 5:
            suggestion = "This website appears to use JavaScript. Try setting use_javascript=true"
        else:
            suggestion = None
        
        return json.dumps({
            "success": True,
            "url": url,
            "method": "basic_scraping",
            "title": title,
            "meta_description": meta_desc,
            "content": text,
            "content_length": len(text),
            "links_found": len(unique_links),
            "links": unique_links[:50],
            "suggestion": suggestion
        }, indent=2)
        
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": str(e),
            "url": url
        }, indent=2)


# ============= 2B. OPEN WEBSITE WITH JAVASCRIPT (PLAYWRIGHT) =============

async def open_website_with_js(url: str, wait_seconds: int = 5) -> str:
    """Open a website using Playwright for JavaScript rendering"""
    try:
        async with async_playwright() as p:
            # Launch browser
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--no-sandbox',
                    '--disable-dev-shm-usage'
                ]
            )
            
            # Create context with custom settings
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                ignore_https_errors=True
            )
            
            # Create page
            page = await context.new_page()
            
            # Set longer timeout
            page.set_default_timeout(30000)
            
            # Navigate to URL
            await page.goto(url, wait_until='networkidle', timeout=30000)
            
            # Wait additional time for JavaScript to execute
            await asyncio.sleep(wait_seconds)
            
            # Get page content
            title = await page.title()
            content = await page.content()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract meta description
            meta_desc = ""
            meta_tag = soup.find('meta', attrs={'name': 'description'})
            if meta_tag:
                meta_desc = meta_tag.get('content', '')
            
            # Remove unwanted elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            
            # Get text content
            text = soup.get_text()
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            text = text[:15000]  # Increased limit for JS-rendered content
            
            # Extract all links
            links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                link_text = link.get_text(strip=True)
                absolute_url = urljoin(url, href)
                
                if absolute_url.startswith(('http://', 'https://')):
                    links.append({
                        "url": absolute_url,
                        "text": link_text
                    })
            
            # Remove duplicate links
            seen = set()
            unique_links = []
            for link in links:
                if link['url'] not in seen:
                    seen.add(link['url'])
                    unique_links.append(link)
            
            # Close browser
            await browser.close()
            
            return json.dumps({
                "success": True,
                "url": url,
                "method": "playwright_javascript",
                "title": title,
                "meta_description": meta_desc,
                "content": text,
                "content_length": len(text),
                "links_found": len(unique_links),
                "links": unique_links[:100]  # Return more links for JS sites
            }, indent=2)
        
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": str(e),
            "url": url,
            "method": "playwright_javascript",
            "message": "Failed to render page with Playwright"
        }, indent=2)


# ============= 3. NAVIGATE TO LINK =============

@mcp.tool(
    name="navigate_to_link",
    description="""Navigate to a specific link from a previously opened website.

Args:
    url: The URL to navigate to
    use_javascript: Set to true for JavaScript-heavy websites
    wait_seconds: Seconds to wait for JavaScript to load (default: 5)
    context: Optional context about why you're navigating to this link

Returns the content of the linked page.
"""
)
async def navigate_to_link(url: str, use_javascript: bool = False, wait_seconds: int = 5, context: Optional[str] = None) -> str:
    """Navigate to a link"""
    result = await open_website.fn(url, use_javascript=use_javascript, wait_seconds=wait_seconds)
    
    result_dict = json.loads(result)
    if context:
        result_dict['navigation_context'] = context
    
    return json.dumps(result_dict, indent=2)


# ============= 4. EXTRACT SPECIFIC ELEMENTS =============

@mcp.tool(
    name="extract_elements",
    description="""Extract specific elements from a JavaScript-heavy website using CSS selectors.

Args:
    url: The URL to scrape
    selectors: Dictionary of {name: css_selector} to extract specific elements
    wait_seconds: Seconds to wait for page load (default: 5)

Example selectors:
    {"documents": "a[href*='.pdf']", "headings": "h1, h2, h3"}

Returns extracted elements grouped by selector name.
"""
)
async def extract_elements(url: str, selectors: dict, wait_seconds: int = 5) -> str:
    """Extract specific elements using Playwright and CSS selectors"""
    
    if not PLAYWRIGHT_AVAILABLE:
        return json.dumps({
            "success": False,
            "error": "Playwright not installed",
            "message": "Install with: pip install playwright && playwright install chromium"
        }, indent=2)
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=['--disable-blink-features=AutomationControlled', '--no-sandbox']
            )
            
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                ignore_https_errors=True
            )
            
            page = await context.new_page()
            page.set_default_timeout(30000)
            
            await page.goto(url, wait_until='networkidle', timeout=30000)
            await asyncio.sleep(wait_seconds)
            
            results = {}
            
            for name, selector in selectors.items():
                elements = await page.query_selector_all(selector)
                extracted = []
                
                for element in elements:
                    text = await element.inner_text()
                    href = await element.get_attribute('href')
                    
                    item = {"text": text.strip()}
                    if href:
                        item["url"] = urljoin(url, href)
                    
                    extracted.append(item)
                
                results[name] = extracted
            
            await browser.close()
            
            return json.dumps({
                "success": True,
                "url": url,
                "method": "playwright_selector_extraction",
                "results": results
            }, indent=2)
        
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": str(e),
            "url": url
        }, indent=2)