from fastapi import APIRouter, status
from fastapi.exceptions import HTTPException
from models.auth import UserLoginParameters, TokenResponse, UserCreateParameters
from models.users import CreateNewUser, AuthenticatedUserResponse, UserProfile
from services.auth import AuthenticationService, AuthorizationService
from models.auth import EntityAccessId
from database.mongo_operations import does_user_exist, create_user, get_user_profile


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/login", response_model=AuthenticatedUserResponse, description="Authenticate a user and return tokens", status_code=status.HTTP_200_OK)
async def login(user: UserLoginParameters) -> AuthenticatedUserResponse:
    # Authenticate user
    authenticated = await AuthenticationService.authenticate_user(user.email, user.password)
    
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
    
    user_data = get_user_profile(user.email)
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

    
    return AuthenticatedUserResponse(
        **token_response.model_dump(),
        user=user_data
    )

# routes/auth.py

@router.post("/register", response_model=TokenResponse, description="Register a new user and return tokens", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreateParameters) -> TokenResponse:
    """
    Register a new user account
    """
    
    existing_user = does_user_exist(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = AuthenticationService.get_password_hash(user.password)
    
    # Create user in database
    new_user = CreateNewUser(
        email=user.email,
        password_hash=hashed_password,
        auth_provider="local",  # Assuming local auth for registration
        subscription_tier="free"  # Default subscription tier
    )

    # Need try accepts for DB operations
    response_id = await create_user(new_user)
    if not response_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    
    # Create tokens for the new user
    access_token = AuthorizationService.create_access_token(
        subject_info=user.email,
        entity=EntityAccessId.USER
    )
    
    refresh_token = AuthorizationService.create_refresh_token(
        subject_info=user.email,
        entity=EntityAccessId.USER
    )

    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )
    user_profile = UserProfile(
        email=user.email,
        business_profile=None
    )
    
    return AuthenticatedUserResponse(
        **token_response.model_dump(),
        user=user_profile
    )


