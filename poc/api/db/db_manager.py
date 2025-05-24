from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from contextlib import contextmanager
import logging

from models.tables import Base

logger = logging.getLogger("middleware")
logger.setLevel(logging.INFO)

class DatabaseManager:
    """
    A class to manage database connections, sessions, and operations.
    """
    
    def __init__(self, db_url=None, echo=False):
        """
        Initialize the database manager.
        
        Args:
            db_url (str): Database connection URL. Defaults to SQLite.
            echo (bool): Whether to echo SQL statements.
        """
        if db_url is None:
            # Default to SQLite
            db_url = 'sqlite:///financial_app.db'
            
        self.engine = create_engine(db_url, echo=echo)
        self.Session = scoped_session(sessionmaker(bind=self.engine))
        self.logger = logging.getLogger(__name__)
    
    def create_tables(self):
        """Create all tables defined in the Base metadata."""
        Base.metadata.create_all(self.engine)
        self.logger.info("All tables created successfully")
    
    def drop_tables(self):
        """Drop all tables defined in the Base metadata."""
        Base.metadata.drop_all(self.engine)
        self.logger.info("All tables dropped successfully")
    
    @contextmanager
    def session_scope(self):
        """
        Provide a transactional scope around a series of operations.
        
        Usage:
            with db_manager.session_scope() as session:
                session.add(some_object)
        """
        session = self.Session()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            self.logger.error(f"Session error: {str(e)}")
            raise
        finally:
            session.close()
    
    def add(self, obj):
        """Add an object to the database."""
        with self.session_scope() as session:
            session.add(obj)
            return obj
    
    def add_all(self, objects):
        """Add multiple objects to the database."""
        with self.session_scope() as session:
            session.add_all(objects)
            return objects
    
    def get_by_id(self, model, id):
        """Get an object by its ID."""
        with self.session_scope() as session:
            return session.query(model).filter(model.id == id).first()
    
    def get_all(self, model):
        """Get all objects of a specific model."""
        with self.session_scope() as session:
            return session.query(model).all()
    
    def update(self, model, id, **kwargs):
        """Update an object by its ID with the provided keyword arguments."""
        with self.session_scope() as session:
            obj = session.query(model).filter(model.id == id).first()
            if obj:
                for key, value in kwargs.items():
                    if hasattr(obj, key):
                        setattr(obj, key, value)
                return obj
            return None
    
    def delete(self, model, id):
        """Delete an object by its ID."""
        with self.session_scope() as session:
            obj = session.query(model).filter(model.id == id).first()
            if obj:
                session.delete(obj)
                return True
            return False
    
    def execute_query(self, query):
        """Execute a raw SQL query."""
        with self.session_scope() as session:
            return session.execute(query)
    
    def get_user_by_phone(self, phone_number):
        """Get a user by phone number."""
        with self.session_scope() as session:
            return session.query(User).filter(User.phone_number == phone_number).first()
    
    def get_user_language_preference(self, user_id):
        """Get a user's language preference."""
        with self.session_scope() as session:
            return session.query(LanguagePreference).filter(LanguagePreference.user_id == user_id).first()
    
    def get_user_message_state(self, user_id):
        """Get a user's message state."""
        with self.session_scope() as session:
            return session.query(MessageState).filter(MessageState.user_id == user_id).first()
    
    def get_user_expenses(self, user_id):
        """Get all expenses for a user."""
        with self.session_scope() as session:
            return session.query(UnverifiedExpenses).filter(UnverifiedExpenses.user_id == user_id).all()
    
    def get_user_incomes(self, user_id):
        """Get all incomes for a user."""
        with self.session_scope() as session:
            return session.query(UnverifiedIncomes).filter(UnverifiedIncomes.user_id == user_id).all()
    
    def get_user_feelings(self, user_id):
        """Get all financial feelings for a user."""
        with self.session_scope() as session:
            return session.query(FinancialFeelings).filter(FinancialFeelings.user_id == user_id).all()


# Example usage:
if __name__ == "__main__":
    # For SQLite
    db_manager = DatabaseManager(db_url='sqlite:///test_db.db', echo=True)
    
    # For PostgreSQL (when you migrate)
    # db_manager = DatabaseManager(db_url='postgresql://username:password@localhost:5432/dbname', echo=True)
    
    # Create all tables
    db_manager.create_tables()
    
    # Example: Create a new user
    # new_user = User(phone_number="+1234567890", user_name="John", user_surname="Doe")
    # db_manager.add(new_user)
    
    # Example: Get a user by ID
    # user = db_manager.get_by_id(User, 1)
    # if user:
    #     print(f"Found user: {user.user_name} {user.user_surname}")
    
    print("Database setup complete!")