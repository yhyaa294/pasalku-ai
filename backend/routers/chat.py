"""
Router untuk handle chat dengan AI
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, models
from ..core.security import get_current_user
from ..database import get_db
from ..ai_service import byteplus_service

router = APIRouter()

@router.post("/query", response_model=schemas.ChatResponse)
async def chat_with_ai(
    chat_request: schemas.ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Chat dengan AI untuk mendapatkan jawaban hukum
    """
    try:
        # Validasi input
        if not chat_request.query or len(chat_request.query.strip()) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pertanyaan harus lebih dari 10 karakter"
            )

        # Dapatkan respon dari layanan AI
        response = await byteplus_service.get_legal_response(chat_request.query)
        
        # Simpan riwayat chat ke database
        chat_history = crud.create_chat_history(
            db=db,
            chat_history=schemas.ChatHistoryCreate(
                user_id=current_user.id,
                query=chat_request.query,
                response=response.response,
                source_documents=response.source_documents
            )
        )
        
        return response
        
    except Exception as e:
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
