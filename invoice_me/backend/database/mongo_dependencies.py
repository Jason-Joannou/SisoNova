# dependencies.py (or database/dependencies.py)
from typing import AsyncGenerator
from database.mongo_client import MongoDBClient

async def get_mongo_client() -> AsyncGenerator[MongoDBClient, None]:
    """
    Shared dependency to get MongoDB client.
    Use this across all routers that need database access.
    """
    async with MongoDBClient() as client:
        yield client