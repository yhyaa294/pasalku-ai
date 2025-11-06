"""
MongoDB Schema for Orchestrator Conversations
Store full conversation context, analysis, and feature usage
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ConversationMessage(BaseModel):
    """Single message in conversation"""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None


class ConversationSession(BaseModel):
    """Full conversation session with AI Orchestrator"""
    
    # Identifiers
    session_id: str
    user_id: Optional[str] = None  # Clerk user ID if authenticated
    
    # Conversation data
    messages: List[ConversationMessage] = []
    
    # Context tracking
    legal_area: str = "general"
    current_stage: int = 1  # 1-5 stages
    user_tier: str = "free"
    
    # AI analysis
    detected_signals: Dict[str, Any] = {}
    suggested_features: List[Dict[str, Any]] = []
    features_used: List[str] = []  # IDs of features user actually used
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    
    # Status
    status: str = "active"  # active, completed, abandoned
    
    # Results
    analysis_results: Optional[Dict[str, Any]] = None
    report_generated: bool = False
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ConversationSummary(BaseModel):
    """Lightweight summary for listing conversations"""
    session_id: str
    user_id: Optional[str]
    legal_area: str
    current_stage: int
    message_count: int
    created_at: datetime
    last_activity: datetime
    status: str
    first_message_preview: Optional[str] = None


# MongoDB collection name
COLLECTION_NAME = "orchestrator_conversations"
