"""
Server Sederhana Untuk Pasalku.ai MVP
Fokus pada fitur utama tanpa dependency complex
"""
import logging
import asyncio
from fastapi import FastAPI, HTTPException, status, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import sys
from pathlib import Path

# Tambahkan backend ke path Python
backend_path = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_path))

from core.config import settings, get_settings
from database import init_db
from ai_service import ai_service

# Setup logging sederhana
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Buat FastAPI app
app = FastAPI(
    title="Pasalku.ai MVP",
    description="Asisten Hukum AI Sederhana",
    version="1.0.0"
)

# CORS agar bisa diakses dari frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Endpoint root untuk health check"""
    return {
        "message": "Pasalku.ai MVP Server Running",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Pasalku.ai server is healthy",
        "timestamp": "2025-01-01T00:00:00",
        "environment": settings.ENVIRONMENT,
        "ai_service_available": True  # Simplified
    }

@app.post("/api/auth/register")
async def register_user(email: str = Form(...), password: str = Form(...), full_name: str = Form(...)):
    """Registrasi user sederhana"""
    # Untuk MVP, simpan di memory saja atau gunakan SQLite sederhana
    return {
        "message": "User registered successfully",
        "user": {
            "email": email,
            "full_name": full_name,
            "is_active": True
        }
    }

@app.post("/api/auth/login")
async def login_user(username: str = Form(...), password: str = Form(...)):
    """Login sederhana untuk demo"""
    try:
        logger.info(f"Login attempt for: {username}")

        # Untuk demo, izinkan login dengan password apapun (MVP)
        # Dalam production, validasi password hash dari database

        return {
            "access_token": "demo-jwt-token-mvp-12345",
            "refresh_token": "demo-refresh-token-12345",
            "token_type": "bearer",
            "user": {
                "id": "1",
                "email": username,
                "full_name": "Pengguna Test",
                "role": "user",
                "is_active": True
            }
        }
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login error"
        )

@app.post("/api/auth/login-phone")
async def login_phone(phone_number: str = Form(...)):
    """Login via nomor HP dengan SMS OTP"""
    # Generate OTP sederhana
    import random
    otp = str(random.randint(100000, 999999))

    # Simpan OTP di memory (untuk MVP)
    temp_otps = getattr(app.state, 'temp_otps', {})
    temp_otps[phone_number] = otp
    app.state.temp_otps = temp_otps

    logger.info(f"SMS OTP untuk {phone_number}: {otp} (DEMO MODE)")

    return {
        "message": "OTP telah dikirim ke nomor HP Anda",
        "phone_number": phone_number,
        "expires_in": 300  # 5 menit
    }

@app.post("/api/auth/verify-phone")
async def verify_phone(phone_number: str = Form(...), otp: str = Form(...)):
    """Verifikasi OTP nomor HP"""
    temp_otps = getattr(app.state, 'temp_otps', {})

    if phone_number not in temp_otps:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP tidak ditemukan atau sudah expired"
        )

    if temp_otps[phone_number] != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP tidak valid"
        )

    # Hapus OTP setelah digunakan
    del temp_otps[phone_number]

    return {
        "access_token": f"phone-jwt-token-{phone_number}-12345",
        "refresh_token": f"phone-refresh-token-{phone_number}-12345",
        "token_type": "bearer",
        "user": {
            "id": f"phone-{phone_number}",
            "email": f"{phone_number}@phone.pasalku.ai",
            "phone_number": phone_number,
            "full_name": f"Pengguna HP {phone_number[-4:]}",
            "role": "user",
            "is_active": True
        }
    }

@app.post("/api/auth/google-login")
async def google_login(code: str = Form(...), state: str = Form(...)):
    """Simulasi Google OAuth login untuk MVP"""
    # Dalam production, validasi code dengan Google OAuth API
    # Untuk MVP, simpan saja

    logger.info(f"Google OAuth code: {code[:20]}... state: {state}")

    return {
        "access_token": "google-oauth-token-12345",
        "refresh_token": "google-refresh-token-12345",
        "token_type": "bearer",
        "user": {
            "id": "google-12345",
            "email": "user@gmail.com",
            "full_name": "Pengguna Google",
            "provider": "google",
            "role": "user",
            "is_active": True
        }
    }

@app.post("/api/auth/github-login")
async def github_login(code: str = Form(...)):
    """Simulasi GitHub OAuth login untuk MVP"""
    logger.info(f"GitHub OAuth code: {code[:20]}...")

    return {
        "access_token": "github-oauth-token-12345",
        "refresh_token": "github-refresh-token-12345",
        "token_type": "bearer",
        "user": {
            "id": "github-12345",
            "email": "user@github.com",
            "full_name": "Pengguna GitHub",
            "provider": "github",
            "role": "user",
            "is_active": True
        }
    }

@app.post("/api/consult")
async def consult_legal(request: Request):
    """Endpoint konsultasi hukum utama (public, tanpa auth)"""
    try:
        data = await request.json()
        query = data.get("query", "").strip()

        if not query:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pertanyaan tidak boleh kosong"
            )

        logger.info(f"Konsultasi: {query[:50]}...")

        # Untuk MVP, gunakan simulasi AI response
        # Dalam production, panggil BytePlus AI
        response_text = f"""
        Berdasarkan pertanyaan Anda tentang "{query}", berikut adalah informasi umum:

        ⚖️ **Informasi Umum:**
        Masalah hukum bisa berbeda tergantung konteks dan yurisdiksi. Jawaban ini bersifat umum dan bukan merupakan nasihat hukum profesional.

        📋 **Rekomendasi:**
        1. Konsultasikan dengan pengacara profesional untuk kasus spesifik Anda
        2. Periksa peraturan yang berlaku di daerah Anda
        3. Pastikan semua dokumen lengkap dan sah

        💡 **Tips:**
        - Simpan semua bukti dan komunikasi terkait
        - Ikuti prosedur hukum yang benar
        - Jika perlu, gunakan jasa advokat berpengalaman

        📞 **Bantuan Lebih Lanjut:**
        Kunjungi situs Mahkamah Agung atau konsultasikan langsung dengan pengacara di daerah Anda.

        *Informasi ini dari AI Asisten Pasalku.ai - bukan pengganti konsultasi hukum profesional*
        """

        return {
            "session_id": data.get("session_id", f"session-{len(query)}"),
            "query": query,
            "response": response_text,
            "citations": ["Undang-Undang Dasar 1945", "Kitab Undang-Undang Hukum Perdata"],
            "model": "pasalku-ai-mvp",
            "disclaimer": "Informasi bersifat umum. Konsultasikan dengan pengacara untuk nasihat hukum spesifik."
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Consultation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Terjadi kesalahan pada server"
        )

# Initialize saat startup
@app.on_event("startup")
async def startup_event():
    """Event saat aplikasi startup"""
    logger.info("🚀 Pasalku.ai MVP Server Starting...")

    # Initialize temp storage untuk OTP (MVP)
    app.state.temp_otps = {}

    # Skip complex database init untuk MVP
    logger.info("✅ MVP Server Ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Event saat aplikasi shutdown"""
    logger.info("👋 Pasalku.ai MVP Server Shutdown")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server_simple:app", host="0.0.0.0", port=8000, reload=False)