from fastapi import APIRouter, status, Depends, Query
from fastapi.exceptions import HTTPException
from models.users import UserProfile
from models.auth import TokenInfo
from database.mongo_operations import does_user_exist, create_user, get_user_profile
from database.mongo_client import MongoDBClient
from database.mongo_dependencies import get_mongo_client
from services.auth import AuthenticationService


router = APIRouter(
    prefix="/user",
    tags=["user"]
)

@router.get("/profile", response_model=UserProfile, description="Get user profile", status_code=status.HTTP_200_OK)
async def user_profile(token: TokenInfo = Depends(AuthenticationService.get_current_user), mongo_client: MongoDBClient = Depends(get_mongo_client)) -> UserProfile:
    """
    Get the user profile for the authenticated user
    """

    _, email = token.sub.split(":", 1)

    user_profile = await get_user_profile(email=email, mongo_client=mongo_client)

    if not user_profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")

    return user_profile