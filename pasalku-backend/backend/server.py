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

from backend.core.config import get_settings

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

    sentry_sdk.init(
        dsn=settings.NEXT_PUBLIC_SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        integrations=[
            FastApiIntegration(),
            LoggingIntegration(
                level=logging.INFO,
                event_level=logging.ERROR
            ),
        ],
        traces_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
        send_default_pii=False
    )
    sentry_available = True
except ImportError:
    sentry_available = False
    logger.warning("Sentry SDK not installed - error monitoring disabled")
except Exception as e:
    sentry_available = False
    logger.warning(f"Sentry initialization failed: {str(e)}")

from backend.database import init_db, get_db, get_db_connections
from backend.routers import auth_router, users_router, chat_router, consultation_router, payments, analytics
from backend.models import user, consultation, chat
from sqlalchemy.orm import configure_mappers

try:
    configure_mappers()
except Exception:
    pass

from backend.services.analytics_service import AnalyticsService

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

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(consultation_router, prefix="/api/consultation", tags=["Consultation"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/api/health", tags=["Health"])
async def health():
    db_connections = get_db_connections()
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.ENVIRONMENT,
        "mongo_available": mongo_available,
        "sentry_available": sentry_available,
        "ai_service_available": False,
        "databases": {
            "postgresql": bool(db_connections.pg_engine),
            "mongodb": db_connections.mongodb_client is not None,
            "supabase": db_connections.supabase_engine is not None,
            "turso": db_connections.turso_client is not None,
            "edgedb": db_connections.edgedb_client is not None
        }
    }

# Database initialization
@app.on_event("startup")
async def startup_event():
    await init_db()

@app.on_event("shutdown")
async def shutdown_event():
    if mongo_client:
        mongo_client.close()