from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum
import uuid

class LegalCategory(str, enum.Enum):
    PIDANA = "Hukum Pidana"
    PERDATA = "Hukum Perdata"
    TENAGA_KERJA = "Hukum Ketenagakerjaan"
    BISNIS = "Hukum Bisnis"
    KELUARGA = "Hukum Keluarga"
    LAINNYA = "Lainnya"

class ConsultationSession(Base):
    __tablename__ = "consultation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    session_name = Column(String(255), nullable=False)
    legal_category = Column(String(50), nullable=False)
    status = Column(String(20), default="active")  # active, completed, archived
    pin_hash = Column(String(255))  # For session protection
    rating = Column(Float)
    feedback = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="consultation_sessions")
    messages = relationship("ConsultationMessage", back_populates="session")
    evidence_records = relationship("EvidenceRecord", back_populates="session")

class ConsultationMessage(Base):
    __tablename__ = "consultation_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("consultation_sessions.id"))
    role = Column(String(20))  # user, assistant
    content = Column(Text, nullable=False)
    encrypted_content = Column(Text)  # For sensitive messages
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    session = relationship("ConsultationSession", back_populates="messages")

class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("consultation_sessions.id"))
    evidence_type = Column(String(50))  # document, image, audio, etc.
    description = Column(Text)
    file_path = Column(String(255))  # If we store files
    additional_metadata = Column(Text)  # JSON string for additional metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    session = relationship("ConsultationSession", back_populates="evidence_records")