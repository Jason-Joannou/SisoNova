from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator


class IndustryType(str, Enum):
    """Enum for industry types"""

    RETAIL = "retail"
    LEGAL = "legal"
    ENTERTAINMENT = "entertainment"
    CONSTRUCTION = "construction"
    CONSULTING = "consulting"
    MANUFACTURING = "manufacturing"
    OTHER = "other"


class BusinessProfile(BaseModel):
    """Business profile configuration"""

    company_id: UUID = Field(default_factory=uuid4, description="Company ID")
    company_name: str = Field(..., description="Company name")
    trading_name: Optional[str] = Field(None, description="Trading name if different")
    address_line_1: str = Field(..., description="Address line 1")
    address_line_2: Optional[str] = Field(None, description="Address line 2")
    city: str = Field(..., description="City")
    province: str = Field(..., description="Province")
    postal_code: str = Field(..., description="Postal code")
    country: str = Field("South Africa", description="Country")
    vat_number: Optional[str] = Field(None, description="VAT registration number")
    company_registration: Optional[str] = Field(
        None, description="Company registration number"
    )
    email: str = Field(..., description="Business email")
    phone: str = Field(..., description="Business phone")
    website: Optional[str] = Field(None, description="Website URL")
    logo_url: Optional[str] = Field(None, description="Logo image URL")
    industry: IndustryType = Field(..., description="Industry type")


class ClientDetails(BaseModel):
    """Client/customer details"""

    client_id: UUID = Field(default_factory=uuid4, description="Client ID")
    company_name: str = Field(..., description="Client company name")
    contact_person: str = Field(..., description="Contact person name")
    email: str = Field(..., description="Client email")
    phone: Optional[str] = Field(None, description="Client phone")
    address_line_1: Optional[str] = Field(None, description="Client address line 1")
    address_line_2: Optional[str] = Field(None, description="Client address line 2")
    city: Optional[str] = Field(None, description="Client city")
    province: Optional[str] = Field(None, description="Client province")
    postal_code: Optional[str] = Field(None, description="Client postal code")
    vat_number: Optional[str] = Field(None, description="Client VAT number")
    purchase_order_number: Optional[str] = Field(None, description="Client PO number")
