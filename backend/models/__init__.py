# Models package
from enum import Enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Enum as SQLEnum
from backend.database import Base

class UserRole(str, Enum):
    PUBLIC = "public"
    LEGAL_PROFESSIONAL = "legal_professional"
    ADMIN = "admin"

    def __str__(self):
        return self.value

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(SQLEnum(UserRole), default=UserRole.PUBLIC)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)