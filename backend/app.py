"""
File inisialisasi utama untuk aplikasi Pasalku AI Backend.
"""
import os
import logging
import traceback
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

# Konfigurasi CORS
allowed_origins = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
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
    try:
        # Test database connection
        from database import SessionLocal
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
