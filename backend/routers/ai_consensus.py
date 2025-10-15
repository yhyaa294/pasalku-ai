"""
AI Consensus Router

FastAPI endpoints for Dual AI Consensus Engine.
Provides REST API for querying legal questions with consensus from BytePlus Ark and Groq.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import time

from services.ai.consensus_engine import (
    DualAIConsensusEngine,
    ConsensusResult,
    get_consensus_engine
)
from services.ark_ai_service import ArkAIService
from services.ai.groq_service import get_groq_service


# Pydantic models
class ConsensusRequest(BaseModel):
    """Request model for consensus query"""
    prompt: str = Field(..., description="User's legal question or query")
    system_prompt: Optional[str] = Field(
        None,
        description="System prompt to guide AI behavior"
    )
    temperature: Optional[float] = Field(
        0.7,
        ge=0.0,
        le=2.0,
        description="Response creativity (0.0-2.0, lower = more focused)"
    )
    max_tokens: Optional[int] = Field(
        1000,
        ge=100,
        le=4000,
        description="Maximum response length in tokens"
    )
    enable_parallel: Optional[bool] = Field(
        True,
        description="Enable parallel execution of both AI models"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "prompt": "Apa yang harus saya lakukan jika tetangga membangun di tanah saya?",
                "system_prompt": "Anda adalah asisten hukum AI Pasalku.ai yang ahli dalam hukum Indonesia.",
                "temperature": 0.6,
                "max_tokens": 1000,
                "enable_parallel": True
            }
        }


class AIResponseDetail(BaseModel):
    """Individual AI model response details"""
    model_name: str
    confidence: float
    response_time: float
    tokens_used: int
    content_preview: str  # First 200 chars


class ConsensusResponse(BaseModel):
    """Response model for consensus query"""
    success: bool
    final_content: str
    consensus_method: str
    consensus_confidence: float
    similarity_score: float
    total_time: float
    byteplus_detail: AIResponseDetail
    groq_detail: AIResponseDetail
    metadata: Dict[str, Any]
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "final_content": "Berdasarkan hukum Indonesia...",
                "consensus_method": "high_agreement",
                "consensus_confidence": 0.92,
                "similarity_score": 0.87,
                "total_time": 2.34,
                "byteplus_detail": {
                    "model_name": "BytePlus Ark",
                    "confidence": 0.92,
                    "response_time": 2.1,
                    "tokens_used": 450,
                    "content_preview": "Berdasarkan hukum Indonesia..."
                },
                "groq_detail": {
                    "model_name": "Groq",
                    "confidence": 0.89,
                    "response_time": 0.8,
                    "tokens_used": 420,
                    "content_preview": "Sesuai dengan peraturan..."
                },
                "metadata": {
                    "parallel_execution": True,
                    "temperature": 0.6
                }
            }
        }


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    consensus_engine: str
    byteplus_ark: str
    groq: str


# Router
router = APIRouter(
    prefix="/api/ai",
    tags=["AI Consensus"]
)


# Dependency to get consensus engine
def get_engine() -> DualAIConsensusEngine:
    """Get consensus engine instance"""
    try:
        byteplus_service = ArkAIService()
        groq_service = get_groq_service()
        return get_consensus_engine(
            byteplus_service=byteplus_service,
            groq_service=groq_service
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initialize consensus engine: {str(e)}"
        )


@router.post("/consensus", response_model=ConsensusResponse)
async def get_consensus(
    request: ConsensusRequest,
    engine: DualAIConsensusEngine = Depends(get_engine)
):
    """
    Get consensus response from dual AI models.
    
    This endpoint queries both BytePlus Ark and Groq AI models,
    analyzes their responses, and returns a consensus answer with
    confidence scores.
    
    **Features:**
    - Parallel execution of both AI models for speed
    - Semantic similarity analysis between responses
    - Intelligent consensus strategies based on agreement level
    - Detailed confidence scoring
    - Fallback mechanisms when models disagree
    
    **Consensus Strategies:**
    - **High Agreement (≥85% similarity)**: Use highest confidence response
    - **Moderate Agreement (60-85%)**: Weighted merge of both responses
    - **Low Agreement (<60%)**: Conservative approach with disclaimer
    """
    try:
        start_time = time.time()
        
        # Set default system prompt if not provided
        system_prompt = request.system_prompt or """
        Anda adalah asisten hukum AI Pasalku.ai yang ahli dalam hukum Indonesia.
        Berikan jawaban yang akurat dengan menyebutkan dasar hukum yang relevan.
        Gunakan bahasa yang mudah dipahami oleh masyarakat umum.
        """
        
        # Get consensus response
        result: ConsensusResult = await engine.get_consensus_response(
            prompt=request.prompt,
            system_prompt=system_prompt.strip(),
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            enable_parallel=request.enable_parallel
        )
        
        # Build response
        response = ConsensusResponse(
            success=True,
            final_content=result.final_content,
            consensus_method=result.consensus_method,
            consensus_confidence=result.consensus_confidence,
            similarity_score=result.similarity_score,
            total_time=time.time() - start_time,
            byteplus_detail=AIResponseDetail(
                model_name=result.byteplus_response.model_name,
                confidence=result.byteplus_response.confidence,
                response_time=result.byteplus_response.response_time,
                tokens_used=result.byteplus_response.tokens_used,
                content_preview=result.byteplus_response.content[:200]
            ),
            groq_detail=AIResponseDetail(
                model_name=result.groq_response.model_name,
                confidence=result.groq_response.confidence,
                response_time=result.groq_response.response_time,
                tokens_used=result.groq_response.tokens_used,
                content_preview=result.groq_response.content[:200]
            ),
            metadata={
                "parallel_execution": request.enable_parallel,
                "temperature": request.temperature,
                "max_tokens": request.max_tokens,
                "prompt_length": len(request.prompt),
                "system_prompt_provided": request.system_prompt is not None
            }
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Consensus query failed: {str(e)}"
        )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check for AI consensus services.
    
    Checks the availability of:
    - Consensus engine
    - BytePlus Ark service
    - Groq service
    """
    try:
        # Check BytePlus Ark
        byteplus_status = "available"
        try:
            byteplus_service = ArkAIService()
            # Could add a simple test query here
        except Exception as e:
            byteplus_status = f"unavailable: {str(e)}"
        
        # Check Groq
        groq_status = "available"
        try:
            groq_service = get_groq_service()
            # Could add a simple test query here
        except Exception as e:
            groq_status = f"unavailable: {str(e)}"
        
        # Overall status
        overall_status = "healthy" if (
            "available" in byteplus_status and "available" in groq_status
        ) else "degraded"
        
        return HealthResponse(
            status=overall_status,
            consensus_engine="operational",
            byteplus_ark=byteplus_status,
            groq=groq_status
        )
        
    except Exception as e:
        return HealthResponse(
            status="unhealthy",
            consensus_engine=f"error: {str(e)}",
            byteplus_ark="unknown",
            groq="unknown"
        )


