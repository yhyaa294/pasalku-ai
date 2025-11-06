import os
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from uuid import uuid4, UUID

from fastapi import FastAPI, HTTPException, Depends, status, Request
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import HTMLResponse

from core.config import get_settings

# Setup logging first
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pasalku-backend")

settings = get_settings()

# Initialize Sentry after settings are loaded
try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.logging import LoggingIntegration

    # Temporarily disable Sentry to fix server startup issues
    # sentry_sdk.init(
    #     dsn=settings.NEXT_PUBLIC_SENTRY_DSN,
    #     environment=settings.ENVIRONMENT,
    #     integrations=[
    #         FastApiIntegration(),
    #         LoggingIntegration(
    #             level=logging.INFO,
    #             event_level=logging.ERROR
    #         ),
    #     ],
    #     traces_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
    #     send_default_pii=False
    # )
    sentry_available = False  # Temporarily disabled
    logger.info("Sentry error monitoring temporarily disabled")
except ImportError:
    sentry_available = False
    logger.warning("Sentry SDK not installed - error monitoring disabled")
except Exception as e:
    sentry_available = False
    logger.warning(f"Sentry initialization failed: {str(e)}")
from database import init_db, get_db, get_db_connections
from routers import auth_router, users_router, chat_router, consultation_router, payments, analytics, terms
# Import all models to ensure they are registered with SQLAlchemy
# Import models to register mappers
from models import user, consultation, chat
from sqlalchemy.orm import configure_mappers

# Ensure SQLAlchemy mappers are fully configured now (fixes back_populates resolution issues)
try:
    configure_mappers()
except Exception:
    # If configuration fails, let startup log the error and re-raise during init_db
    pass
from services.ai_service import ai_service
from services.analytics_service import AnalyticsService

mongo_available = False
mongo_client = None
analytics_service = None
if settings.MONGODB_URI:
    try:
        import motor.motor_asyncio
        from pymongo.errors import PyMongoError
        mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        mongo_db = mongo_client.get_default_database()
        mongo_available = True
        logger.info("MongoDB client initialized successfully")
    except Exception as e:
        logger.warning(f"MongoDB not available: {str(e)}")
        mongo_available = False

# ----- App -----
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ----- Helpers -----

