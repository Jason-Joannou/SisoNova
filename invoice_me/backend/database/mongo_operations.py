from fastapi import HTTPException
from database.mongo_client import MongoDBClient
from models.users import User, UserProfile, VerifyUser, UserUpdate
from models.business import (
    BusinessProfile,
    UpdateBusinessProfile,
    BusinessProfileCollection,
)
from config import Secrets
from datetime import datetime
from typing import List
import traceback
import logging

logger = logging.getLogger(__name__)

secrets = Secrets()


async def create_user(mongo_client: MongoDBClient, new_user_data: User) -> User:
    """Create a new user in the database"""
    try:
        print(new_user_data.model_dump())
        async with mongo_client.get_db(mongo_client.database_name) as db:
            result = await db["users"].insert_one(new_user_data.model_dump())
            return new_user_data
    except Exception as e:
        print(f"Error creating user: {e}")
        logger.exception("Error creating user")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error creating user")
    
async def get_user_by_supabase_id(mongo_client: MongoDBClient, supabase_id: str) -> User:
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            user_data = await db["users"].find_one(
                {"supabase_id": supabase_id}, {"_id": 0}
            )  # Exclude _id field, 1 would include it
            return User.model_validate(user_data) if user_data else None
    except Exception as e:
        print(f"Error retrieving user information: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving user information")


async def create_business_profile(
    mongo_client: MongoDBClient,
    user_business_profile_collection: BusinessProfileCollection,
) -> str:
    """Create a new business profile in the database"""
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            result = await db["business_profiles"].insert_one(
                user_business_profile_collection.model_dump()
            )
            return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating business profile: {e}")
        return ""


async def update_user_business_profile(
    mongo_client: MongoDBClient, email: str, business_profile: BusinessProfile
) -> bool:
    """Update the business profile of a user"""
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            result = await db["users"].update_one(
                {"email": email},
                {
                    "$set": {
                        "business_profile": business_profile.model_dump(),
                        "updated_at": datetime.utcnow().isoformat(),
                    }
                },
            )
            return result.modified_count > 0
    except Exception as e:
        print(f"Error updating business profile: {e}")
        return False


async def get_user_information(
    mongo_client: MongoDBClient, email: str
) -> VerifyUser | None:
    """Retrieve user information by email"""
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            user_data = await db["users"].find_one(
                {"email": email}, {"_id": 0}
            )  # Exclude _id field, 1 would include it
            return VerifyUser.model_validate(user_data) if user_data else None
    except Exception as e:
        print(f"Error retrieving user information: {e}")
        return None


async def get_user_profile(
    mongo_client: MongoDBClient, email: str
) -> UserProfile | None:
    """Retrieve the user profile by email"""
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            # User data does not include business profile any more
            user_data = await db["users"].find_one({"email": email})
            preferred_business_profile = await db["business_profiles"].find_one(
                {
                    "email": email,
                    "business_profiles": {
                        "$elemMatch": {
                            "company_name": user_data["preferred_business_profile"]
                        }
                    },
                },
                {"_id": 0,
                 "business_profiles.$": 1
                },
            )
            business_profile = preferred_business_profile["business_profiles"][0]
            user_profile = UserProfile(
                email=user_data["email"],
                preferred_business_profile=user_data["preferred_business_profile"],
                business_profile=business_profile,
            )

            return user_profile
    except Exception as e:
        print(f"Error retrieving user profile: {e}")
        return None


async def get_user_business_profile_company_names(
    mongo_client: MongoDBClient, supabase_id: str
) -> List[str] | None:
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            business_profiles = await db["business_profiles"].find(
                {"supabase_id": supabase_id}, {"_id": 0}
            )  # Exclude _id field, 1 would include it
            return [bp["company_name"] for bp in business_profiles]
    except Exception as e:
        print(f"Error retrieving user information: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving user information")


async def get_user_business_profiles(
    mongo_client: MongoDBClient, email: str
) -> List[BusinessProfile] | None:
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            business_profiles = await db["business_profiles"].find_one(
                {"email": email}, {"_id": 0}
            )  # Exclude _id field, 1 would include it
            return [BusinessProfile.model_validate(bp) for bp in business_profiles]
    except Exception as e:
        print(f"Error retrieving user information: {e}")
        return None


async def get_business_profile_with_company_name(
    mongo_client: MongoDBClient, supabase_id: str, company_name: str
) -> BusinessProfile | None:
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            business_profiles = await db["business_profiles"].find_one(
                {"supabase_id": supabase_id, "company_name": company_name}, {"_id": 0}
            )  # Exclude _id field, 1 would include it
            return BusinessProfile.model_validate(business_profiles)
    except Exception as e:
        print(f"Error retrieving user information: {e}")
        return None


async def update_user_information(
    mongo_client: MongoDBClient, supabase_id: str, user_update: UserUpdate
) -> bool:
    """Update base user information in the database"""

    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            result = await db["users"].update_one(
                {"supabase_id": supabase_id}, {"$set": user_update.model_dump(exclude_unset=True)}
            )
            return result.modified_count > 0
    except Exception as e:
        print(f"Error updating user information: {e}")
        raise HTTPException(status_code=500, detail="Error updating user information")


async def add_business_profile_operation(
    mongo_client: MongoDBClient, supabase_id: str, business_profile: BusinessProfile
):
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            result = await db["business_profiles"].update_one(
                {"supabase_id": supabase_id},
                {
                    "$push": {"business_profiles": business_profile.model_dump()},
                },
                upsert=True,  # True if you want to create the entry if it doesn't exist
            )
            return result.modified_count > 0 or result.upserted_id is not None
    except Exception as e:
        print(f"Error updating business profile: {e}")
        raise HTTPException(status_code=500, detail="Error updating business profile")


async def update_business_profile_operation(
    mongo_client: MongoDBClient,
    supabase_id: str,
    company_name: str,
    business_profile: UpdateBusinessProfile,
):
    try:
        async with mongo_client.get_db(mongo_client.database_name) as db:
            result = await db["users"].update_one(
                {"supabase_id": supabase_id, "business_profile.company_name": company_name},
                {
                    "$set": {
                        "business_profile.$": business_profile.model_dump(
                            exclude_unset=True
                        )
                    }
                },
                {"$set": {"updated_at": datetime.utcnow().isoformat()}},
            )
            return result.modified_count > 0
    except Exception as e:
        print(f"Error updating business profile: {e}")
        return False
