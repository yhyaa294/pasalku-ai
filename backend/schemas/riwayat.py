from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class RiwayatKonsultasi(BaseModel):
    id: str
    kategori: str
    status: str
    fase: str
    created_at: datetime
    rating: Optional[int] = None
    feedback: Optional[str] = None

class DetailKonsultasi(RiwayatKonsultasi):
    analisis: Optional[dict] = None
    pesan: List[dict]

    class Config:
        from_attributes = True