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
from ..services.report_generator import report_generator

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


@router.post("/generate-report")
async def generate_strategic_report(
    session_id: str,
    user_id: Optional[str] = None,
    mongodb = Depends(get_mongodb)
):
    """
    🎯 GENERATE STRATEGIC REPORT (Stage 4 - Synthesis)
    
    Endpoint untuk generate Laporan Strategi Hukum PDF yang komprehensif
    dari seluruh aktivitas dalam sesi konsultasi.
    
    **Features:**
    - Executive Summary
    - Detailed Analysis
    - SWOT Analysis
    - Risk Assessment
    - 30-Day Action Plan
    - Legal References
    
    **Response:**
    - PDF file (downloadable)
    """
    try:
        # Get session from MongoDB
        chat_collection = mongodb["chat_transcripts"]
        session = chat_collection.find_one({"session_id": session_id})
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Prepare session data for report
        transcript = session.get("transcript", [])
        features_used = session.get("features_used", [])
        legal_category = session.get("legal_category", "general")
        
        # Extract key information from transcript
        user_messages = [msg for msg in transcript if msg.get("role") == "user"]
        ai_responses = [msg for msg in transcript if msg.get("role") == "assistant"]
        
        # Build comprehensive session data
        session_data = {
            "transcript": transcript,
            "features_used": features_used,
            "legal_category": legal_category,
            "stage_history": session.get("stage_history", []),
            
            # Analysis summary (combine AI responses)
            "analysis_summary": _extract_analysis_summary(ai_responses),
            
            # Key findings
            "key_findings": _extract_key_findings(transcript, features_used),
            
            # Detailed analysis
            "detailed_analysis": {
                "legal_basis": _extract_legal_basis(ai_responses),
                "relevant_articles": _extract_relevant_articles(ai_responses),
                "precedents": "Based on similar cases in Indonesian jurisdiction"
            },
            
            # SWOT Analysis
            "swot_analysis": _generate_swot_analysis(transcript, legal_category),
            
            # Risk Assessment
            "risks": _identify_risks(transcript, legal_category),
            
            # Action Plan
            "action_plan": _generate_action_plan(transcript, features_used),
            
            # Legal References
            "legal_references": _compile_legal_references(legal_category)
        }
        
        # User info (if available)
        user_info = None
        if user_id:
            user_info = {
                "name": "Client",  # Would fetch from DB in production
                "company": "N/A"
            }
        
        # Generate PDF report
        pdf_bytes = report_generator.generate_report(
            session_id=session_id,
            session_data=session_data,
            user_info=user_info
        )
        
        # Return PDF as downloadable file
        from fastapi.responses import Response
        
        filename = f"Strategic_Report_{session_id[:8]}_{datetime.now().strftime('%Y%m%d')}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
        
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


# Helper functions for report data extraction
def _extract_analysis_summary(ai_responses: List[Dict]) -> str:
    """Extract comprehensive analysis summary from AI responses"""
    if not ai_responses:
        return "Konsultasi telah dilakukan dengan analisis AI komprehensif."
    
    # Get the most substantive responses
    summaries = []
    for resp in ai_responses[-3:]:  # Last 3 responses
        content = resp.get("content", "")
        if len(content) > 100:
            summaries.append(content[:300])
    
    return " ".join(summaries) if summaries else "Analisis lengkap tersedia dalam transkrip."


def _extract_key_findings(transcript: List[Dict], features_used: List[Dict]) -> List[str]:
    """Extract key findings from session"""
    findings = []
    
    # Add finding based on features used
    if features_used:
        findings.append(f"Utilized {len(features_used)} AI-powered analysis tools")
    
    # Add finding based on conversation length
    user_msgs = len([m for m in transcript if m.get("role") == "user"])
    findings.append(f"Comprehensive consultation with {user_msgs} interaction points")
    
    # Generic findings
    findings.extend([
        "Identified primary legal category and relevant regulations",
        "Assessed risks and opportunities in current situation",
        "Developed actionable strategy with clear timeline"
    ])
    
    return findings[:5]


def _extract_legal_basis(ai_responses: List[Dict]) -> str:
    """Extract mentioned legal basis from AI responses"""
    legal_mentions = []
    keywords = ["UU", "Undang-Undang", "Pasal", "Peraturan", "KUHP", "KUHPerdata"]
    
    for resp in ai_responses:
        content = resp.get("content", "")
        for keyword in keywords:
            if keyword in content:
                legal_mentions.append(keyword)
                break
    
    if legal_mentions:
        return f"Based on Indonesian legal framework including {', '.join(set(legal_mentions[:3]))}"
    return "Based on applicable Indonesian laws and regulations"


