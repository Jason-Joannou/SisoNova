from typing import Optional
from utils.language_config import load_language_config, get_template_validation
from utils.twiml_responses import generate_twiml_message


class TwilioTemplateManager:

    def __init__(self, user_exists: bool, user_response: str, current_template: Optional[str], language: Optional[str] = None) -> None:
        self.user_exists = user_exists
        self.preferred_language = self._language_selection_mapping(language=language)
        self.user_response = user_response
        self.templates = {}
        self.current_template_name = self.set_template_name(template_name=current_template)

    def _language_selection_mapping(self, language: str):

        language_codes = {"English": "en", "Afrikaans": "af", "Zulu": "zl"}

        if language not in language_codes:
            language = "English"

        return language_codes[language]
    
    def _set_message_template(self, template_name: str) -> None:
        self.templates = load_language_config()[self.preferred_language][template_name]

    def _validate_user_response(self) -> bool:
        validation_obj = get_template_validation(template_name=self.current_template_name)

        try:
            validation_obj.inbound_validator(self.user_response)
            return True
        except ValueError:
            return False


    def set_template_name(self, template_name: str) -> None:
        if template_name is None:
            template_name = "unregistered_number_language_selector_template"
        self.current_template_name = template_name
        self._set_message_template(template_name=template_name)

    def get_template_message(self) -> str:
        
        if self._validate_user_response():
            message = self.templates["template_message"]
            twiml_build = [
                {"body": message}
            ]
            twiml_message = generate_twiml_message(msgs=twiml_build)
            return twiml_message
        
        validation_obj = get_template_validation(template_name=self.current_template_name)
        error_message = self.templates["error_message"].format(validation_obj.validation_message)
        twiml_build = [
            {"body": error_message}
        ]
        twiml_message = generate_twiml_message(msgs=twiml_build)
        return twiml_message


        
