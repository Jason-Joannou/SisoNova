from fastapi import APIRouter, status, Depends, Path
from fastapi.exceptions import HTTPException
from models.users import UserProfile, UserUpdate, User
from models.base import BaseResponseModel
from models.auth import TokenInfo
from models.business import BusinessProfile, UpdateBusinessProfile
from typing import List
from database.mongo_operations import (
    get_user_by_supabase_id,
    create_user,
    get_user_profile,
    update_user_information,
    add_business_profile_operation,
    update_business_profile_operation,
    get_business_profile_with_company_name,
    get_user_business_profile_company_names,
)
from database.mongo_client import MongoDBClient
from database.mongo_dependencies import get_mongo_client
from services.auth import AuthenticationService
from utils.auth.dependencies import get_current_user


router = APIRouter(prefix="/user", tags=["user"])


@router.get(
    "",
    response_model=UserProfile,
    description="Get user profile",
    status_code=status.HTTP_200_OK,
)
async def user_profile(
    user: User = Depends(get_current_user),
) -> UserProfile:
    """
    Get the user profile for the authenticated user
    """
    print("hhello")

    return UserProfile(
        email=user.email,
        preferred_business_profile=user.preferred_business_profile
        
    )


@router.patch(
    "",
    response_model=UserProfile,
    description="Update user profile",
    status_code=status.HTTP_200_OK,
)
async def update_user_profile(
    update: UserUpdate,
    user: User = Depends(get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> UserProfile:
    """
    Update base user information
    """

    updated = await update_user_information(
        email=user.email, user_update=update, mongo_client=mongo_client
    )

    user_profile = await get_user_by_supabase_id(supabase_id=user.supabase_id, mongo_client=mongo_client)

    return user_profile


@router.get(
    "/business-profile",
    response_model=List[str],
    description="Get business profile names",
    status_code=status.HTTP_200_OK,
)
async def get_business_profile(
    user: User = Depends(get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> List[str]:
    """
    Get the business profile names for the authenticated user
    """

    business_profiles = await get_user_business_profile_company_names(
        supabase_id=user.supabase_id, mongo_client=mongo_client
    )

    return business_profiles


@router.post(
    "/business-profile",
    response_model=BaseResponseModel,
    description="Add business profile",
    status_code=status.HTTP_200_OK,
)
async def add_business_profile(
    business_profile: BusinessProfile,
    user: User = Depends(get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> BaseResponseModel:
    """
    Add a business profile for the authenticated user
    """

    updated = await add_business_profile_operation(
        supabase_id=user.supabase_id, business_profile=business_profile, mongo_client=mongo_client
    )
    
    # Update user's preferred business profile
    updated = await update_user_information(
        supabase_id=user.supabase_id,
        user_update=UserUpdate(preferred_business_profile=business_profile.company_name),
        mongo_client=mongo_client
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating user information",
        )

    return {
        "success": True,
        "message": "Business profile added successfully",
    }


@router.get(
    "/business-profile/{company_name}",
    response_model=BusinessProfile,
    description="Get business profile",
    status_code=status.HTTP_200_OK,
)
async def get_business_profile(
    company_name: str = Path(..., description="The name of the company"),
    user: User = Depends(get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> BusinessProfile:
    """
    Get the business profile for the authenticated user
    """

    business_profile = await get_business_profile_with_company_name(
        supabase_id=user.supabase_id, company_name=company_name, mongo_client=mongo_client
    )

    return business_profile


@router.patch(
    "/business-profile/{company_name}",
    response_model=BaseResponseModel,
    description="Update business profile",
    status_code=status.HTTP_200_OK,
)
async def update_business_profile(
    business_profile: UpdateBusinessProfile,
    company_name: str = Path(..., description="The name of the company"),
    user: User = Depends(get_current_user),
    mongo_client: MongoDBClient = Depends(get_mongo_client),
) -> BaseResponseModel:
    """
    Add a business profile for the authenticated user
    """

    updated = await update_business_profile_operation(
        supabase_id=user.supabase_id,
        business_profile=business_profile,
        mongo_client=mongo_client,
        company_name=company_name,
    )

    return {
        "success": True,
        "message": "Business profile updated successfully",
    }


# Each Business profile can have different services
# Ie one profile can have invoicing and collections enabled
# The other can have Ai agents and collecions enabled
# Each profile can be billed on usage
