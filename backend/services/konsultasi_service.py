"""
Service untuk menangani logika konsultasi hukum AI di Pasalku.ai
"""
from typing import Dict, List, Any, Optional, Tuple
import json
import logging
from datetime import datetime
import httpx
from sqlalchemy.orm import Session

from ..core.config import settings
from ..models import ChatSession, ChatMessage
from . import ai_service

logger = logging.getLogger(__name__)

PANDUAN_KONSULTASI = """
Anda adalah asisten hukum AI Pasalku.ai. Ikuti panduan ini dengan ketat:

ALUR KONSULTASI:
1. Klasifikasi Masalah
   - Identifikasi kategori hukum yang tepat
   - Konfirmasi dengan pengguna

2. Pengumpulan Informasi
   - Ajukan pertanyaan terstruktur
   - Mulai dari umum ke spesifik
   - Catat informasi kunci

3. Simulasi Pengumpulan Bukti
   - Tanyakan bukti yang dimiliki
   - Jelaskan bukti yang diperlukan
   - Analisis kekuatan bukti

4. Rangkuman Pre-Analisis
   - Ringkas semua informasi
   - Konfirmasi dengan pengguna
   - Pastikan tidak ada yang terlewat

5. Analisis Hukum
   - Identifikasi dasar hukum
   - Jelaskan implikasi hukum
   - Berikan opsi penyelesaian

6. Rekomendasi
   - 2-4 opsi solusi
   - Estimasi durasi & biaya
   - Langkah selanjutnya

FORMAT RESPONS:
{
    "klasifikasi": {
        "kategori": "string",
        "sub_kategori": "string",
        "tingkat_urgensi": "rendah|sedang|tinggi"
    },
    "analisis": {
        "ringkasan_masalah": "string",
        "poin_kunci": ["string"],
        "dasar_hukum": ["string"],
        "implikasi": ["string"]
    },
    "bukti": {
        "dimiliki": ["string"],
        "diperlukan": ["string"],
        "kekuatan": "rendah|sedang|tinggi",
        "catatan": "string"
    },
    "opsi_solusi": [
        {
            "judul": "string",
            "deskripsi": "string",
            "langkah": ["string"],
            "estimasi_durasi": "string",
            "estimasi_biaya": "string",
            "tingkat_keberhasilan": "rendah|sedang|tinggi"
        }
    ],
    "rekomendasi": "string",
    "disclaimer": "string"
}
"""

