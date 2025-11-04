from fastmcp import FastMCP
from api.tools.pdf_analyser.models import AnalysePDFParameters
from api.tools.pdf_analyser.utils import analyse_and_extract_text_from_pdf_operation
import json

import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


mcp = FastMCP(
    name="PDF Analysis Service",
    instructions="""
PDF analysis tools for extracting text from compliance documents, regulations, and forms.

WHEN TO USE THESE TOOLS:
- Found a PDF link containing regulations, requirements, or forms
- Need to extract text from documents
- Need to read scanned documents or forms

**CRITICAL REQUIREMENT:**
- ONLY use URLs that have been discovered through:
  1. duck_duck_go_search results
  2. open_website link extraction
  3. Explicitly provided by the user
- NEVER construct, guess, or make up PDF URLs
- ALL URLs are verified before processing - invalid URLs will be rejected
- If you need a PDF but don't have a verified URL, use duck_duck_go_search first

**IF URL VERIFICATION FAILS:**
- The tool will return an error with success=false
- Use duck_duck_go_search to find the correct PDF URL
- Do not retry with the same URL or variations of it

Supports both digital PDFs and scanned image PDFs using PaddleOCR.
""",
)


@mcp.tool(
    name="download_and_analyze_pdf",
    description="""
Extract all text content from a PDF document.

**IMPORTANT: URL VERIFICATION**
- All URLs are automatically verified before processing
- Only accessible URLs with valid responses (200 OK) will be processed
- If verification fails, you will receive an error response

**WHEN TO USE:**
- Need to read the contents of a PDF
- Extracting information from regulations, forms, or documents

**HOW TO GET VALID URLs:**
- Use duck_duck_go_search to find PDF documents
- Use open_website to discover PDF links on pages
- Accept URLs explicitly provided by the user

**DO NOT:**
- Construct or guess URLs based on patterns
- Modify URLs from search results
- Assume URL structures

**WHAT THIS RETURNS:**
- success: true/false
- message: Status message or error description
- text_content: All text extracted from the PDF (if successful)
- filename: The PDF filename
- url: The URL that was processed

**PARAMETERS:**
- url: PDF URL to extract text from (will be verified automatically)
- use_ocr: false (default, faster) or true (if results are unsatisfactory)

**IF YOU RECEIVE AN ERROR:**
- Check the error message in the response
- If URL verification failed, use duck_duck_go_search to find the correct URL
- If text extraction failed but URL was valid, retry with use_ocr=true

**WORKFLOW EXAMPLE:**
1. User asks: "Get me the SAMSA vessel safety form"
2. You: Use duck_duck_go_search("SAMSA vessel safety form PDF")
3. You: Find PDF URL in search results
4. You: Use download_and_analyze_pdf with that URL
5. If verification fails: Search again with different terms
""",
)
async def download_and_analyze_pdf_tool(request: AnalysePDFParameters) -> str:
    """Download and analyse a PDF"""
    logger.info("Downloading and analyzing PDF...")
    response = await analyse_and_extract_text_from_pdf_operation(request)
    if not response.success:
        logger.error(f"Failed to download and analyze PDF: {response.error}")
        logger.error(f"Model dump: {response.model_dump()}")
    return json.dumps(response.model_dump(), indent=2)
