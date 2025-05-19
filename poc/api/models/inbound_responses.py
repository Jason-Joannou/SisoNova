from models.enums import Languages
from pydantic import BaseModel, field_validator


class LanguageSelector(BaseModel):
    language: Languages
