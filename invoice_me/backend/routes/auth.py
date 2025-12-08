from fastapi import APIRouter, status, Depends, Response, Request
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordBearer
from models.auth import (
    UserLoginParameters,
    TokenResponse,
    UserCreateParameters,
    TokenInfo,
    TokenAccessType,
)
from models.base import BaseResponseModel
from models.users import User, AuthenticatedUserResponse, UserProfile
from services.auth import AuthenticationService, AuthorizationService
from models.auth import EntityAccessId
from database.mongo_operations import does_user_exist, create_user, get_user_profile
from database.mongo_dependencies import get_mongo_client
from database.mongo_client import MongoDBClient
from datetime import datetime, timezone
from config import AppSettings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
settings = AppSettings()

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/login",
    response_model=UserProfile,
    description="Authenticate a user and return tokens",
    status_code=status.HTTP_200_OK,
)
async def login(
    user: UserLoginParameters, response: Response, mongo_client: MongoDBClient = Depends(get_mongo_client)
) -> UserProfile:
    # Authenticate user
    authenticated = await AuthenticationService.authenticate_user(
        user.email, user.password
    )

    if not authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create tokens
    access_token = AuthorizationService.create_access_token(
        subject_info=user.email,
        entity=EntityAccessId.USER,  # Adjust based on your EntityAccessId enum
    )

    refresh_token = AuthorizationService.create_refresh_token(
        subject_info=user.email, entity=EntityAccessId.USER
    )

    user_profile = await get_user_profile(email=user.email, mongo_client=mongo_client)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=False,
        path="/",
        secure=True if settings.environment == "production" else False,
        samesite="lax",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        path="/",
        secure=True if settings.environment == "production" else False,
        samesite="lax",
    )

    

    return user_profile


# routes/auth.py


@router.post(
    "/register",
    response_model=UserProfile,
    description="Register a new user and return tokens",
    status_code=status.HTTP_201_CREATED,
)
async def register(
    user: UserCreateParameters, response: Response, mongo_client: MongoDBClient = Depends(get_mongo_client)
) -> UserProfile:
    """
    Register a new user account
    """

    existing_user = await does_user_exist(email=user.email, mongo_client=mongo_client)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Hash the password
    hashed_password = AuthenticationService.get_password_hash(user.password)

    # Create user in database
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        auth_provider="local",  # Assuming local auth for registration
        preferred_business_profile=None, # Will be updated on dashboard page
        subscription_tier="free",  # Default subscription tier
        created_at=datetime.utcnow().isoformat(),
        updated_at=datetime.utcnow().isoformat(),
    )

    # Need try accepts for DB operations
    response_id = await create_user(new_user_data=new_user, mongo_client=mongo_client)
    if not response_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        )

    # Create tokens for the new user
    access_token = AuthorizationService.create_access_token(
        subject_info=user.email, entity=EntityAccessId.USER
    )

    refresh_token = AuthorizationService.create_refresh_token(
        subject_info=user.email, entity=EntityAccessId.USER
    )

    user_profile = UserProfile(
        email=user.email, preferred_business_profile=None, business_profile=None)


    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=False,
        path="/",
        secure=True if settings.environment == "production" else False,
        samesite="lax",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        path="/",
        secure=True if settings.environment == "production" else False,
        samesite="lax",
    )

    return user_profile


@router.get(
    "/verify",
    response_model=BaseResponseModel,
    description="Verify the validity of an access token",
    status_code=status.HTTP_200_OK,
)
async def verify_token(
    token: TokenInfo = Depends(AuthenticationService.get_current_user),
) -> TokenInfo:
    """
    Verify the provided access token
    """

    return BaseResponseModel(
        success=True,
        message="Token is valid",
    )


@router.get(
    "/refresh",
    response_model=TokenResponse,
    description="Refresh access token using a refresh token",
    status_code=status.HTTP_200_OK,
)
async def refresh_token(
    response: Response,
    request: Request,
) -> TokenResponse:
    
    raw_token = request.cookies.get("refresh_token")
    token = await AuthenticationService.get_refresh_user(token=raw_token)

    # Create new access token
    new_access_token = AuthorizationService.create_access_token(
        subject_info=token.sub,
        entity=EntityAccessId.USER,
    )

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=False,
        path="/",
        secure=True if settings.environment == "production" else False,
        samesite="lax",
    )

    return BaseResponseModel(
        success=True,
        message="Access token refreshed successfully",
    )
