from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class BusinessProfile(BaseModel):
    company_name: str = Field(..., description="The name of the company")
    trading_name: Optional[str] = Field(None, description="The trading name of the company")
    address_line_1: str = Field(..., description="The company's primary address line")
    address_line_2: Optional[str] = Field(None, description="The company's secondary address line")
    city: str = Field(..., description="The city where the company is located")
    province: str = Field(..., description="The province/state where the company is located")
    country: str = Field(..., description="The country where the company is located")
    postal_code: str = Field(..., description="The postal/ZIP code of the company's location")
    vat_number: Optional[str] = Field(None, description="The VAT number of the company")
    company_registration_number: Optional[str] = Field(None, description="The registration number of the company")
    tax_registration_number: Optional[str] = Field(None, description="The tax registration number of the company")
    contact_email: EmailStr = Field(..., description="The contact email address for the company")
    contact_phone: Optional[str] = Field(None, description="The contact phone number for the company")
    industry_type: str = Field(..., description="The industry type of the company")