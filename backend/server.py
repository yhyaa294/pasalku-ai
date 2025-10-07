import os
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from uuid import uuid4, UUID

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer


from backend.core.config import settings
from backend.database import init_db, get_db, SessionLocal
from backend.routers import auth_router, users_router, chat_router
from backend.services.ark_service import ark_service


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pasalku-backend")

mongo_available = False
mongo_client = None
if settings.MONGO_URL:
    try:
        import motor.motor_asyncio
        from pymongo.errors import PyMongoError
        mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URL)
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

# CORS: allow frontend ingress to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Event Handlers -----

@app.on_event("startup")
async def on_startup():
    """Initialize services on app startup."""
    global mongo_available
    
    logger.info(f"Starting up {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode...")
    
    # Initialize database
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise
    
    # Initialize MongoDB if available
    if mongo_available:
        try:
            # Test MongoDB connection
            await mongo_client.server_info()
            logger.info("MongoDB connection successful")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {str(e)}")
            mongo_available = False
    
    # Initialize BytePlus Ark client
    if ark_service.client is None:
        logger.warning("BytePlus Ark client is not initialized. Check your ARK_API_KEY.")
    else:
        logger.info("BytePlus Ark client initialized successfully")

@app.on_event("shutdown")
async def on_shutdown():
    """Clean up resources on app shutdown."""
    logger.info("Shutting down Pasalku.ai Backend...")
    if mongo_available and mongo_client:
        mongo_client.close()
        logger.info("MongoDB connection closed")

# ----- Helpers -----

async def log_consult_to_mongo(session_id: str, query: str, response: str, metadata: dict = None):
    """Log consultation to MongoDB if available."""
    if not mongo_available:
        return
    
    try:
        consult_log = {
            "session_id": session_id,
            "query": query,
            "response": response,
            "timestamp": datetime.utcnow(),
            "metadata": metadata or {}
        }
        
        result = await mongo_db.consults.insert_one(consult_log)
        logger.debug(f"Logged consult to MongoDB with ID: {result.inserted_id}")
    except Exception as e:
        logger.error(f"Failed to log consult to MongoDB: {str(e)}")

# ----- Consolidated Routes (all prefixed with /api) -----
# Include routers from the project
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])

# Health check endpoint
@app.get("/api/health", tags=["Health"])
async def health():
    """Health check endpoint to verify the API is running."""
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.ENVIRONMENT,
        "mongo_available": mongo_available,
        "ark_available": ark_service.client is not None
    }

# Public consultation endpoint (no auth required)
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
        
        # Get response from BytePlus Ark
        result = await ark_service.chat_completion(messages)
        
        if not result.get("success"):
            logger.error(f"AI service error: {result.get('error')}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is currently unavailable. Please try again later."
            )
        
        response_text = result.get("response", "")
        
        # Log the consultation (async, don't wait for it to complete)
        if mongo_available:
            asyncio.create_task(
                log_consult_to_mongo(
                    session_id=session_id,
                    query=query,
                    response=response_text,
                    metadata={
                        "model": settings.ARK_MODEL_ID,
                        "tokens": len(response_text.split())  # Approximate token count
                    }
                )
            )
        
        return {
            "session_id": session_id,
            "query": query,
            "response": response_text,
            "model": settings.ARK_MODEL_ID,
            "disclaimer": (
                "Informasi yang diberikan bersifat umum dan bukan merupakan nasihat hukum. "
                "Untuk masalah hukum spesifik, disarankan untuk berkonsultasi dengan pengacara."
            )
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
