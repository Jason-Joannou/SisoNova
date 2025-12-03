from fastapi import APIRouter, status, Depends, Path
from fastapi.exceptions import HTTPException
from models.users import UserProfile, UserUpdate
from models.base import BaseResponseModel
from models.auth import TokenInfo
from models.business import BusinessProfile, UpdateBusinessProfile
from typing import List
from database.mongo_operations import (
    does_user_exist,
    create_user,
    get_user_profile,
    update_user_information,
    add_business_profile_operation,
    update_business_profile_operation
)
from database.mongo_client import MongoDBClient
from database.mongo_dependencies import get_mongo_client
from services.auth import AuthenticationService


router = APIRouter(prefix="/user", tags=["user"])


@router.get(
    "/",
    response_model=UserProfile,
    description="Get user profile",
    status_code=status.HTTP_200_OK,
)
async def user_profile(
    token: TokenInfo = Depends(AuthenticationService.get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> UserProfile:
    """
    Get the user profile for the authenticated user
    """

    _, email = token.sub.split(":", 1)

    user_profile = await get_user_profile(email=email, mongo_client=mongo_client)

    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found"
        )

    return user_profile


@router.patch(
    "/",
    response_model=UserProfile,
    description="Update user profile",
    status_code=status.HTTP_200_OK,
)
async def update_user_profile(
    update: UserUpdate,
    token: TokenInfo = Depends(AuthenticationService.get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> UserProfile:
    """
    Update base user information
    """

    _, email = token.sub.split(":", 1)

    user_exists = await does_user_exist(email=email, mongo_client=mongo_client)

    if not user_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    updated = await update_user_information(
        email=email, user_update=update, mongo_client=mongo_client
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating user information",
        )

    user_profile = await get_user_profile(email=email, mongo_client=mongo_client)

    return user_profile


@router.get(
    "/business-profile",
    response_model=List[BusinessProfile],
    description="Get business profile",
    status_code=status.HTTP_200_OK,
)
async def get_business_profile(
    token: TokenInfo = Depends(AuthenticationService.get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> List[BusinessProfile]:
    """
    Get the business profile for the authenticated user
    """

    _, email = token.sub.split(":", 1)

    user_profile = await get_user_profile(email=email, mongo_client=mongo_client)

    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found"
        )

    return user_profile.business_profile


@router.post(
    "/business-profile",
    response_model=BaseResponseModel,
    description="Add business profile",
    status_code=status.HTTP_200_OK,
)
async def add_business_profile(
    business_profile: BusinessProfile,
    token: TokenInfo = Depends(AuthenticationService.get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> BaseResponseModel:
    """
    Add a business profile for the authenticated user
    """

    _, email = token.sub.split(":", 1)

    exists = await does_user_exist(email=email, mongo_client=mongo_client)

    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found"
        )

    updated = await add_business_profile_operation(
        email=email, business_profile=business_profile, mongo_client=mongo_client
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating business profile",
        )

    return {
        "success": True,
        "message": "Business profile added successfully",
    }

@router.patch("/business-profile/{company_name}", response_model=BaseResponseModel, description="Update business profile", status_code=status.HTTP_200_OK)
async def update_business_profile(
    business_profile: UpdateBusinessProfile,
    company_name: str = Path(..., description="The name of the company"),
    token: TokenInfo = Depends(AuthenticationService.get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> BaseResponseModel:
    """
    Add a business profile for the authenticated user
    """

    _, email = token.sub.split(":", 1)

    exists = await does_user_exist(email=email, mongo_client=mongo_client)

    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found"
        )

    updated = await update_business_profile_operation(
        email=email, business_profile=business_profile, mongo_client=mongo_client, company_name=company_name
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating business profile",
        )

    return {
        "success": True,
        "message": "Business profile updated successfully",
    }