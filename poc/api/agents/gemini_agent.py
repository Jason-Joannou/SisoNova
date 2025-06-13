import json
from datetime import datetime
from typing import Dict, Any, Optional, List
import os
from llm_factory import GeminiModel
import google.generativeai as genai
from google.generativeai.protos import FunctionDeclaration, Schema, Type
from model_actions import get_user_financial_context, check_user_registration
from api.db.query_manager import AsyncQueries
from api.services.s3_bucket import SecureS3Service

class SisoNovaAgent:

    def __init__(self, user_id: int, user_phone_number: str, query_manager: AsyncQueries, s3_bucket: SecureS3Service) -> None:
        self.user_id = user_id
        self.user_phone_number = user_phone_number
        self.query_manager = query_manager
        self.s3_bucket = s3_bucket

        self.model: genai.GenerativeModel = GeminiModel(model_name="gemini-2.0-flash", model_tools=self.get_function_declarations())

    def get_function_declarations(self) -> List[FunctionDeclaration]:
        """
        Returns a list of function declarations for the SisoNova agent.

        Each function declaration describes an action that can be performed,
        including saving expenses, incomes, and financial feelings, as well as
        generating reports and showing various service capabilities. The schema
        for each function specifies the required parameters and their types.

        Returns:
            List[FunctionDeclaration]: A list of FunctionDeclaration objects
            describing the available functions and their schemas.
        """
        return [
            FunctionDeclaration(
                name="save_expense",
                description="Save an expense to the database after user confirms it",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "amount": Schema(type=Type.NUMBER, description="Amount spent in Rand"),
                        "category": Schema(type=Type.STRING, description="Expense category"),
                        "feeling": Schema(type=Type.STRING, description="User's feeling about this expense"),
                        "date": Schema(type=Type.STRING, description="Date of expense (YYYY-MM-DD format)")
                    },
                    required=["amount", "category"]
                )
            ),
            FunctionDeclaration(
                name="save_income",
                description="Save income to the database after user confirms it",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "amount": Schema(type=Type.NUMBER, description="Amount earned in Rand"),
                        "source": Schema(type=Type.STRING, description="Income source"),
                        "feeling": Schema(type=Type.STRING, description="User's feeling about this income"),
                        "date": Schema(type=Type.STRING, description="Date of income")
                    },
                    required=["amount", "source"]
                )
            ),
            FunctionDeclaration(
                name="save_feeling",
                description="Save a financial feeling to the database",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "feeling": Schema(type=Type.STRING, description="The financial feeling"),
                        "context": Schema(type=Type.STRING, description="Context or reason for the feeling")
                    },
                    required=["feeling"]
                )
            ),
            FunctionDeclaration(
                name="get_expense_report",
                description="Generate and return expense report data",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "period_days": Schema(type=Type.INTEGER, description="Number of days to include in report (7, 30, etc.)")
                    },
                    required=["period_days"]
                )
            ),
            FunctionDeclaration(
                name="get_income_report",
                description="Generate and return income report data",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "period_days": Schema(type=Type.INTEGER, description="Number of days to include in report")
                    },
                    required=["period_days"]
                )
            ),
            FunctionDeclaration(
                name="get_feelings_report",
                description="Generate and return financial feelings report",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "period_days": Schema(type=Type.INTEGER, description="Number of days to include in report")
                    },
                    required=["period_days"]
                )
            ),
            FunctionDeclaration(
                name="show_sisonova_services",
                description="Show the main SisoNova services and what the platform offers",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "service_type": Schema(
                            type=Type.STRING,
                            enum=["overview", "personal", "public", "all"],
                            description="Which services to show - overview for main menu, personal/public for specific services, all for everything"
                        )
                    }
                )
            ),
            FunctionDeclaration(
                name="show_personal_capabilities",
                description="Show detailed SisoNova Personal service capabilities and examples",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "detailed": Schema(type=Type.BOOLEAN, description="Whether to show detailed examples and instructions")
                    }
                )
            ),
            FunctionDeclaration(
                name="show_getting_started_guide",
                description="Show a step-by-step guide for new users on how to use SisoNova",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "user_type": Schema(
                            type=Type.STRING,
                            enum=["complete_beginner", "has_some_data", "returning_user"],
                            description="Type of user to customize the guide"
                        )
                    }
                )
            ),
            FunctionDeclaration(
                name="check_user_registration",
                description="Check if user is registered and can use SisoNova services",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "phone_number": Schema(type=Type.STRING, description="User's phone number")
                    },
                    required=["phone_number"]
                )
            ),
            FunctionDeclaration(
                name="register_new_user",
                description="Register a new user after they give consent",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "phone_number": Schema(type=Type.STRING, description="User's phone number"),
                        "consent_given": Schema(type=Type.BOOLEAN, description="Whether user has given explicit consent"),
                        "language_preference": Schema(type=Type.STRING, description="User's preferred language"),
                    },
                    required=["phone_number", "consent_given"]
                )
            ),
            FunctionDeclaration(
                name="show_registration_info",
                description="Show registration information and terms to unregistered users",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "language": Schema(type=Type.STRING, description="Language to show registration info in")
                    }
                )
            ),
            FunctionDeclaration(
                name="show_unregistered_limitations",
                description="Explain what unregistered users cannot do",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "attempted_action": Schema(type=Type.STRING, description="Attempted action by unregistered user")
                    }
                )
            )
        ]
    
    async def process_message(self, message: str) -> Dict[str, Any]:
        """Fully agentic message processing with Gemini"""
        
        try:
            # Get full context for AI
            context = await get_user_financial_context(user_id=self.user_id, query_manager=self.query_manager, s3_bucket=self.s3_bucket)
            
            # Build system instruction
            system_instruction = self.build_system_instruction(context)
            
            # Start chat with Gemini
            chat = self.model.start_chat(history=[])
            
            # Send message with system context
            full_prompt = f"{system_instruction}\n\nUser message: {message}"
            
            response = chat.send_message(full_prompt)
            
            # Process Gemini's response
            return self.process_gemini_response(response, message)
            
        except Exception as e:
            return {
                "message": "I'm having trouble processing that right now. Could you try again?",
                "success": False,
                "error": str(e)
            }
        
    def build_system_instruction(self, context: Dict) -> str:
        """Build system instruction for Gemini"""
        registration_status = check_user_registration(self.user_phone_number, self.query_manager)
        is_registered = registration_status.get("registered", False)
        registration_instruction = ""
        if not is_registered:
            registration_instruction = """
            🚨 CRITICAL: USER IS NOT REGISTERED
            
            This user has NOT given consent to store their data. You MUST:
            1. NOT save any financial data (expenses, income, feelings)
            2. NOT access any existing data
            3. Explain they need to register first
            4. Use show_registration_info tool to explain registration
            5. Use register_new_user tool ONLY after explicit consent
            6. Be helpful but respect privacy boundaries
            
            ALLOWED for unregistered users:
            - General information about SisoNova
            - Language selection
            - Registration process
            - Answering questions about services
            
            NOT ALLOWED for unregistered users:
            - Saving expenses, income, or feelings
            - Generating reports
            - Accessing any personal financial data
            - Creating financial profiles
            """
        else:
            registration_instruction = """
            ✅ USER IS REGISTERED
            
            This user has given consent and is fully registered. You can:
            - Save all financial data
            - Generate reports
            - Access their financial history
            - Provide full SisoNova services
            """

        lang_prefs = self.get_user_language_preferences() if is_registered else {"display": "English", "input": "English", "mixed": False}

        return f"""
        You are SisoNova's AI Financial Assistant for user {self.user_phone_number}.
        
        REGISTRATION STATUS: {"REGISTERED" if is_registered else "NOT REGISTERED"}
        {registration_instruction}

        REGISTRATION HANDLING RULES:
        - If unregistered user tries to save data → use show_unregistered_limitations
        - If user asks about registration → use show_registration_info
        - If user gives consent → use register_new_user
        - Always check registration before using financial tools
        - Be transparent about why registration is needed
        
        CONSENT DETECTION:
        Look for explicit consent phrases:
        - "Yes, I want to register"
        - "I agree to register" 
        - "Register me"
        - "I consent"
        - "I agree to the terms"

        LANGUAGE SETTINGS:
        - User's display language: {lang_prefs["display"]}
        - User's input language: {lang_prefs["input"]}
        - Mixed preference: {lang_prefs["mixed"]}
        
        ABOUT SISONOVA:
        SisoNova helps unbanked and underserved people in South Africa track their finances 
        to build financial profiles for accessing formal financial services.
        
        CRITICAL: SERVICE DISCOVERY RESPONSIBILITY
        You MUST help users understand what SisoNova offers, especially new users. When users:
        - Say hello/hi for the first time
        - Ask "what can you do" or "what is this"
        - Seem confused about services
        - Ask for help or menu
        - Want to know about SisoNova
        
        USE THESE FUNCTIONS:
        - show_sisonova_services: For main service overview
        - show_personal_capabilities: For detailed Personal service info
        - show_getting_started_guide: For step-by-step guidance
        
        YOUR PERSONALITY:
        - Warm, supportive, and encouraging
        - Focused on financial empowerment  
        - Use South African context (Rand currency, local stores like Shoprite, Pick n Pay)
        - Celebrate progress and small wins
        - PROACTIVELY explain SisoNova's value when users seem uncertain
        
        USER'S CURRENT FINANCIAL CONTEXT:
        - Total expenses (30 days): R {context.get('total_expenses_30d', 0):,.2f}
        - Total income (30 days): R {context.get('total_income_30d', 0):,.2f}
        - Net position: R {context.get('net_position', 0):,.2f}
        - Recent transactions: {context.get('recent_transaction_count', 0)}
        - Top expense category: {context.get('top_expense_category', 'Unknown')}
        
        CONVERSATION CONTEXT:
        {context.get('conversation_context', 'This is a new conversation.')}
        
        IMPORTANT BEHAVIORAL GUIDELINES:
        1. For new users or unclear requests, ALWAYS explain SisoNova's services first
        2. Use service discovery functions liberally - don't assume users know what we do
        3. If user seems lost, show them the main services overview
        4. Be proactive about explaining value and capabilities
        5. Make it easy for users to rediscover services anytime
        6. ALWAYS understand what the user is saying before taking action
        7. If user mentions spending/earning, extract the details and confirm understanding
        8. Only use functions when you're confident about the user's intent
        9. If unsure, ask clarifying questions instead of guessing
        10. Be natural - don't sound robotic or overly formal
        
        EXAMPLES OF GOOD RESPONSES:
        User: "Hi"
        You: Use show_sisonova_services function with overview, then welcome them warmly
        
        User: "I spent R50 on groceries"
        You: "I see you spent R50 on groceries! How are you feeling about that purchase? Should I record this for you?"
        
        User: "yes record it, feeling okay about it"  
        You: Use save_expense function, then respond with encouragement
        
        User: "show me my spending"
        You: Use get_expense_report function, then explain the insights in a friendly way
        
        Remember: You have full autonomy to decide when and how to use functions. Trust your judgment!
        """
    

    def process_gemini_response(self, response, original_message: str) -> Dict[str, Any]:
        """Process Gemini's response and execute any function calls"""
        
        # Check if Gemini wants to call functions
        if response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'function_call') and part.function_call:
                    # Execute the function call
                    function_name = part.function_call.name
                    function_args = {}
                    
                    # Extract arguments
                    for key, value in part.function_call.args.items():
                        function_args[key] = value
                    
                    # Execute the function
                    function_result = self.execute_tool(function_name, function_args)
                    
                    # Get AI's response after function execution
                    return self.get_response_after_function(function_result, function_name, original_message)
        
        # If no function calls, just return the text response
        response_text = response.text if hasattr(response, 'text') else "I'm here to help with your finances!"
        
        # Save conversation
        self.save_conversation_turn(original_message, response_text)
        
        return {
            "message": response_text,
            "success": True
        }
    

    def get_response_after_function(self, function_result: Dict, function_name: str, original_message: str) -> Dict[str, Any]:
        """Get AI's response after function execution"""
        
        # Create a follow-up prompt for natural response
        follow_up_prompt = f"""
        I just executed the function '{function_name}' with this result:
        {json.dumps(function_result, indent=2)}
        
        The user's original message was: "{original_message}"
        
        Please provide a natural, friendly response to the user based on this function result. 
        Be encouraging and helpful. If it's a report, explain the key insights in simple terms.
        If it's a save operation, confirm what was saved and encourage continued tracking.
        If it's service information, present it clearly and ask what they'd like to do next.
        """
        
        try:
            chat = self.model.start_chat(history=[])
            response = chat.send_message(follow_up_prompt)
            final_message = response.text
        except:
            # Fallback response
            if function_name.startswith('save_'):
                final_message = f"✅ Great! I've recorded that information. Keep up the good work tracking your finances!"
            elif function_name.startswith('get_'):
                final_message = f"📊 Here's your report! This data helps build your financial profile."
            elif function_name.startswith('show_'):
                final_message = f"ℹ️ Here's the information about SisoNova's services. What would you like to try?"
            else:
                final_message = "✅ Done! How else can I help you today?"
        
        # Save conversation
        self.save_conversation_turn(original_message, final_message)
        
        return {
            "message": final_message,
            "success": True,
            "function_result": function_result
        }
    

    def execute_tool(self, function_name: str, arguments: Dict) -> Dict[str, Any]:
        """Execute a tool function"""

        protected_tools = [
            "save_expense", 
            "save_income", 
            "save_feeling",
            "get_expense_report", 
            "get_income_report", 
            "get_feelings_report"
        ]

        if function_name in protected_tools:
            if not self.is_user_registered():
                return self.show_unregistered_limitations(function_name)
        
        if function_name == "save_expense":
            return self.save_expense(**arguments)
        elif function_name == "save_income":
            return self.save_income(**arguments)
        elif function_name == "save_feeling":
            return self.save_feeling(**arguments)
        elif function_name == "get_expense_report":
            return self.get_expense_report(**arguments)
        elif function_name == "get_income_report":
            return self.get_income_report(**arguments)
        elif function_name == "get_feelings_report":
            return self.get_feelings_report(**arguments)
        # Registration tools (always allowed)
        elif function_name == "check_user_registration":
            return self.check_user_registration(**arguments)
        elif function_name == "register_new_user":
            return self.register_new_user(**arguments)
        elif function_name == "show_registration_info":
            return self.show_registration_info(**arguments)
        elif function_name == "show_unregistered_limitations":
            return self.show_unregistered_limitations(**arguments)
        # Service info tools (always allowed)
        elif function_name == "show_sisonova_services":
            return self.show_sisonova_services(**arguments)
        elif function_name == "show_personal_capabilities":
            return self.show_personal_capabilities(**arguments)
        elif function_name == "show_getting_started_guide":
            return self.show_getting_started_guide(**arguments)
        # Language tools (always allowed)
        elif function_name == "set_user_language":
            return self.set_user_language(**arguments)
        elif function_name == "show_language_options":
            return self.show_language_options(**arguments)
        else:
            return {"error": f"Unknown function: {function_name}"}