from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from api.middleware.utils import validate_twilio_request
from api.db.query_manager import AsyncQueries
from api.db.db_manager import DatabaseManager
from api.utils.twilio_templates import TwilioTemplateManager
from api.db.models.tables import User, MessageState, LanguagePreference, UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings
from api.utils.template_actions import create_poc_dummy_data_south_africa
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

router = APIRouter(
    prefix="/api/twilio",
    tags=["twilio"],
    responses={404: {"description": "Not Found"}},
)


@router.post("/whatsapp")
async def twilio_webhook(form_data: dict = Depends(validate_twilio_request)):
    """Handle incoming WhatsApp messages from Twilio."""
    logging.info("Received WhatsApp message from Twilio")
    # Database Manager
    db_manager = DatabaseManager(db_url='sqlite+aiosqlite:///test_db.db')
    
    # Use async context manager properly
    async with db_manager.session_scope() as db_session:
        # Query Manager
        query_manager = AsyncQueries(session=db_session)

        # Extract message details
        message_body = form_data.get("Body", "")
        from_number = form_data.get("From", "")

        # Check if the user exists in your database
        user = await query_manager.get_user_by_phone(phone_number=from_number)
        
        if user is None:
            # User not found, set template
            template_manager = TwilioTemplateManager(
                user_exists=False,
                user_response=message_body,
                current_template=None,
                language=None,
                has_started=False  # New users haven't started
            )

            # Insert User to database
            new_user = User(phone_number=from_number)
            await query_manager.add(new_user)

            # Update Language Preference (start with None)
            language_preference = LanguagePreference(
                user_id=new_user.id,
                preferred_language=None
            )
            await query_manager.add(language_preference)

            logging.info("User not found, set template")
            logging.info("Initializing tables for new user")

            # Get the template message
            next_template, previous_template, twiml_message = template_manager.get_template_message()
            
            # Create message state (will stay on language selector)
            new_message_state = MessageState(
                user_id=new_user.id,
                current_state=next_template,
                previous_state=previous_template,
                has_started=True
            )
            await query_manager.add(new_message_state)

            return PlainTextResponse(content=twiml_message, media_type="application/xml")
        
        logging.info("User found, set template")

        # Get conversation state
        user_message_state = await query_manager.get_user_message_state(user_id=user.id)
        # Get user language preference
        language_preference = await query_manager.get_user_language_preference(user_id=user.id)

        print(f"DEBUG: Current state: {user_message_state.current_state}")
        print(f"DEBUG: Has started: {user_message_state.has_started}")
        print(f"DEBUG: Current language: {language_preference.preferred_language}")
        print(f"DEBUG: User message: '{message_body}'")

        # Create template manager to process the current response
        template_manager = TwilioTemplateManager(
            user_exists=True,
            user_response=message_body,
            current_template=user_message_state.current_state,
            language=language_preference.preferred_language,
            has_started=user_message_state.has_started
        )

        # Get the response (this handles all the logic)
        next_template, previous_template, twiml_message = template_manager.get_template_message()

        # Check if language was selected and update database
        selected_language = template_manager.get_selected_language()
        if selected_language:
            print(f"DEBUG: Language selected: {selected_language}")
            await query_manager.update_user_language_preference(user_id=user.id, new_language=selected_language)

        # Update the database state
        await query_manager.update_current_message_state(user_id=user.id, new_state=next_template)
        if previous_template:
            await query_manager.update_previous_message_state(user_id=user.id, new_state=previous_template)

        logging.info("Response processed, returning TwiML")
        
        return PlainTextResponse(content=twiml_message, media_type="application/xml")
    
