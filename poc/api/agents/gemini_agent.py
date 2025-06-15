import json
from datetime import datetime
from typing import Dict, Any, Optional, List
import os
from api.agents.llm_factory import GeminiModel
import google.generativeai as genai
from google.generativeai.protos import FunctionDeclaration, Schema, Type
from api.agents.model_actions import get_user_financial_context, check_user_registration, show_registration_info, show_registration_info, register_new_user, set_user_language_preferences, get_user_language_preferences, show_unregistered_limitations, save_expense, save_feeling, save_income, show_sisonova_services, show_getting_started_guide, show_personal_capabilities, show_language_options
from api.db.query_manager import AsyncQueries
from api.services.s3_bucket import SecureS3Service
from api.agents.conversation_state import AgentConversationManager

class SisoNovaAgent:

    def __init__(self, user_id: int, user_phone_number: str, query_manager: AsyncQueries, s3_bucket: SecureS3Service) -> None:
        self.user_id = user_id
        self.user_phone_number = user_phone_number
        self.query_manager = query_manager
        self.s3_bucket = s3_bucket
        self.conversation_manager = AgentConversationManager(s3_bucket=self.s3_bucket, user_phone_number=self.user_phone_number, user_id=self.user_id)
        self.model: Optional[genai.GenerativeModel] = None

    async def init_model(self) -> None:
        model_tools = self.get_function_declarations()
        model_context = await get_user_financial_context(user_id=self.user_id, query_manager=self.query_manager, s3_bucket=self.s3_bucket)
        model_instructions = await self.build_system_instruction(context=model_context)

        model_init = GeminiModel(model_name="gemini-2.0-flash", model_tools=model_tools, model_instructions=model_instructions)
        gemini_model = model_init.get_model()
        self.model: genai.GenerativeModel = gemini_model

    def get_function_declarations(self) -> List[FunctionDeclaration]:
        """
        Returns enhanced function declarations with detailed descriptions for optimal model guidance.
        Each declaration includes when to use, workflow context, and business rules.
        """
        return [
            
            # =============================================================================
            # FINANCIAL TRACKING FUNCTIONS (Require Registration)
            # =============================================================================
            
            FunctionDeclaration(
                name="save_expense",
                description="""IMMEDIATELY save user's expense when they mention spending money.
    
                **CRITICAL: SAVE FIRST, ASK LATER**
                
                **When to call IMMEDIATELY:**
                - "I spent R50 on groceries" → SAVE NOW
                - "Bought bread for R15" → SAVE NOW  
                - "Taxi cost R25" → SAVE NOW
                - "Paid rent R3500" → SAVE NOW
                
                **DO NOT ask for confirmation first - SAVE IMMEDIATELY**
                
                **Workflow:**
                1. User mentions spending → Extract amount & category → CALL THIS FUNCTION
                2. After saving → Ask "How are you feeling about this expense?"
                3. User responds with feeling → Use update_expense_feeling()
                
                **Examples:**
                User: "I spent R50 on groceries"
                You: [IMMEDIATELY call save_expense(50, "groceries")] 
                Then: "✅ Saved R50 for groceries! How are you feeling about this expense?"
                
                **Categories:** groceries, transport, utilities, entertainment, clothing, airtime, rent, food""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "amount": Schema(type=Type.NUMBER, description="Amount spent in South African Rand (R)"),
                        "category": Schema(type=Type.STRING, description="Expense category: groceries, transport, utilities, entertainment, clothing, airtime, rent, etc."),
                        "feeling": Schema(type=Type.STRING, description="User's emotional response: good, okay, worried, stressed, fine, etc. Optional."),
                        "date": Schema(type=Type.STRING, description="Date in YYYY-MM-DD format. Use today's date if not specified.")
                    },
                    required=["amount", "category"]
                )
            ),
            
            FunctionDeclaration(
                name="save_income",
                description="""IMMEDIATELY save user's income when they mention earning money.
    
                **CRITICAL: SAVE FIRST, ASK LATER**
                
                **When to call IMMEDIATELY:**
                - "I earned R3000 from my job" → SAVE NOW
                - "Got paid R4500" → SAVE NOW
                - "Made R200 selling vegetables" → SAVE NOW
                
                **DO NOT ask for confirmation - SAVE IMMEDIATELY**
                
                **Workflow:**
                1. User mentions earning → Extract amount & source → CALL THIS FUNCTION
                2. After saving → Ask "How are you feeling about this income?"

                **Examples:**
                User: "I recieved R1000 bonus from my job"
                You: [IMMEDIATELY call save_income(1000, "job")] 
                Then: "✅ Saved R1000 for job! How are you feeling about this income?"
                
                **Sources:** salary, job, freelance, business, selling, piece_job, domestic_work""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "amount": Schema(type=Type.NUMBER, description="Amount earned in South African Rand (R)"),
                        "source": Schema(type=Type.STRING, description="Income source: salary, freelance, business, piece_job, domestic_work, grants, etc."),
                        "feeling": Schema(type=Type.STRING, description="User's feeling about this income: good, relieved, grateful, etc. Optional."),
                        "date": Schema(type=Type.STRING, description="Date in YYYY-MM-DD format. Use today if not specified.")
                    },
                    required=["amount", "source"]
                )
            ),
            
            FunctionDeclaration(
                name="save_feeling",
                description="""Save a GENERAL financial feeling for wellness tracking - SEPARATE from expense/income feelings.
    
                **🚨 CRITICAL DISTINCTION:**
                - This function is for GENERAL financial wellness, NOT transaction-specific feelings
                - Use update_expense_feeling() or update_income_feeling() for transaction feelings
                - This is for overall financial mood, stress, confidence about money in general
                
                **When to call save_feeling:**
                - User expresses GENERAL emotions about money: "I'm worried about money this month"
                - User shares overall financial stress or confidence: "I'm feeling good about my finances"
                - User wants to track their general financial wellness journey
                - User talks about money anxiety, financial goals, or overall money mood
                
                **When NOT to call save_feeling:**
                - User just spent/earned money and you're asking "How are you feeling?" → Use update_expense_feeling/update_income_feeling instead
                - User responds with feeling after a transaction → Use transaction-specific update functions
                - User gives feeling about a specific purchase/income → Use transaction update functions
                
                **EXAMPLES of when to use save_feeling:**
                ✅ "I'm stressed about money this month" → save_feeling("Worried", "monthly financial stress")
                ✅ "Feeling good about my savings progress" → save_feeling("Good", "savings progress")
                ✅ "I'm worried about my financial future" → save_feeling("Worried", "financial future concerns")
                ✅ "Money has been tight lately" → save_feeling("Struggling", "tight budget")
                
                **EXAMPLES of when NOT to use save_feeling:**
                ❌ User: "I spent R50 on groceries" You: "How are you feeling?" User: "Good" → Use update_expense_feeling()
                ❌ User: "I earned R3000" You: "How are you feeling?" User: "Great" → Use update_income_feeling()
                ❌ Any feeling response immediately after a transaction → Use transaction update functions
                
                **Workflow:**
                1. User expresses GENERAL financial emotion (not about specific transaction)
                2. Extract feeling and context
                3. Call this function to save general financial wellness data
                4. Provide supportive response about their overall financial journey
                
                **Allowed feelings:** Struggling, Worried, Coping, Okay, Fine, Good, Great
                
                **Purpose:** Track overall financial wellness patterns over time, separate from specific transaction emotions.""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "feeling": Schema(type=Type.STRING, description="Financial feeling level", 
                                        enum=["Struggling","Worried","Coping","Okay","Fine","Good","Great"]),
                        "context": Schema(type=Type.STRING, description="Reason or context for the feeling. Optional but valuable.")
                    },
                    required=["feeling"]
                )
            ),
            
            FunctionDeclaration(
                name="get_expense_report",
                description="""Generate detailed expense analysis and insights.
                
                **When to call:**
                - User asks: "Show me my spending", "How much did I spend?", "Expense report"
                - User wants to understand spending patterns
                - User asks for financial insights or summaries
                
                **Provides:**
                - Total spending for the period
                - Spending by category breakdown
                - Daily/weekly patterns
                - Comparison to previous periods
                - Insights and recommendations
                
                **Follow-up after calling:**
                - Explain the insights in simple terms
                - Highlight patterns or concerns
                - Suggest actionable improvements
                - Encourage continued tracking""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "period_days": Schema(type=Type.INTEGER, description="Number of days to include: 7 (week), 30 (month), 90 (quarter)")
                    },
                    required=["period_days"]
                )
            ),
            
            FunctionDeclaration(
                name="get_income_report",
                description="""Generate detailed income analysis and insights.
                
                **When to call:**
                - User asks about income: "How much did I earn?", "Show my income"
                - User wants to understand earning patterns
                - User asks for income vs expense comparison
                
                **Provides:**
                - Total income for period
                - Income by source breakdown
                - Income consistency analysis
                - Growth trends""",
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
                description="""Generate financial wellness and emotional patterns report.
                
                **When to call:**
                - User asks about their financial feelings over time
                - User wants to understand their financial wellness journey
                - User asks: "How have I been feeling about money?"
                
                **Provides:**
                - Feeling trends over time
                - Correlation with financial events
                - Wellness insights and patterns""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "period_days": Schema(type=Type.INTEGER, description="Number of days to include in feelings analysis")
                    },
                    required=["period_days"]
                )
            ),
            
            # =============================================================================
            # REGISTRATION & USER MANAGEMENT
            # =============================================================================
            
            FunctionDeclaration(
                name="check_user_registration",
                description="""Check current registration status of a user.
                
                **When to call:**
                - When you need to verify if user can access protected features
                - Before attempting registration to avoid duplicates
                - When user asks about their registration status
                
                **Returns:**
                - Whether user exists in system
                - Current registration status
                - User ID if registered
                - Service access permissions
                
                **Note:** This is mainly for internal checks. The register_new_user function 
                already handles checking internally.""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "phone_number": Schema(type=Type.STRING, description="User's phone number to check")
                    },
                    required=["phone_number"]
                )
            ),
            
            FunctionDeclaration(
                name="register_new_user",
                description="""Register a new user or handle existing user registration.
                
                **When to call:**
                - User gives explicit consent: "Yes I want to register", "I agree to register"
                - User says: "Register me", "I consent", "Sign me up"
                - User agrees to terms after seeing registration info
                
                **This function automatically:**
                - Checks if user already exists and is registered
                - Creates new user if they don't exist
                - Updates registration status if user exists but isn't registered
                - Sets up default language preferences (English)
                - Returns appropriate welcome/status messages
                
                **Workflow:**
                1. User expresses interest in registration
                2. Show registration info if they need more details
                3. User gives explicit consent
                4. Call this function with consent_given=true
                5. Use the returned message to respond to user
                
                **Consent phrases to recognize:**
                - "Yes I want to register"
                - "I agree to register with SisoNova"
                - "Register me"
                - "I consent to store my data"
                - "Sign me up"
                
                **Do NOT call without explicit consent.**""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "phone_number": Schema(type=Type.STRING, description="User's phone number"),
                        "consent_given": Schema(type=Type.BOOLEAN, description="Must be true - user has given explicit consent to store data")
                    },
                    required=["phone_number", "consent_given"]
                )
            ),
            
            FunctionDeclaration(
                name="show_registration_info",
                description="""Display registration information, terms, and privacy details.
                
                **When to call:**
                - User asks: "What is registration?", "How do I register?", "Tell me about registration"
                - User seems hesitant about registering and needs more information
                - Before registration to ensure informed consent
                - User asks about data privacy or terms
                
                **Provides:**
                - What registration means
                - Data privacy and security information
                - Terms and conditions summary
                - Benefits of registration
                - How to proceed with registration
                
                **Follow-up:**
                After showing this, ask if they'd like to register or have questions.""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "language": Schema(type=Type.STRING, description="Language for registration info: English, Zulu, or Afrikaans")
                    }
                )
            ),
            
            FunctionDeclaration(
                name="show_unregistered_limitations",
                description="""Explain what unregistered users cannot do when they try protected features.
                
                **When to call:**
                - Unregistered user tries to save expenses, income, or feelings
                - Unregistered user asks for reports or personal data
                - User attempts any feature that requires registration
                
                **Provides:**
                - Clear explanation of what they tried to do
                - Why registration is needed
                - Benefits of registering
                - How to register
                
                **Follow-up:**
                Offer to help them register or answer questions about registration.""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "attempted_action": Schema(type=Type.STRING, description="What the user tried to do: save_expense, save_income, get_report, etc.")
                    }
                )
            ),
            
            # =============================================================================
            # SERVICE DISCOVERY & ONBOARDING
            # =============================================================================
            
            FunctionDeclaration(
                name="show_sisonova_services",
                description="""Show SisoNova's main services and capabilities - PRIMARY ONBOARDING TOOL.
                
                **When to call (CRITICAL for user experience):**
                - User says "Hi", "Hello", "Hey" for the first time
                - User asks: "What can you do?", "What is this?", "Help"
                - User seems confused about SisoNova's purpose
                - User asks for menu or main services
                - New users who need orientation
                
                **Service types:**
                - overview: Main welcome and service summary (USE FOR GREETINGS)
                - personal: Focus on SisoNova Personal features
                - public: Community and public features
                - all: Complete comprehensive overview
                
                **This is your PRIMARY tool for:**
                - Welcoming new users
                - Explaining SisoNova's value proposition
                - Helping users understand what they can do
                - Service discovery and orientation
                
                **Always use 'overview' for first-time greetings.**""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "service_type": Schema(
                            type=Type.STRING,
                            enum=["overview", "personal", "public", "all"],
                            description="overview=main welcome (use for greetings), personal=Personal features, public=community features, all=everything"
                        )
                    }
                )
            ),
            
            FunctionDeclaration(
                name="show_personal_capabilities",
                description="""Show detailed SisoNova Personal service capabilities with examples.
                
                **When to call:**
                - User asks specifically about Personal services
                - User wants detailed examples of what they can track
                - User asks: "How does expense tracking work?", "Show me examples"
                - User needs more detailed guidance after seeing overview
                
                **Provides:**
                - Detailed expense tracking examples
                - Income tracking examples
                - Financial feelings tracking
                - Report capabilities
                - Step-by-step usage instructions
                
                **Use detailed=true for comprehensive examples and instructions.**""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "detailed": Schema(type=Type.BOOLEAN, description="true=comprehensive examples and instructions, false=brief summary")
                    }
                )
            ),
            
            FunctionDeclaration(
                name="show_getting_started_guide",
                description="""Show step-by-step guidance for new users based on their experience level.
                
                **When to call:**
                - User asks: "How do I start?", "What should I do first?", "I'm new here"
                - User seems overwhelmed and needs structured guidance
                - User wants step-by-step instructions
                - After registration to guide next steps
                
                **User types:**
                - complete_beginner: Never used financial tracking, needs basic guidance
                - has_some_data: Has tracked some data, needs optimization tips
                - returning_user: Returning after time away, needs refresher
                
                **Provides:**
                - Step-by-step instructions
                - Simple first actions to take
                - Progressive complexity
                - Encouragement and motivation""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "user_type": Schema(
                            type=Type.STRING,
                            enum=["complete_beginner", "has_some_data", "returning_user"],
                            description="complete_beginner=new to financial tracking, has_some_data=some experience, returning_user=coming back"
                        )
                    }
                )
            ),
            
            # =============================================================================
            # LANGUAGE & LOCALIZATION
            # =============================================================================
            
            FunctionDeclaration(
                name="set_user_language_preferences",
                description="""Set user's language preferences for display and input.
                
                **When to call:**
                - User requests language change: "I want Zulu", "Switch to Afrikaans"
                - User asks to change how they communicate
                - You detect they prefer a different language
                
                **Supports:**
                - English, Zulu (isiZulu), Afrikaans
                - Mixed preferences (read in one language, type in another)
                - Automatic detection of mixed preferences
                
                **Examples:**
                - "I want to read in Zulu" → display_language="Zulu"
                - "Switch to Afrikaans" → both languages="Afrikaans"
                
                **The function handles:**
                - Language name normalization
                - Mixed preference detection
                - Database updates
                - Appropriate response messages""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "display_language": Schema(type=Type.STRING, description="Language for responses: English, Zulu, or Afrikaans"),
                        "input_language": Schema(type=Type.STRING, description="Language user types in: English, Zulu, or Afrikaans. Optional - defaults to display_language"),
                        "reason": Schema(type=Type.STRING, description="Why language was changed: user_request, detection, etc. Optional.")
                    },
                    required=["display_language"]
                )
            ),
            
            FunctionDeclaration(
                name="show_language_options",
                description="""Display available language options to the user.
                
                **When to call:**
                - User asks: "What languages do you support?", "Change language"
                - User seems to want language options
                - User asks about multilingual capabilities
                
                **Provides:**
                - Available languages (English, Zulu, Afrikaans)
                - How to switch languages
                - Examples of language change requests
                - Current language indication""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "language": Schema(type=Type.STRING, description="Current user language for appropriate response language")
                    }
                )
            ),
            
            FunctionDeclaration(
                name="detect_message_language",
                description="""Detect what language the user is communicating in.
                
                **When to call:**
                - User sends message in non-English language
                - You want to offer language switching
                - User seems to prefer different language than current setting
                
                **Provides:**
                - Detected language
                - Confidence level
                - Suggestions for language switching
                
                **Use sparingly** - don't constantly detect language, only when helpful.""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "message": Schema(type=Type.STRING, description="The user's message to analyze for language")
                    },
                    required=["message"]
                )
            )
        ]
    async def process_message(self, message: str) -> Dict[str, Any]:
        """Fully agentic message processing with Gemini"""
        
        try:

            if self.model is None:
                await self.init_model()
            # Initialize Chat History
            chat_history = await self.conversation_manager.get_conversation_history_for_agent()
            

            # Start chat with Gemini
            chat = self.model.start_chat(history=chat_history)
            
            # Send message
            user_message = f"User message: {message}"
            
            response = chat.send_message(user_message)
            
            # Process Gemini's response
            result = await self.process_gemini_response(response, message, chat)

            # Save turn to conversation
            await self.conversation_manager.save_conversation_turn(user_message=user_message, assistant_response=result["message"], function_calls=result.get('function_calls', []))

            return result
            
        except Exception as e:
            return {
                "message": "I'm having trouble processing that right now. Could you try again?",
                "success": False,
                "error": str(e)
            }
        
    
    async def build_system_instruction(self, context: Dict) -> str:
        """Build simplified system instruction focusing on high-level behavior"""
        
        registration_status = await check_user_registration(self.user_phone_number, self.query_manager)
        is_registered = registration_status.get("registered", False)
        
        lang_prefs = await get_user_language_preferences() if is_registered else {"display": "English", "input": "English", "mixed": False}
        display_lang = lang_prefs["display"]
        input_lang = lang_prefs["input"]
        is_mixed = lang_prefs["mixed"]

        return f"""You are SisoNova's AI Financial Assistant for user {self.user_phone_number}.

        CORE MISSION:
        Help South Africans track their finances to build financial profiles for accessing formal financial services.

        USER STATUS:
        - Registration: {"✅ REGISTERED" if is_registered else "❌ NOT REGISTERED"}
        - Display Language: {display_lang}
        - Input Language: {input_lang}
        - Mixed Preference: {"Yes" if is_mixed else "No"}

        PERSONALITY:
        - Warm, supportive, and encouraging
        - Celebrate small wins and progress
        - Use South African context (Rand, local stores)
        - Focus on financial empowerment

        CONVERSATION FLOW:
        1. **New Users**: Always start with show_sisonova_services to explain what you offer
        2. **Registration**: Let functions handle the logic - just call them when user gives consent
        3. **Financial Tracking**: Confirm details before saving anything
        4. **Language**: Always respond in {display_lang}, accept input in any language

        LANGUAGE HANDLING:
        {"- User types in " + input_lang + " but reads responses in " + display_lang if is_mixed else "- User prefers " + display_lang + " for both input and responses"}
        - Never correct their language choice
        - Only offer language changes if explicitly asked

        USER'S FINANCIAL CONTEXT:
        - 30-day expenses: R{context.get('total_expenses_30d', 0):,.2f}
        - 30-day income: R{context.get('total_income_30d', 0):,.2f}
        - Net position: R{context.get('net_position', 0):,.2f}
        - Top category: {context.get('top_expense_category', 'None yet')}

        CONVERSATION CONTEXT:
        {context.get('conversation_context', 'This is a new conversation.')}

        IMPORTANT:
        - Trust your function declarations - they contain the detailed logic
        - Focus on natural conversation flow
        - Ask clarifying questions when unsure
        - Be proactive about explaining SisoNova's value
        - Functions handle registration checks, validation, and business logic

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

        Remember: You have full autonomy to decide when and how to use functions. Trust your judgment!"""
        

    async def process_gemini_response(self, response, original_message: str, chat_session: genai.ChatSession) -> Dict[str, Any]:
        """Process Gemini's response and execute any function calls"""
        
        function_calls_executed = []  # Track all function calls
        
        # Check if Gemini wants to call functions
        if hasattr(response, 'candidates') and response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'function_call') and part.function_call:
                    # Execute the function call
                    function_name = part.function_call.name
                    function_args = {}
                    
                    # Extract arguments
                    for key, value in part.function_call.args.items():
                        function_args[key] = value
                    
                    # Execute the function
                    function_result = await self.execute_tool(function_name, function_args)
                    
                    # Track this function call
                    function_calls_executed.append({
                        "function_name": function_name,
                        "arguments": function_args,
                        "result": function_result
                    })
                    
                    # Get AI's response after function execution
                    return await self.get_response_after_function(
                        function_result, 
                        function_name, 
                        original_message, 
                        chat_session,
                        function_calls_executed  # Pass all function calls
                    )
        
        # If no function calls, just return the text response
        response_text = response.text if hasattr(response, 'text') else "I'm here to help with your finances!"
        
        return {
            "message": response_text,
            "success": True,
            "function_result": None,
            "function_calls": function_calls_executed  # Empty list if no functions called
        }
    

    async def get_response_after_function(self, function_result: Dict, function_name: str, 
                                original_message: str, chat_session: genai.ChatSession,
                                function_calls_executed: List[Dict]) -> Dict[str, Any]:
        """Get AI's response after function execution using the same chat session"""
        
        # Create a follow-up prompt
        follow_up_prompt = f"""
        I just executed the function '{function_name}' with this result:
        {json.dumps(function_result, indent=2)}
        
        Please provide a natural, friendly response to the user based on this function result. 
        Be encouraging and helpful. If it's a report, explain the key insights in simple terms.
        If it's a save operation, confirm what was saved and encourage continued tracking.
        If it's service information, present it clearly and ask what they'd like to do next.
        If it's registration, welcome them warmly and explain what they can do now.
        
        IMPORTANT: Respond with ONLY text - no function calls in this response.
        """
        
        try:
            # Use the same chat session - maintains full context
            response = chat_session.send_message(follow_up_prompt)
            
            # Better error handling for response text extraction
            if hasattr(response, 'text') and response.text:
                final_message = response.text
            elif hasattr(response, 'candidates') and response.candidates:
                # Extract text from candidates if direct text access fails
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and candidate.content.parts:
                    text_parts = []
                    for part in candidate.content.parts:
                        if hasattr(part, 'text') and part.text:
                            text_parts.append(part.text)
                    final_message = ''.join(text_parts) if text_parts else "✅ Done! How else can I help you today?"
                else:
                    final_message = "✅ Done! How else can I help you today?"
            else:
                final_message = "✅ Done! How else can I help you today?"
                
        except Exception as e:
            print(f"❌ Error in follow-up response: {e}")
            # Enhanced fallback responses based on function type
            if function_name == 'register_new_user':
                if function_result.get('success'):
                    final_message = "🎉 Welcome to SisoNova! You're now registered and can start tracking your finances. Try saying 'I spent R50 on groceries' to get started!"
                else:
                    final_message = "❌ There was an issue with registration. Please try again or contact support."
            elif function_name.startswith('save_'):
                final_message = "✅ Great! I've recorded that information. Keep up the good work tracking your finances!"
            elif function_name.startswith('get_'):
                final_message = "📊 Here's your report! This data helps build your financial profile."
            elif function_name.startswith('show_'):
                final_message = "ℹ️ Here's the information about SisoNova's services. What would you like to try?"
            else:
                final_message = "✅ Done! How else can I help you today?"
        
        return {
            "message": final_message,
            "success": True,
            "function_result": function_result,
            "function_calls": function_calls_executed
        }
    

    async def execute_tool(self, function_name: str, arguments: Dict) -> Dict[str, Any]:
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
            registration_status = await check_user_registration(self.user_phone_number, self.query_manager)
            if not registration_status.get("registered", False):
                return await show_unregistered_limitations(function_name)  # Make sure this is async
        
        if function_name == "save_expense":
            return await save_expense(query_manager=self.query_manager,**arguments)
        elif function_name == "save_income":
            return await save_income(query_manager=self.query_manager,**arguments)
        elif function_name == "save_feeling":
            return await save_feeling(query_manager=self.query_manager,**arguments)
        # elif function_name == "get_expense_report":
        #     return self.get_expense_report(**arguments)
        # elif function_name == "get_income_report":
        #     return self.get_income_report(**arguments)
        # elif function_name == "get_feelings_report":
        #     return self.get_feelings_report(**arguments)
        # Registration tools (always allowed)
        elif function_name == "check_user_registration":
            return await check_user_registration(query_manager=self.query_manager, **arguments)
        elif function_name == "register_new_user":
            return await register_new_user(query_manager=self.query_manager,**arguments)
        elif function_name == "show_registration_info":
            return show_registration_info(**arguments)
        elif function_name == "show_unregistered_limitations":
            return show_unregistered_limitations(**arguments)
        # Service info tools (always allowed)
        elif function_name == "show_sisonova_services":
            return show_sisonova_services(**arguments)
        elif function_name == "show_personal_capabilities":
            return show_personal_capabilities(**arguments)
        elif function_name == "show_getting_started_guide":
            return show_getting_started_guide(**arguments)
        # Language tools (always allowed)
        elif function_name == "set_user_language":
            return await set_user_language_preferences(query_manager=self.query_manager, **arguments)
        elif function_name == "show_language_options":
            return show_language_options(**arguments)
        else:
            return {"error": f"Unknown function: {function_name}"}