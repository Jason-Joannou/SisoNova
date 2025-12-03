from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from models.auth import AuthProvider, TokenResponse
from models.business import BusinessProfile
from enum import Enum

class UserSubscriptionTier(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"

class User(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password_hash: Optional[str] = Field(..., description="The hashed password of the user")
    auth_provider: AuthProvider = Field(..., description="The authentication provider for the user")
    subscription_tier: UserSubscriptionTier = Field(..., description="The subscription tier of the user")
    created_at: Optional[str] = Field(None, description="The timestamp when the user was created")
    updated_at: Optional[str] = Field(None, description="The timestamp when the user was last updated")
    business_profile: List[BusinessProfile] = Field([], description="The business profile associated with the user")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password_hash: Optional[str] = None
    auth_provider: Optional[str] = None
    subscription_tier: Optional[str] = None

class VerifyUser(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password_hash: str = Field(..., description="The hashed password of the user")

class UserProfile(BaseModel):
    email: str = Field(..., description="The user's email address")
    business_profile: List[BusinessProfile] = Field([], description="The business profile associated with the user")

class AuthenticatedUserResponse(TokenResponse):
    user: UserProfile = Field(..., description="The authenticated user's profile")

