from pydantic import BaseModel, Field, field_validator, EmailStr
from enum import Enum
from typing import List, Optional, Dict, Any, Union
from uuid import UUID, uuid4
from datetime import datetime, date
from decimal import Decimal

# Enums for collection service
class CollectionStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    PARTIALLY_COLLECTED = "partially_collected"
    FULLY_COLLECTED = "fully_collected"
    OVERDUE = "overdue"
    DISPUTED = "disputed"
    WRITTEN_OFF = "written_off"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    DISPUTED = "disputed"

class ReminderType(str, Enum):
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    SMS = "sms"
    PHONE_CALL = "phone_call"
    LETTER = "letter"

class ReminderStatus(str, Enum):
    SCHEDULED = "scheduled"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    BOUNCED = "bounced"

class CollectionMethod(str, Enum):
    AUTOMATED_REMINDERS = "automated_reminders"
    MANUAL_FOLLOW_UP = "manual_follow_up"
    LEGAL_ACTION = "legal_action"
    DEBT_COLLECTION_AGENCY = "debt_collection_agency"

class DisputeStatus(str, Enum):
    RAISED = "raised"
    UNDER_REVIEW = "under_review"
    RESOLVED = "resolved"
    ESCALATED = "escalated"
    CLOSED = "closed"

class PaymentReferenceType(str, Enum):
    BANK_TRANSFER = "bank_transfer"
    MOBILE_MONEY = "mobile_money"
    QR_CODE = "qr_code"
    VIRTUAL_ACCOUNT = "virtual_account"
    INSTANT_TRANSFER = "instant_transfer"


class MobileMoneyProvider(str, Enum):
    MTN_MOMO = "mtn_momo"
    VODACOM_MPESA = "vodacom_mpesa"
    AIRTEL_MONEY = "airtel_money"
    TELKOM_TCASH = "telkom_tcash"
    CAPITEC_PAY = "capitec_pay"
    FNB_PAY = "fnb_pay"
    NEDBANK_MONEY = "nedbank_money"


class InstantTransferProvider(str, Enum):
    """Instant transfer services that use identifiers like phone numbers or aliases"""
    PAYSHAP = "payshap"  # Uses ShapID (phone number or custom alias)
    PAYFLEX = "payflex"
    OZOW = "ozow"
    PEACH_PAYMENTS = "peach_payments"

class QRPaymentProvider(str, Enum):
    SNAPSCAN = "snapscan"
    ZAPPER = "zapper"
    MASTERPASS = "masterpass"
    SAMSUNG_PAY = "samsung_pay"
    GOOGLE_PAY = "google_pay"
    APPLE_PAY = "apple_pay"

# NEW: Enhanced payment reference models
class BasePaymentReference(BaseModel):
    """Base payment reference"""
    reference_number: str = Field(..., description="Unique payment reference")
    payment_type: PaymentReferenceType = Field(..., description="Type of payment reference")
    instructions: str = Field(..., description="Payment instructions for the debtor")
    
    @field_validator('reference_number')
    @classmethod
    def validate_reference(cls, v):
        if not v or len(v) < 3:
            raise ValueError('Reference number must be at least 3 characters')
        return v.upper()

class BankPaymentReference(BasePaymentReference):
    """Traditional bank payment reference"""
    payment_type: PaymentReferenceType = Field(PaymentReferenceType.BANK_TRANSFER, description="Payment type")
    dedicated_account: Optional[str] = Field(None, description="Dedicated/virtual account number")
    bank_name: str = Field(..., description="Bank name")
    account_number: str = Field(..., description="Account number")
    branch_code: str = Field(..., description="Branch code")
    swift_code: Optional[str] = Field(None, description="SWIFT code for international")
    account_holder: str = Field(..., description="Account holder name")

class MobileMoneyReference(BasePaymentReference):
    """Mobile money payment reference"""
    payment_type: PaymentReferenceType = Field(PaymentReferenceType.MOBILE_MONEY, description="Payment type")
    provider: MobileMoneyProvider = Field(..., description="Mobile money provider")
    merchant_code: str = Field(..., description="Merchant code for the provider")
    phone_number: str = Field(..., description="Phone number to pay to")
    ussd_code: Optional[str] = Field(None, description="USSD code for payment")
    app_deep_link: Optional[str] = Field(None, description="Deep link to mobile app")
    
    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v):
        if not v.startswith('+27'):
            raise ValueError('Phone number must be in +27 format')
        return v

