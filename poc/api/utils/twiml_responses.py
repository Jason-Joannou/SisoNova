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

def generate_twiml_message(msgs: List[Dict[str, str]]):
    response = MessagingResponse()
    message = Message()

    for msg in msgs:
        for msg_type, msg_content in msg.items():
            if msg_type == "body":
                message.body(msg_content)
            elif msg_type == "media_url":
                message.media(msg_content)
            elif msg_type == "redirect":
                message.redirect(msg_content)

    response.message(message)

    return str(response)

