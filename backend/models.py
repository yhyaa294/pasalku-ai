import enum
from sqlalchemy import Column, Integer, String, Enum, Text, DateTime, ForeignKey, UUID
from sqlalchemy.orm import relationship
from backend.database import Base
import uuid
from datetime import datetime

class UserRole(str, enum.Enum):
    PUBLIC = "public"
    LEGAL_PROFESSIONAL = "legal_professional"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.PUBLIC)
    is_active = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    preferred_language = Column(String(10), default="id", nullable=False)

    # Relationships
    chat_sessions = relationship("ChatSession", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    consultation_sessions = relationship("ConsultationSession", back_populates="user")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=True)
    status = Column(String, default="active")  # active/archived
    pin_hash = Column(String, nullable=True)  # Hashed PIN for access
    category = Column(String, nullable=True)  # Legal category (Hukum Pidana, etc.)
    phase = Column(String, default="initial")  # Current consultation phase
    consultation_data = Column(Text, nullable=True)  # JSON string of consultation data
    rating = Column(Integer, nullable=True)  # User rating 1-5
    feedback = Column(Text, nullable=True)  # User feedback
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    language = Column(String(10), default="id", nullable=False)

    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # user/assistant
    content = Column(Text, nullable=False)
    citations = Column(Text, nullable=True)  # JSON string of citations
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    language = Column(String(10), default="id", nullable=False)
    metadata = Column(Text, nullable=True)

    # Relationship
    session = relationship("ChatSession", back_populates="messages")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Can be null for anonymous payments

    stripe_payment_intent_id = Column(String, unique=True, nullable=False)
    stripe_subscription_id = Column(String, unique=True, nullable=True)
    stripe_customer_id = Column(String, nullable=True)

    amount = Column(Integer, nullable=False)  # Amount in cents
    currency = Column(String, nullable=False, default="usd")
    status = Column(String, nullable=False)  # succeeded, failed, pending, canceled

    payment_type = Column(String, nullable=False)  # subscription, one_time
    product_id = Column(String, nullable=True)  # Stripe product/price ID

    description = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="payments")
