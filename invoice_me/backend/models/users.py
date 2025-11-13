from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from auth import AuthProvider
from models.business import BusinessProfile

class CreateUserProfile(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password_hash: Optional[str] = Field(..., description="The hashed password of the user")
    auth_provider: AuthProvider = Field(..., description="The authentication provider for the user")

class UserProfile(BaseModel):
    email: str = Field(..., description="The user's email address")
    business_profile: BusinessProfile = Field(..., description="The business profile associated with the user")
