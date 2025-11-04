from pathlib import Path
import tempfile
import httpx
from paddleocr import PaddleOCR
import asyncio
import fitz
from api.tools.pdf_analyser.models import AnalysePDFParameters, AnalysePDFResponse
from urllib.parse import urlparse, unquote
from api.utils.web_services import verify_url_exists
import os
import re


def _extract_pdf_filename(url: str) -> str:
    """
    Extracts and cleans the PDF filename from any URL.
    Falls back to a default name if extraction fails.
    """
    parsed = urlparse(url)
    filename_encoded = os.path.basename(parsed.path)
    filename = unquote(filename_encoded)
    filename = re.split(r"[?#]", filename)[0]
    filename = " ".join(filename.split())

    # Ensure valid filename
    if not filename or filename.strip() == "":
        filename = "document.pdf"

    # Ensure it ends with .pdf
    if not filename.lower().endswith(".pdf"):
        filename += ".pdf"

    return filename


async def download_and_analyze_pdf(url: str) -> AnalysePDFResponse:
    """
    Download a PDF and extract text using PaddleOCR
    """
    try:

        temp_dir = None

        temp_dir = tempfile.mkdtemp()
        temp_path = Path(temp_dir)

        # Download PDF
        async with httpx.AsyncClient(
            timeout=60.0, follow_redirects=True, verify=False, max_redirects=20
        ) as client:
            response = await client.get(url)
            response.raise_for_status()

            filename = _extract_pdf_filename(url)

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

        full_text = "\n".join(all_text)

        # Cleanup
        pdf_path.unlink()
        Path(temp_dir).rmdir()

        return AnalysePDFResponse(
            success=True,
            message=f"Successfully extracted text from PDF ({len(result)} page(s))",
            url=url,
            filename=filename,
            text_content=full_text,
        )

    except Exception as e:
        return AnalysePDFResponse(
            success=False,
            message=f"Failed to extract text from PDF: {str(e)}",
            url=url,
            error=str(e),
            filename="",
            text_content="",
        )


async def extract_text_from_pdf(url: str) -> AnalysePDFResponse:
    """
    Fast text extraction for PDFs with text layer (digital PDFs)
    """
    try:

        temp_dir = None

        temp_dir = tempfile.mkdtemp()
        temp_path = Path(temp_dir)

        # Download PDF
        async with httpx.AsyncClient(
            timeout=60.0, follow_redirects=True, verify=False, max_redirects=20
        ) as client:
            response = await client.get(url)
            response.raise_for_status()

            filename = _extract_pdf_filename(url)

            pdf_path = temp_path / filename
            pdf_path.write_bytes(response.content)

        # Extract text with PyMuPDF
        doc = fitz.open(str(pdf_path))
        all_text = []

        page_count = len(doc)  # Store page count BEFORE closing

        for page_num in range(page_count):
            page = doc[page_num]
            text = page.get_text()
            all_text.append(text)

        doc.close()

        full_text = "\n".join(all_text)

        # Cleanup
        pdf_path.unlink()
        Path(temp_dir).rmdir()

        return AnalysePDFResponse(
            success=True,
            message=f"Successfully extracted text from PDF ({page_count} page(s))",  # Use stored page_count
            url=url,
            filename=filename,
            text_content=full_text,
        )

    except Exception as e:
        return AnalysePDFResponse(
            success=False,
            message=f"Failed to extract text from PDF: {str(e)}",
            error=str(e),
            url=url,
            filename="",
            text_content="",
        )


async def analyse_and_extract_text_from_pdf_operation(
    parameters: AnalysePDFParameters,
) -> AnalysePDFResponse:
    # verify url exists
    is_valid, message = await verify_url_exists(parameters.url)

    if not is_valid:
        return AnalysePDFResponse(
            success=False,
            message=f"URL verification failed: {message}. This URL may be incorrect, constructed, or inaccessible. Please use duck_duck_go_search to find the correct PDF URL.",
            url=parameters.url,
            filename="",
            text_content="",
            error=f"URL_VERIFICATION_FAILED: {message}",
        )
    if parameters.use_ocr:
        return await download_and_analyze_pdf(parameters.url)

    return await extract_text_from_pdf(parameters.url)


async def test():
    pdf_url = "https://www.samsa.org.za/api/api/File/view/2kD0ao6TAdLtvYZXp4HlAA%3D%3D"

    # result = await download_and_analyze_pdf(pdf_url)

    # print("Success:", result.success)
    # print("Message:", result.message)
    # print("Filename:", result.filename)
    # print("\n--- Extracted Text ---")
    # print(result.text_content)

    # if result.error:
    #     print("\nError:", result.error)

    # Test fast text extraction method
    # pdf_url = "https://www.resbank.co.za/content/dam/sarb/what-we-do/financial-surveillance/general-public/Position%20paper%20no%20%2001_2018%20on%20%20the%20PFMIs.pdf"
    print("=== Testing Fast Text Extraction Method ===")
    result_text = await extract_text_from_pdf(pdf_url)
    print("Success:", result_text.success)
    print("Message:", result_text.message)
    print("Filename:", result_text.filename)
    print("\n--- Text Extracted (first 500 chars) ---")
    print(result_text.text_content[:500])


if __name__ == "__main__":
    asyncio.run(test())
