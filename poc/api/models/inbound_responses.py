from api.models.enums import Languages, YesOrNo
from pydantic import BaseModel, field_validator
from abc import ABC, abstractmethod
from pydantic import BaseModel
from typing import Any
from datetime import datetime

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
    

class IncomeExpenseRecordingValidator(BaseValidator):
    input_text: str

    @field_validator("input_text", mode="before")
    @classmethod
    def normalize_input(cls, v: str) -> str:
        return v.strip()
    
    @classmethod
    def validate_input(cls, input_value: str) -> bool:
        """
        Validate expense/income recording input
        Returns True if:
        1. Input is "1" (stop recording)
        2. Input contains valid expense/income format(s)
        """
        input_text = input_value.strip()
        
        # Allow "1" to stop recording
        if input_text == "1":
            return True
        
        lines = [line.strip() for line in input_text.split('\n') if line.strip()]

        for line in lines:
            
            # Check if line has at least the basic format: something - something - something
            parts = [part.strip() for part in line.split('-')]
            if len(parts) < 3:
                return False  # Invalid format
            
            type = parts[0]
            amount_str = parts[1]
            feeling = parts[2]

            if not type:
                return False
            
            try:
                amount = float(amount_str.strip())
                if amount <= 0:
                    return False
            except ValueError:
                return False
            
            # Feeling should not be empty
            if not feeling:
                return False
            
            valid_feelings = [
                "Struggling",
                "Worried",
                "Coping",
                "Okay",
                "Fine",
                "Good",
                "Great"
            ]
            
            if feeling not in valid_feelings:
                return False
            

            if len(parts) >= 4:
                date_str = parts[3].strip()
                if date_str:  # Only validate if date is provided
                    if '/' not in date_str:
                        return False  # Date must use "/" separator
                    
                    date_format = '%Y/%m/%d'
                    try:
                        datetime.strptime(date_str, date_format)
                    except ValueError:
                        return False  # No valid date format found
                    

        return True
                    
            

                    
            




    
