from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import httpx
import json

from ..database import get_db
from ..models.consultation import ConsultationSession, ConsultationMessage, LegalCategory
from ..core.security import get_current_user
from ..services.ai_agent import AIConsultationAgent
from ..core.config import settings

router = APIRouter()
ai_agent = AIConsultationAgent()

@router.post("/sessions/create")
async def create_consultation_session(
    category: LegalCategory,
    session_name: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new consultation session"""
    session = ConsultationSession(
        user_id=current_user.id,
        session_name=session_name,
        legal_category=category,
        status="active"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Create initial AI greeting
    initial_message = ai_agent.generate_greeting(category)
    message = ConsultationMessage(
        session_id=session.id,
        role="assistant",
        content=initial_message
    )
    db.add(message)
    db.commit()

    return {
        "session_id": session.id,
        "initial_message": initial_message
    }

@router.post("/sessions/{session_id}/message")
async def send_message(
    session_id: int,
    message: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Send a message in a consultation session"""
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Save user message
    user_message = ConsultationMessage(
        session_id=session_id,
        role="user",
        content=message
    )
    db.add(user_message)
    db.commit()

    # Get conversation history
    history = db.query(ConsultationMessage).filter(
        ConsultationMessage.session_id == session_id
    ).order_by(ConsultationMessage.created_at).all()

    # Generate AI response
    ai_response = ai_agent.generate_response(
        message,
        history,
        session.legal_category
    )

    # Save AI response
    ai_message = ConsultationMessage(
        session_id=session_id,
        role="assistant",
        content=ai_response
    )
    db.add(ai_message)
    db.commit()

    return {
        "response": ai_response
    }

@router.post("/sessions/{session_id}/complete")
async def complete_session(
    session_id: int,
    pin: str,
    rating: float,
    feedback: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Complete a consultation session with rating and PIN protection"""
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Update session with completion data
    session.status = "completed"
    session.pin_hash = ai_agent.hash_pin(pin)  # Implement secure PIN hashing
    session.rating = rating
    session.feedback = feedback
    
    db.commit()

    return {"status": "completed"}