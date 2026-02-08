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
    supabase_id: str = Field(..., description="The Supabase ID of the user")
    email: EmailStr = Field(..., description="The user's email address")
    auth_provider: str = Field(..., description="The authentication provider for the user")
    subscription_tier: UserSubscriptionTier = Field(..., description="The subscription tier of the user")
    preferred_business_profile: Optional[str] = Field(None, description="The preferred business profile for the user")
    created_at: Optional[str] = Field(None, description="The timestamp when the user was created")
    updated_at: Optional[str] = Field(None, description="The timestamp when the user was last updated")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password_hash: Optional[str] = None
    auth_provider: Optional[str] = None
    preferred_business_profile: Optional[str] = None
    subscription_tier: Optional[str] = None

class VerifyUser(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password_hash: str = Field(..., description="The hashed password of the user")

class UserProfile(BaseModel):
    email: str = Field(..., description="The user's email address")
    preferred_business_profile: Optional[str] = Field(None, description="The preferred business profile for the user")
    business_profile: Optional[BusinessProfile] = Field(None, description="The business profile associated with the user")

class AuthenticatedUserResponse(TokenResponse):
    user: UserProfile = Field(..., description="The authenticated user's profile")

