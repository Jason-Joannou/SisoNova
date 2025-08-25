from enum import Enum
from typing import List, Optional

from ice.models.kyc import BusinessProfile, ClientDetails
from ice.models.payments import PaymentConfiguration
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


class InvoiceItem(BaseModel):
    """Configurable invoice line item"""

    title: str = Field(..., description="Item/service title")
    description: Optional[str] = Field(None, description="Detailed description")
    category: Optional[str] = Field(None, description="Item category")
    sku: Optional[str] = Field(None, description="SKU or product code")
    quantity: float = Field(1.0, ge=0, description="Quantity (supports decimals)")
    unit: Optional[str] = Field("each", description="Unit of measurement")
    unit_price: float = Field(..., ge=0, description="Price per unit")
    discount_percentage: Optional[float] = Field(
        0, ge=0, le=100, description="Line item discount %"
    )
    tax_rate: Optional[float] = Field(
        None, description="Custom tax rate (overrides default VAT)"
    )

    @field_validator("unit_price", "quantity")
    def validate_positive(cls, v):
        if v < 0:
            raise ValueError("Must be positive")
        return v


class InvoiceConfiguration(BaseModel):
    """Complete invoice configuration"""

    # Basic invoice details
    invoice_number: str = Field(..., description="Invoice number")
    invoice_date: Optional[str] = Field(
        None, description="Invoice date (auto-generated if not provided)"
    )
    due_date: str = Field(..., description="Due date")

    # Business and client
    business_profile: BusinessProfile = Field(
        ..., description="Business profile configuration"
    )
    client_details: ClientDetails = Field(..., description="Client details")

    # Items and pricing
    items: List[InvoiceItem] = Field(
        ..., min_length=1, description="Invoice line items"
    )

    # Tax configuration
    include_vat: bool = Field(True, description="Include VAT")
    vat_rate: float = Field(0.15, description="VAT rate (default 15% for SA)")
    vat_number_required: bool = Field(True, description="Require VAT number display")

    # Discounts
    global_discount_enabled: bool = Field(False, description="Enable global discount")
    global_discount_percentage: Optional[float] = Field(
        0, ge=0, le=100, description="Global discount percentage"
    )
    global_discount_amount: Optional[float] = Field(
        None, ge=0, description="Global discount fixed amount"
    )

    # Configuration
    credit_terms: CreditTerms = Field(..., description="Credit terms configuration")
    payment_config: PaymentConfiguration = Field(
        ..., description="Payment configuration"
    )

    # Additional options
    currency: str = Field("ZAR", description="Currency code")
    language: str = Field("en", description="Language code")
    notes: Optional[str] = Field(None, description="Additional notes")
    internal_notes: Optional[str] = Field(
        None, description="Internal notes (not shown on invoice)"
    )
