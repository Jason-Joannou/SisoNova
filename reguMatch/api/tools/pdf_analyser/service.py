from fastmcp import FastMCP
import json
from pathlib import Path
import tempfile
import httpx
from typing import Optional
from paddleocr import PaddleOCR
from pydantic import BaseModel, Field

mcp = FastMCP(
    name="PDF Analysis Service",
    instructions="""
PDF analysis tools for extracting text from compliance documents, regulations, and forms.

WHEN TO USE THESE TOOLS:
- Found a PDF link containing regulations, requirements, or forms
- Need to extract text from official documents
- User provides a PDF URL to analyze
- Need to read scanned documents or forms

Supports both digital PDFs and scanned image PDFs using PaddleOCR.
""",
)


class PDFDownloadRequest(BaseModel):
    url: str = Field(..., description="URL of the PDF to download and analyze")
    use_structure: bool = Field(
        default=True,
        description="Use PP-StructureV3 for better layout preservation (default: True)"
    )


class PDFAnalysisResponse(BaseModel):
    success: bool
    message: str
    url: str
    filename: str
    text_content: str
    error: Optional[str] = None


# Initialize PaddleOCR once
ocr_engine = None

def get_ocr_engine(use_structure: bool = True):
    """Get or initialize PaddleOCR engine"""
    global ocr_engine
    if ocr_engine is None:
        ocr_engine = PaddleOCR(
            use_angle_cls=True,
            lang='en',
            use_gpu=False,
            show_log=False,
            # Use structure model for better PDF parsing
            use_structure=use_structure
        )
    return ocr_engine


async def download_and_analyze_pdf(
    url: str,
    use_structure: bool = True
) -> PDFAnalysisResponse:
    """
    Download a PDF and extract text using PaddleOCR
    """
    temp_dir = None
    
    try:
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        temp_path = Path(temp_dir)
        
        # Download PDF
        async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            # Get filename from URL
            filename = url.split('/')[-1].split('?')[0]
            if not filename.endswith('.pdf'):
                filename = 'document.pdf'
            
            pdf_path = temp_path / filename
            pdf_path.write_bytes(response.content)
        
        # Use PaddleOCR to process PDF directly
        ocr = get_ocr_engine(use_structure)
        
        # PaddleOCR can handle PDFs directly!
        result = ocr.ocr(str(pdf_path), cls=True)
        
        # Extract text from results
        all_text = []
        
        if result:
            for page_idx, page_result in enumerate(result):
                page_text_lines = []
                
                if page_result:
                    for line in page_result:
                        if line:
                            # line format: [bbox, (text, confidence)]
                            text_content = line[1][0]
                            page_text_lines.append(text_content)
                
                page_text = "\n".join(page_text_lines)
                all_text.append(f"\n--- Page {page_idx + 1} ---\n{page_text}")
        
        full_text = "\n".join(all_text)
        
        # Limit text length
        max_length = 50000
        if len(full_text) > max_length:
            full_text = full_text[:max_length] + "\n\n[Content truncated - PDF too long]"
        
        # Cleanup
        pdf_path.unlink()
        Path(temp_dir).rmdir()
        
        return PDFAnalysisResponse(
            success=True,
            message=f"Successfully extracted text from PDF",
            url=url,
            filename=filename,
            text_content=full_text
        )
    
    except httpx.HTTPError as e:
        return PDFAnalysisResponse(
            success=False,
            message=f"Failed to download PDF: {str(e)}",
            url=url,
            filename="",
            text_content="",
            error=str(e)
        )
    
    except Exception as e:
        return PDFAnalysisResponse(
            success=False,
            message=f"Failed to analyze PDF: {str(e)}",
            url=url,
            filename="",
            text_content="",
            error=str(e)
        )
    
    finally:
        # Cleanup
        if temp_dir and Path(temp_dir).exists():
            try:
                for file in Path(temp_dir).iterdir():
                    file.unlink()
                Path(temp_dir).rmdir()
            except:
                pass


@mcp.tool(
    name="download_and_analyze_pdf",
    description="""
Download a PDF from a URL and extract all text content using PaddleOCR.

**WHEN TO USE THIS:**
- Found a PDF link containing regulations, requirements, or compliance information
- Need to read the contents of an official document
- User provides a PDF URL to analyze
- Need to extract text from scanned documents, forms, or tables

**WHAT THIS DOES:**
1. Downloads the PDF from the provided URL
2. Uses PaddleOCR to extract text (handles both digital and scanned PDFs automatically)
3. Returns all text content organized by page

**SUPPORTS:**
- Digital PDFs (text-based)
- Scanned PDFs (image-based)
- Mixed PDFs
- Multi-page documents
- Tables and structured forms
- 109 languages

**WHAT THIS RETURNS:**
- Full text content from all pages
- Organized by page number

**ADVANTAGES:**
- Handles PDFs directly (no conversion needed)
- High accuracy on complex layouts
- Works with scanned documents
- Supports multilingual content

**LIMITATIONS:**
- Text is limited to 50,000 characters to prevent crashes
- May take longer for large PDFs

**EXAMPLES:**
- Extract requirements from a government regulation PDF
- Read application form instructions from a scanned PDF
- Analyze compliance documentation

Args:
    url: Direct URL to the PDF file (must be publicly accessible)
    use_structure: Use PP-StructureV3 for better layout (default: True)

Returns: Extracted text content organized by page.

**USE THIS** whenever you need to read the contents of a PDF document.
""",
)
async def download_and_analyze_pdf_tool(request: PDFDownloadRequest) -> str:
    """Download and analyze PDF with PaddleOCR"""
    response = await download_and_analyze_pdf(
        url=request.url,
        use_structure=request.use_structure
    )
    return json.dumps(response.model_dump(), indent=2)