from fastapi import APIRouter, status
from fastapi.exceptions import HTTPException
from models.auth import UserLoginParameters, TokenResponse
from models.users import UserProfile
from services.auth import AuthenticationService, AuthorizationService
from models.auth import EntityAccessId


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/login", response_model=TokenResponse, description="Authenticate a user and return tokens", status_code=status.HTTP_200_OK)
async def login(user: UserLoginParameters) -> TokenResponse:
    # Authenticate user
    authenticated = AuthenticationService.authenticate_user(user.email, user.password)
    
    if not authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token = AuthorizationService.create_access_token(
        subject_info=user.email,
        entity=EntityAccessId.USER  # Adjust based on your EntityAccessId enum
    )
    
    refresh_token = AuthorizationService.create_refresh_token(
        subject_info=user.email,
        entity=EntityAccessId.USER
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


