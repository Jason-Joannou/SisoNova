# This might be deleted later but will be used for
# testing while we wait for whatsapp business approval
from typing import List, Dict
from twilio.twiml.messaging_response import (
    Body,
    Media,
    Message,
    MessagingResponse,
    Redirect,
)

def generate_twiml_message(msgs: List[Dict[str, str]]) -> str:
    """
    Generate TwiML response from a list of message dictionaries.
    
    Args:
        msgs: List of dictionaries containing message content
              Each dict can have keys: 'body', 'media_url', 'redirect'
    
    Returns:
        String representation of TwiML response
    """
    response = MessagingResponse()
    
    for msg in msgs:
        # Create a new message for each msg dict
        message = response.message()
        
        for msg_type, msg_content in msg.items():
            if msg_type == "body":
                message.body(msg_content)
            elif msg_type == "media_url":
                message.media(msg_content)
            elif msg_type == "redirect":
                message.redirect(msg_content)

    return str(response)

