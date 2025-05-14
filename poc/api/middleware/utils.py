import logging
import os
from fastapi import Request, Header, HTTPException
from twilio.request_validator import RequestValidator
from dotenv import load_dotenv
from typing import List, Dict, Optional
import logging.handlers

load_dotenv()
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
api_key = os.getenv("API_KEY", "test_key")

validator = RequestValidator(auth_token)

logger = logging.getLogger("middleware-utils")
logger.setLevel(logging.INFO)

async def validate_twilio_request(
    request: Request,
    x_twilio_signature: Optional[str] = Header(None)
):
    """Validate that the request is coming from Twilio."""
    if request.state.endpoint_type != "twilio":
        # Skip validation for non-Twilio endpoints
        return await request.form()
        
    if not x_twilio_signature:
        logger.warning(f"Missing Twilio signature from {request.client.host}")
        raise HTTPException(status_code=403, detail="Missing Twilio signature")
    
    # Get the full URL of the request
    url = str(request.url)
    
    # Get the request body as form data
    form_data = await request.form()
    form_dict = dict(form_data)
    
    # Validate the request using Twilio's validator
    if not validator.validate(url, form_dict, x_twilio_signature):
        logger.warning(f"Invalid Twilio signature from {request.client.host}")
        raise HTTPException(status_code=403, detail="Invalid Twilio signature")
    
    logger.info(f"Valid Twilio request validated")
    return form_data


async def validate_admin_request(
    request: Request,
    x_api_key: Optional[str] = Header(None)
):
    """Validate that the request has a valid admin API key."""
    if request.state.endpoint_type != "admin":
        # Skip validation for non-admin endpoints
        return
        
    if not x_api_key:
        logger.warning(f"Missing API key from {request.client.host}")
        raise HTTPException(status_code=403, detail="Missing API key")
    
    if x_api_key != api_key:
        logger.warning(f"Invalid API key from {request.client.host}")
        raise HTTPException(status_code=403, detail="Invalid API key")
    
    logger.info(f"Valid admin request validated")
    return True