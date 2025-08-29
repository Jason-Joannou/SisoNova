from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, DateTime, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class BusinessUser(Base):
    __tablename__ = "BusinessUser"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    phone_number = Column(String, nullable=False, unique=True)

    registered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)