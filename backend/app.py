"""
File inisialisasi utama untuk aplikasi Pasalku AI Backend.
"""
import os
import logging
import traceback
import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
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

# Inisialisasi Sentry
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
    environment=os.getenv("ENVIRONMENT", "development")
)

# Konfigurasi CORS
allowed_origins = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://pasalku-ai.vercel.app",
    "https://pasalku-ai-3.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handler for debugging
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception handler caught: {exc}")
    logger.error(f"Exception type: {type(exc).__name__}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    return {
        "error": "Internal server error",
        "detail": str(exc),
        "type": type(exc).__name__
    }

# Import dan include router
from .routers.auth_updated import router as auth_router
from .routers.chat_updated import router as chat_router
from .routers.users import router as users_router
from .routers.advanced_ai import router as advanced_ai_router
from .routers.documents import router as documents_router
from .routers.case_study import router as case_study_router
from .routers.knowledge_base import router as knowledge_router
from .routers.scheduler import router as scheduler_router
from .routers.risk_calculator import router as risk_router
from .routers.ai_debate import router as debate_router
from .routers.cross_validation import router as cross_val_router
from .routers.predictive_analytics import router as predictive_router
from .routers.language_translator import router as translator_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(advanced_ai_router, tags=["AI Advanced"])
app.include_router(documents_router, tags=["Documents"])
app.include_router(case_study_router, tags=["Case Studies"])
app.include_router(knowledge_router, tags=["Knowledge Base"])
app.include_router(scheduler_router, tags=["AI Scheduler"])
app.include_router(risk_router, tags=["Risk Calculator"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """Endpoint untuk mengecek status server"""
    try:
        # Test database connection
        from .database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "message": "Pasalku AI API is running",
        "database": db_status,
        "port": os.getenv("PORT", "8001")
    }

# Event handler untuk startup
@app.on_event("startup")
async def startup_event():
    """Aksi yang dijalankan saat aplikasi startup"""
    logger.info("Starting up Pasalku AI Backend...")

    # Inisialisasi database
    try:
        from .database import init_db
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
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port, reload=True)
