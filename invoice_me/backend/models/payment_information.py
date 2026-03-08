from pydantic import BaseModel, Field
from typing import Optional, Union, Literal
from models.invoices import AcceptedPaymentMethods
from enum import Enum

class BasePaymentMethodInfo(BaseModel):
    payment_method: AcceptedPaymentMethods
    enabled: bool = True
    information_present: bool = False
    display_name: Optional[str] = None
    description: Optional[str] = None

class EFTPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.EFT] = AcceptedPaymentMethods.EFT
    bank_name: str
    account_holder: str
    account_number: str
    branch_code: str
    swift_code: Optional[str] = None

class InstantEFTPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.INSTANT_EFT] = AcceptedPaymentMethods.INSTANT_EFT
    bank_name: str
    account_holder: str
    account_number: str
    branch_code: str

class SnapScanPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.SNAPSCAN] = AcceptedPaymentMethods.SNAPSCAN
    merchant_id: str
    store_id: Optional[str] = None
    qr_code_url: Optional[str] = None

class PayShapPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.PAYSHAP] = AcceptedPaymentMethods.PAYSHAP
    payshap_id: str
    reference_prefix: Optional[str] = None

class ZapperPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.ZAPPER] = AcceptedPaymentMethods.ZAPPER
    merchant_id: str
    store_id: Optional[str] = None
    qr_code_url: Optional[str] = None

class CardPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.CARD_PAYMENTS] = AcceptedPaymentMethods.CARD_PAYMENTS
    merchant_id: str

class MobileMoneyPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.MOBILE_MONEY] = AcceptedPaymentMethods.MOBILE_MONEY
    provider: str
    merchant_code: str

class CashPaymentInfo(BasePaymentMethodInfo):
    payment_method: Literal[AcceptedPaymentMethods.CASH] = AcceptedPaymentMethods.CASH

# This is the Union type port
PaymentMethodInfo = Union[
    EFTPaymentInfo,
    InstantEFTPaymentInfo,
    SnapScanPaymentInfo,
    PayShapPaymentInfo,
    ZapperPaymentInfo,
    CardPaymentInfo,
    MobileMoneyPaymentInfo,
    CashPaymentInfo
]

# We use Field(discriminator=...) so Pydantic knows which model to use 
# when parsing a list of mixed payment methods.
class AnnotatedPaymentMethod(BaseModel):
    info: Union[
        EFTPaymentInfo,
        InstantEFTPaymentInfo,
        SnapScanPaymentInfo,
        PayShapPaymentInfo,
        ZapperPaymentInfo,
        CardPaymentInfo,
        MobileMoneyPaymentInfo,
        CashPaymentInfo
    ] = Field(..., discriminator='payment_method')