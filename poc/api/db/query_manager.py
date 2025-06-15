from api.db.models.tables import User, LanguagePreference, MessageState, UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, desc
from datetime import datetime, timedelta
from typing import Dict, Optional

class AsyncQueries:

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    # Get Methods
    async def get_user_by_phone(self, phone_number: str) -> User:
        result = await self.session.execute(
            select(User).where(User.phone_number == phone_number)
        )
        return result.scalar_one_or_none()
    
    async def get_user_expenses_by_date_range(self, user_id: int, start_date: datetime, end_date: datetime) -> list[UnverifiedExpenses]:
        """Get all expenses for a user within a date range."""
        result = await self.session.execute(
            select(UnverifiedExpenses).where(
                UnverifiedExpenses.user_id == user_id and
                UnverifiedExpenses.expense_date >= start_date and UnverifiedExpenses.expense_date <= end_date
            )
        )
        return result.scalars().all()
    
    async def get_user_incomes_by_date_range(self, user_id: int, start_date: datetime, end_date: datetime) -> list[UnverifiedIncomes]:
        """Get all incomes for a user within a date range."""
        result = await self.session.execute(
            select(UnverifiedIncomes).where(
                UnverifiedIncomes.user_id == user_id and
                UnverifiedIncomes.income_date >= start_date and UnverifiedIncomes.income_date <= end_date
            )
        )
        return result.scalars().all()
    
    async def get_user_feelings_by_date_range(self, user_id: int, start_date: datetime, end_date: datetime) -> list[FinancialFeelings]:
        """Get all financial feelings for a user within a date range."""
        result = await self.session.execute(
            select(FinancialFeelings).where(
                FinancialFeelings.user_id == user_id and
                FinancialFeelings.feeling_date >= start_date and FinancialFeelings.feeling_date <= end_date
            )
        )
        return result.scalars().all()
    
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
    
    async def get_user_financial_context(self, user_id: str, period_days: Optional[int] = 30) -> Dict:
        cutoff_date = datetime.utcnow() - timedelta(days=period_days)

        # Total expenses and count
        expense_stmt = select(
            func.coalesce(func.sum(UnverifiedExpenses.expense_amount), 0),
            func.count(UnverifiedExpenses.id)
        ).where(
            UnverifiedExpenses.user_id == user_id,
            UnverifiedExpenses.expense_date >= cutoff_date
        )
        expense_result = await self.session.execute(expense_stmt)
        total_expenses, expense_count = expense_result.fetchone()

        # Total income and count
        income_stmt = select(
            func.coalesce(func.sum(UnverifiedIncomes.income_amount), 0),
            func.count(UnverifiedIncomes.id)
        ).where(
            UnverifiedIncomes.user_id == user_id,
            UnverifiedIncomes.income_date >= cutoff_date
        )
        income_result = await self.session.execute(income_stmt)
        total_income, income_count = income_result.fetchone()

        # Top category
        top_category_stmt = (
            select(
                UnverifiedExpenses.expense_type,
                func.sum(UnverifiedExpenses.expense_amount).label("total")
            )
            .where(
                UnverifiedExpenses.user_id == user_id,
                UnverifiedExpenses.expense_date >= cutoff_date
            )
            .group_by(UnverifiedExpenses.expense_type)
            .order_by(desc("total"))
            .limit(1)
        )
        top_category_result = await self.session.execute(top_category_stmt)
        top_category_row = top_category_result.first()
        top_category = top_category_row[0] if top_category_row else "None"

        return {
            "total_expenses_30d": total_expenses,
            "total_income_30d": total_income,
            "net_position": total_income - total_expenses,
            "recent_transaction_count": (expense_count or 0) + (income_count or 0),
            "top_expense_category": top_category,
        }
    
    # Set methods

    async def update_user_message_state(self, user_id: int, **kwargs) -> None:
        """Update a user's message state."""
        await self.session.execute(
            update(MessageState).where(MessageState.user_id == user_id).values(**kwargs)
        )
        await self.session.commit()

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

    async def update_user_language_preference(self, user_id: int, display_language: str, input_language: str, mixed_preference: bool) -> None:
        """Update a user's language preference."""
        await self.session.execute(
            update(LanguagePreference).where(LanguagePreference.user_id == user_id).values(display_language=display_language, input_language=input_language, mixed_preference=mixed_preference, updated_at=datetime.utcnow())
        )
        await self.session.commit()

    async def update_user_registration_status(self, user_id: int, user_phone_number: str, registration_status: bool) -> None:
        await self.session.execute(
            update(User).where(User.id == user_id, User.phone_number == user_phone_number).values(registered=registration_status, updated_at=datetime.utcnow())
        )

    async def update_income_feeling(self, user_id: int, income_id: int, feeling: str) -> None:
        await self.session.execute(
            update(UnverifiedIncomes).where(UnverifiedIncomes.user_id == user_id, UnverifiedIncomes.id == income_id).values(feeling=feeling, updated_at=datetime.utcnow())
        )
        await self.session.commit()

    async def update_expense_feeling(self, user_id: int, expense_id: int, feeling: str) -> None:
        await self.session.execute(
            update(UnverifiedExpenses).where(UnverifiedExpenses.user_id == user_id, UnverifiedExpenses.id == expense_id).values(feeling=feeling, updated_at=datetime.utcnow())
        )
        await self.session.commit()
        

    # Insert Methods

    async def insert_user_unverified_expenses(self, user_id: int, expenses: list[UnverifiedExpenses]) -> None:
        """Insert unverified expenses for a user."""
        self.session.add_all(expenses)
        await self.session.commit()

    async def insert_user_unverified_incomes(self, user_id: int, incomes: list[UnverifiedIncomes]) -> None:
        """Insert unverified incomes for a user."""
        self.session.add_all(incomes)
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