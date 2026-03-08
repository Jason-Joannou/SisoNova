from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from enum import Enum
from datetime import date, datetime

class CollectionStatus(str, Enum):
    ACTIVE = 'active'
    PAID = 'paid'
    OVERDUE = 'overdue'
    DISPUTED = 'disputed'
    WRITTEN_OFF = 'written_off'

class CollectionItem(BaseModel):
    id: str
    invoice_number: str
    buyer_name: str
    buyer_email: EmailStr
    buyer_phone: Optional[str] = None
    amount: float
    due_date: date
    days_overdue: int
    status: CollectionStatus
    payment_reference: str
    last_reminder_sent: Optional[datetime] = None
    reminder_count: int = 0
    created_at: datetime = Field(default_factory=datetime.now)

class CollectionSettings(BaseModel):
    enabled: bool = False
    reminder_schedule: List[int] = Field(
        description="List of days at which reminders should be sent (e.g., [1, 7, 14])"
    )
    whatsapp_enabled: bool = False
    email_enabled: bool = True
    sms_enabled: bool = False
    escalation_enabled: bool = False
    escalation_days: int
    custom_message: Optional[str] = None

class CollectionStats(BaseModel):
    total_outstanding: float
    total_collected_this_month: float
    average_collection_days: float
    collection_success_rate: float  # e.g., 0.85 for 85%
    overdue_amount: float
    active_collections: int