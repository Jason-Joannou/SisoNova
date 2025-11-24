from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from enum import Enum

class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"

class EntityAccessId(str, Enum):
    USER = "user"
    LLM = "llm"

class TokenAccessType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


class TokenInfo(BaseModel):
    sub: str = Field(..., description="The subject identifier for the token")
    exp: int = Field(..., description="The expiration timestamp of the token")
    type: str = Field(..., description="The type of the token, e.g., access or refresh")

    @field_validator("sub")
    @classmethod
    def validate_sub(cls, v: str) -> str:
        split_sub = v.split(":")
        if len(split_sub) != 2:
            raise ValueError("Invalid subject format. Expected format: '<entity>:<identifier>'")
        
        valid_entities = [e.value for e in EntityAccessId]
        if split_sub[0] not in valid_entities:
            raise ValueError(f"Invalid entity. Must be one of: {valid_entities}")
        
        return v
    
    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        valid_types = [t.value for t in TokenAccessType]
        if v not in valid_types:
            raise ValueError(f"Invalid token type. Must be one of: {valid_types}")
        
        return v

class UserBaseParameters(BaseModel):
    email: EmailStr = Field(..., description="The user's email address")
    password: str = Field(..., description="The password of the user")

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





