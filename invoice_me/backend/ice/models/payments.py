from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class PaymentConfiguration(BaseModel):
    """Payment Option configuration"""

    # Bank details
    bank_name: str = Field(..., description="Bank name")
    account_holder: str = Field(..., description="Account holder name")
    account_number: str = Field(..., description="Account number")
    branch_code: str = Field(..., description="Branch code")
    swift_code: Optional[str] = Field(None, description="SWIFT code for international")

    # Payment methods
    enable_instant_eft: bool = Field(True, description="Enable Instant EFT")
    enable_payshap: bool = Field(True, description="Enable PayShap")
    enable_snapscan: bool = Field(True, description="Enable Snapscan")
    enable_zapper: bool = Field(True, description="Enable Zapper")
    enable_mobile_money: bool = Field(True, description="Enable Mobile Money Transfers")
    enable_bank_transfer: bool = Field(
        True, description="Enable traditional bank transfer"
    )
    enable_card_payments: bool = Field(False, description="Enable card payments")

    # Payment links (for future integration)
    instant_eft_provider: Optional[str] = Field(
        None, description="Instant EFT provider"
    )
    payshap_merchant_id: Optional[str] = Field(None, description="PayShap merchant ID")
    snapscan_merchant_id: Optional[str] = Field(
        None, description="Snapscan merchant ID"
    )
    zapper_merchant_id: Optional[str] = Field(None, description="Zapper merchant ID")
    monile_money_number: Optional[str] = Field(None, description="Mobile money number")
    card_payment_provider: Optional[str] = Field(
        None, description="Card payment provider"
    )

    # Reference generation
    reference_prefix: str = Field("INV", description="Payment reference prefix")
    include_company_code: bool = Field(
        True, description="Include company code in reference"
    )
    include_date: bool = Field(False, description="Include date in reference")