class KonsultasiHukumService:
    def __init__(self, db: Session):
        self.db = db
        self.ai_service = ai_service.get_service()

    async def mulai_konsultasi(
        self,
        user_id: int,
        kategori: str,
        konteks_awal: Optional[str] = None
    ) -> Tuple[ChatSession, str]:
        """Mulai sesi konsultasi baru"""
        try:
            # Buat sesi baru
            sesi = ChatSession(
                user_id=user_id,
                category=kategori,
                status="active",
                phase="initial"
            )
            self.db.add(sesi)
            self.db.commit()
            self.db.refresh(sesi)

            # Generate pesan pembuka
            prompt = f"""
            Mulai sesi konsultasi hukum baru untuk kategori: {kategori}
            
            Instruksi:
            1. Perkenalkan diri sebagai asisten hukum Pasalku.ai
            2. Jelaskan alur konsultasi secara singkat
            3. Mulai dengan pertanyaan awal yang relevan
            4. Sertakan disclaimer singkat
            
            Konteks tambahan: {konteks_awal if konteks_awal else 'Tidak ada'}
            """

            response = await self.ai_service.get_legal_response(
                prompt,
                user_context=str(user_id)
            )

            # Simpan pesan pembuka
            pesan = ChatMessage(
                session_id=sesi.id,
                role="assistant",
                content=response["message"],
                metadata=json.dumps(response.get("metadata", {}))
            )
            self.db.add(pesan)
            self.db.commit()

            return sesi, response["message"]

        except Exception as e:
            logger.error(f"Error memulai konsultasi: {str(e)}")
            self.db.rollback()
            raise

    async def proses_pesan(
        self,
        sesi_id: int,
        pesan: str,
        fase: Optional[str] = None
    ) -> Dict[str, Any]:
        """Proses pesan dalam sesi konsultasi"""
        try:
            # Ambil sesi
            sesi = self.db.query(ChatSession).filter_by(id=sesi_id).first()
            if not sesi:
                raise ValueError("Sesi tidak ditemukan")

            # Ambil riwayat pesan
            riwayat = self.db.query(ChatMessage).filter_by(
                session_id=sesi_id
            ).order_by(ChatMessage.created_at).all()

            # Bangun konteks
            konteks = self._bangun_konteks(sesi, riwayat)

            # Proses dengan AI
            hasil = await self.ai_service.get_legal_response(
                pesan,
                user_context=konteks,
                phase=fase or sesi.phase
            )

            # Simpan pesan pengguna
            pesan_user = ChatMessage(
                session_id=sesi_id,
                role="user",
                content=pesan
            )
            self.db.add(pesan_user)

            # Simpan respons AI
            pesan_ai = ChatMessage(
                session_id=sesi_id,
                role="assistant",
                content=hasil["message"],
                metadata=json.dumps(hasil.get("metadata", {}))
            )
            self.db.add(pesan_ai)

            # Update fase sesi jika perlu
            if fase:
                sesi.phase = fase
                
            # Update data konsultasi
            if "analisis" in hasil:
                sesi.consultation_data = json.dumps(hasil["analisis"])

            self.db.commit()

            return hasil

        except Exception as e:
            logger.error(f"Error memproses pesan: {str(e)}")
            self.db.rollback()
            raise

    async def selesaikan_konsultasi(
        self,
        sesi_id: int,
        rating: Optional[float] = None,
        feedback: Optional[str] = None,
        pin: Optional[str] = None
    ) -> Dict[str, Any]:
        """Selesaikan sesi konsultasi"""
        try:
            sesi = self.db.query(ChatSession).filter_by(id=sesi_id).first()
            if not sesi:
                raise ValueError("Sesi tidak ditemukan")

            # Generate ringkasan akhir
            riwayat = self.db.query(ChatMessage).filter_by(
                session_id=sesi_id
            ).order_by(ChatMessage.created_at).all()

            ringkasan = await self._generate_ringkasan(sesi, riwayat)

            # Update sesi
            sesi.status = "completed"
            sesi.phase = "completed"
            if rating:
                sesi.rating = rating
            if feedback:
                sesi.feedback = feedback
            if pin:
                sesi.pin_hash = self._hash_pin(pin)

            # Simpan ringkasan sebagai pesan terakhir
            pesan_ringkasan = ChatMessage(
                session_id=sesi_id,
                role="assistant",
                content=ringkasan["message"],
                metadata=json.dumps(ringkasan.get("metadata", {}))
            )
            self.db.add(pesan_ringkasan)
            self.db.commit()

            return {
                "status": "completed",
                "ringkasan": ringkasan["message"],
                "analisis": json.loads(sesi.consultation_data) if sesi.consultation_data else None
            }

        except Exception as e:
            logger.error(f"Error menyelesaikan konsultasi: {str(e)}")
            self.db.rollback()
            raise

    def _bangun_konteks(
        self,
        sesi: ChatSession,
        riwayat: List[ChatMessage]
    ) -> str:
        """Bangun konteks untuk AI dari riwayat konsultasi"""
        konteks = [
            f"SESI KONSULTASI: {sesi.category}",
            f"FASE: {sesi.phase}",
            f"STATUS: {sesi.status}",
            "\nRIWAYAT PERCAKAPAN:"
        ]

        for pesan in riwayat[-5:]:  # Ambil 5 pesan terakhir saja
            konteks.append(f"{pesan.role}: {pesan.content}")

        if sesi.consultation_data:
            konteks.append("\nANALISIS SEBELUMNYA:")
            konteks.append(sesi.consultation_data)

        return "\n".join(konteks)

    async def _generate_ringkasan(
        self,
        sesi: ChatSession,
        riwayat: List[ChatMessage]
    ) -> Dict[str, Any]:
        """Generate ringkasan akhir konsultasi"""
        prompt = """
        Buat ringkasan komprehensif dari sesi konsultasi ini.
        
        Format ringkasan:
        1. Klasifikasi Masalah Hukum
        2. Kronologi & Fakta Utama
        3. Analisis Hukum
        4. Bukti yang Dibahas
        5. Opsi Solusi yang Diberikan
        6. Rekomendasi Berikutnya
        7. Disclaimer
        """

        return await self.ai_service.get_legal_response(
            prompt,
            user_context=self._bangun_konteks(sesi, riwayat)
        )

    def _hash_pin(self, pin: str) -> str:
        """Hash PIN untuk penyimpanan aman"""
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.hash(pin)