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
                "registration_date": user[2],
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
        user_info = check_user_registration(phone_number=phone_number, query_manager=query_manager)
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
    
def show_registration_info(self, language: str = "English") -> Dict:
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


def show_unregistered_limitations(self, attempted_action: str) -> Dict:
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
            date = datetime.utcnow().date()
            date_str = date.strftime("%Y-%m-%d")

        expense = UnverifiedExpenses(
            user_id = user_id,
            expense_type = category,
            expense_amount = amount,
            expense_feeling = feeling,
            expense_date = date_str
        )

        await query_manager.add(expense)

        return {
                "success": True,
                "message": f"Expense saved: R{amount:,.2f} for {category}",
                "amount": amount,
                "category": category,
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
            date = datetime.utcnow().date()
            date_str = date.strftime("%Y-%m-%d")

        expense = UnverifiedIncomes(
            user_id = user_id,
            income_type = source,
            income_amount = amount,
            income_feeling = feeling,
            income_date = date_str
        )

        await query_manager.add(expense)

        return {
                "success": True,
                "message": f"Income saved: R{amount:,.2f} from {source}",
                "amount": amount,
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
            date = datetime.utcnow().date()
            date_str = date.strftime("%Y-%m-%d")


        expense = FinancialFeelings(
            user_id = user_id,
            feeling = feeling,
            reason = context,
            feeling_date = date_str,
        )

        await query_manager.add(expense)

        message = f"Feeling saved: {feeling}"
        if context:
            message += f"\nReason for feeling:\n({context})"

        return {
                "success": True,
                "message": message,
                "feeling": feeling,
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


# Metadata
###############################################################################################################################################


async def get_user_financial_context(user_id: int, query_manager: AsyncQueries, s3_bucket: SecureS3Service, period_days: Optional[int] = 30) -> Dict:
    """Get a user's financial context."""
    user_financial_context = await query_manager.get_user_financial_context(user_id=user_id, period_days=period_days)
    conversation_object = await get_user_conversation_state(user_id, s3_service=s3_bucket)
    if conversation_object['exists']:
        user_financial_context['conversation_context'] = conversation_object['conversation']
    return user_financial_context

async def get_user_conversation_state(user_phone_number: str, s3_service: SecureS3Service) -> Dict:
    """
    Retrieve the most recent conversation state for a user from S3.

    Args:
        user_phone_number: The phone number of the user.
        s3_service: An instance of the SecureS3Service.

    Returns:
        A dict with keys:
            - 'exists' (bool): Whether a conversation history was found.
            - 'conversation' (Dict or None): The conversation history if found, else None.
    """
    prefix = f"{user_phone_number}/conversations/"
    try:
        response = s3_service.s3_client.list_objects_v2(
            Bucket=s3_service.bucket_name,
            Prefix=prefix
        )

        if 'Contents' not in response or not response['Contents']:
            return {'exists': False, 'conversation': None}

        # Find the most recent file
        sorted_objects = sorted(
            response['Contents'],
            key=lambda obj: obj['LastModified'],
            reverse=True
        )

        latest_key = sorted_objects[0]['Key']

        obj = s3_service.s3_client.get_object(
            Bucket=s3_service.bucket_name,
            Key=latest_key
        )
        conversation_data = json.loads(obj['Body'].read().decode('utf-8'))

        return {'exists': True, 'conversation': conversation_data}

    except Exception as e:
        logger.error(f"Error retrieving conversation history: {e}")
        return {'exists': False, 'conversation': None}
    

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

