# This might be deleted later but will be used for
# testing while we wait for whatsapp business approval

from models.inbound_responses import LanguageSelector
from twilio.twiml.messaging_response import (
    Body,
    Media,
    Message,
    MessagingResponse,
    Redirect,
)

TEMPLATES = {
    "unregistered_number_language_selector_template": {
        "inbound_response_model": LanguageSelector,
        "template_error_message": "error",
    }
}


def twiml_image_response() -> str:
    twiml_response = """
    <?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Message>
                <Body>NASA Earth image</Body>
                <Media>https://images-assets.nasa.gov/image/PIA00342/PIA00342~thumb.jpg</Media>
            </Message>
        </Response>
    """
    return twiml_response


def twiml_unregistered_response() -> str:
    twiml_response = """
    <?xml version ="1.0" encoding="UTF-8"?>
        <Response>
            <Message>
                <Body>
                    Hi there 👋 , and welcome to SisoNova’s financial assistance service.

We believe that financial conversations are most effective when they happen in a language you’re comfortable with. 

To help you feel confident and understood every step of the way, please select your preferred language to continue. 

(You can change this anytime later.)
                </Body>
            </Message>
        </Response>
    """

    return twiml_response
