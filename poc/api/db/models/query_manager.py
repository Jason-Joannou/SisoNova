from models.tables import User, LanguagePreference, MessageState, UnverifiedExpenses, UnverifiedIncomes, FinancialFeelings
from sqlalchemy.orm import Session

class UserQueries:

    def __init__(self, session: Session) -> None:
        self.session = session

    def get_user_by_phone(self, phone_number: str) -> User:
        return self.session.query(User).filter(User.phone_number == phone_number).first()
    
    def get_user_language_preference(self, user_id: int) -> LanguagePreference:
        """Get a user's language preference."""
        return self.session.query(LanguagePreference).filter(LanguagePreference.user_id == user_id).first()
    
    def get_user_message_state(self, user_id: int) -> MessageState:
        """Get a user's message state."""
        return self.session.query(MessageState).filter(MessageState.user_id == user_id).first()
    
    def get_user_expenses(self, user_id: int) -> list[UnverifiedExpenses]:
        """Get all expenses for a user."""
        return self.session.query(UnverifiedExpenses).filter(UnverifiedExpenses.user_id == user_id).all()
    
    def get_user_incomes(self, user_id: int) -> list[UnverifiedIncomes]:
        """Get all incomes for a user."""
        return self.session.query(UnverifiedIncomes).filter(UnverifiedIncomes.user_id == user_id).all()
    
    def get_user_feelings(self, user_id: int) -> list[FinancialFeelings]:
        """Get all financial feelings for a user."""
        return self.session.query(FinancialFeelings).filter(FinancialFeelings.user_id == user_id).all()