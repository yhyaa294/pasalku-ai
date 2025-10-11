"""
Case Study Arena - Interactive Legal Case Analysis Dashboard
Menggabungkan semua advanced AI capabilities untuk analisis kasus hukum interaktif:
- Multi-case comparison
- Cross-case pattern recognition
- Predictive outcomes
- Personalized learning paths
- Interactive scenario simulation
"""
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging
import asyncio
from datetime import datetime
import json

from ..services.blockchain_databases import get_mongodb_cursor
from ..services.ai_service import AdvancedAIService
from ..core.security_updated import get_current_user
from ..models import User

router = APIRouter(prefix="/api/case-studies", tags=["Case Studies"])
logger = logging.getLogger(__name__)

advanced_ai = AdvancedAIService()

# Pydantic Models
class CaseStudyRequest(BaseModel):
    """Request untuk submit case study"""
    title: str = Field(..., description="Judul kasus")
    description: str = Field(..., description="Deskripsi kasus hukum")
    category: str = Field(..., description="Kategori hukum (perdata/pidana/keluarga/bisnis)")
    urgency_level: str = Field("medium", description="Tingkat urgensi")
    user_role: str = Field("general", description="Role pengguna")
    documents: Optional[List[str]] = Field(None, description="Array dokumen terkait")

class CaseComparisonRequest(BaseModel):
    """Request untuk compare multiple cases"""
    case_ids: List[str] = Field(..., description="List ID kasus untuk dibandingkan")
    analysis_type: str = Field("strategic", description="Tipe analisis: strategic/consensus/reasoning")

class ScenarioSimulationRequest(BaseModel):
    """Request untuk simulasi skenario alternatif"""
    base_case_id: str = Field(..., description="ID kasus dasar")
    scenario_variables: Dict[str, Any] = Field(..., description="Variabel yang diubah dalam simulasi")
    user_role: str = Field("general", description="Role pengguna")

class CaseStudyResponse(BaseModel):
    """Response lengkap case study analysis"""
    case_id: str
    title: str
    description: str
    category: str
    analysis_status: str
    strategic_assessment: Optional[Dict[str, Any]] = None
    consensus_analysis: Optional[Dict[str, Any]] = None
    reasoning_chain: Optional[List[str]] = None
    adaptive_responses: Optional[Dict[str, Any]] = None
    sentiment_analysis: Optional[Dict[str, Any]] = None
    predictive_outcomes: Optional[List[Dict[str, Any]]] = None
    risk_assessment: Optional[str] = None
    recommendations: Optional[List[str]] = None
    created_at: str
    updated_at: str

class ComparisonResponse(BaseModel):
    """Response untuk case comparison"""
    comparison_id: str
    cases_analyzed: List[str]
    analysis_type: str
    similarities: List[Dict[str, Any]]
    differences: List[Dict[str, Any]]
    patterns_identified: List[str]
    cross_case_insights: List[str]
    confidence_levels: Dict[str, float]

class LearningPathResponse(BaseModel):
    """Personalized learning path berdasarkan case analysis"""
    user_id: str
    recommended_topics: List[Dict[str, Any]]
    skill_gaps_identified: List[str]
    next_case_suggestions: List[str]
    learning_progress: Dict[str, Any]

@router.post("/analyze", response_model=CaseStudyResponse)
async def analyze_case_study(
    request: CaseStudyRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Comprehensive case study analysis menggunakan semua advanced AI APIs
    """
    try:
        case_id = f"case_{current_user.id}_{int(datetime.utcnow().timestamp())}"

        # Initial response structure
        case_data = {
            "case_id": case_id,
            "title": request.title,
            "description": request.description,
            "category": request.category,
            "analysis_status": "processing",
            "user_id": str(current_user.id),
            "user_email": current_user.email,
            "created_at": datetime.utcnow(),
            "documents": request.documents or []
        }

        # Save initial case to MongoDB
        mongodb = get_mongodb_cursor()
        if mongodb:
            db = mongodb["pasalku_ai_analytics"]
            await db["case_studies"].insert_one(case_data)

        # Trigger comprehensive analysis
        background_tasks.add_task(
            perform_comprehensive_case_analysis,
            case_id=case_id,
            description=request.description,
            category=request.category,
            urgency_level=request.urgency_level,
            user_role=request.user_role,
            documents=request.documents
        )

        return CaseStudyResponse(
            case_id=case_id,
            title=request.title,
            description=request.description,
            category=request.category,
            analysis_status="processing",
            created_at=datetime.utcnow().isoformat(),
            updated_at=datetime.utcnow().isoformat()
        )

    except Exception as e:
        logger.error(f"Case study analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal menganalisis kasus: {str(e)}")

@router.get("/{case_id}", response_model=CaseStudyResponse)
async def get_case_study(
    case_id: str,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get complete case study analysis"""
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="Database connection failed")

        db = mongodb["pasalku_ai_analytics"]
        case_data = await db["case_studies"].find_one({
            "case_id": case_id,
            "user_id": str(current_user.id)
        })

        if not case_data:
            raise HTTPException(status_code=404, detail="Case study not found")

        return case_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get case study error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve case study")

