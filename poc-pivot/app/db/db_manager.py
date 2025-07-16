import logging
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.asyncio import async_scoped_session
from sqlalchemy.orm import sessionmaker

from db.models.tables import Base

logger = logging.getLogger("db-manager")
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
            # Default to SQLite with aiosqlite
            db_url = 'sqlite+aiosqlite:///test_db.db'
            
        # For PostgreSQL, you would use:
        # db_url = 'postgresql+asyncpg://username:password@localhost:5432/dbname'
            
        self.engine = create_async_engine(db_url, echo=echo)
        self.async_session = async_scoped_session(
            sessionmaker(
                self.engine, 
                expire_on_commit=False, 
                class_=AsyncSession
            ),
            scopefunc=lambda: None
        )
    
    async def create_tables(self):
        """Create all tables defined in the Base metadata."""
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("All tables created successfully")
    
    async def drop_tables(self):
        """Drop all tables defined in the Base metadata."""
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        logger.info("All tables dropped successfully")
    
    @asynccontextmanager
    async def session_scope(self):
        """
        Provide a transactional scope around a series of operations.
        
        Usage:
            async with db_manager.session_scope() as session:
                await session.add(some_object)
        """
        session = self.async_session()
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Session error: {str(e)}")
            raise
        finally:
            await session.close()
    
    async def execute_query(self, query):
        """Execute a raw SQL query."""
        async with self.session_scope() as session:
            result = await session.execute(query)
            return result
    

# Example usage:
if __name__ == "__main__":
    import asyncio
    
    async def main():
        # For SQLite with aiosqlite
        db_manager = DatabaseManager(db_url='sqlite+aiosqlite:///test_db.db', echo=True)
        
        # For PostgreSQL with asyncpg
        # db_manager = AsyncDatabaseManager(db_url='postgresql+asyncpg://username:password@localhost:5432/dbname', echo=True)
        
        # Create all tables
        await db_manager.create_tables()

        # Drop all tables
        # await db_manager.drop_tables()
        
        # Example: Create a new user
        # new_user = User(phone_number="+1234567890", user_name="John", user_surname="Doe")
        # await db_manager.add(new_user)
        
        # Example: Get a user by ID
        # user = await db_manager.get_by_id(User, 1)
        # if user:
        #     print(f"Found user: {user.user_name} {user.user_surname}")
        
        print("Async database setup complete!")
    
    asyncio.run(main())