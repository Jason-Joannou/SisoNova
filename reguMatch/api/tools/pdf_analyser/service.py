from fastmcp import FastMCP
from api.tools.pdf_analyser.models import AnalysePDFParameters
from api.tools.pdf_analyser.utils import analyse_and_extract_text_from_pdf_operation
import json


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
- If you need a PDF but don't have a verified URL, use duck_duck_go_search first

Supports both digital PDFs and scanned image PDFs using PaddleOCR.
""",
)


@mcp.tool(
    name="download_and_analyze_pdf",
    description="""
Extract all text content from a PDF document.

**WHEN TO USE:**
- Need to read the contents of a PDF
- Extracting information from regulations, forms, or documents

**BEFORE USING THIS TOOL:**
- Verify you have a real URL from:
  * duck_duck_go_search results
  * open_website links
  * User-provided URL
- DO NOT construct or guess URLs

**WHAT THIS RETURNS:**
- All text extracted from the PDF
- Text is returned as-is from the document

**PARAMETERS:**
- url: PDF URL to extract text from (MUST be from verified source)
- use_ocr: false (default, faster) or true (if results are unsatisfactory)

**NOTE:**
If the extracted text is empty or unsatisfactory, retry with use_ocr=true.
"""
)
async def download_and_analyze_pdf_tool(request: AnalysePDFParameters) -> str:
    response = await analyse_and_extract_text_from_pdf_operation(request)
    return json.dumps(response.model_dump(), indent=2)