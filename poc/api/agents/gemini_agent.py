import json
from datetime import datetime
from typing import Dict, Any, Optional, List
import os
from api.agents.llm_factory import GeminiModel
import google.generativeai as genai
from google.generativeai.protos import FunctionDeclaration, Schema, Type
from api.agents.model_actions import get_user_financial_context, get_recent_transactions, check_user_registration, show_registration_info, show_registration_info, register_new_user, set_user_language_preferences, get_user_language_preferences, show_unregistered_limitations, save_expense, save_feeling, save_income, show_sisonova_services, show_getting_started_guide, show_personal_capabilities, show_language_options, update_expense_feeling, update_income_feeling
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
                description="""🚨 MANDATORY: IMMEDIATELY save user's expense when they mention spending money.

                **CRITICAL: SAVE FIRST, ASK LATER - NO CONFIRMATION NEEDED**
                
                **When to call IMMEDIATELY:**
                - "I spent R50 on groceries" → CALL NOW, don't ask for confirmation
                - "Bought bread for R15" → CALL NOW, don't ask for confirmation  
                - "Taxi cost R25" → CALL NOW, don't ask for confirmation
                
                **DO NOT:**
                - Ask "Is that correct?" before saving
                - Ask for confirmation
                - Wait for user approval
                
                **DO:**
                - Extract amount and category immediately
                - Call this function right away
                - Ask about feelings AFTER saving
                
                **Workflow:**
                1. User mentions spending → IMMEDIATELY call save_expense()
                2. After successful save → Ask "How are you feeling about this expense?"
                3. User responds with feeling → Use get_recent_transactions() + update_expense_feeling()
                
                **Example:**
                User: "I spent R50 on groceries"
                You: [IMMEDIATELY call save_expense(50, "groceries")] 
                Then: "✅ Saved R50 for groceries! How are you feeling about this expense?"
                
                User: "Good"
                You: [call get_recent_transactions("expense")] → [call update_expense_feeling(expense_id, "Good")]""",
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
                description="""🚨 MANDATORY: IMMEDIATELY save user's income when they mention earning money.

                **CRITICAL: SAVE FIRST, ASK LATER - NO CONFIRMATION NEEDED**
                
                **When to call IMMEDIATELY:**
                - "I earned R3000 from my job" → CALL NOW, don't ask for confirmation
                - "Got paid R4500" → CALL NOW, don't ask for confirmation  
                - "Made R200 selling vegetables" → CALL NOW, don't ask for confirmation
                - "Received R1500 bonus" → CALL NOW, don't ask for confirmation
                - "My salary was R5000" → CALL NOW, don't ask for confirmation
                
                **DO NOT:**
                - Ask "Is that correct?" before saving
                - Ask for confirmation
                - Wait for user approval
                
                **DO:**
                - Extract amount and source immediately
                - Call this function right away
                - Ask about feelings AFTER saving
                
                **Workflow:**
                1. User mentions earning → IMMEDIATELY call save_income()
                2. After successful save → Ask "How are you feeling about this income?"
                3. User responds with feeling → Use get_recent_transactions() + update_income_feeling()
                
                **Example:**
                User: "I earned R3000 from my job"
                You: [IMMEDIATELY call save_income(3000, "job")] 
                Then: "✅ Saved R3000 from job! How are you feeling about this income?"
                
                User: "Great"
                You: [call get_recent_transactions("income")] → [call update_income_feeling(income_id, "Great")]
                
                **Income Sources:** salary, job, freelance, business, selling, piece_job, domestic_work, grants, bonus, tips""",
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

                **CRITICAL: SAVE EVERY SINGLE FEELING MENTIONED - NEVER SKIP**

    
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
            ),
            FunctionDeclaration(
                name="get_recent_transactions",
                description="""Get recent transactions to find which one needs a feeling update.

                **When to call:**
                - User gives a short emotional response: "good", "bad", "worried", "fine", "great"
                - You need to find the most recent transaction that needs a feeling
                - User seems to be responding to your "How are you feeling?" question
                
                **Critical Workflow for Feeling Updates:**
                1. User mentions transaction → save_expense/save_income
                2. You ask "How are you feeling about this expense/income?"
                3. User responds with feeling → CALL THIS FUNCTION FIRST
                4. Find transaction with needs_feeling=true
                5. Call update_expense_feeling or update_income_feeling with the ID
                
                **Example:**
                User: "I spent R50 on groceries"
                You: [save_expense] → "✅ Saved! How are you feeling?"
                User: "Good"
                You: [get_recent_transactions("expense")] → Find ID:1 needs_feeling=true → [update_expense_feeling(1, "Good")]
                
                **NEVER guess transaction IDs - always get them from this function first!**""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "record_type": Schema(
                            type=Type.STRING, 
                            enum=["expense", "income"],
                            description="Type of transactions to get: 'expense' for expenses, 'income' for incomes"
                        ),
                        "limit": Schema(
                            type=Type.INTEGER, 
                            description="Number of recent transactions to get (default 5)"
                        )
                    },
                    required=["record_type"]
                )
            ),
            FunctionDeclaration(
                name="update_expense_feeling",
                description="""Update a specific expense with feeling information.
    
                **When to call:**
                - After calling get_recent_transactions(record_type="expense") 
                - User has provided a feeling response like "good", "bad", "worried", "fine"
                - You have an expense_id from the recent transactions that needs_feeling=true
                
                **Workflow:**
                1. User gives emotional response after expense
                2. Call get_recent_transactions(record_type="expense") 
                3. Find the most recent expense with needs_feeling=true
                4. Call this function with that expense_id and the user's feeling
                
                **Example:**
                User: "I spent R50 on groceries" → save_expense → "How are you feeling?"
                User: "Good" → get_recent_transactions(record_type="expense") → update_expense_feeling(expense_id=1, feeling="Good")
                
                **Always get the expense_id from get_recent_transactions() first - never guess the ID!**""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "expense_id": Schema(type=Type.INTEGER, description="Expense ID from get_recent_transactions() - the expense that needs feeling update"),
                        "feeling": Schema(type=Type.STRING, description="User's feeling: Good, Bad, Worried, Fine, etc.")
                    },
                    required=["expense_id", "feeling"]
                )
            ),

            FunctionDeclaration(
                name="update_income_feeling",
                description="""Update a specific income with feeling information.
    
                **When to call:**
                - After calling get_recent_transactions(record_type="income")
                - User has provided a feeling response like "good", "great", "worried", "relieved"
                - You have an income_id from the recent transactions that needs_feeling=true
                
                **Workflow:**
                1. User gives emotional response after income
                2. Call get_recent_transactions(record_type="income")
                3. Find the most recent income with needs_feeling=true
                4. Call this function with that income_id and the user's feeling
                
                **Example:**
                User: "I earned R3000 from my job" → save_income → "How are you feeling?"
                User: "Great" → get_recent_transactions(record_type="income") → update_income_feeling(income_id=1, feeling="Great")
                
                **Always get the income_id from get_recent_transactions() first - never guess the ID!**""",
                parameters=Schema(
                    type=Type.OBJECT,
                    properties={
                        "income_id": Schema(type=Type.INTEGER, description="Income ID from get_recent_transactions() - the income that needs feeling update"),
                        "feeling": Schema(type=Type.STRING, description="User's feeling about income")
                    },
                    required=["income_id", "feeling"]
                )
            ),
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

        🚨 CRITICAL FUNCTION CALLING RULES:
        1. NEVER claim to have saved data without calling the actual function
        2. When user mentions spending/earning, you MUST call save_expense/save_income
        3. If you say "✅ Saved", you MUST have called the function first
        4. NEVER hallucinate function results - always call the actual functions
        5. Wait for function results before responding
        6. You are allowed to call more than one function per turn

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
        
        print(f"🔍 DEBUG: Processing response for message: {original_message}")
        
        function_calls_executed = []  # Track all function calls
        
        # Check if Gemini wants to call functions
        if hasattr(response, 'candidates') and response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'function_call') and part.function_call:
                    # Execute the function call
                    function_name = part.function_call.name
                    function_args = {}
                    
                    print(f"🔍 DEBUG: Gemini wants to call function: {function_name}")
                    
                    # Extract arguments
                    for key, value in part.function_call.args.items():
                        function_args[key] = value

                    print(f"🔍 DEBUG: Function arguments: {function_args}")
                    
                    # Execute the function
                    function_result = await self.execute_tool(function_name, function_args)
                    
                    print(f"🔍 DEBUG: Function result: {function_result}")
                    
                    # Track this function call
                    function_calls_executed.append({
                        "function_name": function_name,
                        "arguments": function_args,
                        "result": function_result
                    })
                    
                    # ✅ DON'T return here - continue processing other function calls
            
            # ✅ After processing ALL function calls, get the AI's response
            if function_calls_executed:
                return await self.get_response_after_function(
                    function_calls_executed[-1]["result"],  # Use last function result
                    function_calls_executed[-1]["function_name"],  # Use last function name
                    original_message, 
                    chat_session,
                    function_calls_executed  # Pass all function calls
                )
        
        # 🚨 NEW: Validate response for hallucinated saves
        response_text = response.text if hasattr(response, 'text') else ""
        
        # Check if AI claims to have saved something without calling functions
        if any(phrase in response_text.lower() for phrase in ["✅ saved", "saved r", "recorded r", "tracked r"]):
            if not function_calls_executed:
                print(f"🚨 CRITICAL: AI hallucinated saving data without calling functions!")
                print(f"🚨 Response: {response_text}")
                
                # Force a retry with stronger instruction
                retry_prompt = f"""
                CRITICAL ERROR: You just claimed to save data but didn't call any functions.
                
                Original message: "{original_message}"
                Your response: "{response_text}"
                
                You MUST call the appropriate function (save_expense, save_income, etc.) when user mentions financial transactions.
                
                Please process the original message again and ACTUALLY call the required function.
                """
                
                retry_response = chat_session.send_message(retry_prompt)
                return await self.process_gemini_response(retry_response, original_message, chat_session)
        
        return {
            "message": response_text,
            "success": True,
            "function_result": None,
            "function_calls": function_calls_executed
        }
    

    async def get_response_after_function(self, function_result: Dict, function_name: str, 
                            original_message: str, chat_session: genai.ChatSession,
                            function_calls_executed: List[Dict]) -> Dict[str, Any]:
    
        follow_up_prompt = f"""
        I just executed the function '{function_name}' with this result:
        {json.dumps(function_result, indent=2)}
        
        Please provide a natural, friendly text response to the user based on this function result. 
        
        🚨 CRITICAL: Respond with ONLY TEXT - DO NOT call any functions.
        🚨 CRITICAL: Do not use function calls in this response.
        🚨 CRITICAL: Just give me a conversational text response.
        
        If it's a save operation, confirm what was saved.
        If it's a report, explain the insights.
        Be encouraging and helpful.
        """
        
        try:
            # Send with explicit instruction to not use tools
            response = chat_session.send_message(
                follow_up_prompt,
                tool_config={'function_calling_config': {'mode': 'NONE'}}  # 🚨 Disable function calling
            )
            
            final_message = response.text if hasattr(response, 'text') else "✅ Done!"
            
        except Exception as e:
            print(f"❌ Error in follow-up response: {e}")
            final_message = "✅ Done!"
        
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
                return show_unregistered_limitations(function_name)  # Make sure this is async
        
        if function_name == "save_expense":
            return await save_expense(query_manager=self.query_manager, user_id=self.user_id, **arguments)
        elif function_name == "save_income":
            return await save_income(query_manager=self.query_manager, user_id=self.user_id,**arguments)
        elif function_name == "save_feeling":
            return await save_feeling(query_manager=self.query_manager, user_id=self.user_id,**arguments)
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
            return await set_user_language_preferences(query_manager=self.query_manager, user_id=self.user_id, **arguments)
        elif function_name == "show_language_options":
            return show_language_options(**arguments)
        elif function_name == "get_recent_transactions":
            return await get_recent_transactions(query_manager=self.query_manager, user_id=self.user_id, **arguments)
        elif function_name == "update_expense_feeling":
            return await update_expense_feeling(query_manager=self.query_manager, s3_bucket=self.s3_bucket, user_phone_number=self.user_phone_number, user_id=self.user_id, **arguments)
        elif function_name == "update_income_feeling":
            return await update_income_feeling(query_manager=self.query_manager, s3_bucket=self.s3_bucket, user_phone_number=self.user_phone_number, user_id=self.user_id, **arguments)
        else:
            return {"error": f"Unknown function: {function_name}"}