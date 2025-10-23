from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional, Dict

class AddEntryResponse(BaseModel):
    success: bool
    message: str
    response_document: Dict
    error: Optional[str] = None
