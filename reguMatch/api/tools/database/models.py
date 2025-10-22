from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator
from datetime import datetime
from typing import Dict, List, Optional
from api.utils.general import to_snake_case


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


class WhiteListURLCollection(BaseModel):
    _id: str
