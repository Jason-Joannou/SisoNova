import yaml
from pathlib import Path
from api.models.inbound_responses import LanguageSelector, YesNoValidator, NumberedMenuValidator
from api.models.responses import TemplateValidation

def load_language_config(path: str = "./api/translations") -> dict:
    return {
        lang_file.stem: yaml.safe_load(lang_file.read_text(encoding="utf-8"))
        for lang_file in Path(path).glob("*.yaml")
    }

def get_template_validation(template_name: str) -> TemplateValidation:
    templates = {
        "unregistered_number_language_selector_template": {
            "inbound_validator": LanguageSelector,
        },
        "unregistered_number_welcome_template": {
            "inbound_validator": YesNoValidator,
        },
        "registration_no_template": {
            "inbound_validator": NumberedMenuValidator,
        },
    }

    return templates[template_name]
