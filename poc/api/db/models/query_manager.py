from models.tables import User
from sqlalchemy.orm import Session

class UserQueries:

    def __init__(self, session: Session) -> None:
        self.session = session

    def get_user_by_phone(self, phone_number: str) -> User:
        return self.session.query(User).filter(User.phone_number == phone_number).first()