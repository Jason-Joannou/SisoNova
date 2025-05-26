from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from api.middleware.utils import validate_twilio_request
from api.db.query_manager import AsyncQueries
from api.db.db_manager import DatabaseManager
from api.utils.twilio_templates import TwilioTemplateManager
from api.db.models.tables import User, MessageState, LanguagePreference
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
    db_manager = DatabaseManager(db_url='sqlite+aiosqlite:///test_db.db') # This will need to be read from an environment variable
    
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
                language=None
            )

            # Insert User to database
            new_user = User(phone_number=from_number)
            await query_manager.add(new_user)

            # Update Language Preference
            language_preference = LanguagePreference(
                user_id=new_user.id,
                preferred_language=None
            )
            await query_manager.add(language_preference)

            logging.info("User not found, set template")
            logging.info("Initializing tables for new user")

            # Get the template message (now returns tuple)
            next_template, previous_template, twiml_message = template_manager.get_template_message()
            
            # Update conversation state - you should update existing record, not create new one
            new_message_state = MessageState(
                user_id=new_user.id,
                current_state=next_template,
                previous_state=previous_template
            )
            await query_manager.add(new_message_state)

            return PlainTextResponse(content=twiml_message, media_type="application/xml")
        
        logging.info("User found, set template")
        
        # Get conversation state
        user_message_state = await query_manager.get_user_message_state(user_id=user.id)

        # Get user language preference
        language_preference = await query_manager.get_user_language_preference(user_id=user.id)

        # Create template manager to process the current response
        template_manager = TwilioTemplateManager(
            user_exists=True,
            user_response=message_body,
            current_template=user_message_state.current_state,
            language=language_preference.preferred_language
        )

        # Get the response (this will trigger validation and language detection)
        next_template, previous_template, twiml_message = template_manager.get_template_message()

        # Check if user selected a new language and update it
        selected_language = template_manager.get_selected_language()
        if selected_language is not None:
            logging.info(f"User selected new language: {selected_language}")
            await query_manager.update_user_language_preference(user_id=user.id, new_language=selected_language)
            
            # Recreate template manager with new language for the NEXT template
            template_manager = TwilioTemplateManager(
                user_exists=True,
                user_response=message_body,
                current_template=user_message_state.current_state,
                language=selected_language
            )
            
            # Regenerate the message with the new language
            next_template, previous_template, twiml_message = template_manager.get_template_message()

        # ADD THESE LINES - Update the database state
        await query_manager.update_current_message_state(user_id=user.id, new_state=next_template)
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