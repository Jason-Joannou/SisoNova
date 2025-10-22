from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator
from datetime import datetime
from typing import Dict, List, Optional
from api.utils.general import to_snake_case

class CountryInformation(BaseModel):
    country_name: str = Field(..., description="The name of the country. e.g. 'south_africa'")
    province: Optional[str] = Field(None, description="The name of the province. e.g. 'western_cape'")

    @field_validator('province')
    @classmethod
    def handle_empty_province(cls, v):
        """If province is empty, assign it to all - this means the url applies to the entire industry"""
        if not v:
            return 'all'
        return v

class CategoryInformation(BaseModel):
    category_name: str = Field(..., description="The name of the category. e.g. 'fishing'")
    subcategory: Optional[str] = Field(None, description="The name of the subcategory. e.g. 'commercial_fishing'")

    @field_validator('subcategory')
    @classmethod
    def handle_empty_subcategory(cls, v):
        """If subcategory is empty, assign it to all - this means the url applies to the entire sector"""
        if not v:
            return 'all'
        return v

class URLEntry(BaseModel):
    """Individual URL entry with metadata"""
    url: str = Field(..., description="The URL of the website containing the regulatory or compliance information.")
    description: str = Field(..., description="A description of the website containing the regulatory or compliance information.")
    added_at: str = Field(..., description="The date the URL was added to the database in YYYY-MM-DD format (e.g., '2025-10-22').")
    modified_at: str = Field(..., description="The date the URL was last modified in the database in YYYY-MM-DD format (e.g., '2025-10-22').")

    @field_validator('url')
    @classmethod
    def validate_url(cls, v):
        """Basic URL validation"""
        v = v.strip()
        if not v.startswith('https://'):
            raise ValueError('URL must start with https://')
        if ' ' in v:
            raise ValueError('URL cannot contain spaces')
        return v
    
    @field_validator('added_at', 'modified_at')
    @classmethod
    def validate_date_format(cls, v):
        """Validate that date strings are in YYYY-MM-DD format"""
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError(f'Date must be in YYYY-MM-DD format (e.g., "2025-10-22"), got: {v}')
    
class WhiteListURLData(BaseModel):
    country_information: CountryInformation
    category_information: CategoryInformation
    urls: List[URLEntry]