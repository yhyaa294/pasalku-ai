"""
Router untuk fitur-fitur AI canggih di Pasalku.ai
- Dual AI Strategic Assessment
- Multi-AI Consensus Consulting
- Adaptive Persona Responses
- Reasoning Chain Analysis
- Sentiment Analysis & Adaptation
"""
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime

from ..services.ai_service import AdvancedAIService
from ..services.blockchain_databases import get_mongodb_cursor, get_turso_client, get_edgedb_client
from ..core.security import get_current_user_optional
from ..core.config import get_settings

router = APIRouter(prefix="/ai/advanced", tags=["AI Advanced"])
logger = logging.getLogger(__name__)

settings = get_settings()
advanced_ai_service = AdvancedAIService()

# Pydantic Models untuk Request/Response
class StrategicAssessmentRequest(BaseModel):
    """Model untuk permintaan dual AI strategic assessment"""
    legal_query: str = Field(..., description="Pertanyaan hukum yang akan dianalisis")
    context_documents: Optional[List[str]] = Field(None, description="Dokumen konteks tambahan")
    urgency_level: Optional[str] = Field("medium", description="Tingkat urgensi: low/medium/high")

    class Config:
        json_schema_extra = {
            "example": {
                "legal_query": "Saya mendapat surat gugatan dari kreditur tentang pinjaman yang belum dilunasi. Apa langkah yang harus saya ambil?",
                "context_documents": ["Surat gugatan tertanggal 15 Januari 2025", "Perjanjian kredit dengan Bank XYZ"],
                "urgency_level": "high"
            }
        }

class ConsensusConsultationRequest(BaseModel):
    """Model untuk permintaan multi-AI consensus"""
    query: str = Field(..., description="Pertanyaan konsultan hukum")
    user_context: Optional[str] = Field("", description="Konteks tambahan pengguna")

class AdaptivePersonaRequest(BaseModel):
    """Model untuk permintaan dengan adaptive persona"""
    query: str = Field(..., description="Pertanyaan hukum")
    user_role: str = Field("general", description="Role pengguna: legal_professional/general/business_owner/student")

class SentimentAdaptationRequest(BaseModel):
    """Model untuk permintaan dengan sentiment adaptation"""
    query: str = Field(..., description="Pertanyaan hukum")

class ReasoningChainRequest(BaseModel):
    """Model untuk permintaan reasoning chain"""
    query: str = Field(..., description="Pertanyaan hukum")
    user_context: Optional[str] = Field("", description="Konteks pengguna")

# Response Models
class StrategicAssessmentResponse(BaseModel):
    """Model respons dual AI strategic assessment"""
    status: str
    processing_time: float
    risk_assessment: str
    confidence_level: str
    ai_consensus: str
    final_recommendations: List[str]
    dual_ai_results: Dict[str, Any]
    final_strategic_assessment: Dict[str, Any]
    citations: List[str]
    disclaimer: str
    timestamp: str

class ConsensusResponse(BaseModel):
    """Model respons multi-AI consensus"""
    consensus_answer: str
    confidence: str
    differences_notated: str
    citations: List[str]
    disclaimer: str
    individual_responses: Dict[str, Any]
    processing_time: float

class AdaptiveResponse(BaseModel):
    """Model respons adaptive AI"""
    answer: str
    adapted_persona: str
    citations: List[str]
    disclaimer: str
    reasoning_explanation: str

# Endpoints yang tepat untuk collaborative development

@router.post(
    "/strategic-assessment",
    response_model=StrategicAssessmentResponse,
    summary="Dual AI Strategic Assessment",
    description="""
    **DUAL AI STRATEGIC ASSESSMENT**

    Fitur inovatif dengan pendekatan paralel antara:
    - **BytePlus Ark**: Analisis mendalam dengan konteks hukum komprehensif
    - **Groq AI**: Assessment cepat dengan fokus pada urgency dan next steps

    **Kapan Menggunakan:**
    - Masalah hukum kompleks yang memerlukan analisis mendalam
    - Situasi darurat atau masalah sensitif
    - Kedua hasil AI akan di-fuse secara intelligent untuk memberikan penilaian terintegrasi

    **Benefits:**
    - Multiple perspectives dari AI yang berbeda
    - Risk assessment yang lebih accurate
    - Recommendations yang balanced
    """,
)
async def dual_ai_strategic_assessment(
    request: StrategicAssessmentRequest,
    background_tasks: BackgroundTasks,
    settings: Any = Depends(get_settings)
) -> Dict[str, Any]:
    """
    Endpoint utama untuk Dual AI Strategic Assessment
    Menggunakan paralel processing antara BytePlus Ark dan Groq AI
    """
    try:
        start_time = datetime.now()

        # Log request untuk analytics
        logger.info(f"Dual AI Strategic Assessment requested - urgency: {request.urgency_level}")

        # Execute strategic assessment dengan timeout handling
        result = await advanced_ai_service.strategic_assessment(
            legal_query=request.legal_query,
            context_documents=request.context_documents,
            urgency_level=request.urgency_level
        )

        processing_time = (datetime.now() - start_time).total_seconds()

        # Add metadata
        result.update({
            "processing_time": round(processing_time, 2),
            "timestamp": start_time.isoformat(),
            "request_urgency": request.urgency_level,
            "context_documents_count": len(request.context_documents) if request.context_documents else 0
        })

        # Log success secara asynchronous
        background_tasks.add_task(
            log_strategic_assessment_success,
            request.legal_query,
            processing_time,
            result.get("final_strategic_assessment", {}).get("risk_assessment")
        )

        return StrategicAssessmentResponse(**result)

    except Exception as e:
        logger.error(f"Dual AI Strategic Assessment error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Gagal melakukan strategic assessment: {str(e)}"
        )

