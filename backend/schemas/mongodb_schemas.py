"""
MongoDB Collection Schemas
Defines structure untuk collections di MongoDB
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """Single message dalam chat"""
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    tokens: Optional[int] = None
    model: Optional[str] = None
    confidence_score: Optional[float] = None
    citations: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None


class ChatTranscript(BaseModel):
    """
    Full chat transcript stored in MongoDB
    Collection: chat_transcripts
    """
    _id: str = Field(alias="_id")  # Same as session_id from Neon
    user_id: str
    session_id: str
    
    # Messages array
    messages: List[ChatMessage] = []
    
    # Session context
    context: Optional[Dict[str, Any]] = None
    system_prompt: Optional[str] = None
    
    # Metadata
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True


class DocumentContent(BaseModel):
    """
    Document content stored in MongoDB GridFS
    Collection: fs.files (GridFS)
    """
    _id: str = Field(alias="_id")
    filename: str
    content_type: str
    length: int  # File size in bytes
    upload_date: datetime
    
    # Metadata
    metadata: Dict[str, Any] = {
        "user_id": str,
        "session_id": Optional[str],
        "original_filename": str,
        "file_type": str
    }
    
    class Config:
        populate_by_name = True


class DocumentAnalysis(BaseModel):
    """
    AI analysis results untuk documents
    Collection: document_analyses
    """
    _id: str = Field(alias="_id")
    document_id: str  # Reference to GridFS file
    user_id: str
    session_id: Optional[str] = None
    
    # OCR results (if applicable)
    ocr_text: Optional[str] = None
    ocr_confidence: Optional[float] = None
    
    # Document structure
    pages: Optional[List[Dict[str, Any]]] = None
    sections: Optional[List[Dict[str, Any]]] = None
    
    # AI analysis
    document_type: Optional[str] = None
    summary: Optional[str] = None
    key_points: Optional[List[str]] = None
    legal_issues: Optional[List[Dict[str, Any]]] = None
    parties_involved: Optional[List[Dict[str, Any]]] = None
    dates_mentioned: Optional[List[Dict[str, Any]]] = None
    amounts_mentioned: Optional[List[Dict[str, Any]]] = None
    
    # Legal references found
    legal_references: Optional[List[Dict[str, Any]]] = None
    
    # Full extracted text
    full_text: Optional[str] = None
    
    # Metadata
    analysis_model: Optional[str] = None
    analysis_timestamp: datetime
    processing_time_ms: Optional[int] = None
    
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True


class VerificationDocument(BaseModel):
    """
    Professional verification documents
    Collection: verification_documents
    """
    _id: str = Field(alias="_id")
    user_id: str
    filename: str
    content_type: str
    size: int
    content: bytes  # Binary content
    uploaded_at: datetime
    
    class Config:
        populate_by_name = True


class AIResponseCache(BaseModel):
    """
    Cache untuk AI responses (frequently asked questions)
    Collection: ai_response_cache
    """
    _id: str = Field(alias="_id")  # Hash of query
    query: str
    query_hash: str
    
    # Response
    response: str
    model: str
    confidence_score: Optional[float] = None
    
    # Cache metadata
    hit_count: int = 0
    last_accessed: datetime
    created_at: datetime
    expires_at: Optional[datetime] = None
    
    # Context
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    
    class Config:
        populate_by_name = True


class KnowledgeGraphCache(BaseModel):
    """
    Cache untuk EdgeDB knowledge graph queries
    Collection: knowledge_graph_cache
    """
    _id: str = Field(alias="_id")
    query_hash: str
    query: str
    
    # Results
    results: List[Dict[str, Any]]
    
    # Cache metadata
    hit_count: int = 0
    last_accessed: datetime
    created_at: datetime
    expires_at: datetime
    
    class Config:
        populate_by_name = True


class UserActivityLog(BaseModel):
    """
    Detailed user activity log
    Collection: user_activity_logs
    """
    _id: str = Field(alias="_id")
    user_id: str
    
    # Activity details
    activity_type: str  # login, query, document_upload, etc.
    activity_data: Dict[str, Any]
    
    # Context
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device_info: Optional[Dict[str, Any]] = None
    
    # Timestamp
    timestamp: datetime
    
    class Config:
        populate_by_name = True


class DualAIComparison(BaseModel):
    """
    Results dari dual-AI verification
    Collection: dual_ai_comparisons
    """
    _id: str = Field(alias="_id")
    user_id: str
    session_id: str
    message_id: str
    
    # Query
    query: str
    
    # Primary AI (Ark)
    ark_response: str
    ark_model: str
    ark_tokens: int
    ark_response_time_ms: int
    ark_confidence: Optional[float] = None
    
    # Secondary AI (Groq)
    groq_response: str
    groq_model: str
    groq_tokens: int
    groq_response_time_ms: int
    groq_confidence: Optional[float] = None
    
    # Comparison results
    similarity_score: float  # 0-1
    divergence_points: Optional[List[str]] = None
    consensus_points: Optional[List[str]] = None
    
    # Final response (merged/selected)
    final_response: str
    selection_reason: str  # "consensus", "ark_preferred", "groq_preferred", "merged"
    
    # User feedback
    user_selected: Optional[str] = None  # "ark", "groq", "merged"
    user_rating: Optional[int] = None
    
    # Metadata
    created_at: datetime
    
    class Config:
        populate_by_name = True


class FeatureFlagCache(BaseModel):
    """
    Cache untuk feature flags dari Statsig/Hypertune
    Collection: feature_flag_cache
    """
    _id: str = Field(alias="_id")
    flag_name: str
    
    # Flag value
    enabled: bool
    value: Optional[Any] = None
    
    # Targeting
    user_segments: Optional[List[str]] = None
    
    # Cache metadata
    last_synced: datetime
    expires_at: datetime
    
    class Config:
        populate_by_name = True


# MongoDB Collection Names
COLLECTIONS = {
    "chat_transcripts": "chat_transcripts",
    "document_analyses": "document_analyses",
    "verification_documents": "verification_documents",
    "ai_response_cache": "ai_response_cache",
    "knowledge_graph_cache": "knowledge_graph_cache",
    "user_activity_logs": "user_activity_logs",
    "dual_ai_comparisons": "dual_ai_comparisons",
    "feature_flag_cache": "feature_flag_cache"
}


# MongoDB Indexes
INDEXES = {
    "chat_transcripts": [
        ("user_id", 1),
        ("session_id", 1),
        ("created_at", -1)
    ],
    "document_analyses": [
        ("user_id", 1),
        ("document_id", 1),
        ("session_id", 1),
        ("created_at", -1)
    ],
    "verification_documents": [
        ("user_id", 1),
        ("uploaded_at", -1)
    ],
    "ai_response_cache": [
        ("query_hash", 1),
        ("category", 1),
        ("expires_at", 1),
        ("hit_count", -1)
    ],
    "knowledge_graph_cache": [
        ("query_hash", 1),
        ("expires_at", 1)
    ],
    "user_activity_logs": [
        ("user_id", 1),
        ("activity_type", 1),
        ("timestamp", -1)
    ],
    "dual_ai_comparisons": [
        ("user_id", 1),
        ("session_id", 1),
        ("created_at", -1)
    ],
    "feature_flag_cache": [
        ("flag_name", 1),
        ("expires_at", 1)
    ]
}


def setup_mongodb_indexes(db):
    """
    Setup all MongoDB indexes
    """
    for collection_name, indexes in INDEXES.items():
        collection = db[collection_name]
        for index in indexes:
            collection.create_index([index])
    
    print("MongoDB indexes created successfully")
