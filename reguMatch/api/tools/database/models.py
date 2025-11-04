from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional, Dict
from enum import Enum


class BaseDatabaseResponse(BaseModel):
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(
        ..., description="A message indicating the success or failure of the operation"
    )
    error: Optional[str] = Field(
        None, description="An error message if the operation failed"
    )


class CountryInformation(BaseModel):
    country_name: str = Field(
        ...,
        description="Country name in snake_case (e.g., 'south_africa', 'united_states')",
    )
    province: Optional[str] = Field(
        None,
        description="Province/state name in snake_case (e.g., 'western_cape', 'california'). Omit or set to null if the URL applies to the ENTIRE country (e.g., national government websites, country-wide regulations).",
    )

    @field_validator("province")
    @classmethod
    def handle_empty_province(cls, v):
        """If province is empty, assign it to all - this means the url applies to the entire country"""
        if not v:
            return "all"
        return v


class CategoryInformation(BaseModel):
    category_name: str = Field(
        ...,
        description="Industry category in snake_case. Use broad categories for general regulations (e.g., 'labor_laws', 'taxation', 'environmental_regulations') or specific categories for industry-specific content (e.g., 'fishing', 'manufacturing', 'healthcare').",
    )
    subcategory: Optional[str] = Field(
        None,
        description="Industry subcategory in snake_case (e.g., 'commercial_fishing', 'food_manufacturing'). Omit or set to null if the URL applies to the ENTIRE category/sector (e.g., all types of fishing, all manufacturing). Only specify if the content is truly specific to this subcategory.",
    )

    @field_validator("subcategory")
    @classmethod
    def handle_empty_subcategory(cls, v):
        """If subcategory is empty, assign it to all - this means the url applies to the entire category"""
        if not v:
            return "all"
        return v


class URLEntry(BaseModel):
    """Individual URL entry with metadata"""

    url: str = Field(
        ...,
        description="The URL of the website containing the regulatory or compliance information.",
    )
    description: str = Field(
        ...,
        description="A description of the website containing the regulatory or compliance information.",
    )
    added_at: str = Field(
        ...,
        description="The date the URL was added to the database in YYYY-MM-DD format (e.g., '2025-10-22').",
    )
    modified_at: str = Field(
        ...,
        description="The date the URL was last modified in the database in YYYY-MM-DD format (e.g., '2025-10-22').",
    )

    @field_validator("url")
    @classmethod
    def validate_url(cls, v):
        """Basic URL validation"""
        v = v.strip()
        if not v.startswith("https://"):
            raise ValueError("URL must start with https://")
        if " " in v:
            raise ValueError("URL cannot contain spaces")
        return v

    @field_validator("added_at", "modified_at")
    @classmethod
    def validate_date_format(cls, v):
        """Validate that date strings are in YYYY-MM-DD format"""
        try:
            datetime.strptime(v, "%Y-%m-%d")
            return v
        except ValueError:
            raise ValueError(
                f'Date must be in YYYY-MM-DD format (e.g., "2025-10-22"), got: {v}'
            )


class WhiteListURLData(BaseModel):
    country_information: CountryInformation = Field(
        ...,
        description="Geographic scope information. Set province to null for country-wide content.",
    )
    category_information: CategoryInformation = Field(
        ...,
        description="Industry scope information. Use broad categories for general regulations, specific categories only when content is industry-specific.",
    )
    urls: List[URLEntry] = Field(
        ...,
        description="List of URLs to add to the whitelist. All URLs will be verified before being added.",
    )


class WhiteListQueryParameters(BaseModel):
    country_name: str = Field(
        ...,
        description="Country name in snake_case (e.g., 'south_africa', 'united_states')",
    )
    province: Optional[str] = Field(
        None,
        description="Province/state name in snake_case (e.g., 'western_cape', 'california').",
    )
    category_name: Optional[str] = Field(
        None,
        description="Industry category in snake_case (e.g., 'fishing', 'manufacturing', 'healthcare').",
    )
    subcategory: Optional[str] = Field(
        None,
        description="Industry subcategory in snake_case (e.g., 'commercial_fishing', 'food_manufacturing').",
    )

    @field_validator("province")
    def handle_empty_subcategory(cls, v):
        """If subcategory is empty, assign it to all - this means the url applies to the entire category"""
        if not v:
            return "all"
        return v

    @field_validator("subcategory")
    def handle_empty_subcategory(cls, v):
        """If subcategory is empty, assign it to all - this means the url applies to the entire category"""
        if not v:
            return "all"
        return v


class AddEntryResponse(BaseDatabaseResponse):
    response_document: Dict = Field(
        ..., description="The document that was added to the database."
    )


class WhiteListQueryResponse(BaseDatabaseResponse):
    country_present: bool = Field(
        ..., description="Whether the country exists in the database"
    )
    filters_applied: Dict[str, bool] = Field(
        ...,
        description="Which filters were applied: {province: bool, category: bool, subcategory: bool}",
    )
    filters_matched: Dict[str, bool] = Field(
        ...,
        description="Which applied filters found matches: {province: bool, category: bool, subcategory: bool}",
    )
    query_parameters: WhiteListQueryParameters
    result_doc: Dict = Field(
        ..., description="The document that was retrieved from mongoDB."
    )


