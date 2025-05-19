from models.enums import Languages
from pydantic import BaseModel, field_validator


class LanguageSelector(BaseModel):
    language: Languages

    @field_validator("language", mode="before")
    @classmethod
    def normalize_input(cls, v: str) -> str:
        return v.strip().capitalize()
