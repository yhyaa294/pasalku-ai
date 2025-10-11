import os
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from uuid import uuid4, UUID

from fastapi import FastAPI, HTTPException, Depends, status, Request
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
    logger.info("Sentry error monitoring initialized")
except ImportError:
    sentry_available = False
    logger.warning("Sentry SDK not installed - error monitoring disabled")
except Exception as e:
    sentry_available = False
    logger.warning(f"Sentry initialization failed: {str(e)}")
from backend.database import init_db, get_db, get_db_connections
from backend.routers import auth_router, users_router, chat_router, consultation_router, payments, analytics
from backend.services.ai_service import ai_service
from backend.services.analytics_service import AnalyticsService

mongo_available = False
mongo_client = None
analytics_service = None
if settings.MONGODB_URL:
    try:
        import motor.motor_asyncio
        from pymongo.errors import PyMongoError
        mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
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
    global mongo_available, analytics_service
    
    logger.info(f"Starting up {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode...")
    
    # Initialize database
    try:
        init_db()
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

            # Initialize analytics service
            analytics_service = AnalyticsService(mongo_client)
            logger.info("Analytics service initialized successfully")

        except Exception as e:
            logger.error(f"MongoDB connection failed: {str(e)}")
            mongo_available = False
    
        # Test AI service connection
        if await ai_service.test_connection():
            logger.info("AI service initialized successfully")
        else:
            logger.warning("AI service is not initialized. Check your configuration.")@app.on_event("shutdown")
async def on_shutdown():
    """Clean up resources on app shutdown."""
    logger.info("Shutting down Pasalku.ai Backend...")
    if mongo_available and mongo_client:
        mongo_client.close()
        logger.info("MongoDB connection closed")

# ----- Helpers -----

# ----- Consolidated Routes (all prefixed with /api) -----
# Include routers from the project
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(consultation_router, prefix="/api/consultation", tags=["Consultation"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

# Health check endpoint
@app.get("/api/health", tags=["Health"])
async def health():
    """Health check endpoint to verify the API is running."""
    db_connections = get_db_connections()
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.ENVIRONMENT,
        "mongo_available": mongo_available,
        "sentry_available": sentry_available,
        "ai_service_available": await ai_service.test_connection(),
        "databases": {
            "postgresql": bool(db_connections.pg_engine),
            "mongodb": db_connections.mongodb_client is not None,
            "supabase": db_connections.supabase_engine is not None,
            "turso": db_connections.turso_client is not None,
            "edgedb": db_connections.edgedb_client is not None
        }
    }# ===== STRUCTURED LEGAL CONSULTATION FLOW =====

@app.post("/api/structured-consult/initiate", tags=["Structured Consultation"])
async def initiate_structured_consultation(payload: Dict[str, Any]):
    """
    Initiate structured legal consultation session.

    This endpoint starts the Clarity Flow:
    1. AI introduces itself proactively
    2. User provides initial problem description
    3. AI classifies the problem into legal categories

    Request body:
        - problem_description: User's initial description of the legal problem

    Returns:
        JSON with session_id, ai_greeting, and problem_classification
    """
    try:
        problem_description = payload.get("problem_description", "").strip()
        if not problem_description:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="problem_description is required"
            )

        session_id = str(uuid4())

        # AI Introduction
        ai_greeting = """Halo! Saya adalah Pasalku.ai, asisten hukum AI yang dirancang khusus untuk membantu masyarakat Indonesia memahami dan menavigasi masalah hukum mereka dengan lebih baik.

Saya akan memandu Anda melalui proses konsultasi terstruktur ini untuk memastikan kita mendapatkan pemahaman yang komprehensif tentang situasi hukum Anda. Mari kita mulai dengan mengklasifikasikan jenis masalah hukum yang Anda hadapi."""

        # Classify the problem
        classification = await ai_service.classify_problem(problem_description)

        # Prepare initial session data
        session_data = {
            "problem_description": problem_description,
            "classification": classification,
            "phase": "classification",
            "collected_data": {},
            "evidence_processed": [],
            "pre_analysis_confirmed": False
        }

        return {
            "session_id": session_id,
            "ai_greeting": ai_greeting,
            "problem_classification": classification,
            "next_phase": "questionnaire",
            "message": f"Masalah Anda terklasifikasi sebagai: {classification['category']} (Kepercayaan: {int(classification['confidence'] * 100)}%)"
        }

    except Exception as e:
        logger.error(f"Error in structured consultation initiation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to initiate structured consultation"
        )

