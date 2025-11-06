"""
🧠 PROACTIVE CHAT ROUTER - AI Konsultan Proaktif

Router baru yang menggunakan Conversation Orchestrator untuk memberikan
pengalaman konsultasi yang lebih cerdas dan proaktif.

PERBEDAAN DENGAN CHAT BIASA:
- Chat Biasa: User bertanya → AI menjawab → Selesai
- Proactive Chat: User bertanya → AI klarifikasi → AI analisis → AI tawarkan fitur premium → Eksekusi → Generate report

ENDPOINT UTAMA:
- POST /api/proactive-chat/message - Send message dengan orchestration
- GET /api/proactive-chat/session/{id} - Get session dengan metadata orchestration
- POST /api/proactive-chat/execute-feature - Execute fitur yang dipilih user
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from ..database import get_db, get_mongodb
from ..models.user import User
from ..models.chat import ChatSession, AIQueryLog
from ..core.security_updated import get_current_user
from ..services.conversation_orchestrator import ConversationOrchestrator, ConversationStage
from ..services.ark_ai_service import ark_ai_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/proactive-chat", tags=["Proactive AI Chat"])


# Pydantic Models
class ProactiveChatRequest(BaseModel):
    """Request untuk proactive chat"""
    message: str = Field(..., min_length=5, description="Pesan dari user")
    session_id: Optional[str] = Field(None, description="ID sesi (optional, akan create jika null)")


class FeatureOffering(BaseModel):
    """Model untuk feature yang ditawarkan"""
    feature_id: str
    feature_name: str
    tier: str  # free, professional, premium
    confidence: float
    description: str
    icon: Optional[str] = None


class ProactiveChatResponse(BaseModel):
    """Response dari proactive chat"""
    message_id: str
    session_id: str
    stage: str  # conversation stage
    category: str  # legal category
    ai_response: str
    clarification_questions: List[str] = []
    feature_offerings: List[FeatureOffering] = []
    next_actions: List[str] = []
    metadata: Dict[str, Any] = {}
    created_at: datetime


class ExecuteFeatureRequest(BaseModel):
    """Request untuk execute fitur yang dipilih"""
    session_id: str
    feature_id: str
    additional_data: Optional[Dict[str, Any]] = None


class ExecuteFeatureResponse(BaseModel):
    """Response dari feature execution"""
    feature_id: str
    status: str
    result: Dict[str, Any]
    next_steps: List[str]


@router.post("/message", response_model=ProactiveChatResponse)
async def send_proactive_message(
    request: ProactiveChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    mongodb = Depends(get_mongodb)
):
    """
    **🧠 PROACTIVE CHAT - AI Konsultan yang Cerdas**
    
    Endpoint ini menggunakan Conversation Orchestrator untuk memberikan
    pengalaman konsultasi yang lebih natural dan proaktif.
    
    **Alur Otomatis:**
    1. **Tahap Klarifikasi**: AI akan bertanya detail untuk memahami masalah
    2. **Analisis Awal**: AI memberikan analisis hukum dasar (GRATIS)
    3. **Feature Offering**: AI menawarkan fitur premium yang relevan
    4. **Eksekusi**: User memilih fitur untuk analisis mendalam
    5. **Sintesis**: AI menggabungkan semua hasil menjadi laporan strategi
    
    **User Tier:**
    - Free: Akses konsultasi dasar + template generator
    - Professional: + Persona Simulation + Reasoning Analysis
    - Premium: + Contract Analysis + Full features
    """
    
    try:
        # Get or create session
        if request.session_id:
            session = db.query(ChatSession).filter(
                ChatSession.id == uuid.UUID(request.session_id),
                ChatSession.user_id == current_user.id
            ).first()
            
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
        else:
            # Create new session
            session = ChatSession(
                user_id=current_user.id,
                title=request.message[:50] + "..." if len(request.message) > 50 else request.message,
                ai_model="proactive-orchestrator",
                ai_persona="consultant",
                mongodb_transcript_id=str(uuid.uuid4())
            )
            db.add(session)
            db.commit()
            db.refresh(session)
            
            logger.info(f"New proactive session created: {session.id}")
        
        # Get conversation history from MongoDB
        transcript = mongodb.chat_transcripts.find_one({"_id": session.mongodb_transcript_id})
        
        conversation_history = []
        if transcript:
            conversation_history = [
                {"role": msg["role"], "content": msg["content"]}
                for msg in transcript.get("messages", [])
            ]
        
        # Initialize orchestrator
        orchestrator = ConversationOrchestrator()
        
        # Determine user tier (dari subscription)
        user_tier = _get_user_tier(current_user)
        
        # Process message dengan orchestrator
        orchestration_result = await orchestrator.process_message(
            message=request.message,
            conversation_history=conversation_history,
            user_tier=user_tier,
            session_id=str(session.id)
        )
        
        # Get AI response berdasarkan stage
        ai_response_text = orchestration_result["ai_response"]
        
        # Jika bukan tahap INITIAL_INQUIRY, tambahkan actual AI analysis
        if orchestration_result["stage"] not in ["initial_inquiry", "clarification"]:
            # Call actual AI untuk legal analysis
            ai_result = await ark_ai_service.legal_consultation(
                user_query=request.message,
                conversation_history=conversation_history,
                persona="konsultan_hukum"
            )
            
            if ai_result["success"]:
                # Inject AI analysis ke response
                ai_response_text = ai_response_text.replace(
                    "Baik, berdasarkan informasi yang Anda berikan:",
                    ai_result["content"][:500]  # Use first 500 chars dari AI response
                )
        
        # Save messages to MongoDB
        user_message = {
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        assistant_message = {
            "role": "assistant",
            "content": ai_response_text,
            "timestamp": datetime.utcnow().isoformat(),
            "stage": orchestration_result["stage"],
            "category": orchestration_result["category"],
            "features_offered": [f["feature_id"] for f in orchestration_result.get("feature_offerings", [])]
        }
        
        if transcript:
            mongodb.chat_transcripts.update_one(
                {"_id": session.mongodb_transcript_id},
                {"$push": {"messages": {"$each": [user_message, assistant_message]}}}
            )
        else:
            mongodb.chat_transcripts.insert_one({
                "_id": session.mongodb_transcript_id,
                "session_id": str(session.id),
                "messages": [user_message, assistant_message],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # Update session metadata
        session.message_count += 2
        session.last_message_at = datetime.utcnow()
        db.commit()
        
        # Log AI query
        ai_log = AIQueryLog(
            user_id=current_user.id,
            session_id=session.id,
            query_type="proactive_chat",
            ai_provider="orchestrator",
            model="proactive-v1",
            prompt_tokens=len(request.message.split()),
            completion_tokens=len(ai_response_text.split()),
            total_tokens=len(request.message.split()) + len(ai_response_text.split()),
            response_time_ms=0  # Will be calculated
        )
        db.add(ai_log)
        db.commit()
        
        # Build response
        feature_offerings = [
            FeatureOffering(
                feature_id=f["feature_id"],
                feature_name=f["feature_name"],
                tier=f["tier"],
                confidence=f["confidence"],
                description=f["feature_name"],
                icon=_get_feature_icon(f["feature_id"])
            )
            for f in orchestration_result.get("feature_offerings", [])
        ]
        
        return ProactiveChatResponse(
            message_id=str(uuid.uuid4()),
            session_id=str(session.id),
            stage=orchestration_result["stage"],
            category=orchestration_result["category"],
            ai_response=ai_response_text,
            clarification_questions=orchestration_result.get("clarification_questions", []),
            feature_offerings=feature_offerings,
            next_actions=orchestration_result.get("next_actions", []),
            metadata=orchestration_result.get("metadata", {}),
            created_at=datetime.utcnow()
        )
    
    except Exception as e:
        logger.error(f"Proactive chat error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan saat memproses pesan: {str(e)}"
        )


@router.post("/execute-feature", response_model=ExecuteFeatureResponse)
async def execute_selected_feature(
    request: ExecuteFeatureRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    """
    **⚙️ EXECUTE FEATURE - Jalankan Fitur yang Dipilih User**
    
    Endpoint untuk execute fitur premium yang dipilih user seperti:
    - Contract Analysis
    - Persona Simulation
    - Reasoning Analysis
    - Template Generation
    - dll
    
    **Flow:**
    1. User memilih fitur dari offerings (Opsi A/B/C)
    2. Frontend call endpoint ini dengan feature_id
    3. System routing ke service yang tepat
    4. Return hasil + next steps
    """
    
    try:
        # Verify session ownership
        session = db.query(ChatSession).filter(
            ChatSession.id == uuid.UUID(request.session_id),
            ChatSession.user_id == current_user.id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Check user tier permission
        user_tier = _get_user_tier(current_user)
        feature_tier = _get_feature_tier(request.feature_id)
        
        if not _has_access_to_feature(user_tier, feature_tier):
            raise HTTPException(
                status_code=403,
                detail=f"Fitur ini memerlukan tier {feature_tier}. Upgrade akun Anda untuk mengakses."
            )
        
        # Route to appropriate service
        result = await _route_feature_execution(
            feature_id=request.feature_id,
            session_id=request.session_id,
            user=current_user,
            additional_data=request.additional_data or {},
            db=db
        )
        
        return ExecuteFeatureResponse(
            feature_id=request.feature_id,
            status="success",
            result=result,
            next_steps=result.get("next_steps", [])
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Feature execution error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Gagal execute fitur: {str(e)}"
        )


@router.get("/session/{session_id}")
async def get_proactive_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    mongodb = Depends(get_mongodb)
):
    """
    Get session details dengan orchestration metadata
    """
    
    session = db.query(ChatSession).filter(
        ChatSession.id == uuid.UUID(session_id),
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get transcript
    transcript = mongodb.chat_transcripts.find_one({"_id": session.mongodb_transcript_id})
    
    return {
        "session_id": str(session.id),
        "title": session.title,
        "created_at": session.created_at,
        "message_count": session.message_count,
        "messages": transcript.get("messages", []) if transcript else [],
        "metadata": {
            "model": session.ai_model,
            "persona": session.ai_persona
        }
    }


# Helper Functions

def _get_user_tier(user: User) -> str:
    """Determine user tier from subscription"""
    # Check subscription status (implement based on your subscription model)
    # For now, return based on role
    if hasattr(user, 'subscription_tier'):
        return user.subscription_tier
    
    # Default based on role
    if user.role == "admin":
        return "premium"
    
    return "free"


def _get_feature_tier(feature_id: str) -> str:
    """Get tier requirement untuk feature"""
    tier_map = {
        "contract_analysis": "premium",
        "persona_simulation": "professional",
        "document_ocr": "premium",
        "reasoning_analysis": "professional",
        "template_generation": "free",
        "ai_debate": "professional",
        "contract_comparison": "premium",
        "risk_assessment": "professional",
        "citation_validator": "free"
    }
    
    return tier_map.get(feature_id, "free")


def _has_access_to_feature(user_tier: str, feature_tier: str) -> bool:
    """Check apakah user punya akses ke feature"""
    tier_levels = {
        "free": 0,
        "professional": 1,
        "premium": 2
    }
    
    user_level = tier_levels.get(user_tier, 0)
    feature_level = tier_levels.get(feature_tier, 0)
    
    return user_level >= feature_level


def _get_feature_icon(feature_id: str) -> str:
    """Get icon untuk feature"""
    icons = {
        "contract_analysis": "📄",
        "persona_simulation": "🎭",
        "document_ocr": "📷",
        "reasoning_analysis": "🧠",
        "template_generation": "📝",
        "ai_debate": "⚖️",
        "contract_comparison": "📊",
        "risk_assessment": "⚠️",
        "citation_validator": "📚"
    }
    
    return icons.get(feature_id, "✨")


async def _route_feature_execution(
    feature_id: str,
    session_id: str,
    user: User,
    additional_data: Dict[str, Any],
    db: Session
) -> Dict[str, Any]:
    """
    Route feature execution ke service yang tepat
    
    Ini adalah "router" yang menghubungkan orchestrator dengan actual features
    """
    
    # Import services as needed
    from ..services.ai_service import AdvancedAIService
    
    ai_service = AdvancedAIService()
    
    if feature_id == "contract_analysis":
        # Redirect to contract engine
        return {
            "instruction": "Silakan upload dokumen kontrak Anda",
            "upload_endpoint": "/api/contract-engine/analyze-contract",
            "next_steps": ["upload_document"]
        }
    
    elif feature_id == "persona_simulation":
        # Start persona simulation
        return {
            "mode": "simulation_active",
            "persona": "HRD",
            "message": "Simulasi negosiasi dimulai. Saya adalah HRD perusahaan Anda. Silakan mulai bernegosiasi.",
            "next_steps": ["send_negotiation_message"]
        }
    
    elif feature_id == "template_generation":
        # Show template options
        return {
            "templates": [
                {"id": "somasi", "name": "Surat Somasi"},
                {"id": "tuntutan_hak", "name": "Surat Tuntutan Hak (PHK)"},
                {"id": "kuasa", "name": "Surat Kuasa"},
                {"id": "jawaban", "name": "Surat Jawaban/Bantahan"}
            ],
            "next_steps": ["select_template"]
        }
    
    elif feature_id == "reasoning_analysis":
        return {
            "instruction": "Silakan sampaikan argumen yang ingin dianalisis",
            "next_steps": ["provide_argument"]
        }
    
    else:
        return {
            "error": f"Feature {feature_id} belum diimplementasikan",
            "next_steps": []
        }


# Export router
__all__ = ["router"]
