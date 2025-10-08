"""
Router untuk handle chat dengan AI - Updated Version
"""
import logging
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
from backend.ai_service import ai_service

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
