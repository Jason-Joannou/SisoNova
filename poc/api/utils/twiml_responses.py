# This might be deleted later but will be used for
# testing while we wait for whatsapp business approval


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
