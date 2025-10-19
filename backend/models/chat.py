"""
Chat Session Models untuk Neon PostgreSQL Instance 2
Metadata sesi chat disimpan di Neon 2, transkrip lengkap di MongoDB
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean, JSON, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..database import Base


class ChatSession(Base):
    """
    Chat session metadata (Neon PostgreSQL Instance 2)
    Full transcripts stored in MongoDB
    """
    __tablename__ = "chat_sessions"
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # User reference (Clerk user ID from Neon 1)
    user_id = Column(String, nullable=False, index=True)
    
    # Session info
    title = Column(String, nullable=True)
    category = Column(String, nullable=True, index=True)  # Hukum Pidana, Perdata, etc.
    status = Column(String, default="active", index=True)  # active, archived, deleted
    
    # PIN for session access (encrypted)
    pin_hash = Column(String, nullable=True)  # Hashed PIN
    pin_salt = Column(String, nullable=True)
    is_pin_protected = Column(Boolean, default=False)
    
    # AI configuration used
    ai_model = Column(String, nullable=True)  # e.g., "ark-default", "groq-llama"
    ai_persona = Column(String, nullable=True)  # e.g., "advokat_progresif"
    
    # Session statistics
    message_count = Column(Integer, default=0)
    total_tokens_used = Column(Integer, default=0)
    ai_confidence_avg = Column(Float, nullable=True)  # Average confidence score
    
    # MongoDB reference
    mongodb_transcript_id = Column(String, nullable=True, index=True)  # Reference to MongoDB document
    
    # User feedback
    rating = Column(Integer, nullable=True)  # 1-5 stars
    feedback = Column(Text, nullable=True)
    
    # Legal case tracking
    case_number = Column(String, nullable=True)  # If linked to actual case
    case_status = Column(String, nullable=True)  # draft, filed, ongoing, closed
    
    # Session metadata (renamed from 'metadata' to avoid SQLAlchemy reserved word)
    session_metadata = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)  # Array of tags
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, nullable=True)
    archived_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<ChatSession(id={self.id}, user_id={self.user_id}, title={self.title})>"


class DocumentMetadata(Base):
    """
    Document metadata (Neon PostgreSQL Instance 2)
    Actual document content stored in MongoDB
    """
    __tablename__ = "document_metadata"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # User and session reference
    user_id = Column(String, nullable=False, index=True)
    session_id = Column(UUID(as_uuid=True), nullable=True, index=True)  # Optional link to chat session
    
    # Document info
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, docx, jpg, etc.
    file_size = Column(Integer, nullable=False)  # in bytes
    mime_type = Column(String, nullable=False)
    
    # MongoDB reference
    mongodb_document_id = Column(String, nullable=False, index=True)  # Reference to MongoDB GridFS
    
    # Processing status
    processing_status = Column(String, default="pending", index=True)  # pending, processing, completed, failed
    ocr_status = Column(String, nullable=True)  # pending, completed, failed, not_needed
    analysis_status = Column(String, nullable=True)  # pending, completed, failed
    
    # Document analysis results (summary only, full in MongoDB)
    document_type = Column(String, nullable=True)  # contract, lawsuit, legal_opinion, etc.
    detected_language = Column(String, nullable=True)
    page_count = Column(Integer, nullable=True)
    word_count = Column(Integer, nullable=True)
    
    # AI analysis summary
    ai_summary = Column(Text, nullable=True)
    key_points = Column(JSON, nullable=True)  # Array of key points
    legal_issues = Column(JSON, nullable=True)  # Array of identified legal issues
    
    # Document metadata (renamed from 'metadata' to avoid SQLAlchemy reserved word)
    document_metadata = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)
    
    # Timestamps
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    processed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<DocumentMetadata(id={self.id}, filename={self.filename}, user_id={self.user_id})>"


class AIQueryLog(Base):
    """
    Log semua AI queries untuk analytics dan billing
    """
    __tablename__ = "ai_query_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # User and session
    user_id = Column(String, nullable=False, index=True)
    session_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    
    # Query info
    query_type = Column(String, nullable=False, index=True)  # chat, document_analysis, dual_ai, etc.
    ai_provider = Column(String, nullable=False)  # ark, groq
    model = Column(String, nullable=False)
    
    # Token usage
    prompt_tokens = Column(Integer, nullable=False)
    completion_tokens = Column(Integer, nullable=False)
    total_tokens = Column(Integer, nullable=False)
    
    # Performance
    response_time_ms = Column(Integer, nullable=False)  # Response time in milliseconds
    
    # Quality metrics
    confidence_score = Column(Float, nullable=True)
    user_rating = Column(Integer, nullable=True)  # 1-5 if user rated this specific response
    
    # Cost tracking (for internal analytics)
    estimated_cost = Column(Float, nullable=True)  # in USD
    
    # Query metadata (renamed from 'metadata' to avoid SQLAlchemy reserved word)
    query_metadata = Column(JSON, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    def __repr__(self):
        return f"<AIQueryLog(id={self.id}, user_id={self.user_id}, query_type={self.query_type})>"


class SessionAnalytics(Base):
    """
    Aggregated analytics per session
    """
    __tablename__ = "session_analytics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    session_id = Column(UUID(as_uuid=True), nullable=False, unique=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    
    # Message statistics
    total_messages = Column(Integer, default=0)
    user_messages = Column(Integer, default=0)
    ai_messages = Column(Integer, default=0)
    
    # Token statistics
    total_tokens = Column(Integer, default=0)
    total_prompt_tokens = Column(Integer, default=0)
    total_completion_tokens = Column(Integer, default=0)
    
    # Time statistics
    total_duration_seconds = Column(Integer, default=0)
    avg_response_time_ms = Column(Float, nullable=True)
    
    # Quality metrics
    avg_confidence_score = Column(Float, nullable=True)
    user_satisfaction_score = Column(Float, nullable=True)
    
    # Legal categories identified
    legal_categories = Column(JSON, nullable=True)  # Array of categories
    key_legal_issues = Column(JSON, nullable=True)  # Array of issues
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<SessionAnalytics(session_id={self.session_id}, total_messages={self.total_messages})>"