@router.post("/compare", response_model=ComparisonResponse)
async def compare_case_studies(
    request: CaseComparisonRequest,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Compare multiple case studies dengan berbagai AI analysis methods
    """
    try:
        if len(request.case_ids) < 2:
            raise HTTPException(status_code=400, detail="Minimal 2 kasus untuk comparison")

        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="Database connection failed")

        db = mongodb["pasalku_ai_analytics"]

        # Get all requested cases
        cases = []
        for case_id in request.case_ids:
            case_data = await db["case_studies"].find_one({
                "case_id": case_id,
                "user_id": str(current_user.id)
            })
            if case_data:
                cases.append(case_data)

        if len(cases) < 2:
            raise HTTPException(status_code=404, detail="Beberapa kasus tidak ditemukan")

        # Perform comparison analysis
        comparison_result = await advanced_ai.perform_case_comparison(
            cases=cases,
            analysis_type=request.analysis_type
        )

        comparison_id = f"comparison_{int(datetime.utcnow().timestamp())}"
        comparison_data = {
            "comparison_id": comparison_id,
            "user_id": str(current_user.id),
            "case_ids": request.case_ids,
            "analysis_type": request.analysis_type,
            "comparison_result": comparison_result,
            "created_at": datetime.utcnow()
        }

        await db["case_comparisons"].insert_one(comparison_data)

        return ComparisonResponse(
            comparison_id=comparison_id,
            cases_analyzed=request.case_ids,
            analysis_type=request.analysis_type,
            similarities=comparison_result.get("similarities", []),
            differences=comparison_result.get("differences", []),
            patterns_identified=comparison_result.get("patterns", []),
            cross_case_insights=comparison_result.get("insights", []),
            confidence_levels=comparison_result.get("confidence_levels", {})
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Case comparison error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Comparison gagal: {str(e)}")

@router.post("/simulate-scenario", response_model=Dict[str, Any])
async def simulate_case_scenario(
    request: ScenarioSimulationRequest,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Simulate alternative scenarios untuk case outcome prediction
    """
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="Database connection failed")

        db = mongodb["pasalku_ai_analytics"]

        # Get base case
        base_case = await db["case_studies"].find_one({
            "case_id": request.base_case_id,
            "user_id": str(current_user.id)
        })

        if not base_case:
            raise HTTPException(status_code=404, detail="Base case not found")

        # Generate scenario variations
        scenario_results = await advanced_ai.simulate_case_scenarios(
            base_case=base_case,
            scenario_variables=request.scenario_variables,
            user_role=request.user_role
        )

        return {
            "simulation_id": f"sim_{int(datetime.utcnow().timestamp())}",
            "base_case_id": request.base_case_id,
            "scenarios_simulated": scenario_results,
            "generated_at": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Scenario simulation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulasi gagal: {str(e)}")

@router.get("/user/learning-path", response_model=LearningPathResponse)
async def get_personalized_learning_path(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generate personalized learning path berdasarkan case study history
    """
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="Database connection failed")

        db = mongodb["pasalku_ai_analytics"]

        # Get user's case study history
        user_cases = await db["case_studies"].find({
            "user_id": str(current_user.id)
        }).sort("created_at", -1).to_list(length=None)

        if not user_cases:
            return LearningPathResponse(
                user_id=str(current_user.id),
                recommended_topics=[],
                skill_gaps_identified=[],
                next_case_suggestions=[],
                learning_progress={}
            )

        # Analyze learning patterns and gaps
        learning_analysis = await advanced_ai.analyze_learning_patterns(user_cases)

        return LearningPathResponse(
            user_id=str(current_user.id),
            recommended_topics=learning_analysis.get("recommended_topics", []),
            skill_gaps_identified=learning_analysis.get("skill_gaps", []),
            next_case_suggestions=learning_analysis.get("next_suggestions", []),
            learning_progress=learning_analysis.get("progress", {})
        )

    except Exception as e:
        logger.error(f"Learning path error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal generate learning path: {str(e)}")

@router.get("/trending-cases")
async def get_trending_case_studies(
    limit: int = 10,
    category: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get trending/popular case studies untuk learning resources
    """
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="Database connection failed")

        db = mongodb["pasalku_ai_analytics"]

        # Get trending cases (most analyzed/viewed)
        pipeline = [
            {"$match": category and {"category": category} or {}},
            {"$sort": {"view_count": -1, "created_at": -1}},
            {"$limit": limit},
            {"$project": {
                "case_id": 1,
                "title": 1,
                "category": 1,
                "description": {"$substr": ["$description", 0, 200]},
                "analysis_status": 1,
                "view_count": 1,
                "created_at": 1
            }}
        ]

        trending_cases = await db["case_studies"].aggregate(pipeline).to_list(length=None)

        return {
            "trending_cases": trending_cases,
            "total_count": len(trending_cases),
            "category": category
        }

    except Exception as e:
        logger.error(f"Trending cases error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch trending cases")

# Background processing function
async def perform_comprehensive_case_analysis(
    case_id: str,
    description: str,
    category: str,
    urgency_level: str,
    user_role: str,
    documents: Optional[List[str]] = None
):
    """
    Comprehensive AI analysis menggunakan semua advanced APIs
    """
    try:
        logger.info(f"Starting comprehensive analysis for case: {case_id}")

        mongodb = get_mongodb_cursor()
        if not mongodb:
            logger.error("MongoDB connection failed for case analysis")
            return

        db = mongodb["pasalku_ai_analytics"]

        # 1. Strategic Assessment
        strategic_result = await advanced_ai.strategic_assessment(
            legal_query=description,
            context_documents=documents,
            urgency_level=urgency_level
        )

        # 2. Consensus Analysis
        consensus_result = await advanced_ai.get_multi_ai_consensus(
            query=description,
            user_context=f"Category: {category}, Urgency: {urgency_level}"
        )

        # 3. Reasoning Chain
        reasoning_result = await advanced_ai.get_reasoning_chain_response(
            query=description,
            user_context=f"Legal case in {category} category"
        )

        # 4. Adaptive Persona Response
        adaptive_result = await advanced_ai.get_adaptive_persona_response(
            query=description,
            user_role=user_role
        )

        # 5. Sentiment Analysis
        sentiment_result = await advanced_ai.analyze_sentiment_and_adapt(
            query=description
        )

        # 6. Generate Predictive Outcomes
        predictive_outcomes = await advanced_ai.generate_predictive_outcomes(
            case_description=description,
            category=category,
            strategic_data=strategic_result
        )

        # 7. Final compilation
        final_analysis = {
            "analysis_status": "completed",
            "strategic_assessment": strategic_result,
            "consensus_analysis": consensus_result,
            "reasoning_chain": reasoning_result.get("reasoning_chain", []),
            "adaptive_responses": {
                user_role: adaptive_result
            },
            "sentiment_analysis": sentiment_result,
            "predictive_outcomes": predictive_outcomes,
            "risk_assessment": strategic_result.get("final_strategic_assessment", {}).get("risk_level", "medium"),
            "recommendations": strategic_result.get("final_recommendations", []),
            "updated_at": datetime.utcnow()
        }

        # Update MongoDB
        await db["case_studies"].update_one(
            {"case_id": case_id},
            {"$set": final_analysis}
        )

        logger.info(f"Comprehensive analysis completed for case: {case_id}")

    except Exception as e:
        logger.error(f"Comprehensive case analysis failed: {str(e)}")

        # Update with error status
        try:
            await db["case_studies"].update_one(
                {"case_id": case_id},
                {"$set": {
                    "analysis_status": "failed",
                    "error": str(e),
                    "updated_at": datetime.utcnow()
                }}
            )
        except:
            pass