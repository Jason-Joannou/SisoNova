"""
This config file holds the settings for the LLM models used by the agents.
"""
import google.generativeai as genai
from google.generativeai.protos import FunctionDeclaration
from typing import List

class GeminiModel:

    def __init__(self, model_name: str, model_tools: List[FunctionDeclaration]) -> None:
        """
        Constructor for GeminiModel

        Args:
            model_name (str): The name of the Gemini model
            model_tools (List[FunctionDeclaration]): The model tools associated with this model
        """

        self.model_name = model_name
        self.model_tools = model_tools

    def get_model_name(self) -> str:
        """
        Gets the name of the Gemini model

        Returns:
            str: The name of the Gemini model
        """
        return self.model_name
    
    def get_model(self) -> genai.GenerativeModel:
        """
        Gets the Gemini model

        Returns:
            genai.GenerativeModel: The Gemini model
        """
        return genai.GenerativeModel(self.model_name, model_tools=self.model_tools)
