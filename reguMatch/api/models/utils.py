from pydantic import BaseModel
from typing import List

class URLVerificationResult(BaseModel):
    exists: bool
    dns_valid: bool
    http_accessible: bool
    is_https: bool
    reason: str
    warnings: List[str]