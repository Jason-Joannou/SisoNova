import asyncio
from api.db.query_manager import AsyncQueries
from api.services.s3_bucket import SecureS3Service
from api.db.db_manager import DatabaseManager
from api.db.models.tables import User, LanguagePreference, UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings
from typing import Optional, Dict
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Registration
###############################################################################################################################################

async def check_user_registration(phone_number: str, query_manager: AsyncQueries) -> Dict:
    """Check if user is registered"""
    try:

        user = await query_manager.get_user_by_phone(phone_number=phone_number)
        if user:
            return {
                "exists": True,
                "registered": user.registered,
                "user_id": user.id,
                "registration_date": user.created_at,
                "can_use_services": user.registered
            }
        else:
            return {
                "exists": False,
                "registered": False,
                "user_id": None,
                "can_use_services": False
            }
    except Exception as e:
        return {
            "exists": False,
            "registered": False,
            "error": str(e),
            "can_use_services": False
        }
    
async def register_new_user(phone_number: str, consent_given: bool, query_manager: AsyncQueries) -> Dict:

    try:
        if not consent_given:
            return {
                "success": False,
                "message": "Registration requires your consent to store your information.",
                "registered": False
            }
        
        # Check if user already exists
        user_info = await check_user_registration(phone_number=phone_number, query_manager=query_manager)
        if user_info["exists"]:
            if user_info["registered"]:
                return {
                        "success": True,
                        "message": "You're already registered! Welcome back to SisoNova.",
                        "registered": True,
                        "user_id": user_info["user_id"]
                    }
            else:
                # Update registration status for user
                user_id = user_info["user_id"]
                await query_manager.update_user_registration_status(user_id=user_id, user_phone_number=phone_number, registration_status=True)
        else:
            user = User(
                phone_number=phone_number,
                registered=True
            )
            await query_manager.add(user)

            

            language = LanguagePreference(
                user_id = user.id,
                display_language = "English",
                input_language = "English",
                mixed_preference = False
            )

            await query_manager.add(language)

            welcome_messages = {
            "English": "🎉 Welcome to SisoNova! You're now registered and can start tracking your finances to build your financial profile.",
            "Zulu": "🎉 Wamukelekile ku-SisoNova! Manje usebhalisiwe futhi ungaqala ukugcina imali yakho ukuze wakhe iphrofayela yakho yezimali.",
            "Afrikaans": "🎉 Welkom by SisoNova! Jy is nou geregistreer en kan begin om jou finansies te volg om jou finansiële profiel te bou."
            }

            return {
            "success": True,
            "message": welcome_messages["English"],
            "registered": True,
            "user_id": user.id
            }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "registered": False
        }
    
