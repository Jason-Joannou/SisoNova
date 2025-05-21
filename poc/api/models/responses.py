from typing import TypedDict, Type

class TemplateValidation(TypedDict):
    inbound_validator: Type
    validation_message: str