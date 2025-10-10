"""
Router untuk handle chat dengan AI - Updated Version
"""
import logging
import json
from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

logger = logging.getLogger(__name__)

from backend import crud
from backend import schemas
from backend import models
from backend.core.security_updated import get_current_user
from backend.database import get_db
from backend.services.ai_service_enhanced import ai_service_enhanced as ai_service

router = APIRouter()

@router.post("/consult", response_model=schemas.ChatResponse)
async def consult_with_ai(
    chat_request: schemas.ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Konsultasi hukum dengan AI (authenticated endpoint)
    """
    try:
        # Validasi input
        if not chat_request.query or len(chat_request.query.strip()) < 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pertanyaan harus lebih dari 5 karakter"
            )

        # Get or create session
        session_id = chat_request.session_id
        if not session_id:
            # Create new session
            session = crud.create_chat_session(db, current_user.id, f"Session {chat_request.query[:50]}...")
            session_id = session.id
        else:
            # Verify session belongs to user
            session = crud.get_chat_session(db, session_id, current_user.id)
            if not session:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Session tidak ditemukan"
                )

        # Get AI response
        user_context = f"Role: {current_user.role}, Email: {current_user.email}"
        response = await ai_service.get_legal_response(
            query=chat_request.query,
            user_context=user_context
        )

        # Save user message
        crud.create_chat_message(
            db, session_id, "user", chat_request.query
        )

        # Save AI response
        crud.create_chat_message(
            db, session_id, "assistant", response["answer"], response.get("citations", [])
        )

        return {
            "session_id": session_id,
            "message": response["answer"],
            "citations": response.get("citations", []),
            "disclaimer": response.get("disclaimer", "")
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in consult endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat memproses permintaan: {str(e)}"
        )

@router.get("/history", response_model=List[schemas.ChatSession])
async def get_chat_history(
    skip: int = 0,
    limit: int = 10,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Dapatkan riwayat sesi chat pengguna
    """
    return crud.get_user_chat_sessions(db, current_user.id, skip, limit)

@router.get("/session/{session_id}", response_model=schemas.ChatHistory)
async def get_chat_session_detail(
    session_id: UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Dapatkan detail sesi chat tertentu
    """
    history = crud.get_chat_history(db, session_id, current_user.id)
    if not history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session tidak ditemukan"
        )

    return history

@router.delete("/session/{session_id}")
async def delete_chat_session(
    session_id: UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Hapus sesi chat
    """
    success = crud.delete_chat_session(db, session_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session tidak ditemukan"
        )

    return {"message": "Session berhasil dihapus"}

# Legacy endpoint for backward compatibility
@router.post("", response_model=dict)  # Frontend calls /api/chat directly
async def chat_with_ai_form(
    message: str = Form(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Chat dengan AI untuk mendapatkan jawaban hukum (Form endpoint for frontend compatibility)
    """
    try:
        # Validasi input
        if not message or len(message.strip()) < 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pertanyaan harus lebih dari 5 karakter"
            )

        # Create new session for legacy endpoint
        session = crud.create_chat_session(db, current_user.id, f"Legacy: {message[:50]}...")

        # Get AI response
        user_context = f"Role: {current_user.role}, Email: {current_user.email}"
        response = await ai_service.get_legal_response(
            query=message,
            user_context=user_context
        )

        # Save messages
        crud.create_chat_message(db, session.id, "user", message)
        crud.create_chat_message(db, session.id, "assistant", response["answer"], response.get("citations", []))

        # Return in format expected by frontend
        return {
            "response": response["answer"],
            "citations": response.get("citations", []),
            "disclaimer": response.get("disclaimer", ""),
            "session_id": str(session.id),
            "success": True
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat form endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat memproses permintaan: {str(e)}"
        )

# Enhanced endpoints for Clarity Flow and PIN access

@router.post("/start", response_model=schemas.ChatSession)
async def start_clarity_flow_session(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start a new Clarity Flow consultation session
    """
    session = crud.create_chat_session(db, current_user.id, "Clarity Flow Consultation")
    crud.update_chat_session_enhanced(db, session.id, schemas.ChatSessionUpdate(phase="initial"))
    return session

@router.post("/flow/{session_id}")
async def process_clarity_flow(
    session_id: UUID,
    user_input: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Process Clarity Flow phases
    """
    session = crud.get_chat_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Get current phase and consultation data
    phase = session.phase or "initial"
    consultation_data = {}
    if session.consultation_data:
        try:
            consultation_data = json.loads(session.consultation_data)
        except:
            consultation_data = {}

    # Get AI response for current phase
    response = await ai_service.get_clarity_flow_response(
        phase=phase,
        user_input=user_input,
        consultation_data=consultation_data,
        session_history=crud.get_chat_messages(db, session_id, limit=20)
    )

    # Update session based on phase
    next_phase = phase
    if phase == "initial":
        next_phase = "classification"
    elif phase == "classification":
        if user_input.lower() in ["ya", "yes"]:
            next_phase = "questions"
        else:
            # User provided different category
            consultation_data["category"] = user_input
            next_phase = "questions"
    elif phase == "questions":
        # Store answer and check if more questions needed
        answers = consultation_data.get("answers", [])
        answers.append(user_input)
        consultation_data["answers"] = answers
        current_index = consultation_data.get("current_question_index", 0) + 1
        consultation_data["current_question_index"] = current_index

        questions = ai_service.get_structured_questions(consultation_data.get("category", ""))
        if current_index >= len(questions):
            next_phase = "evidence"
    elif phase == "evidence":
        consultation_data["evidence"] = user_input
        next_phase = "summary"
    elif phase == "summary":
        if user_input.lower() in ["ya", "yes"]:
            next_phase = "analysis"
        else:
            next_phase = "questions"  # Go back to questions for correction
    elif phase == "analysis":
        next_phase = "naming"
    elif phase == "naming":
        crud.update_chat_session_enhanced(db, session_id, schemas.ChatSessionUpdate(title=user_input))
        next_phase = "clarification"

    # Update session
    update_data = schemas.ChatSessionUpdate(
        phase=next_phase,
        consultation_data=schemas.ConsultationData(**consultation_data)
    )
    if phase == "classification" and "category" in response:
        update_data.category = response["category"]

    crud.update_chat_session_enhanced(db, session_id, update_data)

    # Save messages
    crud.create_chat_message(db, session_id, "user", user_input)
    crud.create_chat_message(db, session_id, "assistant", response["message"], response.get("citations", []))

    return {
        "session_id": session_id,
        "message": response["message"],
        "citations": response.get("citations", []),
        "disclaimer": response.get("disclaimer", ""),
        "phase": next_phase
    }

@router.post("/save/{session_id}")
async def save_session_with_pin(
    session_id: UUID,
    pin_request: schemas.PINVerification,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save session with PIN for access
    """
    session = crud.get_chat_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    crud.update_chat_session_enhanced(db, session_id, schemas.ChatSessionUpdate(pin=pin_request.pin))
    return {"message": "Session saved with PIN protection"}

@router.post("/access")
async def access_session_with_pin(
    access_request: schemas.SessionAccessRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Access session with PIN
    """
    session_data = crud.get_session_with_access(
        db, access_request.session_id, current_user.id, access_request.pin
    )
    if not session_data:
        raise HTTPException(status_code=403, detail="Invalid PIN or session not found")

    return schemas.SessionAccessResponse(**session_data)

@router.get("/history-enhanced", response_model=List[schemas.ChatSessionWithAccess])
async def get_chat_history_enhanced(
    skip: int = 0,
    limit: int = 10,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get chat history with PIN status
    """
    return crud.get_user_sessions_with_pin_status(db, current_user.id, skip, limit)

@router.post("/feedback/{session_id}")
async def submit_feedback(
    session_id: UUID,
    feedback: schemas.FeedbackRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit feedback for a session
    """
    session = crud.get_chat_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    crud.save_session_feedback(db, session_id, feedback.rating, feedback.feedback)
    return {"message": "Feedback submitted successfully"}
