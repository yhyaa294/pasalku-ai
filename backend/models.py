import enum
from sqlalchemy import Column, Integer, String, Enum, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class UserRole(str, enum.Enum):
    PUBLIC = "public"
    LEGAL_PROFESSIONAL = "legal_professional"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.PUBLIC)

    # Relationship with chat history
    chat_histories = relationship("ChatHistory", back_populates="user")

class ChatHistory(Base):
    __tablename__ = "chat_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=False)

    # Relationship with user
    user = relationship("User", back_populates="chat_histories")
