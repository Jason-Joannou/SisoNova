from pydantic import BaseModel, Field
from typing import Optional

class BaseResponseModel(BaseModel):
    success: bool = Field(..., description="Indicates whether the operation was successful or not")
    message: str = Field(..., description="A message indicating the result of the operation")
    error: Optional[str] = Field(None, description="Error message if the operation failed")