from typing import Literal

from pydantic import BaseModel, field_validator


class LanguageSelector(BaseModel):
    language: str

    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        allowed_languages = ["English", "Zulu", "Afrikaans"]
        capitalized = v.strip().capitalize()
        if capitalized not in allowed_languages:
            raise ValueError("Invalid language selected")
        return capitalized