class RegulationCompianceType(str, Enum):
    REGULATION = "regulation"  # Gov stuff
    COMPLIANCE = "compliance"  # Non-gov stuff


class RegulationAndComplianceBusinessCriteria(BaseModel):
    business_size: str = Field(
        ...,
        description="Which business sizes this applies to. e.g. ['Large', 'Enterprise']. If None, applies to all sizes.",
    )
    business_type: str = Field(
        ...,
        description="Which business types this applies to. e.g. ['Pty Ltd', 'Public Company']. If None, applies to all types.",
    )
    business_sector: str = Field(
        ...,
        description="The sector that this applies to. e.g. ['Commercial Fishing']. If None, applies to all activities.",
    )
    custom_criteria: Optional[Dict[str, str]] = Field(
        ...,
        description="Custom criteria specific to the industry. e.g. {'vessel_length_meters': '>24', 'crew_size': '>20'}",
    )


class BaseRegulationAndComplianceRequirements(BaseModel):
    location_information: CountryInformation = Field(
        ...,
        description="The location where this regulation and compliance requirements apply.",
    )
    industry_information: CategoryInformation = Field(
        ...,
        description="The industry where this regulation and compliance requirements apply.",
    )
    business_criteria: RegulationAndComplianceBusinessCriteria = Field(
        ...,
        description="The business criteria where this regulation and compliance requirements apply.",
    )
    regulation_compliance_type: RegulationCompianceType = Field(
        ...,
        description="The type of regulation and compliance requirements. e.g. REGULATION or COMPLIANCE",
    )


class RequiredLicenses(BaseModel):
    license_name: str = Field(..., description="The name of the license.")
    license_description: str = Field(..., description="The description of the license.")


class RequiredCertificates(BaseModel):
    certificate_name: str = Field(..., description="The name of the certificate.")
    certificate_description: str = Field(
        ..., description="The description of the certificate."
    )


class RequiredFields(BaseModel):
    field_name: str = Field(..., description="The name of the field.")
    field_description: str = Field(..., description="The description of the field.")


class PDFFields(BaseModel):
    pdf_name: str = Field(..., description="The name of the PDF.")
    pdf_url: str = Field(..., description="The URL of the PDF.")


class SuggestedContacts(BaseModel):
    contact_name: str = Field(..., description="The name of the contact.")
    contact_email: Optional[str] = Field(None, description="The email of the contact.")
    contact_phone: Optional[str] = Field(
        None, description="The phone number of the contact."
    )


class RequiredFees(BaseModel):
    fee_name: str = Field(..., description="The name of the fee.")
    fee_ammount: str = Field(..., description="The amount of the fee.")
    fee_description: str = Field(..., description="The description of the fee.")


class RegulationNode(BaseRegulationAndComplianceRequirements):
    regulation_name: str = Field(..., description="The name of the regulation.")
    regulation_description: str = Field(
        ..., description="The description of the regulation."
    )
    regulation_webpage: str = Field(..., description="The webpage of the regulation.")
    regulation_pdf_urls: Optional[List[PDFFields]] = Field(
        ..., description="The PDF URLs of the regulation."
    )

    required_fields: Optional[List[RequiredFields]] = Field(
        ..., description="The fields required for this regulation."
    )
    required_licenses: Optional[List[RequiredLicenses]] = Field(
        None, description="The licenses required for this regulation."
    )
    required_certificates: Optional[List[RequiredLicenses]] = Field(
        None, description="The certificates required for this regulation."
    )
    required_fees: Optional[List[RequiredFees]] = Field(
        None, description="The fees required for this regulation."
    )
    suggested_contacts: Optional[List[SuggestedContacts]] = Field(
        None, description="Suggested contacts for this regulation."
    )

    regulatory_body: str = Field(..., description="The name of the regulatory body.")
    regulatory_body_description: str = Field(
        ..., description="The description of the regulatory body."
    )


class ComplianceNode(BaseRegulationAndComplianceRequirements):
    compliance_name: str = Field(..., description="The name of the compliance.")
    compliance_description: str = Field(
        ..., description="The description of the compliance."
    )
    compliance_webpage: str = Field(..., description="The webpage of the compliance.")
    compliance_pdf_urls: Optional[List[PDFFields]] = Field(
        ..., description="The PDF URLs of the compliance."
    )

    required_fields: Optional[List[RequiredFields]] = Field(
        ..., description="The fields required for this compliance."
    )
    required_licenses: Optional[List[RequiredLicenses]] = Field(
        None, description="The licenses required for this compliance."
    )
    required_certificates: Optional[List[RequiredLicenses]] = Field(
        None, description="The certificates required for this compliance."
    )
    required_fees: Optional[List[RequiredFees]] = Field(
        None, description="The fees required for this compliance."
    )
    suggested_contacts: Optional[List[SuggestedContacts]] = Field(
        None, description="Suggested contacts for this compliance."
    )

class AvailableKeysInCollectionResponse(BaseDatabaseResponse):
    keys: List[str] = Field(..., description="The available keys in the collection.")

class DatabaseQueryParameters(BaseModel):
    location_information: CountryInformation = Field(
        ..., description="The location where this regulation and compliance requirements apply."
    )
