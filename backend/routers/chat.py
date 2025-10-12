"""
Enhanced Chat Router dengan BytePlus Ark AI Integration
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import hashlib
import logging

from ..database import get_db, get_mongodb
from ..models.user import User
from ..models.chat import ChatSession, AIQueryLog, SessionAnalytics
from ..middleware.auth import (
    get_current_active_user,
    check_query_limit,
    log_action
)
from ..services.ark_ai_service import ark_ai_service

logger = logging.getLogger(__name__)

router = APIRouter()


# Pydantic models
class ChatMessageRequest(BaseModel):
    content: str
    session_id: Optional[str] = None
    persona: Optional[str] = "default"
    category: Optional[str] = None


class ChatMessageResponse(BaseModel):
    message_id: str
    session_id: str
    role: str
    content: str
    citations: Optional[List[Dict[str, str]]] = None
    confidence_score: Optional[float] = None
    usage: Dict[str, int]
    response_time_ms: int
    created_at: datetime


class SessionCreateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    pin: Optional[str] = None


class SessionResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str]
    category: Optional[str]
    status: str
    message_count: int
    is_pin_protected: bool
    created_at: datetime
    last_message_at: Optional[datetime]
    
    class Config:
        from_attributes = True


@router.post("/message", response_model=ChatMessageResponse, tags=["Chat"])
@log_action("chat.message_sent", "chat_session")
async def send_message(
    message_request: ChatMessageRequest,
    current_user: User = Depends(check_query_limit),
    db: Session = Depends(get_db),
    mongodb = Depends(get_mongodb),
    request: Request = None
):
    """
    Send message to AI and get response.
    Creates new session if session_id not provided.
    """
    # Get or create session
    if message_request.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == uuid.UUID(message_request.session_id),
            ChatSession.user_id == current_user.id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        # Create new session
        session = ChatSession(
            user_id=current_user.id,
            title=message_request.content[:50] + "..." if len(message_request.content) > 50 else message_request.content,
            category=message_request.category,
            ai_model="ark-default",
            ai_persona=message_request.persona,
            mongodb_transcript_id=str(uuid.uuid4())
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        logger.info(f"New chat session created: {session.id} for user {current_user.id}")
    
    # Get conversation history from MongoDB
    transcript = mongodb.chat_transcripts.find_one({"_id": session.mongodb_transcript_id})
    
    conversation_history = []
    if transcript:
        conversation_history = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in transcript.get("messages", [])
        ]
    
    # Get AI response
    ai_result = await ark_ai_service.legal_consultation(
        user_query=message_request.content,
        conversation_history=conversation_history,
        persona=message_request.persona
    )
    
    if not ai_result["success"]:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {ai_result.get('error', 'Unknown error')}"
        )
    
    # Create message objects
    user_message = {
        "role": "user",
        "content": message_request.content,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    assistant_message = {
        "role": "assistant",
        "content": ai_result["content"],
        "timestamp": datetime.utcnow().isoformat(),
        "model": ai_result["model"],
        "tokens": ai_result["usage"]["completion_tokens"],
        "confidence_score": ai_result.get("confidence_score"),
        "citations": ai_result.get("citations", [])
    }
    
    # Update MongoDB transcript
    if transcript:
        mongodb.chat_transcripts.update_one(
            {"_id": session.mongodb_transcript_id},
            {
                "$push": {
                    "messages": {"$each": [user_message, assistant_message]}
                },
                "$set": {
                    "updated_at": datetime.utcnow()
                }
            }
        )
    else:
        # Create new transcript
        mongodb.chat_transcripts.insert_one({
            "_id": session.mongodb_transcript_id,
            "user_id": current_user.id,
            "session_id": str(session.id),
            "messages": [user_message, assistant_message],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
    
    # Update session metadata
    session.message_count += 2
    session.total_tokens_used += ai_result["usage"]["total_tokens"]
    session.last_message_at = datetime.utcnow()
    
    # Update confidence average
    if ai_result.get("confidence_score"):
        if session.ai_confidence_avg:
            session.ai_confidence_avg = (session.ai_confidence_avg + ai_result["confidence_score"]) / 2
        else:
            session.ai_confidence_avg = ai_result["confidence_score"]
    
    # Log AI query
    ai_log = AIQueryLog(
        user_id=current_user.id,
        session_id=session.id,
        query_type="chat",
        ai_provider="ark",
        model=ai_result["model"],
        prompt_tokens=ai_result["usage"]["prompt_tokens"],
        completion_tokens=ai_result["usage"]["completion_tokens"],
        total_tokens=ai_result["usage"]["total_tokens"],
        response_time_ms=ai_result["response_time_ms"],
        confidence_score=ai_result.get("confidence_score")
    )
    db.add(ai_log)
    
    # Update user query count
    current_user.ai_queries_count += 1
    current_user.ai_queries_this_month += 1
    current_user.last_query_at = datetime.utcnow()
    
    db.commit()
    
    return ChatMessageResponse(
        message_id=str(uuid.uuid4()),
        session_id=str(session.id),
        role="assistant",
        content=ai_result["content"],
        citations=ai_result.get("citations"),
        confidence_score=ai_result.get("confidence_score"),
        usage=ai_result["usage"],
        response_time_ms=ai_result["response_time_ms"],
        created_at=datetime.utcnow()
    )


@router.post("/sessions", response_model=SessionResponse, tags=["Chat"])
async def create_session(
    session_request: SessionCreateRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create new chat session"""
    session = ChatSession(
        user_id=current_user.id,
        title=session_request.title or "New Consultation",
        category=session_request.category,
        mongodb_transcript_id=str(uuid.uuid4())
    )
    
    # Set PIN if provided
    if session_request.pin:
        import bcrypt
        salt = bcrypt.gensalt()
        pin_hash = bcrypt.hashpw(session_request.pin.encode(), salt)
        session.pin_hash = pin_hash.decode()
        session.pin_salt = salt.decode()
        session.is_pin_protected = True
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return SessionResponse(
        id=str(session.id),
        user_id=session.user_id,
        title=session.title,
        category=session.category,
        status=session.status,
        message_count=session.message_count,
        is_pin_protected=session.is_pin_protected,
        created_at=session.created_at,
        last_message_at=session.last_message_at
    )


