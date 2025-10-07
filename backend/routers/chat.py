"""
Router untuk handle chat dengan AI
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from typing import List, Optional

logger = logging.getLogger(__name__)

import crud
import schemas
import models
from core.security import get_current_user
from database import get_db
from ai_service import ai_service

router = APIRouter()

@router.post("/query", response_model=schemas.ChatResponse)
async def chat_with_ai(
    chat_request: schemas.ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Chat dengan AI untuk mendapatkan jawaban hukum (JSON endpoint)
    """
    try:
        # Validasi input
        if not chat_request.query or len(chat_request.query.strip()) < 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pertanyaan harus lebih dari 5 karakter"
            )

        # Dapatkan respon dari layanan AI
        user_context = f"Role: {current_user.role}, Email: {current_user.email}"
        response = await ai_service.get_legal_response(
            query=chat_request.query,
            user_context=user_context
        )

        # Simpan riwayat chat ke database
        try:
            _ = crud.create_chat_history(
                db=db,
                user_id=current_user.id,
                query=chat_request.query,
                response=response["answer"]
            )
        except Exception as db_error:
            logger.warning(f"Failed to save chat history: {db_error}")

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan saat memproses permintaan: {str(e)}"
        )

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

        # Dapatkan respon dari layanan AI
        user_context = f"Role: {current_user.role}, Email: {current_user.email}"
        response = await ai_service.get_legal_response(
            query=message,
            user_context=user_context
        )

        # Simpan riwayat chat ke database
        try:
            chat_history = crud.create_chat_history(
                db=db,
                user_id=current_user.id,
                query=message,
                response=response["answer"]
            )
        except Exception as db_error:
            logger.warning(f"Failed to save chat history: {db_error}")

        # Return in format expected by frontend
        return {
            "response": response["answer"],
            "citations": response.get("citations", []),
            "disclaimer": response.get("disclaimer", ""),
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

@router.get("/history", response_model=List[schemas.ChatHistory])
async def get_chat_history(
    skip: int = 0,
    limit: int = 10,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Dapatkan riwayat chat pengguna
    """
    return crud.get_chat_histories(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
