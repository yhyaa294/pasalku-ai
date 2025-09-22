 """
File inisialisasi utama untuk aplikasi Pasalku AI Backend.
"""
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Inisialisasi FastAPI
app = FastAPI(
    title="Pasalku AI API",
    description="Backend API untuk Aplikasi Konsultasi Hukum Pasalku AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Di production, ganti dengan domain yang sesuai
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import dan include router
from routers.auth import router as auth_router
from routers.chat import router as chat_router
from routers.users import router as users_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """Endpoint untuk mengecek status server"""
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "message": "Pasalku AI API is running"
    }

# Event handler untuk startup
@app.on_event("startup")
async def startup_event():
    """Aksi yang dijalankan saat aplikasi startup"""
    logger.info("Starting up Pasalku AI Backend...")

    # Inisialisasi database
    try:
        from database import init_db
        init_db()
        logger.info("Database initialization successful")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        logger.warning("Continuing without database connection...")

    logger.info("Application startup complete")

# Event handler untuk shutdown
@app.on_event("shutdown")
async def shutdown_event():
    """Aksi yang dijalankan saat aplikasi shutdown"""
    logger.info("Shutting down Pasalku AI Backend...")
    # Tambahkan kode cleanup di sini jika diperlukan

# Jika dijalankan langsung, gunakan uvicorn
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
