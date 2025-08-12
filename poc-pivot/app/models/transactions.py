from pydantic import BaseModel
import uuid
from datetime import datetime


class UnverifiedTransaction(BaseModel):
    id: uuid.UUID
    requesting_number: str
    receiver_number: str | None = None
    amount: float
    purpose: str
    issued_at: datetime
    expires_at: datetime