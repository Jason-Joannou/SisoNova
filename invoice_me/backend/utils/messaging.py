import re

def is_e164_format(number: str) -> bool:
    """
    Checks if a number is in e164 format.

    The requirments for this format to be correct are:

        - Must begin with a '+'
        - Followed by country code and subscriber number (digits only)
        - No spaces, dashes, parenthesis
        - Total digits after the '+' should be between 1 and 15

    Args:
        number (str): The number to check against

    Returns:
        bool: Whether the number matches the regex pattern
    """
    pattern = re.compile(r"^\+[1-9]\d{1,14}$")
    return bool(pattern.match(number))