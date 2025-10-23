from pydantic import BaseModel, Field
from typing import Optional

class URLVerificationResult(BaseModel):
    exists: bool = Field(..., description="Whether the URL exists")
    is_https: bool = Field(..., description="Whether the URL is using HTTPS")
    status_code: int = Field(..., description="The HTTP status code of the response")
    error: Optional[str] = Field(None, description="An error message if the operation failed.")