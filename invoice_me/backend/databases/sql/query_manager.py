from databases.models.tables import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime

class AsyncQueries:

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    # Get Methods
    async def get_user_by_phone(self, phone_number: str) -> User:
        result = await self.session.execute(
            select(User).where(User.phone_number == phone_number)
        )
        return result.scalar_one_or_none()

    # Object related methods
    async def add(self, obj):
        """Add an object to the database."""
        self.session.add(obj)
        await self.session.flush()
        return obj
    
    async def add_all(self, objects):
        """Add multiple objects to the database."""
        self.session.add_all(objects)
        await self.session.flush()
        return objects