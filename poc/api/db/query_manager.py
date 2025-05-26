from api.db.models.tables import User, LanguagePreference, MessageState, UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

class AsyncQueries:

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    # Get Methods
    async def get_user_by_phone(self, phone_number: str) -> User:
        result = await self.session.execute(
            select(User).where(User.phone_number == phone_number)
        )
        return result.scalar_one_or_none()
    
    async def get_user_language_preference(self, user_id: int) -> LanguagePreference:
        """Get a user's language preference."""
        result = await self.session.execute(
            select(LanguagePreference).where(LanguagePreference.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_message_state(self, user_id: int) -> MessageState:
        """Get a user's message state."""
        result = await self.session.execute(
            select(MessageState).where(MessageState.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_expenses(self, user_id: int) -> list[UnverifiedExpenses]:
        """Get all expenses for a user."""
        result = await self.session.execute(
            select(UnverifiedExpenses).where(UnverifiedExpenses.user_id == user_id)
        )
        return result.scalars().all()
    
    async def get_user_incomes(self, user_id: int) -> list[UnverifiedIncomes]:
        """Get all incomes for a user."""
        result = await self.session.execute(
            select(UnverifiedIncomes).where(UnverifiedIncomes.user_id == user_id)
        )
        return result.scalars().all()
    
    async def get_user_feelings(self, user_id: int) -> list[FinancialFeelings]:
        """Get all financial feelings for a user."""
        result = await self.session.execute(
            select(FinancialFeelings).where(FinancialFeelings.user_id == user_id)
        )
        return result.scalars().all()
    
    # Set methods

    async def update_current_message_state(self, user_id: int, new_state: str) -> None:
        """Update a user's message state."""
        await self.session.execute(
            update(MessageState).where(MessageState.user_id == user_id).values(current_state=new_state)
        )
        await self.session.commit()

    async def update_previous_message_state(self, user_id: int, new_state: str) -> None:
        """Update a user's previous message state."""
        await self.session.execute(
            update(MessageState).where(MessageState.user_id == user_id).values(previous_state=new_state)
        )
        await self.session.commit()

    async def update_user_language_preference(self, user_id: int, new_language: str) -> None:
        """Update a user's language preference."""
        await self.session.execute(
            update(LanguagePreference).where(LanguagePreference.user_id == user_id).values(preferred_language=new_language)
        )
        await self.session.commit()
    

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