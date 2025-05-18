from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):

    __tablename__ = "User"

    id = Column(Integer, primary_key=True)
    phone_number = Column(String, nullable=False, unique=True)
    user_name = Column(String, nullable=True)
    user_surname = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LanguagePreference(Base):
    __tablename__ = "LanguagePreference"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    preferred_language = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)


class MessageState(Base):

    __tablename__ = "MessageState"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    current_state = Column(
        String, nullable=False, default="unregistered_number_language_selector"
    )
    previous_state = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)


class MessageLog(Base):
    __tablename__ = "MessageLog"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)

    message_body = Column(String, nullable=True)
    message_type = Column(String, default="text")
    template_name = Column(String, nullable=True)
    language = Column(String, nullable=True)

    direction = Column(String, default="outbound")
    channel = Column(String, default="whatsapp")

    twilio_sid = Column(String, nullable=True)
    whatsapp_message_id = Column(String, nullable=True)
    twilio_status = Column(String, nullable=True)
    error_code = Column(String, nullable=True)
    error_message = Column(String, nullable=True)

    sent_at = Column(DateTime, default=datetime.utcnow)
    delivered_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)


class UnverifiedExpenses(Base):

    __tablename__ = "UnverifiedExpenses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    expense_type = Column(String, nullable=False)
    expense_amount = Column(Float, nullable=False)
    expense_date = Column(DateTime, nullable=False, default=datetime.utcnow())