@router.get("/sessions", tags=["Chat"])
async def list_sessions(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    status: str = "active",
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List user's chat sessions"""
    query = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id,
        ChatSession.status == status
    )
    
    if category:
        query = query.filter(ChatSession.category == category)
    
    sessions = query.order_by(ChatSession.last_message_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "total": query.count(),
        "sessions": [
            SessionResponse(
                id=str(s.id),
                user_id=s.user_id,
                title=s.title,
                category=s.category,
                status=s.status,
                message_count=s.message_count,
                is_pin_protected=s.is_pin_protected,
                created_at=s.created_at,
                last_message_at=s.last_message_at
            )
            for s in sessions
        ]
    }


@router.get("/sessions/{session_id}", tags=["Chat"])
async def get_session(
    session_id: str,
    pin: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    mongodb = Depends(get_mongodb)
):
    """Get session details with full transcript"""
    session = db.query(ChatSession).filter(
        ChatSession.id == uuid.UUID(session_id),
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check PIN if protected
    if session.is_pin_protected:
        if not pin:
            raise HTTPException(status_code=403, detail="PIN required")
        
        import bcrypt
        if not bcrypt.checkpw(pin.encode(), session.pin_hash.encode()):
            raise HTTPException(status_code=403, detail="Invalid PIN")
    
    # Get transcript from MongoDB
    transcript = mongodb.chat_transcripts.find_one({"_id": session.mongodb_transcript_id})
    
    messages = []
    if transcript:
        messages = transcript.get("messages", [])
    
    return {
        "session": SessionResponse(
            id=str(session.id),
            user_id=session.user_id,
            title=session.title,
            category=session.category,
            status=session.status,
            message_count=session.message_count,
            is_pin_protected=session.is_pin_protected,
            created_at=session.created_at,
            last_message_at=session.last_message_at
        ),
        "messages": messages,
        "analytics": {
            "total_tokens": session.total_tokens_used,
            "avg_confidence": session.ai_confidence_avg,
            "rating": session.rating
        }
    }


@router.put("/sessions/{session_id}", tags=["Chat"])
async def update_session(
    session_id: str,
    title: Optional[str] = None,
    status: Optional[str] = None,
    rating: Optional[int] = None,
    feedback: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update session metadata"""
    session = db.query(ChatSession).filter(
        ChatSession.id == uuid.UUID(session_id),
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if title:
        session.title = title
    if status:
        session.status = status
        if status == "archived":
            session.archived_at = datetime.utcnow()
    if rating:
        session.rating = rating
    if feedback:
        session.feedback = feedback
    
    session.updated_at = datetime.utcnow()
    db.commit()
    
    return {"status": "success", "message": "Session updated"}


@router.delete("/sessions/{session_id}", tags=["Chat"])
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    mongodb = Depends(get_mongodb)
):
    """Delete session (soft delete)"""
    session = db.query(ChatSession).filter(
        ChatSession.id == uuid.UUID(session_id),
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Soft delete
    session.status = "deleted"
    session.updated_at = datetime.utcnow()
    db.commit()
    
    return {"status": "success", "message": "Session deleted"}
