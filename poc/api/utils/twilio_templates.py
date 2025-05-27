from typing import Optional, Dict, Any
from api.utils.language_config import load_language_config, get_template_validation
from api.utils.twiml_responses import generate_twiml_message


class TwilioTemplateManager:

    def __init__(self, user_exists: bool, user_response: str, current_template: Optional[str] = None, language: Optional[str] = None, has_started: bool = False) -> None:
        self.user_exists = user_exists
        self.has_started = has_started
        self.user_response = user_response
        self.current_template_name = current_template
        self.selected_language = None
        self.selected_option = None
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

            # If validation passes, capture the user's selection
            if is_valid:
                if self.current_template_name == "unregistered_number_language_selector_template":
                    self.selected_language = self.user_response.strip().title()
                    print(f"DEBUG: Selected language set to: {self.selected_language}")
                else:
                    # For all other templates, normalize the response for routing
                    self.selected_option = self.user_response.strip().lower()
                    print(f"DEBUG: Selected option set to: {self.selected_option}")

            return is_valid
        except (ValueError, AttributeError) as e:
            print(f"Validation error: {e}")
            return False

    def _get_next_template_from_routing(self) -> Optional[str]:
        """
        Get the next template based on response_routing configuration.
        Returns None if no routing is defined or option not found.
        """
        response_routing = self.templates.get("response_routing", {})
        
        if not response_routing:
            # No dynamic routing defined, use static next_template
            return self.templates.get("next_template")
        
        # Look up the next template based on user's response
        next_template = response_routing.get(self.selected_option)
        
        if next_template:
            print(f"DEBUG: Dynamic routing - '{self.selected_option}' -> '{next_template}'")
            return next_template
        
        print(f"DEBUG: No routing found for option: '{self.selected_option}'")
        return None

    def _has_dynamic_routing(self) -> bool:
        """Check if current template has dynamic routing configured"""
        return "response_routing" in self.templates

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

        # Initial response - requires no validation if it's user's first message
        if self.current_template_name is None:
            message = self.templates["template_message"]
            twiml_build = [{"body": message}]
            twiml_message = generate_twiml_message(msgs=twiml_build)
            return "unregistered_number_language_selector_template", None, twiml_message

        # For language selection responses (special case)
        if (self.current_template_name == "unregistered_number_language_selector_template" 
            and self.has_started):
            if self._validate_user_response():
                # User has entered valid language, need to now set the language and update templates

                # Get the next template BEFORE reloading templates
                next_template = self.templates.get("next_template")
                
                if self.selected_language:
                    self.reload_templates_with_language(self.selected_language)
                
                # Now self.templates contains the welcome template data
                message = self.templates["template_message"]
                previous_template = self.templates.get("previous_template")
                
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

        # For all other templates with potential dynamic routing
        if self._validate_user_response():
            # Determine next template (either dynamic or static)
            if self._has_dynamic_routing():
                next_template = self._get_next_template_from_routing()
                if next_template is None:
                    # This shouldn't happen if validation is correct, but handle gracefully
                    print(f"ERROR: Valid response '{self.selected_option}' but no routing found")
                    next_template = self.current_template_name  # Stay on current template
            else:
                # Use static next_template
                next_template = self.templates.get("next_template", self.current_template_name)
            
            # Load the next template to get its message
            if next_template != self.current_template_name:
                self._set_message_template(template_name=next_template)
                message = self.templates["template_message"]
                previous_template = self.templates.get("previous_template")
            else:
                # Staying on same template
                message = self.templates["template_message"]
                previous_template = self.templates.get("previous_template")
            
            twiml_build = [{"body": message}]
            twiml_message = generate_twiml_message(msgs=twiml_build)

            return next_template, previous_template, twiml_message
        
        # Error case - invalid response
        error_options = "\n".join([f"- {option}" for option in self.templates["error_message"]])
        error_message = self.templates["template_error_message"].format(error_message=error_options)
        twiml_build = [{"body": error_message}]
        twiml_message = generate_twiml_message(msgs=twiml_build)
        return self.current_template_name, None, twiml_message

    def get_selected_language(self) -> Optional[str]:
        """Return the language selected by the user (if any)"""
        return self.selected_language

    def get_selected_option(self) -> Optional[str]:
        """Return the option selected by the user (if any)"""
        return self.selected_option