from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Annotated, Literal
from enum import Enum
from datetime import date, datetime

# Assuming these are in separate files as discussed
from models.business import BusinessProfile, ClientDetails
from models.payment_information import PaymentMethodInfo
from models.collections import CollectionSettings

# --- Enums ---

class PaymentTermsType(str, Enum):
    NET_15 = 'net_15'
    NET_30 = 'net_30'
    NET_60 = 'net_60'
    CASH_ON_DELIVERY = 'cash_on_delivery'
    CASH_IN_ADVANCE = 'cash_in_advance'
    CASH_BEFORE_DELIVERY = 'cash_before_delivery'
    CASH_WITH_ORDER = 'cash_with_order'
    CUSTOM = 'custom'

class AcceptedPaymentMethods(str, Enum):
    INSTANT_EFT = 'instant_eft'
    EFT = 'eft'
    PAYSHAP = 'payshap'
    SNAPSCAN = 'snapscan'
    ZAPPER = 'zapper'
    MOBILE_MONEY = 'mobile_money'
    CARD_PAYMENTS = 'card_payments'
    CASH = 'cash'

# --- Supporting Invoicing Models ---

class InvoiceItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    quantity: float
    unit: str
    unit_price: float
    discount_percentage: float
    tax_rate: Optional[float] = None

class PaymentDescription(BaseModel):
    payment_terms_type: PaymentTermsType
    description: str

class InvoicePaymentTerms(BaseModel):
    payment_terms_type: List[PaymentTermsType]
    payment_description: Optional[List[PaymentDescription]] = None
    late_fee_enabled: bool
    late_fee_type: Literal['percentage', 'fixed']
    late_fee_amount: float
    benefit_enabled: bool
    benefit_type: Literal['percentage', 'fixed']
    benefit_amount: float

class PaymentMethodInformationItem(BaseModel):
    payment_method: AcceptedPaymentMethods
    # Using the discriminated union for exact structure matching
    payment_method_info: Optional[
        Annotated[PaymentMethodInfo, Field(discriminator='payment_method')]
    ] = None

class InvoiceAcceptedPaymentMethods(BaseModel):
    accepted_payment_methods: List[AcceptedPaymentMethods]
    payments_method_information: List[PaymentMethodInformationItem]

class LatePaymentConfig(BaseModel):
    late_fee_enabled: bool
    late_fee_amount: float
    late_fee_type: Literal["percentage", "fixed"]
    grace_period_days: int
    compound_interest: bool
    late_fee_description: str

class DiscountTier(BaseModel):
    id: str
    discount_percentage: float
    discount_days: int
    description: str

class EarlyDiscountConfig(BaseModel):
    early_discount_enabled: bool
    discount_tiers: List[DiscountTier]

class InvoiceConfigurationSettings(BaseModel):
    enable_collections_service: bool
    collection_service_settings: CollectionSettings # Linked to the port from previous step

# --- Main Configuration Model ---

class InvoiceConfiguration(BaseModel):
    invoice_number: str
    invoice_date: str # Kept as str to match TS 'string' exactly, though 'date' is better for logic
    due_date: str
    business_profile: BusinessProfile
    client_details: ClientDetails
    items: List[InvoiceItem]
    include_vat: bool
    vat_rate: float
    payment_terms: Optional[InvoicePaymentTerms] = None
    accepted_payment_methods: Optional[InvoiceAcceptedPaymentMethods] = None
    late_payment_terms: Optional[LatePaymentConfig] = None
    early_discount_terms: Optional[EarlyDiscountConfig] = None
    invoice_settings: Optional[InvoiceConfigurationSettings] = None
    currency: str
    notes: Optional[str] = None