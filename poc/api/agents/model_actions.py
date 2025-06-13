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
    
async def register_new_user(phone_number: str, consent_given: bool, query_manager: AsyncQueries, language_preference: str = "English") -> Dict:

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
                preferred_language=language_preference
            )

            await query_manager.add(language)

            welcome_messages = {
            "English": "🎉 Welcome to SisoNova! You're now registered and can start tracking your finances to build your financial profile.",
            "Zulu": "🎉 Wamukelekile ku-SisoNova! Manje usebhalisiwe futhi ungaqala ukugcina imali yakho ukuze wakhe iphrofayela yakho yezimali.",
            "Afrikaans": "🎉 Welkom by SisoNova! Jy is nou geregistreer en kan begin om jou finansies te volg om jou finansiële profiel te bou."
            }

            return {
            "success": True,
            "message": welcome_messages.get(language_preference, welcome_messages["English"]),
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

