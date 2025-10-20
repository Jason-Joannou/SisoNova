from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator
from datetime import datetime
from typing import Dict, List
from api.utils.general import to_snake_case

class URLEntry(BaseModel):
    """Individual URL entry with metadata"""
    url: HttpUrl = Field(..., description="The URL of the website containing the regulatory or compliance information.")
    description: str = Field(..., description="A description of the website containing the regulatory or compliance information.")
    added_at: datetime = Field(..., description="The date and time the URL was added to the database.")
    modified_at: datetime = Field(..., description="The date and time the URL was last modified in the database.")

    @field_validator('url')
    @classmethod
    def validate_url(cls, v):
        """Basic URL validation"""
        if not v.startswith('https://'):
            raise ValueError('URL must start with https://')
        return v
    
class WhiteListedURLScope(BaseModel):
    """
    Flexible nested structure: country -> province -> category -> subcategory -> URLs
    
    Structure:
    {
        "south_africa": {
            "western_cape": {
                "fishing": {
                    "commercial_fishing": [
                        {"url": "...", "description": "..."},
                        ...
                    ]
                }
            }
        }
    }
    """
    data: Dict[str, Dict[str, Dict[str, Dict[str, List[URLEntry]]]]] = Field(
        default_factory=dict,
        description="Nested structure: country -> province -> category -> subcategory -> list of URLs"
    )

    @model_validator(mode='after')
    def normalize_keys(self):
        """Ensure all keys in the nested structure are snake_case"""
        normalized_data = {}
        
        for country, provinces in self.data.items():
            country_key = to_snake_case(country)
            normalized_data[country_key] = {}
            
            for province, categories in provinces.items():
                province_key = to_snake_case(province)
                normalized_data[country_key][province_key] = {}
                
                for category, subcategories in categories.items():
                    category_key = to_snake_case(category)
                    normalized_data[country_key][province_key][category_key] = {}
                    
                    for subcategory, urls in subcategories.items():
                        subcategory_key = to_snake_case(subcategory)
                        normalized_data[country_key][province_key][category_key][subcategory_key] = urls
        
        self.data = normalized_data
        return self