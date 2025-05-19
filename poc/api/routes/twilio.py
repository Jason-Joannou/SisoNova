from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from middleware.utils import validate_twilio_request
from utils.twiml_responses import twiml_image_response

router = APIRouter(
    prefix="/api/twilio",
    tags=["twilio"],
    responses={404: {"description": "Not Found"}},
)


@router.post("/whatsapp")
async def twilio_webhook(form_data: dict = Depends(validate_twilio_request)):
    """Handle incoming WhatsApp messages from Twilio."""
    # Extract message details
    message_body = form_data.get("Body", "")
    from_number = form_data.get("From", "")

    # Your business logic here
    response_message = f"You said: {message_body}"

    # Return TwiML response
    twiml_response = twiml_image_response()

    return PlainTextResponse(content=twiml_response, media_type="application/xml")

@router.post("/status")
async def twilio_status_callback(form_data: dict = Depends(validate_twilio_request)):
    """Handle message status callbacks from Twilio."""
    message_sid = form_data.get("MessageSid", "")
    message_status = form_data.get("MessageStatus", "")
    
    # Update your database or take action based on status
    print(f"Message SID: {message_sid}, Status: {message_status}")
    
    return JSONResponse(status_code=200, content={"status": "received"})