class QRPaymentReference(BasePaymentReference):
    """QR code payment reference"""
    payment_type: PaymentReferenceType = Field(PaymentReferenceType.QR_CODE, description="Payment type")
    provider: QRPaymentProvider = Field(..., description="QR payment provider")
    qr_code_data: str = Field(..., description="QR code data/payload")
    qr_code_image_url: Optional[str] = Field(None, description="URL to QR code image")
    merchant_id: str = Field(..., description="Merchant ID with the provider")
    deep_link: Optional[str] = Field(None, description="Deep link to payment app")
    web_payment_url: Optional[str] = Field(None, description="Web payment URL")

class InstantTransferReference(BasePaymentReference):
    """Instant transfer payment reference (PayShap, Ozow, etc.)"""
    payment_type: PaymentReferenceType = Field(PaymentReferenceType.INSTANT_TRANSFER, description="Payment type")
    provider: InstantTransferProvider = Field(..., description="Instant transfer provider")
    
    # PayShap-specific fields
    shap_id: Optional[str] = Field(None, description="PayShap ID (phone number or custom alias)")
    recipient_phone: Optional[str] = Field(None, description="Recipient phone number")
    custom_alias: Optional[str] = Field(None, description="Custom PayShap alias if available")
    
    # Generic instant transfer fields
    recipient_identifier: str = Field(..., description="Recipient identifier (phone/email/alias)")
    payment_link: Optional[str] = Field(None, description="Direct payment link if available")
    deep_link: Optional[str] = Field(None, description="Deep link to banking app")
    
    # Provider-specific metadata
    provider_merchant_id: Optional[str] = Field(None, description="Merchant ID with the provider")
    provider_reference: Optional[str] = Field(None, description="Provider-specific reference")
    
    @field_validator('recipient_phone')
    @classmethod
    def validate_phone(cls, v):
        if v and not v.startswith('+27'):
            raise ValueError('Phone number must be in +27 format')
        return v
    
    @field_validator('shap_id')
    @classmethod
    def validate_shap_id(cls, v):
        if v:
            # ShapID can be a phone number or custom alias
            if v.startswith('+27') or v.startswith('0'):
                # It's a phone number
                if not v.startswith('+27'):
                    raise ValueError('Phone number must be in +27 format')
            elif len(v) < 3:
                raise ValueError('Custom alias must be at least 3 characters')
        return v

class VirtualAccountReference(BasePaymentReference):
    """Virtual account payment reference"""
    payment_type: PaymentReferenceType = Field(PaymentReferenceType.VIRTUAL_ACCOUNT, description="Payment type")
    virtual_account_number: str = Field(..., description="Virtual account number")
    bank_name: str = Field(..., description="Bank providing virtual account")
    account_holder: str = Field(..., description="Account holder name")
    expires_at: Optional[datetime] = Field(None, description="When virtual account expires")

# NEW: Enhanced PaymentReference that supports multiple payment types
class PaymentReference(BaseModel):
    """Enhanced payment reference supporting multiple payment types"""
    reference_id: UUID = Field(default_factory=uuid4, description="Reference ID")
    primary_reference: Union[
        BankPaymentReference, 
        MobileMoneyReference, 
        QRPaymentReference, 
        VirtualAccountReference,
        InstantTransferReference
    ] = Field(..., description="Primary payment method")
    alternative_references: List[Union[
        BankPaymentReference, 
        MobileMoneyReference, 
        QRPaymentReference, 
        VirtualAccountReference,
        InstantTransferReference
    ]] = Field(default=[], description="Alternative payment methods")
    
    # Common fields
    amount: Optional[Decimal] = Field(None, description="Specific amount if fixed")
    currency: str = Field("ZAR", description="Currency code")
    expires_at: Optional[datetime] = Field(None, description="When payment reference expires")
    is_active: bool = Field(True, description="Whether reference is active")
    
    # Tracking
    created_at: datetime = Field(default_factory=datetime.now, description="When reference was created")
    used_count: int = Field(0, description="How many times this reference was used")
    last_used_at: Optional[datetime] = Field(None, description="When reference was last used")