@router.post(
    "/consensus-consultation",
    response_model=ConsensusResponse,
    summary="Multi-AI Consensus Consulting",
    description="""
    **MULTI-AI CONSENSUS CONSULTING**

    Fitur premium yang menggabungkan respons dari multiple AI providers untuk mendapatkan:
    - Konsensus yang lebih reliable
    - Pembandingan perspektif yang berbeda
    - Indikasi confidence level
    - Conflict resolution otomatis

    **Proses:**
    1. BytePlus Ark & Groq konsultasi paralel
    2. AI fusion untuk consensus
    3. Confidence scoring
    4. Final answer dengan discrepancy notes
    """
)
async def multi_ai_consensus_consultation(
    request: ConsensusConsultationRequest,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """
    Endpoint untuk multi-AI consensus consulting
    Menggunakan kedua AI provider untuk validasi silang
    """
    try:
        # Eksekusi dengan paralel processing
        result = await advanced_ai_service.get_multi_ai_consensus(
            query=request.query,
            user_context=request.user_context
        )

        # Add processing metadata
        result["processing_time"] = round(result.get("processing_time", 0), 2)

        # Log untuk analytics database
        background_tasks.add_task(
            log_consensus_consultation,
            request.query,
            result.get("confidence", "unknown"),
            len(result.get("citations", []))
        )

        return ConsensusResponse(**result)

    except Exception as e:
        logger.error(f"Multi-AI Consensus error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mendapatkan consensus: {str(e)}"
        )

@router.post(
    "/adaptive-persona",
    response_model=AdaptiveResponse,
    summary="Adaptive Persona AI Response",
    description="""
    **ADAPTIVE PERSONA AI**

    AI yang menyesuaikan cara komunikasi berdasarkan role pengguna:
    - **legal_professional**: Analisis mendalam dengan technical details hukum
    - **general**: Penjelasan sederhana, bahasa mudah dipahami
    - **business_owner**: Fokus pada dampak komersial dan risiko bisnis
    - **student**: Pendekatan akademis dengan penjelasan konsep yang mendalam

    AI secara otomatis mendeteksi dan adaptasi communication style.
    """
)
async def adaptive_persona_response(
    request: AdaptivePersonaRequest,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """
    Endpoint untuk AI dengan adaptive persona berdasarkan role pengguna
    """
    try:
        result = await advanced_ai_service.get_adaptive_persona_response(
            query=request.query,
            user_role=request.user_role
        )

        # Tambahkan metadata
        result.update({
            "adapted_persona": request.user_role,
            "reasoning_explanation": f"Respons disesuaikan untuk {request.user_role.replace('_', ' ')}"
        })

        # Log untuk personalization analytics
        background_tasks.add_task(
            log_adaptive_persona,
            request.query,
            request.user_role,
            len(result.get("answer", ""))
        )

        return AdaptiveResponse(**result)

    except Exception as e:
        logger.error(f"Adaptive Persona error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mendapatkan respons adaptive: {str(e)}"
        )

@router.post(
    "/reasoning-chain",
    summary="Reasoning Chain Analysis dengan Knowledge Graph",
    description="""
    **REASONING CHAIN WITH KNOWLEDGE GRAPH**

    AI yang menggunakan reasoning chain dengan akses ke:
    - EdgeDB Knowledge Graph untuk relasi hukum
    - Legal precedents dan yurisprudensi terkait
    - Complex legal entity relationships

    Menampilkan chain of thinking AI untuk transparency dan audit trail.
    """
)
async def reasoning_chain_response(
    request: ReasoningChainRequest
) -> Dict[str, Any]:
    """
    Endpoint untuk AI reasoning chain dengan knowledge graph
    """
    try:
        result = await advanced_ai_service.get_reasoning_chain_response(
            query=request.query,
            user_context=request.user_context
        )

        # Validate knowledge graph connection
        edgedb_available = get_edgedb_client() is not None
        result["knowledge_graph_available"] = edgedb_available

        if not edgedb_available:
            result["reasoning_chain"] = [
                "Knowledge graph sementara tidak tersedia",
                "Tetap menggunakan reasoning chain standar"
            ]

        return result

    except Exception as e:
        logger.error(f"Reasoning Chain error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mendapatkan reasoning chain: {str(e)}"
        )

@router.post(
    "/sentiment-analysis",
    summary="Sentiment Analysis dengan Adaptive Response",
    description="""
    **SENTIMENT ADAPTIVE AI**

    AI yang menganalisis sentimen dan emosi dari pertanyaan user, kemudian:
    - Mengadaptasi tone dan approach
    - Menyesuaikan level detail dalam respons
    - Menggunakan temperature yang sesuai untuk keadaan emosi user

    **Sentiment Detection:**
    - Urgent/Frustrated: Respons yang empathetic dengan solusi cepat
    - Confused: Jelaskan step-by-step dengan detail
    - Neutral: Balanced response dengan information objective
    """
)
async def sentiment_adaptive_response(
    request: SentimentAdaptationRequest
) -> Dict[str, Any]:
    """
    Endpoint untuk AI dengan sentiment analysis dan adaptive response
    """
    try:
        result = await advanced_ai_service.analyze_sentiment_and_adapt(
            query=request.query
        )

        return result

    except Exception as e:
        logger.error(f"Sentiment Adaptive error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mendapatkan respons adaptive: {str(e)}"
        )

@router.get("/health")
async def advanced_ai_health_check():
    """Health check untuk semua komponen AI advanced"""
    health_status = {
        "service": "Advanced AI Router",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "byteplus_ark": advanced_ai_service.primary_ai.test_connection(),
            "groq_ai": advanced_ai_service.fallback_ai.test_connection(),
            "edgedb": get_edgedb_client() is not None,
            "turso": get_turso_client() is not None,
            "mongodb": get_mongodb_cursor() is not None
        }
    }

    # Check overall health
    all_healthy = all(health_status["components"].values())
    health_status["status"] = "healthy" if all_healthy else "degraded"

    return health_status

@router.get("/capabilities")
async def get_advanced_ai_capabilities():
    """Detail capabilities dari Advanced AI system"""
    return {
        "name": "Pasalku.ai Advanced AI System",
        "version": "2.0.0",
        "capabilities": [
            "Dual AI Strategic Assessment",
            "Multi-AI Consensus Consulting",
            "Adaptive Persona Responses",
            "Reasoning Chain Analysis",
            "Sentiment Analysis & Adaptation",
            "Knowledge Graph Integration",
            "Real-time Feature Flagging",
            "Blockchain Database Support"
        ],
        "ai_providers": [
            "BytePlus Ark (Deep Analysis)",
            "Groq AI (Fast Assessment)",
            "Advanced Fusion Engine"
        ],
        "databases_supported": [
            "PostgreSQL/Neon (Core Data)",
            "MongoDB (Unstructured Data)",
            "Supabase (Realtime)",
            "Turso (Cache/Ephemeral)",
            "EdgeDB (Knowledge Graph)"
        ],
        "special_features": [
            "Parallel AI Processing",
            "Consensus Decision Making",
            "Adaptive Communication",
            "Sentiment Intelligence",
            "Knowledge Graph Reasoning"
        ]
    }

# Utility logging functions untuk analytics
async def log_strategic_assessment_success(query: str, processing_time: float, risk_level: str):
    """Log successful strategic assessment untuk analytics"""
    try:
        mongodb = get_mongodb_cursor()
        if mongodb:
            analytics_db = mongodb["pasalku_ai_analytics"]
            analytics_db["strategic_assessments"].insert_one({
                "query_sample": query[:100] if query else "",
                "processing_time": processing_time,
                "risk_level": risk_level,
                "timestamp": datetime.now(),
                "source": "dual_ai_strategic_assessment"
            })
    except Exception as e:
        logger.error(f"Failed to log strategic assessment: {e}")

async def log_consensus_consultation(query: str, confidence: str, citation_count: int):
    """Log consensus consultation untuk analytics"""
    try:
        mongodb = get_mongodb_cursor()
        if mongodb:
            analytics_db = mongodb["pasalku_ai_analytics"]
            analytics_db["consensus_consultations"].insert_one({
                "query_sample": query[:100] if query else "",
                "confidence_level": confidence,
                "citations_count": citation_count,
                "timestamp": datetime.now(),
                "source": "multi_ai_consensus"
            })
    except Exception as e:
        logger.error(f"Failed to log consensus consultation: {e}")

async def log_adaptive_persona(query: str, persona: str, response_length: int):
    """Log adaptive persona usage untuk personalization"""
    try:
        mongodb = get_mongodb_cursor()
        if mongodb:
            analytics_db = mongodb["pasalku_ai_analytics"]
            analytics_db["adaptive_personas"].insert_one({
                "query_sample": query[:100] if query else "",
                "persona_type": persona,
                "response_length": response_length,
                "timestamp": datetime.now(),
                "source": "adaptive_persona_response"
            })
    except Exception as e:
        logger.error(f"Failed to log adaptive persona: {e}")