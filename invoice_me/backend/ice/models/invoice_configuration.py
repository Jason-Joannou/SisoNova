from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class PaymentTermsType(str, Enum):
    NET_15 = "net_15"
    NET_30 = "net_30"
    NET_60 = "net_60"
    DUE_ON_RECEIPT = "due_on_receipt"
    CUSTOM = "custom"


class CreditTerms(BaseModel):
    """Credit terms for the invoice"""

    payment_terms_type: PaymentTermsType = Field(..., description="Payment terms type")
    custom_payment_terms: Optional[str] = Field(
        None, description="Custom payment terms if type is 'custom'"
    )
    payment_due_days: Optional[int] = Field(
        None, description="Days until payment is due"
    )

    # Late payment configuration
    late_fee_enabled: bool = Field(True, description="Enable late payment fees")
    late_fee_type: str = Field("percentage", description="'percentage' or 'fixed'")
    late_fee_amount: float = Field(
        2.0, description="Late fee amount (% or fixed amount)"
    )
    late_fee_frequency: str = Field("monthly", description="'daily', 'monthly', 'once'")

    # Early payment discount
    early_discount_enabled: bool = Field(
        False, description="Enable early payment discount"
    )
    early_discount_days: Optional[int] = Field(
        10, description="Days for early payment discount"
    )
    early_discount_percentage: Optional[float] = Field(
        2.0, description="Early payment discount percentage"
    )

    # Credit management
    credit_limit_enabled: bool = Field(False, description="Enable credit limit display")
    credit_limit_amount: Optional[float] = Field(
        None, description="Credit limit amount"
    )

    # Dispute and resolution
    dispute_period_days: int = Field(7, description="Days to raise disputes")
    dispute_contact_email: Optional[str] = Field(None, description="Email for disputes")
    dispute_contact_number: Optional[str] = Field(
        None, description="Contact number for disputes"
    )

    # Additional terms
    retention_enabled: bool = Field(False, description="Enable retention terms")
    retention_percentage: Optional[float] = Field(
        None, description="Retention percentage"
    )
    retention_period_days: Optional[int] = Field(
        None, description="Retention period in days"
    )
