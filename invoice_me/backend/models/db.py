from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DatabaseResponse(BaseModel):
    success: bool
    data: Dict | List
    message: str