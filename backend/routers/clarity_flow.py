from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.core.security_updated import get_current_user
from backend.services.ai_service import ai_service
from backend.models import Konsultasi
from backend.schemas.riwayat import DetailKonsultasi

router = APIRouter(prefix="/clarity", tags=["clarity-flow"])

@router.post("/start", response_model=DetailKonsultasi)
async def start_clarity_flow(
    kategori: str,
    deskripsi: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mulai sesi konsultasi hukum AI dengan alur clarity flow:
    - Klasifikasi masalah
    - Pengumpulan info
    - Analisis hukum
    - Simulasi durasi/biaya
    """
    # Klasifikasi masalah
    klasifikasi = await ai_service.classify_problem(deskripsi)
    
    # Analisis hukum
    analisis = await ai_service.get_legal_response(deskripsi)
    
    # Simulasi durasi/biaya
    estimasi = await ai_service.estimate_duration_cost(deskripsi)
    
    # Simpan sesi konsultasi
    sesi = Konsultasi(
        user_id=current_user.id,
        kategori=kategori,
        status="active",
        fase="clarity",
        created_at=None,
        analisis={
            "klasifikasi": klasifikasi,
            "analisis": analisis,
            "estimasi": estimasi
        }
    )
    db.add(sesi)
    db.commit()
    db.refresh(sesi)
    
    return DetailKonsultasi(
        id=sesi.id,
        kategori=sesi.kategori,
        status=sesi.status,
        fase=sesi.fase,
        created_at=sesi.created_at,
        analisis=sesi.analisis,
        pesan=[]
    )