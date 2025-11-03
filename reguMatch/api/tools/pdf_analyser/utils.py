import json
from pathlib import Path
import tempfile
import httpx
from typing import Optional
from paddleocr import PaddleOCR
from pydantic import BaseModel, Field
import asyncio


class PDFDownloadRequest(BaseModel):
    url: str = Field(..., description="URL of the PDF to download and analyze")


class PDFAnalysisResponse(BaseModel):
    success: bool
    message: str
    url: str
    filename: str
    text_content: str
    error: Optional[str] = None


async def download_and_analyze_pdf(url: str) -> PDFAnalysisResponse:
    """
    Download a PDF and extract text using PaddleOCR
    """
    temp_dir = None

    temp_dir = tempfile.mkdtemp()
    temp_path = Path(temp_dir)

    # Download PDF
    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()

        filename = url.split("/")[-1].split("?")[0]
        if not filename.endswith(".pdf"):
            filename = "document.pdf"

        pdf_path = temp_path / filename
        pdf_path.write_bytes(response.content)

    # Initialize PaddleOCR
    ocr = PaddleOCR(
        text_detection_model_name="PP-OCRv5_mobile_det",  # Faster detection
        text_recognition_model_name="PP-OCRv5_mobile_rec",  # Faster recognition
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False,
    )

    # Process the PDF
    result = ocr.predict(str(pdf_path))

    # Extract text from results
    all_text = []

    for page_result in result:
        # Access the rec_texts from the result
        res_dict = page_result.res if hasattr(page_result, "res") else page_result

        if isinstance(res_dict, dict) and "rec_texts" in res_dict:
            rec_texts = res_dict["rec_texts"]
            page_text = "\n".join(rec_texts)
            all_text.append(page_text)

    full_text = "\n\n".join(all_text)

    # Limit text length
    max_length = 50000
    if len(full_text) > max_length:
        full_text = full_text[:max_length] + "\n\n[Content truncated - PDF too long]"

    # Cleanup
    pdf_path.unlink()
    Path(temp_dir).rmdir()

    return PDFAnalysisResponse(
        success=True,
        message=f"Successfully extracted text from PDF ({len(result)} page(s))",
        url=url,
        filename=filename,
        text_content=full_text,
    )


async def test():
    pdf_url = "https://www.samsa.org.za/api/api/File/view/2kD0ao6TAdLtvYZXp4HlAA%3D%3D"

    result = await download_and_analyze_pdf(pdf_url)

    print("Success:", result.success)
    print("Message:", result.message)
    print("Filename:", result.filename)
    print("\n--- Extracted Text ---")
    print(result.text_content)

    if result.error:
        print("\nError:", result.error)


if __name__ == "__main__":
    asyncio.run(test())