def _extract_relevant_articles(ai_responses: List[Dict]) -> List[str]:
    """Extract mentioned legal articles"""
    articles = []
    
    for resp in ai_responses:
        content = resp.get("content", "")
        # Simple pattern matching for "Pasal XX"
        import re
        pasal_matches = re.findall(r'Pasal \d+[a-z]?', content, re.IGNORECASE)
        articles.extend(pasal_matches[:3])
    
    return list(set(articles))[:5] if articles else ["Pasal terkait dalam regulasi yang berlaku"]


def _generate_swot_analysis(transcript: List[Dict], category: str) -> Dict:
    """Generate SWOT analysis based on case category"""
    swot_templates = {
        "ketenagakerjaan": {
            "strengths": ["Clear employment documentation", "Witness availability"],
            "weaknesses": ["Limited written evidence", "Timeline constraints"],
            "opportunities": ["Settlement negotiation potential", "Regulatory support"],
            "threats": ["Litigation costs", "Time-consuming legal process"]
        },
        "kontrak": {
            "strengths": ["Written agreement exists", "Clear terms documented"],
            "weaknesses": ["Ambiguous clauses", "Force majeure considerations"],
            "opportunities": ["Contract renegotiation", "Mediation options"],
            "threats": ["Breach penalties", "Reputation risks"]
        }
    }
    
    return swot_templates.get(category, {
        "strengths": ["Strong legal position"],
        "weaknesses": ["Documentation gaps"],
        "opportunities": ["Settlement potential"],
        "threats": ["Litigation risks"]
    })


def _identify_risks(transcript: List[Dict], category: str) -> List[Dict]:
    """Identify potential risks based on case"""
    risk_templates = {
        "ketenagakerjaan": [
            {
                "description": "Insufficient severance calculation",
                "likelihood": "Medium",
                "impact": "High",
                "priority": "High",
                "mitigation": "Verify calculation with legal formula"
            }
        ],
        "kontrak": [
            {
                "description": "Contract breach implications",
                "likelihood": "Medium",
                "impact": "Medium",
                "priority": "Medium",
                "mitigation": "Review force majeure clauses"
            }
        ]
    }
    
    return risk_templates.get(category, [
        {
            "description": "General legal risks",
            "likelihood": "Low",
            "impact": "Medium",
            "priority": "Medium",
            "mitigation": "Consult with legal professional"
        }
    ])


def _generate_action_plan(transcript: List[Dict], features_used: List[Dict]) -> Dict:
    """Generate 30-day action plan"""
    return {
        "week_1": [
            "Review all documentation and evidence",
            "Consult with legal professional if needed",
            "Gather supporting documents"
        ],
        "week_2": [
            "Draft initial legal correspondence",
            "Identify negotiation opportunities",
            "Prepare settlement proposal"
        ],
        "week_3": [
            "Initiate formal communication with other party",
            "Monitor response deadlines",
            "Prepare alternative strategies"
        ],
        "week_4": [
            "Evaluate progress and outcomes",
            "Consider mediation or litigation options",
            "Finalize strategic approach"
        ]
    }


def _compile_legal_references(category: str) -> List[str]:
    """Compile relevant legal references"""
    references = {
        "ketenagakerjaan": [
            "Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan",
            "Peraturan Pemerintah Nomor 35 Tahun 2021 tentang PKWT",
            "Surat Edaran Menaker terkait PHK dan Pesangon"
        ],
        "kontrak": [
            "Kitab Undang-Undang Hukum Perdata (KUHPerdata) Buku III",
            "Undang-Undang Nomor 30 Tahun 1999 tentang Arbitrase",
            "Peraturan terkait perjanjian dan kontrak"
        ],
        "pidana": [
            "Kitab Undang-Undang Hukum Pidana (KUHP)",
            "Kitab Undang-Undang Hukum Acara Pidana (KUHAP)",
            "Undang-Undang terkait tindak pidana khusus"
        ]
    }
    
    return references.get(category, [
        "Kitab Undang-Undang Hukum Perdata (KUHPerdata)",
        "Peraturan perundang-undangan terkait",
        "Yurisprudensi Mahkamah Agung"
    ])


# Export router
__all__ = ["router"]
