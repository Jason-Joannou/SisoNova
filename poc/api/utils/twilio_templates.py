from typing import Optional


class TwilioTemplateManager:

    def __init__(self, language: Optional[str] = None) -> None:
        self.preferred_language, self.current_template, self.previous_template = (
            self.init_template_manager()
        )

    def init_template_manager(self):
        pass

    def _language_selection_mapping(self, language: str):

        language_codes = {"English": "en", "Afrikaans": "af", "Zulu": "zl"}

        return language_codes[language]