@app.post("/api/structured-consult/generate-questions", tags=["Structured Consultation"])
async def generate_structured_questions(payload: Dict[str, Any]):
    """
    Generate structured questions based on problem category.

    Request body:
        - session_id: Consultation session ID
        - category: Legal category
        - current_data: Currently collected data

    Returns:
        List of structured questions
    """
    logger.info(f"[ENDPOINT] generate-questions called with payload: {payload}")

    try:
        category = payload.get("category", "")
        current_data = payload.get("current_data", {})

        if not category:
            raise HTTPException(status_code=400, detail="category is required")

        logger.info(f"[ENDPOINT] Calling ai_service.generate_questions for category: {category}")
        # Temporarily return static questions for testing
        questions = [
            {
                "id": "fallback_question_1",
                "text": f"Jelaskan lebih detail tentang masalah hukum Anda di kategori {category}:",
                "type": "text",
                "required": True
            },
            {
                "id": "fallback_question_2",
                "text": "Berapa lama masalah ini terjadi?",
                "type": "text",
                "required": True
            },
            {
                "id": "fallback_question_3",
                "text": "Siapa saja pihak yang terlibat dalam masalah ini?",
                "type": "text",
                "required": True
            }
        ]

        logger.info(f"[ENDPOINT] Generated {len(questions)} questions - Type: {type(questions)}")
        logger.info(f"[ENDPOINT] Questions data: {questions}")
        for i, q in enumerate(questions):
            logger.info(f"[ENDPOINT] Question {i+1}: {q['text'][:100]}...")

        return {
            "questions": questions,
            "phase": "questionnaire",
            "message": f"Silakan jawab pertanyaan berikut untuk melengkapi informasi tentang masalah {category} Anda:"
        }

    except Exception as e:
        logger.error(f"[ENDPOINT] Error generating questions: {str(e)}")
        import traceback
        logger.error(f"[ENDPOINT] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Failed to generate questions")

@app.post("/api/structured-consult/process-evidence", tags=["Structured Consultation"])
async def process_evidence(payload: Dict[str, Any]):
    """
    Process and simulate evidence analysis.

    Request body:
        - evidence_description: Description of evidence provided by user

    Returns:
        Evidence evaluation results
    """
    try:
        evidence_description = payload.get("evidence_description", "").strip()
        if not evidence_description:
            raise HTTPException(status_code=400, detail="evidence_description is required")

        evaluation = await ai_service.process_evidence(evidence_description)

        return {
            "evaluation": evaluation,
            "phase": "evidence_processing",
            "message": "Bukti Anda telah dievaluasi. Nilai kekuatan: " + evaluation.get("strength_level", "sedang").upper()
        }

    except Exception as e:
        logger.error(f"Error processing evidence: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process evidence")

@app.post("/api/structured-consult/generate-pre-analysis", tags=["Structured Consultation"])
async def generate_pre_analysis(payload: Dict[str, Any]):
    """
    Generate pre-analysis summary for user confirmation.

    Request body:
        - session_data: Complete session data including problem, answers, evidence
        - session_id: Consultation session ID

    Returns:
        Pre-analysis summary requiring user confirmation
    """
    try:
        session_data = payload.get("session_data", {})
        if not session_data:
            raise HTTPException(status_code=400, detail="session_data is required")

        pre_analysis = await ai_service.generate_pre_analysis(session_data)

        return {
            "pre_analysis": pre_analysis,
            "phase": "pre_analysis",
            "requires_confirmation": True,
            "message": "Berikut adalah ringkasan data yang telah kita kumpulkan. Mohon konfirmasi apakah informasi ini akurat sebelum kita lanjut ke analisis akhir.",
            "confirmation_prompt": "Apakah ringkasan di atas sudah benar dan lengkap? (Jawab 'ya' untuk lanjut ke analisis, atau berikan koreksi/informasi tambahan)"
        }

    except Exception as e:
        logger.error(f"Error generating pre-analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate pre-analysis")

