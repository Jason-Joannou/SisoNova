from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True)
    phone_number = Column(String, nullable=False, unique=True)
    registered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserFinancialScores(Base):
    __tablename__ = "UserFinancialScores"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    reward_score = Column(Float, nullable=False)
    penalty_score = Column(Float, nullable=False)
    overall_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

