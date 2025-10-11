from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Konsultasi, Pesan
from ..schemas import RiwayatKonsultasi, DetailKonsultasi
from ..core.security_updated import get_current_user, verify_pin

router = APIRouter(prefix="/riwayat", tags=["riwayat"])

@router.get("/", response_model=List[RiwayatKonsultasi])
async def get_riwayat(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mendapatkan daftar riwayat konsultasi pengguna."""
    riwayat = db.query(Konsultasi).filter(
        Konsultasi.user_id == current_user.id
    ).order_by(Konsultasi.created_at.desc()).all()
    
    return [
        RiwayatKonsultasi(
            id=k.id,
            kategori=k.kategori,
            status=k.status,
            fase=k.fase,
            created_at=k.created_at,
            rating=k.rating,
            feedback=k.feedback
        ) for k in riwayat
    ]

@router.get("/{sesi_id}", response_model=DetailKonsultasi)
async def get_detail_sesi(
    sesi_id: str,
    pin: str = None,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mendapatkan detail sesi konsultasi tertentu."""
    # Cari sesi konsultasi
    sesi = db.query(Konsultasi).filter(
        Konsultasi.id == sesi_id,
        Konsultasi.user_id == current_user.id
    ).first()
    
    if not sesi:
        raise HTTPException(
            status_code=404,
            detail="Sesi konsultasi tidak ditemukan"
        )
    
    # Verifikasi PIN jika sesi sudah selesai
    if sesi.status == "completed":
        if not pin:
            raise HTTPException(
                status_code=400,
                detail="PIN diperlukan untuk melihat sesi yang sudah selesai"
            )
        
        # Verifikasi PIN
        if not verify_pin(current_user, pin):
            raise HTTPException(
                status_code=403,
                detail="PIN tidak valid"
            )
    
    # Ambil riwayat pesan
    pesan = db.query(Pesan).filter(
        Pesan.konsultasi_id == sesi_id
    ).order_by(Pesan.created_at.asc()).all()
    
    return DetailKonsultasi(
        id=sesi.id,
        kategori=sesi.kategori,
        status=sesi.status,
        fase=sesi.fase,
        created_at=sesi.created_at,
        rating=sesi.rating,
        feedback=sesi.feedback,
        analisis=sesi.analisis,
        pesan=[{
            "id": p.id,
            "role": p.role,
            "content": p.content,
            "created_at": p.created_at,
            "metadata": p.metadata
        } for p in pesan]
    )