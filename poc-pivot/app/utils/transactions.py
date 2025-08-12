import secrets
from models.transactions import UnverifiedTransaction
import jwt

# MOVE TO ENV
SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"

async def calculate_user_validity_score():
    pass

def encode_unverified_transaction_data(transaction_data: UnverifiedTransaction) -> str:
    """Encode unverified transaction data using a secret key."""
    token = jwt.encode(transaction_data.model_dump(), SECRET_KEY, algorithm=ALGORITHM)
    return token