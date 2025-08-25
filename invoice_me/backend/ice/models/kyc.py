from enum import Enum
from typing import Optional

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