@app.post("/api/structured-consult/final-analysis", tags=["Structured Consultation"])
async def generate_final_analysis(payload: Dict[str, Any]):
    """
    Generate final structured legal analysis with solution options.

    Request body:
        - session_data: Complete session data
        - confirmed: Whether pre-analysis was confirmed
        - session_id: Consultation session ID

    Returns:
        Final structured analysis with solution options
    """
    try:
        session_data = payload.get("session_data", {})
        confirmed = payload.get("confirmed", False)

        if not session_data:
            raise HTTPException(status_code=400, detail="session_data is required")

        analysis = await ai_service.generate_structured_analysis(session_data)

        return {
            "final_analysis": analysis,
            "phase": "final_analysis",
            "disclaimer": "Informasi ini bersifat edukasi dan bukan merupakan nasihat hukum resmi. Untuk masalah hukum spesifik, disarankan untuk berkonsultasi dengan pengacara profesional.",
            "follow_up_question": "Apakah ada lagi yang ingin Anda tanyakan atau klarifikasi seputar analisis ini?",
            "session_complete": True
        }

    except Exception as e:
        logger.error(f"Error generating final analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate final analysis")

# ===== ADVANCED AI FEATURES =====

from backend.services.ai_service import advanced_ai_service

@app.post("/api/ai/duaI-consensus", tags=["Advanced AI"])
async def dual_ai_consensus(payload: Dict[str, Any]):
    """
    Dual AI Consensus Verification endpoint.

    Compare responses from BytePlus Ark (primary) and Groq (fallback) AIs.
    Returns confidence score and differences analysis.

    Request body:
        - query (required): The user's legal question
        - user_context (optional): Additional user context

    Returns:
        Consensus response with confidence analysis
    """
    try:
        query = payload.get("query", "").strip()
        if not query:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query is required"
            )

        user_context = payload.get("user_context", "")

        result = await advanced_ai_service.get_multi_ai_consensus(
            query=query,
            user_context=user_context
        )

        return result

    except Exception as e:
        logger.error(f"Error in dual AI consensus: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate dual AI consensus response"
        )

@app.post("/api/ai/reasoning-chain", tags=["Advanced AI"])
async def ai_reasoning_chain(payload: Dict[str, Any]):
    """
    AI Reasoning Chain with Knowledge Graph.

    Generate response with EdgeDB knowledge graph integration
    and semantic relationship analysis.

    Request body:
        - query (required): The user's legal question
        - user_context (optional): Additional user context

    Returns:
        Response with reasoning chain and knowledge sources
    """
    try:
        query = payload.get("query", "").strip()
        if not query:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query is required"
            )

        user_context = payload.get("user_context", "")

        result = await advanced_ai_service.get_reasoning_chain_response(
            query=query,
            user_context=user_context
        )

        return result

    except Exception as e:
        logger.error(f"Error in AI reasoning chain: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate reasoning chain response"
        )

@app.post("/api/ai/persona-adaptive", tags=["Advanced AI"])
async def ai_adaptive_persona(payload: Dict[str, Any]):
    """
    Adaptive AI Persona Response.

    Generate response adapted to user role/persona:
    - general: General public with simple explanations
    - legal_professional: Detailed analysis for lawyers
    - business_owner: Business-focused legal advice
    - student: Academic learning approach

    Request body:
        - query (required): The user's legal question
        - user_role (optional): User persona/role (defaults to "general")
        - user_context (optional): Additional user context

    Returns:
        Role-adapted AI response
    """
    try:
        query = payload.get("query", "").strip()
        if not query:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query is required"
            )

        user_role = payload.get("user_role", "general")
        user_context = payload.get("user_context", "")

        result = await advanced_ai_service.get_adaptive_persona_response(
            query=query,
            user_role=user_role
        )

        return result

    except Exception as e:
        logger.error(f"Error in adaptive persona response: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate adaptive persona response"
        )

