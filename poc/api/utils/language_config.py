import yaml
from pathlib import Path
from api.models.inbound_responses import LanguageSelector, YesNoValidator, NumberedMenuValidator, IncomeExpenseRecordingValidator, FinancialFeelingRecordingValidator
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
        "registered_user_template": {
            "inbound_validator": NumberedMenuValidator,
        },
        "sisonova_personal_template": {
            "inbound_validator": NumberedMenuValidator,
        },
        "sisonova_public_template": {
            "inbound_validator": NumberedMenuValidator,
        },
        "sisonova_personal_expense_template": {
            "inbound_validator": NumberedMenuValidator,
        },
        "sisonova_personal_income_template": {
            "inbound_validator": NumberedMenuValidator,
        },
        "sisonova_personal_record_expense_template":{
            "inbound_validator": IncomeExpenseRecordingValidator
        },
        "sisonova_personal_record_income_template":{
            "inbound_validator": IncomeExpenseRecordingValidator
        },
        "sisonova_personal_feeling_template": {
            "inbound_validator": NumberedMenuValidator
        },
        "sisonova_personal_record_feeling_template": {
            "inbound_validator": FinancialFeelingRecordingValidator
        }

    }

    return templates[template_name]
