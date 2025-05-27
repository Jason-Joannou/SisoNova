from typing import Optional
from api.utils.language_config import load_language_config, get_template_validation
from api.utils.twiml_responses import generate_twiml_message


class TwilioTemplateManager:

    def __init__(self, user_exists: bool, user_response: str, current_template: Optional[str] = None, language: Optional[str] = None, has_started: bool = False) -> None:
        self.user_exists = user_exists
        self.has_started = has_started
        self.user_response = user_response
        self.current_template_name = current_template
        self.selected_language = None
        self.preferred_language = self._language_selection_mapping(language=language)
        self.templates = {}
        self._set_message_template(template_name=self.current_template_name)

    def _language_selection_mapping(self, language: Optional[str]) -> str:
        language_codes = {"English": "en", "Afrikaans": "af", "Zulu": "zu"}
        
        if language is None or language not in language_codes:
            language = "English"
        
        return language_codes[language]
    
    def _set_message_template(self, template_name: Optional[str]) -> None:
        if template_name is None:
            self.templates = load_language_config()[self.preferred_language]["unregistered_number_language_selector_template"]
        else:
            self.templates = load_language_config()[self.preferred_language][template_name]

    def _validate_user_response(self) -> bool:
        validation_obj = get_template_validation(template_name=self.current_template_name)

        try:
            validation_class = validation_obj["inbound_validator"]
            is_valid = validation_class.validate_input(self.user_response)

            print(f"DEBUG: Template: {self.current_template_name}")
            print(f"DEBUG: User response: '{self.user_response}'")
            print(f"DEBUG: Validation result: {is_valid}")

            # If this is a language selection template, capture the selected language
            if is_valid and self.current_template_name == "unregistered_number_language_selector_template":
                self.selected_language = self.user_response.strip().title()
                print(f"DEBUG: Selected language set to: {self.selected_language}")

            return is_valid
        except (ValueError, AttributeError) as e:
            print(f"Validation error: {e}")
            return False

    def set_template_name(self, template_name: Optional[str]) -> str:
        if template_name is None:
            template_name = "unregistered_number_language_selector_template"
        return template_name

    def reload_templates_with_language(self, new_language: str):
        """Reload templates with a new language"""
        self.preferred_language = self._language_selection_mapping(new_language)
        # Reload templates for the next template, not current one
        next_template = self.templates.get("next_template", self.current_template_name)
        self.templates = load_language_config()[self.preferred_language][next_template]

    def get_template_message(self) -> tuple:
        """Generate Twilio message based on template and user response"""

        # This is intial response - requires no validation if its users first message
        if self.current_template_name is None:
            message = self.templates["template_message"]
            twiml_build = [{"body": message}]
            twiml_message = generate_twiml_message(msgs=twiml_build)
            return "unregistered_number_language_selector_template", None, twiml_message


        # For language selection responses
        if (self.current_template_name == "unregistered_number_language_selector_template" 
            and self.has_started):
            if self._validate_user_response():
                # User has entered valid language, need to now set the language and update templates

                if self.selected_language:
                    self.reload_templates_with_language(self.selected_language)

                # Language selected - get next template info first
                next_template = self.templates["next_template"]
                previous_template = self.templates["previous_template"]
                
                
                # Generate message in the selected language
                message = self.templates["template_message"]
                twiml_build = [{"body": message}]
                twiml_message = generate_twiml_message(msgs=twiml_build)
                
                return next_template, previous_template, twiml_message
            else:
                # Invalid language, show error
                error_options = "\n".join([f"- {option}" for option in self.templates["error_message"]])
                error_message = self.templates["template_error_message"].format(error_message=error_options)
                twiml_build = [{"body": error_message}]
                twiml_message = generate_twiml_message(msgs=twiml_build)
                return self.current_template_name, None, twiml_message
        
        # For all other templates
        if self._validate_user_response():
            message = self.templates["template_message"]
            twiml_build = [{"body": message}]
            twiml_message = generate_twiml_message(msgs=twiml_build)

            next_template = self.templates["next_template"]
            previous_template = self.templates["previous_template"]

            return next_template, previous_template, twiml_message
        
        # Error case
        error_options = "\n".join([f"- {option}" for option in self.templates["error_message"]])
        error_message = self.templates["template_error_message"].format(error_message=error_options)
        twiml_build = [{"body": error_message}]
        twiml_message = generate_twiml_message(msgs=twiml_build)
        return self.current_template_name, None, twiml_message
    
    def get_selected_language(self) -> Optional[str]:
        """Return the language selected by the user (if any)"""
        return self.selected_language


        