# ----- Consolidated Routes (all prefixed with /api) -----
# Include routers from the project
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(consultation_router, prefix="/api/consultation", tags=["Consultation"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(terms.router, prefix="/api/terms", tags=["Legal Terms"])

# Import and register proactive chat router
try:
    from backend.routers.proactive_chat import router as proactive_chat_router
    app.include_router(proactive_chat_router, tags=["Proactive AI Chat"])
    logger.info("✅ Proactive Chat Router registered successfully")
except ImportError as e:
    logger.warning(f"⚠️ Proactive Chat Router not available: {e}")

# Import and register AI Orchestrator router
try:
    from routers.orchestrator_api import router as orchestrator_router
    app.include_router(orchestrator_router, tags=["AI Orchestrator"])
    logger.info("✅ AI Orchestrator Router registered successfully")
except ImportError as e:
    logger.warning(f"⚠️ AI Orchestrator Router not available: {e}")


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def backend_homepage() -> HTMLResponse:
    """Serve a friendly landing page for developers accessing the backend root."""

    hero_gradient = "background: radial-gradient(circle at top left, rgba(37,99,235,0.25), transparent 55%), radial-gradient(circle at top right, rgba(168,85,247,0.25), transparent 50%), linear-gradient(135deg, #0f172a, #111827);"

    html = f"""
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{settings.PROJECT_NAME} API</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          :root {{
            color-scheme: dark;
          }}
          * {{ box-sizing: border-box; }}
          body {{
            margin: 0;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #030712;
            color: #f9fafb;
            line-height: 1.6;
          }}
          .hero {{
            {hero_gradient}
            padding: 120px 24px 96px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }}
          .hero::after {{
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at bottom, rgba(249,115,22,0.15), transparent 60%);
            pointer-events: none;
          }}
          h1 {{
            font-size: clamp(2.75rem, 4vw, 3.5rem);
            margin-bottom: 16px;
            font-weight: 700;
          }}
          p.lead {{
            max-width: 680px;
            margin: 0 auto 32px;
            color: #c7d2fe;
          }}
          .cta {{
            display: inline-flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
          }}
          .btn {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            border-radius: 999px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }}
          .btn-primary {{
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #f9fafb;
            box-shadow: 0 18px 40px -18px rgba(79,70,229,0.6);
          }}
          .btn-outline {{
            border: 1px solid rgba(148,163,184,0.35);
            color: #e2e8f0;
            background: rgba(15,23,42,0.35);
          }}
          .btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 20px 45px -20px rgba(59,130,246,0.6);
          }}
          section {{
            padding: 72px 24px;
          }}
          .container {{
            max-width: 1080px;
            margin: 0 auto;
          }}
          .grid {{
            display: grid;
            gap: 24px;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }}
          .card {{
            padding: 24px;
            border-radius: 18px;
            background: linear-gradient(145deg, rgba(30,41,59,0.75), rgba(15,23,42,0.65));
            border: 1px solid rgba(148,163,184,0.15);
            box-shadow: 0 18px 45px -28px rgba(15,118,110,0.55);
            backdrop-filter: blur(12px);
          }}
          .card h3 {{
            margin-top: 0;
            font-size: 1.25rem;
            color: #c4b5fd;
          }}
          footer {{
            text-align: center;
            padding: 48px 24px 64px;
            color: #94a3b8;
            font-size: 0.875rem;
          }}
          code {{
            background: rgba(15,23,42,0.65);
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid rgba(148,163,184,0.25);
            font-size: 0.85rem;
            color: #93c5fd;
          }}
          @media (max-width: 640px) {{
            .hero {{ padding: 96px 20px 72px; }}
            section {{ padding: 56px 20px; }}
          }}
        </style>
      </head>
      <body>
        <header class="hero">
          <h1>{settings.PROJECT_NAME}</h1>
          <p class="lead">
            API backend Pasalku.ai siap melayani modul konsultasi hukum, chat AI, analitik,
            dan integrasi compliance. Gunakan dokumentasi interaktif untuk mengeksplor endpoint tersedia.
          </p>
          <div class="cta">
            <a class="btn btn-primary" href="/api/docs">⚡ API Docs (Swagger)</a>
            <a class="btn btn-outline" href="/api/redoc">📘 Redoc Reference</a>
            <a class="btn btn-outline" href="/api/health">🩺 Health Check</a>
          </div>
        </header>

        <section>
          <div class="container">
            <div class="grid">
              <article class="card">
                <h3>🚀 Konsultasi Terstruktur</h3>
                <p>
                  Endpoint <code>/api/structured-consult/*</code> memandu pengguna melewati empat fase konsultasi
                  hukum berbasis AI, lengkap dengan pengumpulan bukti dan analisis akhir.
                </p>
              </article>
              <article class="card">
                <h3>🧠 Chat & AI Services</h3>
                <p>
                  Modula chat, dual-AI consensus, dan reasoning chain tersedia melalui namespace <code>/api/chat</code>
                  serta <code>/api/ai/*</code> untuk berbagai skenario bantuan hukum.
                </p>
              </article>
              <article class="card">
                <h3>📊 Analitik & Pembayaran</h3>
                <p>
                  Pantau performa platform dan kelola monetisasi melalui <code>/api/analytics</code> dan
                  <code>/api/payments</code>. Endpoint siap diintegrasikan dengan dashboard frontend.
                </p>
              </article>
              <article class="card">
                <h3>⚙️ Cara Menjalankan</h3>
                <p>
                  Pastikan dependensi terinstal, lalu jalankan <code>uvicorn server:app --reload</code> dari direktori backend.
                  Gunakan variabel lingkungan di <code>.env</code> untuk konfigurasi database & layanan eksternal.
                </p>
              </article>
            </div>
          </div>
        </section>

        <footer>
          © {datetime.utcnow().year} Pasalku.ai Backend • Dibangun dengan FastAPI & kasih sayang untuk developer.
        </footer>
      </body>
    </html>
    """

    return HTMLResponse(content=html)

# Health check endpoint
@app.get("/api/health", tags=["Health"])
async def health():
    """Health check endpoint to verify the API is running."""
    db_connections = get_db_connections()
    
    # Test AI service availability
    ai_available = False
    try:
        ai_available = await ai_service.test_connection()
    except Exception as e:
        logger.warning(f"AI service test failed: {e}")
    
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.ENVIRONMENT,
        "mongo_available": mongo_available,
        "sentry_available": sentry_available,
        "ai_service_available": ai_available,
        "databases": {
            "postgresql": bool(db_connections.pg_engine),
            "mongodb": db_connections.mongodb_client is not None,
            "supabase": db_connections.supabase_engine is not None,
            "turso": db_connections.turso_client is not None,
            "edgedb": db_connections.edgedb_client is not None
        }
    }

# ===== WORKING CONSULTATION ENDPOINT =====
# Public consultation endpoint (no auth required)
# Uses the basic AIService for simple legal queries
# For structured consultation flow, use routers/consultation.py endpoints

@app.post("/api/consult", tags=["Consultation"])
async def consult(payload: Dict[str, Any]):
    """
    Public legal consultation endpoint (no auth).

    Request body:
    - query (required): The user's legal question
    - session_id (optional): Session ID for tracking conversation
    - system_prompt (optional): Custom instructions for the AI

    Returns:
        JSON response with the AI's answer and session information
    """
    try:
        query = payload.get("query", "").strip()
        if not query:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query is required and cannot be empty"
            )

        # Generate or use provided session ID
        session_id = payload.get("session_id") or str(uuid4())

        # Prepare system prompt
        system_prompt = payload.get(
            "system_prompt",
            "Anda adalah asisten AI yang membantu pengguna dengan pertanyaan hukum di Indonesia. "
            "Berikan jawaban yang jelas, ringkas, dan mudah dimengerti."
        )

        # Prepare messages for the AI
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]

        # Dapatkan respons dari layanan AI
        result = await ai_service.get_legal_response(
            query=query,
            user_context=payload.get("context", "")
        )

        response_text = result.get("answer", "")
        citations = result.get("citations", [])
        # Log the consultation (async, don't wait for it to complete)
        if mongo_available and analytics_service:
            asyncio.create_task(
                analytics_service.log_consultation(
                    session_id=session_id,
                    query=query,
                    response=response_text,
                    user_id=None,  # Anonymous consultation
                    metadata={
                        "model": settings.ARK_MODEL_ID,
                        "ai_provider": "BytePlus Ark",
                        "response_tokens": len(response_text.split())  # Approximate token count
                    }
                )
            )

        return {
            "session_id": session_id,
            "query": query,
            "response": response_text,
            "citations": citations,
            "model": settings.ARK_MODEL_ID,
            "disclaimer": result.get("disclaimer", (
                "Informasi yang diberikan bersifat umum dan bukan merupakan nasihat hukum. "
                "Untuk masalah hukum spesifik, disarankan untuk berkonsultasi dengan pengacara."
            ))
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in /api/consult: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later."
        )

# Root endpoint for quick check (not under /api)
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint to verify the API is running."""
    return {
        "message": f"{settings.PROJECT_NAME} API is running",
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "docs": "/api/docs",
        "version": "1.0.0"
    }
