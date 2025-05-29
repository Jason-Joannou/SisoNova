from typing import Optional, Dict, Any, Tuple, List
import os
from api.db.models.tables import User
from api.finance.report import PersonalizedReportDispatcher
from api.utils.language_config import load_language_config, get_template_validation
from api.utils.twiml_responses import generate_twiml_message
from api.utils.template_actions import generate_expense_report
from dotenv import load_dotenv

load_dotenv()


class TwilioTemplateManager:

    def __init__(self, user_exists: bool, user_response: str, current_template: Optional[str] = None, language: Optional[str] = None, has_started: bool = False, user_object: Optional[User] = None) -> None:
        self.user_exists = user_exists
        self.has_started = has_started
        self.user_response = user_response
        self.current_template_name = current_template
        self.user_object = user_object
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.selected_language = None
        self.selected_option = None
        self.action_result = None
        self.preferred_language = self._language_selection_mapping(language=language)
        self.templates = {}
        self._set_message_template(template_name=self.current_template_name)
        
        # Initialize report dispatcher if user object is available
        self.report_dispatcher = None
        if self.user_object and self.gemini_api_key:
            self.report_dispatcher = PersonalizedReportDispatcher(
                user=self.user_object, 
                gemini_api_key=self.gemini_api_key
            )

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

            if is_valid:
                if self.current_template_name == "unregistered_number_language_selector_template":
                    self.selected_language = self.user_response.strip().title()
                else:
                    self.selected_option = self.user_response.strip().lower()

            return is_valid
        except (ValueError, AttributeError) as e:
            print(f"Validation error: {e}")
            return False

    def _is_action_event(self) -> bool:
        """Check if the selected option is an action event"""
        actions = self.templates.get("actions", {})
        return self.selected_option in actions

    def _is_routing_event(self) -> bool:
        """Check if the selected option is a routing event"""
        response_routing = self.templates.get("response_routing", {})
        return self.selected_option in response_routing

    def _get_next_template_from_routing(self) -> Optional[str]:
        """Get the next template based on response_routing configuration."""
        response_routing = self.templates.get("response_routing", {})
        return response_routing.get(self.selected_option)

    def reload_templates_with_language(self, new_language: str):
        """Reload templates with a new language"""
        self.preferred_language = self._language_selection_mapping(new_language)
        next_template = self.templates.get("next_template", self.current_template_name)
        self.templates = load_language_config()[self.preferred_language][next_template]

    def _build_twiml_messages(self, messages: List[Dict[str, str]]) -> str:
        """Build TwiML from message list using existing function"""
        return generate_twiml_message(messages)
    
    async def _execute_action(self) -> Dict[str, Any]:
        """Execute the actual async Python methods for actions"""
        actions = self.templates.get("actions", {})
        action_name = actions.get(self.selected_option)
        
        print(f"DEBUG: Actions: {actions}")
        print(f"DEBUG: Action name: {action_name}")
        if not action_name:
            return {"error": "No action defined for this option"}
        
        print(f"DEBUG: Executing async action: {action_name}")
        
        # Map action names to actual async method calls
        try:
            if action_name == "generate_expense_report":
                return await generate_expense_report(report_dispatcher=self.report_dispatcher, user_object=self.user_object)
            # elif action_name == "generate_income_report":
            #     return await self._generate_income_report()
            # elif action_name == "generate_feelings_report":
            #     return await self._generate_feelings_report()
            # elif action_name == "generate_comprehensive_report":
            #     return await self._generate_comprehensive_report()
            # elif action_name == "record_expense_action":
            #     return await self._start_expense_recording()
            # elif action_name == "record_income_action":
            #     return await self._start_income_recording()
            # elif action_name == "record_feeling_action":
            #     return await self._start_feeling_recording()
            else:
                return {"error": f"No handler implemented for action: {action_name}"}
                
        except Exception as e:
            print(f"ERROR executing async action {action_name}: {str(e)}")
            return {"error": f"Failed to execute action: {str(e)}"}

    async def get_template_message(self) -> Tuple[str, Optional[str], str]:
        """
        Generate complete TwiML message including media attachments
        Returns: (next_template, previous_template, complete_twiml_message)
        """

        # Initial response
        if self.current_template_name is None:
            message = self.templates["template_message"]
            twiml_message = self._build_twiml_messages([{"body": message}])
            return "unregistered_number_language_selector_template", None, twiml_message

        # Language selection
        if (self.current_template_name == "unregistered_number_language_selector_template" 
            and self.has_started):
            if self._validate_user_response():
                next_template = self.templates.get("next_template")
                
                if self.selected_language:
                    self.reload_templates_with_language(self.selected_language)
                
                message = self.templates["template_message"]
                previous_template = self.templates.get("previous_template")
                
                twiml_message = self._build_twiml_messages([{"body": message}])
                return next_template, previous_template, twiml_message
            else:
                error_options = "\n".join([f"- {option}" for option in self.templates["error_message"]])
                error_message = self.templates["template_error_message"].format(error_message=error_options)
                twiml_message = self._build_twiml_messages([{"body": error_message}])
                return self.current_template_name, None, twiml_message

        # Handle actions and routing
        if self._validate_user_response():
            # Check if this is an action event
            if self._is_action_event():
                print(f"DEBUG: Processing TwiML-integrated ACTION for option '{self.selected_option}'")
                
                # Execute action and get TwiML message structure
                action_result = await self._execute_action()
                
                if action_result["error"]:
                    twiml_message = self._build_twiml_messages(action_result["messages"])
                    return self.current_template_name, None, twiml_message
                
                # Action succeeded - build complete TwiML with media
                twiml_message = self._build_twiml_messages(action_result["messages"])
                
                # Determine next template
                if action_result.get("stay_on_current", False):
                    next_template = self.current_template_name
                else:
                    next_template = action_result.get("next_template", self.current_template_name)
                
                previous_template = self.templates.get("previous_template")
                return next_template, previous_template, twiml_message
            
            # Check if this is a routing event
            elif self._is_routing_event():
                print(f"DEBUG: Processing ROUTING event for option '{self.selected_option}'")
                next_template = self._get_next_template_from_routing()
                
                if next_template and next_template != self.current_template_name:
                    self._set_message_template(template_name=next_template)
                    message = self.templates["template_message"]
                    previous_template = self.templates.get("previous_template")
                else:
                    message = self.templates["template_message"]
                    previous_template = self.templates.get("previous_template")
                    next_template = self.current_template_name
                
                twiml_message = self._build_twiml_messages([{"body": message}])
                return next_template, previous_template, twiml_message
        
        # Error case
        error_options = "\n".join([f"- {option}" for option in self.templates["error_message"]])
        error_message = self.templates["template_error_message"].format(error_message=error_options)
        twiml_message = self._build_twiml_messages([{"body": error_message}])
        return self.current_template_name, None, twiml_message

    def get_selected_language(self) -> Optional[str]:
        """Return the language selected by the user (if any)"""
        return self.selected_language

    def get_selected_option(self) -> Optional[str]:
        """Return the option selected by the user (if any)"""
        return self.selected_option