@router.post("/consensus/simple")
async def simple_consensus(
    prompt: str,
    engine: DualAIConsensusEngine = Depends(get_engine)
):
    """
    Simplified consensus endpoint.
    
    Returns just the final consensus text without detailed metadata.
    Useful for quick queries and frontend integrations.
    
    **Parameters:**
    - **prompt**: Legal question to ask
    
    **Returns:**
    - JSON with `answer` field containing consensus response
    """
    try:
        system_prompt = """
        Anda adalah asisten hukum AI Pasalku.ai yang ahli dalam hukum Indonesia.
        Berikan jawaban singkat dan jelas.
        """
        
        result = await engine.get_consensus_response(
            prompt=prompt,
            system_prompt=system_prompt.strip(),
            temperature=0.7,
            max_tokens=800
        )
        
        return {
            "success": True,
            "answer": result.final_content,
            "confidence": result.consensus_confidence
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Simple consensus failed: {str(e)}"
        )


@router.get("/models/info")
async def get_models_info():
    """
    Get information about available AI models.
    
    Returns details about BytePlus Ark and Groq models used in consensus.
    """
    return {
        "models": [
            {
                "name": "BytePlus Ark",
                "description": "Deep reasoning model for comprehensive legal analysis",
                "features": [
                    "Complex legal reasoning",
                    "Citation extraction",
                    "Multi-step analysis",
                    "High accuracy"
                ],
                "typical_response_time": "2-3 seconds"
            },
            {
                "name": "Groq",
                "description": "Fast inference model for quick legal validation",
                "features": [
                    "Ultra-fast responses",
                    "Real-time validation",
                    "Efficient processing",
                    "High throughput"
                ],
                "typical_response_time": "0.5-1 second"
            }
        ],
        "consensus_strategies": [
            {
                "name": "High Agreement",
                "threshold": "≥85% similarity",
                "behavior": "Use highest confidence response"
            },
            {
                "name": "Moderate Agreement",
                "threshold": "60-85% similarity",
                "behavior": "Weighted merge (BytePlus 60%, Groq 40%)"
            },
            {
                "name": "Low Agreement",
                "threshold": "<60% similarity",
                "behavior": "Conservative with disclaimer"
            }
        ]
    }