@app.post("/api/ai/sentiment-adaptive", tags=["Advanced AI"])
async def ai_sentiment_adaptive(payload: Dict[str, Any]):
    """
    Sentiment-Adaptive AI Response.

    Analyzes user sentiment and adapts tone/response:
    - Urgent: Priority on quick solutions
    - Confused: Step-by-step explanations
    - Neutral: Balanced standard response

    Request body:
        - query (required): The user's legal question
        - user_context (optional): Additional user context

    Returns:
        Sentiment-adapted AI response
    """
    try:
        query = payload.get("query", "").strip()
        if not query:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query is required"
            )

        user_context = payload.get("user_context", "")

        result = await advanced_ai_service.analyze_sentiment_and_adapt(
            query=query
        )

        return result

    except Exception as e:
        logger.error(f"Error in sentiment adaptive response: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate sentiment-adaptive response"
        )

@app.post("/api/ai/strategic-assessment", tags=["Advanced AI"])
async def strategic_legal_assessment(payload: Dict[str, Any]):
    """
    Comprehensive Strategic Assessment for Complex Legal Cases.

    Uses parallel processing of BytePlus Ark (deep analysis) and Groq AI (quick assessment)
    for emergency legal consulting scenarios.

    Request body:
        - legal_query (required): The complex legal problem requiring strategic assessment
        - context_documents (optional): List of context documents
        - urgency_level (optional): 'low', 'medium', 'high' (default: 'medium')

    Returns:
        Comprehensive dual AI strategic assessment with risk analysis
    """
    try:
        legal_query = payload.get("legal_query", "").strip()
        context_documents = payload.get("context_documents", [])
        urgency_level = payload.get("urgency_level", "medium")

        if not legal_query:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="legal_query is required"
            )

        if urgency_level not in ["low", "medium", "high"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="urgency_level must be one of: low, medium, high"
            )

        result = await advanced_ai_service.strategic_assessment(
            legal_query=legal_query,
            context_documents=context_documents,
            urgency_level=urgency_level
        )

        return result

    except Exception as e:
        logger.error(f"Error in strategic assessment: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate strategic assessment"
        )

@app.get("/api/ai/status", tags=["Advanced AI"])
async def ai_services_status():
    """
    Check status of all AI services and blockchain-inspired databases.

    Returns availability status of:
    - BytePlus Ark (primary AI)
    - Groq (fallback AI)
    - EdgeDB (knowledge graph)
    - Turso (edge cache)
    - MongoDB (unstructured data)
    """
    try:
        db_connections = get_db_connections()

        # Check AI services
        ark_available = await ai_service.test_connection()
        groq_available = await advanced_ai_service.fallback_ai.test_connection()

        # Check databases
        edgedb_available = db_connections.get_edgedb_client() is not None
        turso_available = db_connections.get_turso_db() is not None
        mongodb_available = db_connections.get_mongodb() is not None

        return {
            "ai_services": {
                "byteplus_ark": ark_available,
                "groq_fallback": groq_available,
                "dual_ai_available": ark_available and groq_available
            },
            "knowledge_systems": {
                "edgedb_knowledge_graph": edgedb_available,
                "turso_edge_cache": turso_available,
                "mongodb_unstructured": mongodb_available
            },
            "blockchain_inspired_architecture": {
                "identity_ledger": bool(db_connections.pg_engine),  # Neon
                "realtime_edge": db_connections.supabase_engine is not None,
                "semantic_graph": edgedb_available,
                "ephemeral_cache": turso_available
            },
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        logger.error(f"Error checking AI services status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to check services status"
        )

# ===== LEGACY CONSULTATION ENDPOINT =====
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
