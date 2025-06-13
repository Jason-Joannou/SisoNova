from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):

    __tablename__ = "User"

    id = Column(Integer, primary_key=True)
    phone_number = Column(String, nullable=False, unique=True)
    user_name = Column(String, nullable=True)
    user_surname = Column(String, nullable=True)
    registered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class LanguagePreference(Base):
    __tablename__ = "LanguagePreference"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    preferred_language = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)


class MessageState(Base):

    __tablename__ = "MessageState"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    current_state = Column(String, nullable=False)
    previous_state = Column(String, nullable=True)
    has_started = Column(Boolean, default=False)
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
    expense_feeling = Column(String, nullable=True)
    expense_date = Column(DateTime, nullable=False, default=datetime.utcnow())


class UnverifiedIncomes(Base):

    __tablename__ = "UnverifiedIncomes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    income_type = Column(String, nullable=False)
    income_amount = Column(Float, nullable=False)
    income_feeling = Column(String, nullable=True)
    income_date = Column(DateTime, nullable=False, default=datetime.utcnow())


class FinancialFeelings(Base):

    __tablename__ = "FinancialFeelings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    feeling = Column(String, nullable=False)
    feeling_date = Column(DateTime, default=datetime.utcnow())


class ConversationContext(Base):
    """Store AI conversation context and extracted entities"""
    __tablename__ = "ConversationContext"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    session_id = Column(String, nullable=False)  # Group related messages
    
    # AI extracted entities (JSON format)
    extracted_entities = Column(String, nullable=True)  # Store as JSON string
    confidence_score = Column(Float, nullable=True)     # How confident AI is
    
    # Conversation state
    pending_confirmation = Column(Boolean, default=False)
    confirmation_data = Column(String, nullable=True)   # JSON string of pending data
    
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)        # Auto-cleanup old contexts

class TransactionVerification(Base):
    """Track verification status and methods for transactions"""
    __tablename__ = "TransactionVerification"
    
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("UnverifiedExpenses.id"), nullable=True)
    income_id = Column(Integer, ForeignKey("UnverifiedIncomes.id"), nullable=True)
    
    verification_method = Column(String, nullable=False)  # 'ai_extracted', 'user_confirmed', 'pattern_match'
    verification_status = Column(String, default='pending')  # 'pending', 'verified', 'disputed'
    confidence_score = Column(Float, default=0.5)        # 0.0 to 1.0
    
    # AI extraction metadata
    original_message = Column(String, nullable=True)     # Original user message
    ai_interpretation = Column(String, nullable=True)    # What AI understood
    
    # Future: Receipt/external verification
    receipt_image_url = Column(String, nullable=True)
    external_transaction_id = Column(String, nullable=True)
    
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)