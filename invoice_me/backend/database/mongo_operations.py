from database.mongo_client import MongoDBClient
from models.users import User, UserProfile, VerifyUser, UserUpdate
from models.business import BusinessProfile, UpdateBusinessProfile
from config import Secrets
from datetime import datetime

secrets = Secrets()

async def does_user_exist(mongo_client: MongoDBClient, email: str) -> bool:
    """Check if a user with the given email exists in the database"""
    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            user = await db["users"].find_one({"email": email})
            return user is not None
    except Exception as e:
        print(f"Error checking user existence: {e}")
        return False
    
async def create_user(mongo_client: MongoDBClient, new_user_data: User) -> str:
    """Create a new user in the database"""
    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            result = await db["users"].insert_one(new_user_data.model_dump())
            return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating user: {e}")
        return ""
    

async def update_user_business_profile(mongo_client: MongoDBClient, email: str, business_profile: BusinessProfile) -> bool:
    """Update the business profile of a user"""
    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            result = await db["users"].update_one(
                {"email": email},
                {"$set": {"business_profile": business_profile.model_dump(), "updated_at": datetime.utcnow().isoformat()}}
            )
            return result.modified_count > 0
    except Exception as e:
        print(f"Error updating business profile: {e}")
        return False
    
async def get_user_information(mongo_client: MongoDBClient, email: str) -> VerifyUser | None:
    """Retrieve user information by email"""
    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            user_data = await db["users"].find_one({"email": email}, {"_id": 0}) # Exclude _id field, 1 would include it
            return VerifyUser.model_validate(user_data) if user_data else None
    except Exception as e:
        print(f"Error retrieving user information: {e}")
        return None
    
async def get_user_profile(mongo_client: MongoDBClient, email: str) -> UserProfile | None:
    """Retrieve the user profile by email"""
    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            user_data = await db["users"].find_one({"email": email})
            if user_data:
                return UserProfile.model_validate(user_data)
            return None
    except Exception as e:
        print(f"Error retrieving user profile: {e}")
        return None
    

async def update_user_information(mongo_client: MongoDBClient, email: str, user_update: UserUpdate) -> bool:
    """Update base user information in the database"""

    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            result = await db["users"].update_one(
                {"email": email},
                {"$set": user_update.model_dump(exclude_unset=True)}
            )
            return result.modified_count > 0
    except Exception as e:
        print(f"Error updating user information: {e}")
        return False
    

async def add_business_profile_operation(mongo_client: MongoDBClient, email: str, business_profile: BusinessProfile):
    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            result = await db["users"].update_one(
                {"email": email},
                {
                    "$push": {"business_profile": business_profile.model_dump()},
                    "$set": {"updated_at": datetime.utcnow().isoformat()}
                },
                upsert=False  # or True if you want to create the user if it doesn't exist
            )
            return result.modified_count > 0
    except Exception as e:
        print(f"Error updating business profile: {e}")
        return False
    

async def update_business_profile_operation(mongo_client: MongoDBClient, email: str, company_name: str, business_profile: UpdateBusinessProfile):
    try:
        async with mongo_client.get_db(secrets.mongo_db_database_name) as db:
            result = await db["users"].update_one(
                {"email": email, "business_profile.company_name": company_name},
                {"$set": {"business_profile.$": business_profile.model_dump(exclude_unset=True)}},
                {"$set": {"updated_at": datetime.utcnow().isoformat()}}
            )
            return result.modified_count > 0
    except Exception as e:
        print(f"Error updating business profile: {e}")
        return False
   