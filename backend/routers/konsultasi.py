"""
Router untuk menangani endpoint konsultasi hukum
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from pydantic import BaseModel

from ..database import get_db
from ..core.security_updated import get_current_user
from ..services.konsultasi_service import KonsultasiHukumService
from .. import models

router = APIRouter()

class MulaiKonsultasiRequest(BaseModel):
    kategori: str
    konteks_awal: Optional[str] = None

class KirimPesanRequest(BaseModel):
    pesan: str
    fase: Optional[str] = None

class SelesaiKonsultasiRequest(BaseModel):
    rating: Optional[float] = None
    feedback: Optional[str] = None
    pin: Optional[str] = None

@router.post("/mulai")
async def mulai_konsultasi(
    request: MulaiKonsultasiRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Mulai sesi konsultasi baru"""
    try:
        service = KonsultasiHukumService(db)
        sesi, pesan_pembuka = await service.mulai_konsultasi(
            user_id=current_user.id,
            kategori=request.kategori,
            konteks_awal=request.konteks_awal
        )

        return {
            "sesi_id": sesi.id,
            "pesan_pembuka": pesan_pembuka,
            "status": "active"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal memulai konsultasi: {str(e)}"
        )

@router.post("/sesi/{sesi_id}/pesan")
async def kirim_pesan(
    sesi_id: int,
    request: KirimPesanRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Kirim pesan dalam sesi konsultasi"""
    try:
        # Validasi kepemilikan sesi
        sesi = db.query(models.ChatSession).filter(
            models.ChatSession.id == sesi_id,
            models.ChatSession.user_id == current_user.id
        ).first()

        if not sesi:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sesi tidak ditemukan"
            )

        if sesi.status != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sesi sudah selesai"
            )

        # Proses pesan
        service = KonsultasiHukumService(db)
        hasil = await service.proses_pesan(
            sesi_id=sesi_id,
            pesan=request.pesan,
            fase=request.fase
        )

        return hasil

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal memproses pesan: {str(e)}"
        )

@router.post("/sesi/{sesi_id}/selesai")
async def selesaikan_konsultasi(
    sesi_id: int,
    request: SelesaiKonsultasiRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Selesaikan sesi konsultasi"""
    try:
        # Validasi kepemilikan sesi
        sesi = db.query(models.ChatSession).filter(
            models.ChatSession.id == sesi_id,
            models.ChatSession.user_id == current_user.id
        ).first()

        if not sesi:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sesi tidak ditemukan"
            )

        if sesi.status != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sesi sudah selesai"
            )

        # Selesaikan konsultasi
        service = KonsultasiHukumService(db)
        hasil = await service.selesaikan_konsultasi(
            sesi_id=sesi_id,
            rating=request.rating,
            feedback=request.feedback,
            pin=request.pin
        )

        return hasil

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menyelesaikan konsultasi: {str(e)}"
        )

@router.get("/sesi/{sesi_id}/riwayat")
async def ambil_riwayat(
    sesi_id: int,
    pin: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Ambil riwayat konsultasi"""
    try:
        # Validasi kepemilikan sesi
        sesi = db.query(models.ChatSession).filter(
            models.ChatSession.id == sesi_id,
            models.ChatSession.user_id == current_user.id
        ).first()

        if not sesi:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sesi tidak ditemukan"
            )

        # Cek PIN jika sesi sudah selesai
        if sesi.status == "completed" and sesi.pin_hash:
            if not pin:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="PIN diperlukan untuk mengakses riwayat"
                )

            # Validasi PIN
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            if not pwd_context.verify(pin, sesi.pin_hash):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="PIN tidak valid"
                )

        # Ambil pesan
        pesan = db.query(models.ChatMessage).filter(
            models.ChatMessage.session_id == sesi_id
        ).order_by(models.ChatMessage.created_at).all()

        return {
            "sesi": {
                "id": sesi.id,
                "kategori": sesi.category,
                "status": sesi.status,
                "fase": sesi.phase,
                "created_at": sesi.created_at,
                "rating": sesi.rating,
                "feedback": sesi.feedback,
                "analisis": json.loads(sesi.consultation_data) if sesi.consultation_data else None
            },
            "pesan": [
                {
                    "id": p.id,
                    "role": p.role,
                    "content": p.content,
                    "created_at": p.created_at,
                    "metadata": json.loads(p.metadata) if p.metadata else None
                }
                for p in pesan
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal mengambil riwayat: {str(e)}"
        )