import asyncio
import os
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi

load_dotenv()


class MongoDBClient:
    """Async MongoDB client with context manager support for FastMCP"""

    def __init__(self) -> None:
        self.client: Optional[AsyncIOMotorClient] = None
        self.connection_string = os.getenv("MONGO_DB_CONNECTION_STRING", None)

        if not self.connection_string:
            raise ValueError(
                "MONGO_DB_CONNECTION_STRING not found in environment variables"
            )

    async def connect(self):
        """Initialize the MongoDB client connection"""
        if self.client is not None:
            return self.client

        try:
            self.client = AsyncIOMotorClient(
                self.connection_string,
                server_api=ServerApi("1"),
                serverSelectionTimeoutMS=5000,
                maxPoolSize=50,
                minPoolSize=10,
            )
            await self.client.admin.command("ping")
            print("Successfully connected to MongoDB")
            return self.client
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            self.client = None
            raise

    async def disconnect(self):
        """Close the MongoDB client connection"""
        if self.client:
            self.client.close()
            self.client = None
            print("Disconnected from MongoDB")

    def get_database(self, database_name: str):
        """Get a database instance"""
        if not self.client:
            raise Exception("Client not connected. Call connect() first.")
        return self.client[database_name]

    @asynccontextmanager
    async def get_db(self, database_name: str):
        """Async context manager for database access"""
        if not self.client:
            await self.connect()

        try:
            yield self.client[database_name]
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")

    @asynccontextmanager
    async def get_session(self, database_name: str):
        """Async context manager for session-based transactions"""
        if not self.client:
            await self.connect()

        async with await self.client.start_session() as session:
            try:
                yield self.client[database_name], session
            except Exception as e:
                await session.abort_transaction()
                raise Exception(f"Session error: {str(e)}")

    async def __aenter__(self):
        """Async context manager entry"""
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.disconnect()
        return False


async def test_main():
    return await MongoDBClient().connect()


if __name__ == "__main__":
    client = asyncio.run(test_main())
    print(client)
