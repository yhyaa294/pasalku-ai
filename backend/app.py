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

# Inisialisasi Sentry
from .core.sentry import init_sentry
init_sentry()

# Konfigurasi CORS
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
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
from .routers.contract_engine import router as contract_router
from .routers.adaptive_personas import router as adaptive_persona_router
from .routers.reasoning_chain import router as reasoning_chain_router
from .routers.sentiment_analysis import router as sentiment_analysis_router
from .routers.research_assistant import router as research_router
from .routers.template_generator import router as template_router
from .routers.ethics_monitor import router as ethics_router
from .routers.virtual_court import router as virtual_court_router
from .routers.legal_prediction import router as legal_prediction_router
from .routers.multi_party_negotiator import router as multi_party_router
from .routers.business_intelligence import router as bi_router
from .routers.voice_assistant import router as voice_router
from .routers.startup_accelerator import router as startup_router
from .routers.international_bridge import router as international_router
from .routers.document_review import router as document_review_router
from .routers.knowledge_graph import router as knowledge_graph_router
from .routers.ai_consensus import router as ai_consensus_router
from .routers.knowledge_graph_search import router as kg_search_router
from .routers.legal_flow import router as legal_flow_router

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(advanced_ai_router, tags=["AI Advanced"])
app.include_router(documents_router, tags=["Documents"])
app.include_router(case_study_router, tags=["Case Studies"])
app.include_router(template_router, tags=["Template Generator"])
app.include_router(knowledge_router, tags=["Knowledge Base"])
app.include_router(scheduler_router, tags=["AI Scheduler"])
app.include_router(risk_router, tags=["Risk Calculator"])
app.include_router(debate_router, tags=["AI Debate System"])
app.include_router(cross_val_router, tags=["Cross Validation"])
app.include_router(predictive_router, tags=["Predictive Analytics"])
app.include_router(translator_router, tags=["Language Translator"])
app.include_router(contract_router, tags=["Contract Intelligence"])
app.include_router(adaptive_persona_router, tags=["Adaptive Persona System"])
app.include_router(reasoning_chain_router, tags=["Reasoning Chain Analyzer"])
app.include_router(sentiment_analysis_router, tags=["Sentiment Analysis"])
app.include_router(research_router, tags=["Research Assistant"])
app.include_router(ethics_router, tags=["Ethics & Compliance"])
app.include_router(legal_flow_router, tags=["Legal Flow 4-Step"])
app.include_router(kg_search_router, tags=["Knowledge Graph Search"])
app.include_router(virtual_court_router, tags=["Virtual Court Simulation"])
app.include_router(legal_prediction_router, tags=["Legal Prediction Engine"])
app.include_router(multi_party_router, tags=["Multi-Party Negotiation"])
app.include_router(bi_router, tags=["Business Intelligence"])
app.include_router(voice_router, tags=["AI Voice Assistant"])
app.include_router(startup_router, tags=["Startup Accelerator"])
app.include_router(international_router, tags=["International Legal Bridge"])
app.include_router(document_review_router, tags=["Document Review"])
app.include_router(ai_consensus_router, tags=["AI Consensus"])
app.include_router(kg_search_router, tags=["Knowledge Graph Search"])

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
        "port": os.getenv("PORT", "8000")
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
