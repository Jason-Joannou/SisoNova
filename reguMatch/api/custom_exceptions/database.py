from api.models.utils import URLVerificationResult
class URLVerificationException(Exception):
    """Exception raised when URL verification fails"""
    
    def __init__(self, message:str) -> None:
        super().__init__(message)