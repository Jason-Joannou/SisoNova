from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from enum import Enum

class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"

class UserBaseParameters(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password_hash: str = Field(..., description="The hashed password of the user")

class UserLoginParameters(UserBaseParameters):
    pass

class UserCreateParameters(UserBaseParameters):
    pass

class UserBaseResponse(BaseModel):
    success: bool = Field(..., description="Indicates if the operation was successful")
    message: str = Field(..., description="A message indicating the success or failure of the operation")
    error: Optional[str] = Field(None, description="Error message if the operation failed")

class TokenResponse(BaseModel):
    access_token: str = Field(..., description="The access token for authentication")
    token_type: str = Field(..., description="The type of the token, typically 'bearer'")
    refresh_token: str = Field(..., description="The refresh token for obtaining new access tokens")





