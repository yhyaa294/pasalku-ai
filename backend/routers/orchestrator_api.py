"""
API Endpoint untuk AI Orchestrator - WORKING CODE!
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

from backend.services.orchestrator_engine import (
    orchestrator,
    UserTier,
    ConversationStage
)
from backend.services.contract_analyzer import contract_analyzer
from backend.services.negotiation_simulator import negotiation_simulator
from backend.services.report_generator import report_generator

router = APIRouter(prefix="/api/orchestrator", tags=["AI Orchestrator"])


# Request/Response Models
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: Optional[datetime] = None


class OrchestrationRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    user_tier: UserTier = UserTier.FREE
    context: Optional[Dict[str, Any]] = {}


class OrchestrationResponse(BaseModel):
    stage: int
    legal_area: str
    response_type: str
    message: str
    questions: Optional[List[str]] = None
    features: Optional[List[Dict[str, Any]]] = None
    signals: Optional[Dict[str, Any]] = None
    ai_response: str  # Formatted response untuk ditampilkan


@router.post("/analyze", response_model=OrchestrationResponse)
async def analyze_conversation(request: OrchestrationRequest):
    """
    Endpoint utama untuk orchestrate conversation
    
    Contoh request:
    ```json
    {
        "message": "Saya di-PHK sepihak tapi disuruh resign",
        "user_tier": "free",
        "conversation_history": [],
        "context": {}
    }
    ```
    """
    
    try:
        # Convert history to simple format
        history = [{"role": msg.role, "content": msg.content} 
                  for msg in request.conversation_history]
        
        # Call orchestrator (NOW ASYNC WITH REAL AI!)
        result = await orchestrator.orchestrate(
            user_message=request.message,
            conversation_history=history,
            user_tier=request.user_tier,
            context=request.context or {}
        )
        
        # Format AI response berdasarkan type
        ai_response = format_ai_response(result)
        
        return OrchestrationResponse(
            stage=result["stage"],
            legal_area=result["legal_area"],
            response_type=result["response_type"],
            message=result["message"],
            questions=result.get("questions"),
            features=result.get("features"),
            signals=result.get("signals"),
            ai_response=ai_response
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def format_ai_response(result: Dict[str, Any]) -> str:
    """Format hasil orchestrator jadi response text yang bagus"""
    
    response_parts = []
    
    # Header message
    response_parts.append(result["message"])
    response_parts.append("")
    
    # Add questions jika ada
    if result.get("questions"):
        for i, q in enumerate(result["questions"], 1):
            response_parts.append(f"{i}. {q}")
        response_parts.append("")
        response_parts.append("🎯 Mengapa ini penting: Jawaban Anda akan menentukan strategi terbaik dan hak-hak yang bisa Anda klaim.")
    
    # Add features jika ada
    if result.get("features"):
        response_parts.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        response_parts.append("")
        
        for feature in result["features"]:
            tier_badge = {
                "free": "🆓 GRATIS",
                "premium": "💎 PREMIUM",
                "professional": "👑 PROFESSIONAL"
            }.get(feature["tier"], "")
            
            response_parts.append(f"┌─ {feature['name']} ─┐")
            response_parts.append(f"│ {tier_badge}")
            response_parts.append(f"│ ✓ {feature['description']}")
            
            if feature.get("upgrade_needed"):
                response_parts.append(f"│ ⚠️ Perlu upgrade ke {feature['tier'].upper()}")
            else:
                response_parts.append(f"│ ✅ Tersedia untuk tier Anda")
            
            response_parts.append("└────────────────────┘")
            response_parts.append("")
    
    return "\n".join(response_parts)


@router.get("/features/{legal_area}")
async def get_available_features(
    legal_area: str,
    user_tier: UserTier = UserTier.FREE
):
    """Get all available features untuk legal area tertentu"""
    
    from backend.services.orchestrator_engine import LegalArea
    
    try:
        area = LegalArea(legal_area)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid legal area: {legal_area}")
    
    features = orchestrator.feature_map.get(area, [])
    
    # Add accessibility info
    result = []
    for feature in features:
        is_accessible = (
            user_tier == UserTier.PROFESSIONAL or
            (user_tier == UserTier.PREMIUM and feature["tier"] != UserTier.PROFESSIONAL) or
            feature["tier"] == UserTier.FREE
        )
        
        feature_copy = feature.copy()
        feature_copy.pop("trigger_condition", None)  # Remove lambda
        feature_copy["is_accessible"] = is_accessible
        result.append(feature_copy)
    
    return {
        "legal_area": legal_area,
        "user_tier": user_tier,
        "features": result
    }


@router.post("/detect-area")
async def detect_legal_area(message: str):
    """Quick endpoint untuk detect legal area dari message"""
    
    area = orchestrator.detect_legal_area(message)
    signals = orchestrator.extract_context_signals(message)
    
    return {
        "message": message,
        "detected_area": area.value,
        "signals": signals,
        "confidence": "high" if signals else "low"
    }


# ==================== FEATURE EXECUTION ENDPOINTS ====================

@router.post("/execute/contract-analysis")
async def execute_contract_analysis(
    file: UploadFile = File(...),
    contract_type: str = "employment"
):
    """
    Execute contract analysis feature
    Upload PDF contract and get detailed analysis
    """
    try:
        # Read file content
        file_content = await file.read()
        
        # Analyze document
        result = await contract_analyzer.analyze_document(
            file_content=file_content,
            file_name=file.filename,
            contract_type=contract_type
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/execute/negotiation-sim/start")
async def start_negotiation_simulation(
    scenario: str,
    persona_type: str = "hrd_flexible",
    user_goal: str = "",
    context: Optional[Dict[str, Any]] = None
):
    """
    Start negotiation simulation
    
    Available personas:
    - hrd_strict: HRD yang ketat
    - hrd_flexible: HRD yang fleksibel (default)
    - hrd_aggressive: HRD yang agresif
    - boss_direct: Atasan langsung
    - lawyer_opponent: Pengacara lawan
    """
    try:
        session_data = await negotiation_simulator.start_simulation(
            scenario=scenario,
            persona_type=persona_type,
            user_goal=user_goal,
            context=context or {}
        )
        
        return session_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start simulation: {str(e)}")


@router.post("/execute/negotiation-sim/continue")
async def continue_negotiation_simulation(
    session_id: str,
    user_message: str,
    session_data: Dict[str, Any]
):
    """Continue negotiation simulation with user's response"""
    try:
        updated_session = await negotiation_simulator.continue_simulation(
            session_id=session_id,
            user_message=user_message,
            session_data=session_data
        )
        
        return updated_session
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to continue simulation: {str(e)}")


@router.post("/execute/negotiation-sim/end")
async def end_negotiation_simulation(session_data: Dict[str, Any]):
    """End simulation and get final report"""
    try:
        final_report = await negotiation_simulator.end_simulation(session_data)
        return final_report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to end simulation: {str(e)}")


@router.post("/execute/generate-report")
async def generate_consultation_report(
    session_data: Dict[str, Any],
    analysis_results: Dict[str, Any],
    recommendations: List[Dict[str, Any]]
):
    """
    Generate professional PDF report
    Returns PDF file as download
    """
    try:
        pdf_bytes = await report_generator.generate_consultation_report(
            session_data=session_data,
            analysis_results=analysis_results,
            recommendations=recommendations
        )
        
        # Return as PDF file
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=consultation_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")
