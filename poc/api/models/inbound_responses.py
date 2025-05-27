from api.models.enums import Languages, YesOrNo
from pydantic import BaseModel, field_validator
from abc import ABC, abstractmethod
from pydantic import BaseModel
from typing import Any

class BaseValidator(BaseModel, ABC):
    @classmethod
    @abstractmethod
    def validate_input(cls, input_value: str) -> bool:
        """Validate input without knowing the field structure"""
        pass

class LanguageSelector(BaseValidator):
    language: Languages

    @field_validator("language", mode="before")
    @classmethod
    def normalize_input(cls, v: str) -> str:
        return v.strip().capitalize()
    
    @classmethod
    def validate_input(cls, input_value: str) -> bool:
        try:
            cls(language=input_value)
            return True
        except Exception:
            return False

class YesNoValidator(BaseValidator):
    response: YesOrNo
    
    @field_validator("response", mode="before")
    @classmethod
    def normalize_input(cls, v: str) -> str:
        return v.strip().lower()  # This converts ANY case to lowercase
    
    @classmethod
    def validate_input(cls, input_value: str) -> bool:
        try:
            cls(response=input_value)  # "Yes" becomes "yes" and matches enum
            return True
        except Exception:
            return False
        
class NumberedMenuValidator(BaseValidator):
    option: str
    
    @field_validator("option", mode="before")
    @classmethod
    def normalize_input(cls, v: str) -> str:
        return v.strip()
    
    @classmethod
    def validate_input(cls, input_value: str) -> bool:
        # This will be used for templates that accept "1", "2", etc.
        valid_options = ["1", "2", "3", "4", "5"]  # Adjust as needed
        return input_value.strip() in valid_options