def show_registration_info(language: str = "English") -> Dict:
    """Show registration information and terms"""
    
    registration_info = {
        "English": """
🌟 **Welcome to SisoNova Financial Services!**

To use SisoNova's financial tracking and assistance services, you need to register first.

**📋 What Registration Means:**
• We securely save your WhatsApp number
• You can track expenses, income, and financial feelings
• We build your financial profile over time
• Your data helps you access formal financial services later

**🔒 Your Privacy & Data:**
• Your information is kept secure and private
• We only use your data to provide financial services
• You can request deletion of your data anytime
• We comply with South African data protection laws

**✅ By registering, you agree to:**
• Our Terms and Conditions: https://sisonova.com/terms
• Our Privacy Policy: https://sisonova.com/privacy
• Allow us to store your financial tracking data

**Ready to register?** Just say:
• "Yes, I want to register"
• "I agree to register"
• "Register me"

**Need more info?** Ask me anything about SisoNova!
        """,
        
        "Zulu": """
🌟 **Wamukelekile ku-SisoNova Financial Services!**

Ukuze usebenzise izinsizakalo zika-SisoNova zokulandelela imali, kudingeka ubhalise kuqala.

**📋 Ukubhalisa Kusho Ukuthini:**
• Sigcina inombolo yakho ye-WhatsApp ngokuphepha
• Ungalandelela izindleko, imali engenayo, nemizwa yakho yezimali
• Sakha iphrofayela yakho yezimali ngokuhamba kwesikhathi
• Idatha yakho ikusiza ukufinyelela ezinsizakalweni zezimali ezisemthethweni kamuva

**🔒 Ubumfihlo Bakho Nedatha:**
• Ulwazi lwakho lugcinwa luphephile futhi luyimfihlo
• Sisebenzisa idatha yakho kuphela ukunikeza izinsizakalo zezimali
• Ungacela ukusulwa kwedatha yakho nganoma yisiphi isikhathi
• Siyalandela imithetho yokukhusela idatha yaseNingizimu Afrika

**✅ Ngokubhalisa, uyavuma:**
• Imigomo Yethu Nezimo: https://sisonova.com/terms
• Inqubomgomo Yethu Yobumfihlo: https://sisonova.com/privacy
• Sivumele ukuthi sigcine idatha yakho yokulandelela imali

**Usukulungele ukubhalisa?** Vele uthi:
• "Yebo, ngifuna ukubhalisa"
• "Ngiyavuma ukubhalisa"
• "Ngibhalise"

**Udinga ulwazi oluthe xaxa?** Ngibuze noma yini mayelana ne-SisoNova!
        """,
        
        "Afrikaans": """
🌟 **Welkom by SisoNova Financial Services!**

Om SisoNova se finansiële opvolging en bystandsdienste te gebruik, moet jy eers registreer.

**📋 Wat Registrasie Beteken:**
• Ons stoor jou WhatsApp-nommer veilig
• Jy kan uitgawes, inkomste en finansiële gevoelens volg
• Ons bou jou finansiële profiel oor tyd
• Jou data help jou later om formele finansiële dienste te kry

**🔒 Jou Privaatheid & Data:**
• Jou inligting word veilig en privaat gehou
• Ons gebruik jou data slegs om finansiële dienste te verskaf
• Jy kan enige tyd versoek dat jou data uitgevee word
• Ons voldoen aan Suid-Afrikaanse databeskermingswette

**✅ Deur te registreer, stem jy in tot:**
• Ons Terme en Voorwaardes: https://sisonova.com/terms
• Ons Privaatheidbeleid: https://sisonova.com/privacy
• Laat ons toe om jou finansiële volgdata te stoor

**Gereed om te registreer?** Sê net:
• "Ja, ek wil registreer"
• "Ek stem in om te registreer"
• "Registreer my"

**Benodig meer inligting?** Vra my enigiets oor SisoNova!
        """
    }
    
    return {
        "success": True,
        "content": registration_info.get(language, registration_info["English"]),
        "language": language
    }


def show_unregistered_limitations(attempted_action: str) -> Dict:
    """Explain what unregistered users cannot do"""
    
    limitation_messages = {
        "track_expense": "To track expenses and build your financial profile, you need to register first.",
        "track_income": "To track income and build your financial profile, you need to register first.", 
        "track_feeling": "To track financial feelings and build your wellness profile, you need to register first.",
        "generate_report": "To generate financial reports, you need to register first.",
        "general": "To use SisoNova's financial services, you need to register first."
    }
    
    message = limitation_messages.get(attempted_action, limitation_messages["general"])
    
    return {
        "success": True,
        "message": f"🔒 {message}\n\nRegistration is quick and helps us provide you with personalized financial assistance. Would you like to learn more about registering?",
        "attempted_action": attempted_action,
        "requires_registration": True
    }


# Expenses
###############################################################################################################################################

async def save_expense(query_manager: AsyncQueries, user_id: int, amount: float, category: str, feeling: Optional[str] = None, date: Optional[str] = None) -> Dict:
    """Save an expense to the database."""
    try:
        if date is None:
            expense_date = datetime.utcnow().date()  # Keep as date object
        else:
            # If date is provided as string, convert it to date object
            expense_date = datetime.strptime(date, "%Y-%m-%d").date()

        expense = UnverifiedExpenses(
            user_id = user_id,
            expense_type = category,
            expense_amount = amount,
            expense_feeling = feeling,
            expense_date = expense_date
        )

        await query_manager.add(expense)

        return {
                "success": True,
                "message": f"Expense saved: R{amount:,.2f} for {category}",
                "amount": amount,
                "expense_id": expense.id,
                "category": category,
                "feeling": feeling
            }

    except Exception as e:
        return {"success": False, "error": str(e)}
    
