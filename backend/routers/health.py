"""
Enhanced Health Check & Monitoring Endpoint
Mendukung Checkly monitoring dan Sentry error tracking
"""
import os
import time
from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, Response, status
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class HealthStatus(BaseModel):
    """Model untuk health check response"""
    status: str
    timestamp: str
    environment: str
    version: str
    uptime: float
    services: Dict[str, Any]


class DetailedHealthStatus(BaseModel):
    """Model untuk detailed health check response"""
    status: str
    timestamp: str
    environment: str
    version: str
    uptime: float
    databases: Dict[str, Dict[str, Any]]
    external_services: Dict[str, Dict[str, Any]]
    system_info: Dict[str, Any]


# Track application start time
APP_START_TIME = time.time()


@router.get("/health", response_model=HealthStatus, tags=["Health"])
async def health_check(response: Response):
    """
    Basic health check endpoint untuk Checkly monitoring.
    Returns 200 OK jika service berjalan normal.
    """
    try:
        uptime = time.time() - APP_START_TIME
        
        health_data = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": os.getenv("ENVIRONMENT", "development"),
            "version": "1.0.0",
            "uptime": round(uptime, 2),
            "services": {
                "api": "operational",
                "port": os.getenv("PORT", "8000")
            }
        }
        
        response.status_code = status.HTTP_200_OK
        return health_data
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": os.getenv("ENVIRONMENT", "development"),
            "version": "1.0.0",
            "uptime": 0,
            "services": {
                "api": "error",
                "error": str(e)
            }
        }


@router.get("/health/detailed", response_model=DetailedHealthStatus, tags=["Health"])
async def detailed_health_check(response: Response):
    """
    Detailed health check endpoint dengan informasi lengkap tentang semua services.
    Berguna untuk debugging dan monitoring mendalam.
    """
    from ..database import get_db_connections
    
    uptime = time.time() - APP_START_TIME
    db_connections = get_db_connections()
    
    # Check database connections
    databases = {}
    
    # PostgreSQL (Neon Instance 1)
    try:
        with db_connections.get_db() as db:
            from sqlalchemy import text
            result = db.execute(text("SELECT 1"))
            result.fetchone()
            databases["postgresql_neon_1"] = {
                "status": "connected",
                "type": "PostgreSQL",
                "purpose": "Main Application Database"
            }
    except Exception as e:
        databases["postgresql_neon_1"] = {
            "status": "error",
            "type": "PostgreSQL",
            "error": str(e)
        }
    
    # MongoDB
    try:
        if db_connections.mongodb_client:
            db_connections.mongodb_client.admin.command('ping')
            databases["mongodb"] = {
                "status": "connected",
                "type": "MongoDB",
                "purpose": "Unstructured Data & Transcripts"
            }
        else:
            databases["mongodb"] = {
                "status": "not_configured",
                "type": "MongoDB"
            }
    except Exception as e:
        databases["mongodb"] = {
            "status": "error",
            "type": "MongoDB",
            "error": str(e)
        }
    
    # Supabase
    try:
        if db_connections.supabase_engine:
            with db_connections.get_supabase_db() as db:
                from sqlalchemy import text
                result = db.execute(text("SELECT 1"))
                result.fetchone()
                databases["supabase"] = {
                    "status": "connected",
                    "type": "PostgreSQL (Supabase)",
                    "purpose": "Realtime & Edge Functions"
                }
        else:
            databases["supabase"] = {
                "status": "not_configured",
                "type": "PostgreSQL (Supabase)"
            }
    except Exception as e:
        databases["supabase"] = {
            "status": "error",
            "type": "PostgreSQL (Supabase)",
            "error": str(e)
        }
    
    # Turso
    try:
        if db_connections.turso_client:
            cursor = db_connections.turso_client.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            databases["turso"] = {
                "status": "connected",
                "type": "LibSQL/SQLite",
                "purpose": "Edge Cache"
            }
        else:
            databases["turso"] = {
                "status": "not_configured",
                "type": "LibSQL/SQLite"
            }
    except Exception as e:
        databases["turso"] = {
            "status": "error",
            "type": "LibSQL/SQLite",
            "error": str(e)
        }
    
    # EdgeDB
    try:
        if db_connections.edgedb_client:
            result = db_connections.edgedb_client.query("SELECT 1")
            databases["edgedb"] = {
                "status": "connected",
                "type": "EdgeDB",
                "purpose": "Knowledge Graph"
            }
        else:
            databases["edgedb"] = {
                "status": "not_configured",
                "type": "EdgeDB"
            }
    except Exception as e:
        databases["edgedb"] = {
            "status": "error",
            "type": "EdgeDB",
            "error": str(e)
        }
    
    # Check external services
    external_services = {}
    
    # BytePlus Ark AI
    external_services["byteplus_ark"] = {
        "configured": bool(os.getenv("ARK_API_KEY")),
        "purpose": "Primary AI Engine"
    }
    
    # Groq AI
    external_services["groq"] = {
        "configured": bool(os.getenv("GROQ_API_KEY")),
        "purpose": "Secondary AI Engine (Dual-AI Verification)"
    }
    
    # Clerk Auth
    external_services["clerk"] = {
        "configured": bool(os.getenv("CLERK_SECRET_KEY")),
        "purpose": "Authentication & User Management"
    }
    
    # Stripe
    external_services["stripe"] = {
        "configured": bool(os.getenv("STRIPE_SECRET_KEY")),
        "purpose": "Payment & Subscription Management"
    }
    
    # Sentry
    external_services["sentry"] = {
        "configured": bool(os.getenv("SENTRY_DSN")),
        "purpose": "Error Tracking & Performance Monitoring"
    }
    
    # Checkly
    external_services["checkly"] = {
        "configured": bool(os.getenv("CHECKLY_API_KEY")),
        "purpose": "Uptime Monitoring"
    }
    
    # System info
    system_info = {
        "python_version": os.sys.version.split()[0],
        "platform": os.sys.platform,
        "port": os.getenv("PORT", "8000"),
        "workers": os.getenv("WEB_CONCURRENCY", "1")
    }
    
    # Determine overall status
    db_healthy = all(
        db.get("status") in ["connected", "not_configured"] 
        for db in databases.values()
    )
    overall_status = "healthy" if db_healthy else "degraded"
    
    if overall_status == "healthy":
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    
    return {
        "status": overall_status,
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "version": "1.0.0",
        "uptime": round(uptime, 2),
        "databases": databases,
        "external_services": external_services,
        "system_info": system_info
    }


@router.get("/health/ready", tags=["Health"])
async def readiness_check(response: Response):
    """
    Readiness probe untuk Kubernetes/container orchestration.
    Returns 200 jika aplikasi siap menerima traffic.
    """
    from ..database import get_db_connections
    
    try:
        db_connections = get_db_connections()
        
        # Check critical database (PostgreSQL)
        with db_connections.get_db() as db:
            from sqlalchemy import text
            db.execute(text("SELECT 1"))
        
        response.status_code = status.HTTP_200_OK
        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "not_ready",
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }


@router.get("/health/live", tags=["Health"])
async def liveness_check(response: Response):
    """
    Liveness probe untuk Kubernetes/container orchestration.
    Returns 200 jika aplikasi masih berjalan (tidak hang/deadlock).
    """
    response.status_code = status.HTTP_200_OK
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": round(time.time() - APP_START_TIME, 2)
    }
