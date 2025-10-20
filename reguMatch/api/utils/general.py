import re

def to_snake_case(text: str) -> str:
    """Convert any string to snake_case"""
    text = text.replace(' ', '_').replace('-', '_')
    text = text.lower()
    text = re.sub('_+', '_', text)
    text = text.strip('_')
    return text