@router.post("/whatsapp/poc")
async def twilio_webhook_poc(form_data: dict = Depends(validate_twilio_request)):
    """Handle incoming WhatsApp messages from Twilio with South African dummy data for POC."""
    logging.info("Received WhatsApp message from Twilio (POC)")
    # Database Manager
    db_manager = DatabaseManager(db_url='sqlite+aiosqlite:///test_db.db')
    
    # Use async context manager properly
    async with db_manager.session_scope() as db_session:
        # Query Manager
        query_manager = AsyncQueries(session=db_session)

        # Extract message details
        message_body = form_data.get("Body", "")
        from_number = form_data.get("From", "")

        # Check if the user exists in your database
        user = await query_manager.get_user_by_phone(phone_number=from_number)
        
        if user is None:
            # User not found, set template
            template_manager = TwilioTemplateManager(
                user_exists=False,
                user_response=message_body,
                current_template=None,
                language=None,
                has_started=False  # New users haven't started
            )

            # Insert User to database
            new_user = User(phone_number=from_number)
            await query_manager.add(new_user)

            # Update Language Preference (start with None)
            language_preference = LanguagePreference(
                user_id=new_user.id,
                preferred_language=None
            )
            await query_manager.add(language_preference)

            logging.info("User not found, set template")
            logging.info("Initializing tables for new user")

            # ===== SOUTH AFRICAN POC DUMMY DATA GENERATION =====
            logging.info("Generating South African lower-income dummy data for POC user")
            from api.utils.template_actions import create_poc_dummy_data_south_africa
            
            dummy_data_list = await create_poc_dummy_data_south_africa(new_user)
            
            # Add all dummy data to database
            for data_type, data_dict in dummy_data_list:
                if data_type == 'expense':
                    expense_record = UnverifiedExpenses(**data_dict)
                    await query_manager.add(expense_record)
                elif data_type == 'income':
                    income_record = UnverifiedIncomes(**data_dict)
                    await query_manager.add(income_record)
                elif data_type == 'feeling':
                    feeling_record = FinancialFeelings(**data_dict)
                    await query_manager.add(feeling_record)
            
            logging.info(f"Generated {len(dummy_data_list)} South African dummy records for POC user")
            # ===== END DUMMY DATA GENERATION =====

            # Get the template message
            next_template, previous_template, twiml_message = await template_manager.get_template_message()
            
            # Create message state (will stay on language selector)
            new_message_state = MessageState(
                user_id=new_user.id,
                current_state=next_template,
                previous_state=previous_template,
                has_started=True
            )
            await query_manager.add(new_message_state)

            return PlainTextResponse(content=twiml_message, media_type="application/xml")
        
        # Rest of your existing logic for existing users...
        logging.info("User found, set template")

        # Get conversation state
        user_message_state = await query_manager.get_user_message_state(user_id=user.id)
        # Get user language preference
        language_preference = await query_manager.get_user_language_preference(user_id=user.id)

        print(f"DEBUG: Current state: {user_message_state.current_state}")
        print(f"DEBUG: Has started: {user_message_state.has_started}")
        print(f"DEBUG: Current language: {language_preference.preferred_language}")
        print(f"DEBUG: User message: '{message_body}'")

        # Create template manager to process the current response
        template_manager = TwilioTemplateManager(
            user_exists=True,
            user_response=message_body,
            current_template=user_message_state.current_state,
            language=language_preference.preferred_language,
            has_started=user_message_state.has_started,
            user_object=user
        )

        # Get the response (this handles all the logic)
        next_template, previous_template, twiml_message = await template_manager.get_template_message()

        # Check if language was selected and update database
        selected_language = template_manager.get_selected_language()
        if selected_language:
            print(f"DEBUG: Language selected: {selected_language}")
            await query_manager.update_user_language_preference(user_id=user.id, new_language=selected_language)

        # Update the database state
        await query_manager.update_current_message_state(user_id=user.id, new_state=next_template)
        if previous_template:
            await query_manager.update_previous_message_state(user_id=user.id, new_state=previous_template)

        logging.info("Response processed, returning TwiML")
        
        return PlainTextResponse(content=twiml_message, media_type="application/xml")

@router.post("/status")
async def twilio_status_callback(form_data: dict = Depends(validate_twilio_request)):
    """Handle message status callbacks from Twilio."""
    message_sid = form_data.get("MessageSid", "")
    message_status = form_data.get("MessageStatus", "")
    
    # Update your database or take action based on status
    print(f"Message SID: {message_sid}, Status: {message_status}")
    
    return JSONResponse(status_code=200, content={"status": "received"})