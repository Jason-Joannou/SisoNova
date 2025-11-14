from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from auth import AuthProvider
from models.business import BusinessProfile
from enum import Enum

class UserSubscriptionTier(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"

class CreateUserProfile(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password_hash: Optional[str] = Field(..., description="The hashed password of the user")
    auth_provider: AuthProvider = Field(..., description="The authentication provider for the user")
    subscription_tier: UserSubscriptionTier = Field(..., description="The subscription tier of the user")
    created_at: Optional[str] = Field(None, description="The timestamp when the user was created")
    updated_at: Optional[str] = Field(None, description="The timestamp when the user was last updated")

class UserProfile(BaseModel):
    email: str = Field(..., description="The user's email address")
    business_profile: BusinessProfile = Field(..., description="The business profile associated with the user")


