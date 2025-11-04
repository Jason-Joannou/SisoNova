from pydantic import BaseModel, Field
from typing import Optional

class BasePDFResponse(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="A message indicating the success or failure of the operation")
    error: Optional[str] = Field(None, description="An error message if the operation failed")

class AnalysePDFParameters(BaseModel):
    url: str = Field(..., description="URL of the PDF to download and analyze")
    use_ocr: bool = Field(False, description="Whether to use OCR to extract text from the PDF")


class AnalysePDFResponse(BasePDFResponse):
    url: str
    filename: str
    text_content: str