class CollectionContact(BaseModel):
    """Contact information for collection purposes"""
    contact_id: UUID = Field(default_factory=uuid4, description="Contact ID")
    name: str = Field(..., description="Contact person name")
    email: EmailStr = Field(..., description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    whatsapp_number: Optional[str] = Field(None, description="WhatsApp number")
    role: str = Field(..., description="Role (e.g., Accounts Payable, Finance Manager)")
    is_primary: bool = Field(False, description="Is this the primary contact")
    preferred_contact_method: ReminderType = Field(ReminderType.EMAIL, description="Preferred contact method")
    
    @field_validator('phone', 'whatsapp_number')
    @classmethod
    def validate_phone(cls, v):
        if v and not v.startswith('+27'):
            raise ValueError('Phone numbers must be in +27 format')
        return v

class CollectionItem(BaseModel):
    """Individual item being collected"""
    item_id: UUID = Field(default_factory=uuid4, description="Item ID")
    invoice_line_id: Optional[UUID] = Field(None, description="Reference to original invoice line")
    description: str = Field(..., description="Item description")
    original_amount: Decimal = Field(..., description="Original amount due")
    outstanding_amount: Decimal = Field(..., description="Current outstanding amount")
    currency: str = Field("ZAR", description="Currency code")
    
    @field_validator('original_amount', 'outstanding_amount')
    @classmethod
    def validate_amounts(cls, v):
        if v < 0:
            raise ValueError('Amounts must be positive')
        return v

# NEW: Enhanced PaymentRecord supporting all payment types
class PaymentRecord(BaseModel):
    """Enhanced payment record supporting multiple payment types"""
    payment_id: UUID = Field(default_factory=uuid4, description="Payment ID")
    collection_id: UUID = Field(..., description="Related collection ID")
    
    # Payment details
    amount: Decimal = Field(..., description="Payment amount")
    currency: str = Field("ZAR", description="Currency code")
    payment_date: datetime = Field(..., description="Date payment was received")
    
    # Payment method details
    payment_type: PaymentReferenceType = Field(..., description="Type of payment received")
    payment_provider: Optional[str] = Field(None, description="Payment provider (e.g., MTN, SnapScan)")
    reference_used: str = Field(..., description="Payment reference used by payer")
    
    # Provider-specific transaction details
    provider_transaction_id: Optional[str] = Field(None, description="Provider's transaction ID")
    provider_reference: Optional[str] = Field(None, description="Provider's reference number")
    payer_identifier: Optional[str] = Field(None, description="Payer's phone/account identifier")
    
    # Traditional banking fields (optional for mobile/QR payments)
    bank_reference: Optional[str] = Field(None, description="Bank transaction reference")
    account_credited: Optional[str] = Field(None, description="Account that received the payment")
    
    # Status and reconciliation
    status: PaymentStatus = Field(PaymentStatus.PENDING, description="Payment status")
    reconciled: bool = Field(False, description="Whether payment has been reconciled")
    reconciled_at: Optional[datetime] = Field(None, description="When payment was reconciled")
    
    # Fees and charges
    provider_fee: Optional[Decimal] = Field(None, description="Fee charged by payment provider")
    net_amount: Optional[Decimal] = Field(None, description="Net amount after fees")
    
    # Metadata
    payment_metadata: Dict[str, Any] = Field(default={}, description="Additional payment metadata")
    notes: Optional[str] = Field(None, description="Payment notes")
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Payment amount must be positive')
        return v
    
    @field_validator('provider_fee')
    @classmethod
    def validate_fee(cls, v):
        if v is not None and v < 0:
            raise ValueError('Provider fee cannot be negative')
        return v

# NEW: Helper models for payment processing
class PaymentNotification(BaseModel):
    """Payment notification from payment providers"""
    notification_id: UUID = Field(default_factory=uuid4, description="Notification ID")
    provider: str = Field(..., description="Payment provider")
    provider_transaction_id: str = Field(..., description="Provider transaction ID")
    amount: Decimal = Field(..., description="Payment amount")
    currency: str = Field("ZAR", description="Currency")
    reference_used: str = Field(..., description="Reference used by payer")
    payer_identifier: str = Field(..., description="Payer identifier (phone/ShapID/account)")
    payment_date: datetime = Field(..., description="Payment date")
    status: str = Field(..., description="Payment status from provider")
    raw_notification: Dict[str, Any] = Field(..., description="Raw notification data")
    processed: bool = Field(False, description="Whether notification was processed")
    processed_at: Optional[datetime] = Field(None, description="When notification was processed")

class PaymentInstructions(BaseModel):
    """Generated payment instructions for debtors"""
    collection_id: UUID = Field(..., description="Collection ID")
    instructions_id: UUID = Field(default_factory=uuid4, description="Instructions ID")
    
    # Payment options
    bank_transfer: Optional[BankPaymentReference] = Field(None, description="Bank transfer option")
    mobile_money_options: List[MobileMoneyReference] = Field(default=[], description="Mobile money options")
    qr_payment_options: List[QRPaymentReference] = Field(default=[], description="QR payment options")
    instant_transfer_options: List[InstantTransferReference] = Field(default=[], description="Instant transfer options (PayShap, etc.)")
    virtual_account: Optional[VirtualAccountReference] = Field(None, description="Virtual account option")
    
    # Instructions content
    formatted_instructions: str = Field(..., description="Formatted payment instructions")
    sms_instructions: Optional[str] = Field(None, description="SMS-friendly instructions")
    email_instructions: Optional[str] = Field(None, description="Email-friendly instructions")
    whatsapp_instructions: Optional[str] = Field(None, description="WhatsApp-friendly instructions")
    
    # Metadata
    generated_at: datetime = Field(default_factory=datetime.now, description="When instructions were generated")
    expires_at: Optional[datetime] = Field(None, description="When instructions expire")
    language: str = Field("en", description="Language of instructions")

# Your existing models (keeping them as they were)
class ReminderTemplate(BaseModel):
    """Template for collection reminders"""
    template_id: UUID = Field(default_factory=uuid4, description="Template ID")
    name: str = Field(..., description="Template name")
    reminder_type: ReminderType = Field(..., description="Type of reminder")
    days_overdue: int = Field(..., description="Days overdue when this template applies")
    subject: Optional[str] = Field(None, description="Email/SMS subject")
    message_template: str = Field(..., description="Message template with placeholders")
    is_active: bool = Field(True, description="Whether template is active")
    escalation_level: int = Field(1, description="Escalation level (1=gentle, 5=final notice)")
    
    @field_validator('days_overdue')
    @classmethod
    def validate_days(cls, v):
        if v < 0:
            raise ValueError('Days overdue must be non-negative')
        return v

class CollectionReminder(BaseModel):
    """Individual reminder sent"""
    reminder_id: UUID = Field(default_factory=uuid4, description="Reminder ID")
    collection_id: UUID = Field(..., description="Related collection ID")
    template_id: UUID = Field(..., description="Template used")
    contact_id: UUID = Field(..., description="Contact who received reminder")
    reminder_type: ReminderType = Field(..., description="Type of reminder")
    scheduled_at: datetime = Field(..., description="When reminder was scheduled")
    sent_at: Optional[datetime] = Field(None, description="When reminder was sent")
    delivered_at: Optional[datetime] = Field(None, description="When reminder was delivered")
    status: ReminderStatus = Field(ReminderStatus.SCHEDULED, description="Reminder status")
    subject: Optional[str] = Field(None, description="Actual subject sent")
    message: str = Field(..., description="Actual message sent")
    response_received: bool = Field(False, description="Whether response was received")
    response_date: Optional[datetime] = Field(None, description="When response was received")
    response_notes: Optional[str] = Field(None, description="Response details")

class CollectionDispute(BaseModel):
    """Dispute raised against collection"""
    dispute_id: UUID = Field(default_factory=uuid4, description="Dispute ID")
    collection_id: UUID = Field(..., description="Related collection ID")
    raised_by: str = Field(..., description="Who raised the dispute")
    raised_at: datetime = Field(default_factory=datetime.now, description="When dispute was raised")
    dispute_reason: str = Field(..., description="Reason for dispute")
    disputed_amount: Optional[Decimal] = Field(None, description="Amount being disputed")
    status: DisputeStatus = Field(DisputeStatus.RAISED, description="Dispute status")
    resolution_notes: Optional[str] = Field(None, description="Resolution details")
    resolved_at: Optional[datetime] = Field(None, description="When dispute was resolved")
    resolved_by: Optional[str] = Field(None, description="Who resolved the dispute")

class CollectionConfiguration(BaseModel):
    """Configuration for collection process"""
    config_id: UUID = Field(default_factory=uuid4, description="Configuration ID")
    business_id: UUID = Field(..., description="Business this config belongs to")
    
    # Reminder settings
    enable_automated_reminders: bool = Field(True, description="Enable automated reminders")
    first_reminder_days: int = Field(1, description="Days after due date for first reminder")
    reminder_frequency_days: int = Field(7, description="Days between reminders")
    max_reminders: int = Field(5, description="Maximum number of reminders")
    escalation_enabled: bool = Field(True, description="Enable escalation process")
    
    # Contact preferences
    preferred_contact_methods: List[ReminderType] = Field(
        default=[ReminderType.EMAIL, ReminderType.WHATSAPP], 
        description="Preferred contact methods in order"
    )
    
    # Business rules
    write_off_threshold_days: int = Field(120, description="Days after which to consider write-off")
    legal_action_threshold_days: int = Field(90, description="Days after which to consider legal action")
    minimum_collection_amount: Decimal = Field(Decimal("100.00"), description="Minimum amount to collect")
    
    # Integration settings
    whatsapp_integration_enabled: bool = Field(False, description="WhatsApp integration enabled")
    email_integration_enabled: bool = Field(True, description="Email integration enabled")
    sms_integration_enabled: bool = Field(False, description="SMS integration enabled")
    
    # NEW: Payment method settings
    mobile_money_enabled: bool = Field(True, description="Mobile money payments enabled")
    qr_payments_enabled: bool = Field(True, description="QR code payments enabled")
    virtual_accounts_enabled: bool = Field(False, description="Virtual accounts enabled")
    enabled_mobile_providers: List[MobileMoneyProvider] = Field(
        default=[MobileMoneyProvider.MTN_MOMO, MobileMoneyProvider.VODACOM_MPESA], 
        description="Enabled mobile money providers"
    )
    enabled_qr_providers: List[QRPaymentProvider] = Field(
        default=[QRPaymentProvider.SNAPSCAN, QRPaymentProvider.ZAPPER], 
        description="Enabled QR payment providers"
    )

class Collection(BaseModel):
    """Main collection record with enhanced payment support"""
    collection_id: UUID = Field(default_factory=uuid4, description="Collection ID")
    
    # Related entities
    business_id: UUID = Field(..., description="Business ID (creditor)")
    client_id: UUID = Field(..., description="Client ID (debtor)")
    invoice_id: Optional[UUID] = Field(None, description="Original invoice ID if applicable")
    
    # Collection details
    collection_reference: str = Field(..., description="Unique collection reference")
    original_amount: Decimal = Field(..., description="Original amount to collect")
    outstanding_amount: Decimal = Field(..., description="Current outstanding amount")
    currency: str = Field("ZAR", description="Currency code")
    
    # Dates
    created_at: datetime = Field(default_factory=datetime.now, description="When collection was created")
    due_date: date = Field(..., description="Original due date")
    first_overdue_date: Optional[date] = Field(None, description="First date it became overdue")
    last_payment_date: Optional[date] = Field(None, description="Last payment received date")
    
    # Status and progress
    status: CollectionStatus = Field(CollectionStatus.PENDING, description="Collection status")
    days_overdue: int = Field(0, description="Number of days overdue")
    collection_method: CollectionMethod = Field(CollectionMethod.AUTOMATED_REMINDERS, description="Collection method")
    
    # Enhanced payment details with PayShap support
    payment_references: PaymentReference = Field(..., description="Payment reference details with multiple options including PayShap")
    
    # Contacts
    contacts: List[CollectionContact] = Field(default=[], description="Collection contacts")
    
    # Items being collected
    items: List[CollectionItem] = Field(..., description="Items being collected")
    
    # Collection history
    reminders_sent: int = Field(0, description="Number of reminders sent")
    last_reminder_date: Optional[datetime] = Field(None, description="Last reminder sent date")
    next_reminder_date: Optional[datetime] = Field(None, description="Next scheduled reminder date")
    
    # Enhanced payment tracking
    total_payments_received: Decimal = Field(Decimal("0.00"), description="Total payments received")
    payment_breakdown: Dict[PaymentReferenceType, Decimal] = Field(default={}, description="Payments by type")
    
    # Disputes
    has_active_dispute: bool = Field(False, description="Whether there's an active dispute")
    
    # Notes and metadata
    notes: Optional[str] = Field(None, description="Collection notes")
    tags: List[str] = Field(default=[], description="Collection tags")
    priority: int = Field(1, description="Collection priority (1=low, 5=high)")
    
    # Audit fields
    created_by: UUID = Field(..., description="User who created the collection")
    updated_at: datetime = Field(default_factory=datetime.now, description="Last updated timestamp")
    updated_by: UUID = Field(..., description="User who last updated the collection")
    
    @field_validator('collection_reference')
    @classmethod
    def validate_reference(cls, v):
        if not v or len(v) < 5:
            raise ValueError('Collection reference must be at least 5 characters')
        return v.upper()
    
    @field_validator('original_amount', 'outstanding_amount', 'total_payments_received')
    @classmethod
    def validate_amounts(cls, v):
        if v < 0:
            raise ValueError('Amounts must be non-negative')
        return v
    
    @field_validator('priority')
    @classmethod
    def validate_priority(cls, v):
        if not 1 <= v <= 5:
            raise ValueError('Priority must be between 1 and 5')
        return v

class CreateCollectionRequest(BaseModel):
    """Request to create a new collection with enhanced payment support"""
    business_id: UUID = Field(..., description="Business ID")
    client_id: UUID = Field(..., description="Client ID")
    invoice_id: Optional[UUID] = Field(None, description="Invoice ID if applicable")
    
    original_amount: Decimal = Field(..., description="Amount to collect")
    currency: str = Field("ZAR", description="Currency")
    due_date: date = Field(..., description="Due date")
    
    # UPDATED: Enhanced payment reference
    payment_references: PaymentReference = Field(..., description="Payment reference with multiple options")
    contacts: List[CollectionContact] = Field(..., description="Collection contacts")
    items: List[CollectionItem] = Field(..., description="Items to collect")
    
    notes: Optional[str] = Field(None, description="Initial notes")
    priority: int = Field(1, description="Collection priority")

class UpdateCollectionRequest(BaseModel):
    """Request to update a collection"""
    status: Optional[CollectionStatus] = Field(None, description="New status")
    notes: Optional[str] = Field(None, description="Updated notes")
    priority: Optional[int] = Field(None, description="Updated priority")
    collection_method: Optional[CollectionMethod] = Field(None, description="Collection method")

class CollectionSummary(BaseModel):
    """Summary of collection for list views"""
    collection_id: UUID = Field(..., description="Collection ID")
    collection_reference: str = Field(..., description="Collection reference")
    client_name: str = Field(..., description="Client company name")
    original_amount: Decimal = Field(..., description="Original amount")
    outstanding_amount: Decimal = Field(..., description="Outstanding amount")
    currency: str = Field(..., description="Currency")
    status: CollectionStatus = Field(..., description="Status")
    days_overdue: int = Field(..., description="Days overdue")
    due_date: date = Field(..., description="Due date")
    last_reminder_date: Optional[datetime] = Field(None, description="Last reminder date")
    priority: int = Field(..., description="Priority")
    available_payment_methods: List[PaymentReferenceType] = Field(..., description="Available payment methods")

class CollectionStats(BaseModel):
    """Collection statistics with payment method breakdown"""
    total_collections: int = Field(..., description="Total number of collections")
    total_outstanding: Decimal = Field(..., description="Total outstanding amount")
    total_collected: Decimal = Field(..., description="Total amount collected")
    average_days_to_collect: float = Field(..., description="Average days to collect")
    collection_rate: float = Field(..., description="Collection success rate")
    
    # Status breakdown
    pending_count: int = Field(..., description="Pending collections")
    overdue_count: int = Field(..., description="Overdue collections")
    disputed_count: int = Field(..., description="Disputed collections")
    collected_count: int = Field(..., description="Fully collected")
    
    # Aging analysis
    overdue_0_30_days: Decimal = Field(..., description="Outstanding 0-30 days")
    overdue_31_60_days: Decimal = Field(..., description="Outstanding 31-60 days")
    overdue_61_90_days: Decimal = Field(..., description="Outstanding 61-90 days")
    overdue_90_plus_days: Decimal = Field(..., description="Outstanding 90+ days")
    
    # NEW: Payment method breakdown
    payments_by_method: Dict[PaymentReferenceType, Decimal] = Field(..., description="Payments received by method")
    most_popular_payment_method: PaymentReferenceType = Field(..., description="Most used payment method")
    payment_method_success_rates: Dict[PaymentReferenceType, float] = Field(..., description="Success rate by payment method")