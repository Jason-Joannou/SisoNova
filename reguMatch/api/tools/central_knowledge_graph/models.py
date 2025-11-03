from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, Dict, List

class RequirementType(str, Enum):
    REGULATION = "REGULATION" # Gov stuff
    COMPLIANCE = "COMPLIANCE" # Non-gov stuff

class RegulationAndComplianceLocation(BaseModel):
    country_name: str = Field(..., description="The name of the country. e.g. 'South Africa'")
    province_name: Optional[str] = Field(None, description="The name of the province. e.g. 'Western Cape'")

class RegulationAndComplianceIndustry(BaseModel):
    industry_name: str = Field(..., description="The name of the industry. e.g. 'Fishing'")
    sector_name: Optional[str] = Field(None, description="The name of the sector. e.g. 'Commercial Fishing'")

class RegulationAndComplianceBusinessCriteria(BaseModel):
    business_size: str = Field(..., description="Which business sizes this applies to. e.g. ['Large', 'Enterprise']. If None, applies to all sizes.")
    business_type: str = Field(..., description="Which business types this applies to. e.g. ['Pty Ltd', 'Public Company']. If None, applies to all types.")
    business_sector: str = Field(..., description="The sector that this applies to. e.g. ['Commercial Fishing']. If None, applies to all activities.")
    custom_criteria: Dict[str, str] = Field(..., description="Custom criteria specific to the industry. e.g. {'vessel_length_meters': '>24', 'crew_size': '>20'}")

class BaseRegulationAndComplianceRequirements(BaseModel):
    location_information: RegulationAndComplianceLocation = Field(..., description="The location where this regulation and compliance requirements apply.")
    industry_information: RegulationAndComplianceIndustry = Field(..., description="The industry where this regulation and compliance requirements apply.")
    business_criteria: RegulationAndComplianceBusinessCriteria = Field(..., description="The business criteria where this regulation and compliance requirements apply.")
    requirement_type: RequirementType = Field(..., description="The type of regulation and compliance requirements. e.g. REGULATION or COMPLIANCE")

class RequiredLicenses(BaseModel):
    license_name: str = Field(..., description="The name of the license.")
    license_description: str = Field(..., description="The description of the license.")

class RequiredFields(BaseModel):
    field_name: str = Field(..., description="The name of the field.")
    field_description: str = Field(..., description="The description of the field.")

class RegulationNode(BaseRegulationAndComplianceRequirements):
    regulation_name: str = Field(..., description="The name of the regulation.")
    regulation_description: str = Field(..., description="The description of the regulation.")
    regulation_webpage: str = Field(..., description="The webpage of the regulation.")
    regulation_pdf_url: Optional[str] = Field(..., description="The PDF URL of the regulation.")

    required_fields: Optional[List[RequiredFields]] = Field(..., description="The fields required for this regulation.")
    required_licenses: Optional[List[RequiredLicenses]] = Field(None, description="The licenses required for this regulation.")

    regulatory_body: str = Field(..., description="The name of the regulatory body.")
    regulatory_body_description: str = Field(..., description="The description of the regulatory body.")



class ComplianceNode(BaseRegulationAndComplianceRequirements):
    compliance_name: str = Field(..., description="The name of the compliance.")
    compliance_description: str = Field(..., description="The description of the compliance.")
    compliance_webpage: str = Field(..., description="The webpage of the compliance.")
    compliance_pdf_url: Optional[str] = Field(..., description="The PDF URL of the compliance.")

    required_fields: Optional[List[RequiredFields]] = Field(..., description="The fields required for this compliance.")
    required_licenses: Optional[List[RequiredLicenses]] = Field(None, description="The licenses required for this compliance.")