async def update_expense_feeling(query_manager: AsyncQueries, user_phone_number: str, s3_bucket: SecureS3Service, user_id: int, expense_id: int, feeling: str) -> Dict:
    """Update expense with feeling and mark in context"""
    try:
        # Update in database (you'll need to add this method to query_manager)
        await query_manager.update_expense_feeling(user_id=user_id, expense_id=expense_id, feeling=feeling)
        
        return {
            "success": True,
            "message": f"Updated expense feeling to: {feeling}",
            "expense_id": expense_id,
            "feeling": feeling
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    
async def update_income_feeling(query_manager: AsyncQueries, user_phone_number: str, s3_bucket: SecureS3Service, user_id: int, income_id: int, feeling: str) -> Dict:
    """Update income with feeling and mark in context"""
    try:
        await query_manager.update_income_feeling(user_id=user_id, income_id=income_id, feeling=feeling)
        
        return {
            "success": True,
            "message": f"Updated income feeling to: {feeling}",
            "income_id": income_id,
            "feeling": feeling
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    
def save_expense_bulk() -> Dict:
    pass
    
async def get_expense_report(query_manager: AsyncQueries) -> Dict:
    pass


# Incomes
###############################################################################################################################################

async def save_income(query_manager: AsyncQueries, user_id: int, amount: float, source: str, feeling: Optional[str] = None, date: Optional[str] = None) -> Dict:
    """Save an expense to the database."""
    try:
        if date is None:
            income_date = datetime.utcnow().date()  # Keep as date object
        else:
            # If date is provided as string, convert it to date object
            income_date = datetime.strptime(date, "%Y-%m-%d").date()

        income = UnverifiedIncomes(
            user_id = user_id,
            income_type = source,
            income_amount = amount,
            income_feeling = feeling,
            income_date = income_date
        )

        await query_manager.add(income)

        return {
                "success": True,
                "message": f"Income saved: R{amount:,.2f} from {source}",
                "amount": amount,
                "income_id": income.id,
                "source": source,
                "feeling": feeling
            }

    except Exception as e:
        return {"success": False, "error": str(e)}


# Feelings
###############################################################################################################################################

async def save_feeling(query_manager: AsyncQueries, user_id: int, feeling: str, context: Optional[str] = None, date: Optional[str] = None) -> Dict:
    """Save an expense to the database."""
    try:
        if date is None:
            feeling_date = datetime.utcnow().date()  # Keep as date object
        else:
            # If date is provided as string, convert it to date object
            feeling_date = datetime.strptime(date, "%Y-%m-%d").date()


        feeling_obj = FinancialFeelings(
            user_id = user_id,
            feeling = feeling,
            reason = context,
            feeling_date = feeling_date,
        )

        await query_manager.add(feeling_obj)

        message = f"Feeling saved: {feeling}"
        if context:
            message += f"\nReason for feeling:\n({context})"

        return {
                "success": True,
                "message": message,
                "feeling": feeling,
                "feeling_id": feeling_obj,
                "context": context,
                "feeling": feeling
            }

    except Exception as e:
        return {"success": False, "error": str(e)}
    

# Language
###############################################################################################################################################

async def set_user_language_preferences(query_manager: AsyncQueries, user_id: int, display_language: str, input_language: Optional[str] = None, reason: Optional[str] = None) -> Dict:
    try:
        language_map = {
            "english": "English",
            "zulu": "Zulu", 
            "afrikaans": "Afrikaans",
            "en": "English",
            "zu": "Zulu",
            "af": "Afrikaans"
            }

        display_lang = language_map.get(display_language.lower(), display_language.title())
        input_lang = language_map.get(input_language.lower(), input_language.title()) if input_language else display_lang
        mixed_preference = display_lang != input_lang

        await query_manager.update_user_language_preference(user_id=user_id, display_language=display_lang, input_language=input_lang, mixed_preference=mixed_preference)

        if display_lang == "Zulu":
            if input_lang == "English":
                message = "✅ Kuhle! Ngizokuphendula ngesiZulu kodwa ngiyazi ukuthi uthanda ukubhala ngesiNgisi. Lokhu kulungile!"
            else:
                message = "✅ Kuhle! Ngisebenzise isiZulu manje."
        elif display_lang == "Afrikaans":
            if input_lang == "English":
                message = "✅ Wonderlik! Ek sal in Afrikaans antwoord maar ek verstaan jy verkies om in Engels te tik. Dit is perfek!"
            else:
                message = "✅ Wonderlik! Ek sal nou in Afrikaans kommunikeer."
        else:  # English
            message = "✅ Perfect! I'll communicate in English."
        
        return {
            "success": True,
            "display_language": display_lang,
            "input_language": input_lang,
            "message": message,
            "reason": reason,
            "mixed_preference": display_lang != input_lang
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    
async def get_user_language_preferences(query_manager: AsyncQueries, user_id: int) -> Dict:
    try:
        language = await query_manager.get_user_language_preference(user_id=user_id)
        return {
            "success": True,
            "display_language": language.display_language,
            "input_language": language.input_language,
            "mixed_preference": language.mixed_preference
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "display_language": "English",
            "input_language": "English",
            "mixed_preference": False
        }

async def show_language_options(current_language: str = None) -> Dict:
    """Show language selection options"""
    
    if current_language == "Zulu":
        message = """
🌍 **Khetha Ulimi Lwakho / Choose Your Language**

Ngisekela lezi zilimi:
• **English** - English
• **isiZulu** - isiZulu  
• **Afrikaans** - Afrikaans

Tshela nje uthi "Ngifuna isiZulu" noma "I want English" noma "Ek wil Afrikaans hê"
        """
    elif current_language == "Afrikaans":
        message = """
🌍 **Kies Jou Taal / Choose Your Language**

Ek ondersteun hierdie tale:
• **English** - Engels
• **isiZulu** - Zoeloe
• **Afrikaans** - Afrikaans

Sê net "Ek wil Afrikaans hê" of "I want English" of "Ngifuna isiZulu"
        """
    else:  # Default to English
        message = """
🌍 **Choose Your Language / Khetha Ulimi Lwakho**

SisoNova supports these languages:
• **English** - English
• **isiZulu** - Zulu
• **Afrikaans** - Afrikaans

Just say "I want English" or "Ngifuna isiZulu" or "Ek wil Afrikaans hê"
        """
    
    return {
        "success": True,
        "message": message,
        "current_language": current_language,
        "available_languages": ["English", "Zulu", "Afrikaans"]
    }

async def detect_message_language(message: str) -> Dict:
    """Detect language from user message"""
    
    # Simple keyword-based detection
    zulu_indicators = ["ngifuna", "sawubona", "ngiyabonga", "yebo", "cha", "kunjani", "ngiyakwazi"]
    afrikaans_indicators = ["ek wil", "dankie", "hallo", "goeie", "kan jy", "verstaan", "help"]
    english_indicators = ["i want", "hello", "thank you", "can you", "help me", "how are"]
    
    message_lower = message.lower()
    
    zulu_score = sum(1 for word in zulu_indicators if word in message_lower)
    afrikaans_score = sum(1 for word in afrikaans_indicators if word in message_lower)
    english_score = sum(1 for word in english_indicators if word in message_lower)
    
    if zulu_score > afrikaans_score and zulu_score > english_score:
        detected = "Zulu"
        confidence = min(0.9, 0.5 + (zulu_score * 0.1))
    elif afrikaans_score > english_score:
        detected = "Afrikaans"
        confidence = min(0.9, 0.5 + (afrikaans_score * 0.1))
    else:
        detected = "English"
        confidence = min(0.9, 0.5 + (english_score * 0.1))
    
    return {
        "success": True,
        "detected_language": detected,
        "confidence": confidence,
        "message": message
    }

async def get_user_language(user_id: int, query_manager: AsyncQueries) -> Dict:

    try:

        language = await query_manager.get_user_language_preference(user_id=user_id)
        return {
            "success": True,
            "preferred_language": language
        }

    except Exception as e:

        return {
            "success": False,
            "default_language": "English",
            "error": str(e)
        }

# Services
###############################################################################################################################################

def show_sisonova_services(service_type: str = "overview") -> Dict:
    """Show SisoNova services information"""
    
    if service_type == "overview" or service_type == "all":
        overview = """
🌟 **Welcome to SisoNova Financial Services!** 🌟

SisoNova is designed specifically for South Africans who want to build a stronger financial future. We help you track your money, understand your spending patterns, and build a financial profile that can help you access formal financial services.

**🏠 SisoNova Personal**
Your personal financial assistant that helps you:
• Track expenses and income easily
• Record how you feel about money (financial wellness)
• Get detailed reports and insights
• Build your financial profile over time
• Process receipt photos automatically

**🌍 SisoNova Public** 
Community financial resources including:
• Shared financial education content
• Community support programs  
• Group savings challenges
• Financial literacy resources

**💡 Why SisoNova?**
• Built for the unbanked and underserved
• No complex forms or rigid formats
• Just chat naturally about your money
• Build data that banks and lenders trust
• Free to start, powerful insights included

**Ready to begin?** Just tell me what you'd like to do, like:
• "I want to track my spending"
• "Show me how SisoNova Personal works"
• "I spent money today"
• "Help me get started"
        """
        
        if service_type == "all":
            overview += "\n\n" + show_personal_capabilities(detailed=True)["content"]
        
        return {
            "success": True,
            "content": overview,
            "service_type": service_type
        }
    
    elif service_type == "personal":
        return show_personal_capabilities(detailed=True)
    
    elif service_type == "public":
        return {
            "success": True,
            "content": """
🌍 **SisoNova Public - Community Financial Resources**

**📚 Financial Education**
• Budgeting basics for South African families
• Understanding credit and how to build it
• Savings strategies that work with irregular income
• How to prepare for financial emergencies

**🤝 Community Support**
• Connect with others on similar financial journeys
• Share tips and success stories
• Group challenges and savings goals
• Peer support for financial stress

**🎯 Group Programs**
• Stokvel integration and tracking
• Family financial planning tools
• Community investment education
• Local business support resources

**📱 How to Access:**
Currently in development! SisoNova Personal is available now and helps you build the foundation for community features.

Want to start with Personal services? Just say "I want to track my money" or "Show me Personal services"
            """,
            "service_type": "public"
        }

def show_personal_capabilities( detailed: bool = False) -> Dict:
    """Show SisoNova Personal capabilities"""
    
    if detailed:
        content = """
🏠 **SisoNova Personal - Your AI Financial Assistant**

**💰 EXPENSE TRACKING**
Just tell me naturally when you spend money:
• "I spent R50 on groceries at Shoprite"
• "Paid rent today, R3500, feeling stressed"
• "Bought airtime R30"
• "Taxi to work was R25, expensive today"

**📈 INCOME TRACKING** 
Tell me when you earn money:
• "Got paid R4500 from my job, feeling good"
• "Made R200 from selling vegetables"
• "Received R150 from cleaning job"

**💭 FINANCIAL FEELINGS**
Share how money makes you feel:
• "I'm worried about money this month"
• "Feeling good about my savings"
• "Stressed about unexpected expenses"

**📊 REPORTS & INSIGHTS**
Get detailed analysis:
• "Show me my expense report"
• "How am I doing this month?"
• "What's my biggest spending category?"
• "Generate my financial summary"

**📸 RECEIPT PROCESSING** (Coming Soon)
• Send photos of receipts
• Automatic expense extraction
• Higher verification for your financial profile

**🎯 WHY TRACK WITH SISONOVA?**
• Build a financial history that banks trust
• Identify where you can save money
• Understand your spending patterns
• Prepare for loans, credit, formal banking
• Track progress toward financial goals

**🚀 GETTING STARTED IS EASY:**
1. Just start telling me about your money
2. I'll ask questions to understand better
3. I'll save everything securely
4. You'll get insights and reports
5. Build your financial profile over time

**Ready to start?** Try saying something like:
"I bought groceries for R150 today"
        """
    else:
        content = """
🏠 **SisoNova Personal Services:**

• 💰 Track expenses naturally
• 📈 Record income easily  
• 💭 Monitor financial feelings
• 📊 Get detailed reports
• 🎯 Build your financial profile

Say "show me detailed Personal info" for examples and instructions.
        """
    
    return {
        "success": True,
        "content": content,
        "detailed": detailed
    }

def show_getting_started_guide( user_type: str = "complete_beginner") -> Dict:
    """Show getting started guide"""
    
    if user_type == "complete_beginner":
        guide = """
🎯 **Getting Started with SisoNova - Complete Beginner's Guide**

**STEP 1: Understand What We Do**
SisoNova helps you track your money to build a financial profile. Think of it as your personal money diary that becomes valuable data for your future.

**STEP 2: Start Simple - Track One Thing**
Don't worry about being perfect. Just start with ONE thing:
• Next time you buy something, tell me: "I spent R[amount] on [what]"
• Example: "I spent R25 on bread"

**STEP 3: Add How You Feel (Optional)**
Money affects emotions. You can add:
• "I spent R25 on bread, feeling okay"
• "I spent R25 on bread, worried about money"

**STEP 4: Try It Right Now!**
Think of something you bought recently and tell me about it. I'll show you how easy it is.

**STEP 5: See Your Progress**
After a few days, ask me:
• "Show me my spending report"
• "How am I doing?"

**🌟 Remember:**
• No wrong way to start
• I understand natural language
• Every entry builds your financial profile
• You're taking control of your financial future!

**Ready to try?** Tell me about something you bought recently!
        """
    
    elif user_type == "has_some_data":
        guide = """
📈 **Welcome Back! Let's Build on Your Progress**

I can see you already have some financial data tracked. Great start! 

**NEXT STEPS TO MAXIMIZE SISONOVA:**

**1. Make It a Daily Habit**
• Track expenses as they happen
• "I just spent R15 on taxi"
• "Bought lunch R45"

**2. Include Your Feelings**
• "Paid electricity R200, stressed"
• "Got paid today R3000, relieved"

**3. Use Reports for Insights**
• "Show me my expense report"
• "What's my biggest spending category?"
• "How am I doing this month?"

**4. Set Simple Goals**
• "I want to spend less on transport"
• "I'm trying to save R500 this month"

**Want to see your current progress?** Ask me:
• "Show me my expense report"
• "How much have I spent this month?"
        """
    
    else:  # returning_user
        guide = """
👋 **Welcome Back to SisoNova!**

**QUICK REFRESHER:**
• Tell me about expenses: "I spent R[amount] on [category]"
• Record income: "I earned R[amount] from [source]"
• Share feelings: "I'm feeling [emotion] about money"
• Get reports: "Show me my [expense/income/feelings] report"

**NEW FEATURES YOU MIGHT HAVE MISSED:**
• More detailed financial insights
• Better spending pattern analysis
• Improved report generation

**CONTINUE WHERE YOU LEFT OFF:**
• "Show me my recent activity"
• "How am I doing this month?"
• "What's changed since last time?"

Ready to continue your financial journey?
        """
    
    return {
        "success": True,
        "content": guide,
        "user_type": user_type
    }

# Metadata
###############################################################################################################################################


async def get_user_financial_context(user_id: int, query_manager: AsyncQueries, s3_bucket: SecureS3Service, period_days: Optional[int] = 30) -> Dict:
    """Get a user's financial context."""
    user_financial_context = await query_manager.get_user_financial_context(user_id=user_id, period_days=period_days)
    return user_financial_context

async def get_recent_transactions(query_manager: AsyncQueries, user_id: int, record_type: str, limit: int = 5) -> Dict:
    """Get recent transactions for the user"""
    try:
        transactions = []
        if record_type == "expense":
            # Get recent expenses
            expenses = await query_manager.get_user_expenses(user_id)
            recent_expenses = expenses[-limit:] if expenses else []

            for expense in recent_expenses:
                transactions.append({
                    "type": "expense",
                    "id": expense.id,
                    "amount": expense.expense_amount,
                    "category": expense.expense_type,
                    "feeling": expense.expense_feeling,
                    "date": expense.expense_date.isoformat() if expense.expense_date else None,
                    "needs_feeling": expense.expense_feeling is None
                })
        
        if record_type == "income":
            # Get recent incomes
            incomes = await query_manager.get_user_incomes(user_id)
            recent_incomes = incomes[-limit:] if incomes else []
            
            for income in recent_incomes:
                transactions.append({
                    "type": "income", 
                    "id": income.id,
                    "amount": income.income_amount,
                    "source": income.income_type,
                    "feeling": income.income_feeling,
                    "date": income.income_date.isoformat() if income.income_date else None,
                    "needs_feeling": income.income_feeling is None
                })
        
        # Sort by date (most recent first)
        transactions.sort(key=lambda x: x["date"] or "", reverse=True)
        
        return {
            "success": True,
            "transactions": transactions[:limit],
            "total_found": len(transactions),
            "record_type": record_type
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}
    

# Misc
###############################################################################################################################################

async def main():
    db_manager = DatabaseManager(db_url='sqlite+aiosqlite:///test_db.db')

    # Use async context manager
    async with db_manager.session_scope() as db_session:
        query_manager = AsyncQueries(session=db_session)

        # Await the async function
        user_financial_context = await get_user_financial_context(user_id="1", query_manager=query_manager)
        print(user_financial_context)


if __name__ == "__main__":
    asyncio.run(main())

