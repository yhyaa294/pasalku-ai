"""
Prediction System REST API

Endpoints untuk sistem prediksi outcome kasus hukum.
"""

from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging

from ..services.prediction import (
    get_case_analyzer,
    get_precedent_finder,
    get_outcome_predictor,
    get_explanation_generator,
    OutcomeType,
    ExplanationStyle
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/prediction")


# ============================================================================
# Pydantic Models
# ============================================================================

class PredictOutcomeRequest(BaseModel):
    """Request untuk predict outcome"""
    case_text: str = Field(..., description="Full case text atau summary")
    case_metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional metadata (case_number, court_name, etc)"
    )
    explanation_style: str = Field(
        default="simple",
        description="Style of explanation (simple/detailed/legal/technical)"
    )
    language: str = Field(default="id", description="Language (id/en)")


class AnalyzeCaseRequest(BaseModel):
    """Request untuk analyze case features"""
    case_text: str = Field(..., description="Case text to analyze")
    case_metadata: Optional[Dict[str, Any]] = None


class FindPrecedentsRequest(BaseModel):
    """Request untuk find similar cases"""
    case_text: str = Field(..., description="Case text")
    case_metadata: Optional[Dict[str, Any]] = None
    limit: int = Field(default=10, ge=1, le=50)
    min_similarity: float = Field(default=0.3, ge=0.0, le=1.0)


class PredictionResponse(BaseModel):
    """Response dengan prediction results"""
    prediction: Dict[str, Any]
    explanation: Dict[str, Any]
    similar_cases: List[Dict[str, Any]]
    confidence: Dict[str, float]


class CaseAnalysisResponse(BaseModel):
    """Response case analysis"""
    features: Dict[str, Any]
    summary: str
    confidence: float


# ============================================================================
# Endpoints
# ============================================================================

@router.post("/predict", response_model=PredictionResponse)
async def predict_case_outcome(request: PredictOutcomeRequest):
    """
    **Prediksi outcome kasus hukum**
    
    Complete prediction dengan:
    - Case analysis & feature extraction
    - Finding similar precedent cases
    - ML-based outcome prediction
    - Human-readable explanation
    
    **Example:**
    ```json
    {
        "case_text": "Gugatan wanprestasi kontrak berdasarkan UU No 13 Tahun 2003...",
        "case_metadata": {
            "case_number": "123/Pdt/2024/PN.Jkt",
            "court_name": "PN Jakarta Selatan"
        },
        "explanation_style": "detailed",
        "language": "id"
    }
    ```
    """
    try:
        # 1. Analyze case
        analyzer = get_case_analyzer()
        case_features = await analyzer.analyze_case(
            case_text=request.case_text,
            case_metadata=request.case_metadata
        )
        
        logger.info(f"Case analyzed: {case_features.case_type.value}, confidence: {case_features.confidence:.2f}")
        
        # 2. Find similar cases
        precedent_finder = get_precedent_finder()
        similar_cases = await precedent_finder.find_similar_cases(
            case_features=case_features,
            limit=20
        )
        
        logger.info(f"Found {len(similar_cases)} similar cases")
        
        # 3. Predict outcome
        predictor = get_outcome_predictor()
        prediction = await predictor.predict_outcome(
            case_features=case_features,
            similar_cases=similar_cases
        )
        
        logger.info(f"Prediction: {prediction.predicted_outcome.value}, probability: {prediction.probability:.2f}")
        
        # 4. Generate explanation
        explanation_gen = get_explanation_generator()
        
        style_map = {
            "simple": ExplanationStyle.SIMPLE,
            "detailed": ExplanationStyle.DETAILED,
            "legal": ExplanationStyle.LEGAL,
            "technical": ExplanationStyle.TECHNICAL
        }
        style = style_map.get(request.explanation_style.lower(), ExplanationStyle.SIMPLE)
        
        explanation = await explanation_gen.generate_explanation(
            prediction=prediction,
            style=style,
            language=request.language
        )
        
        # 5. Build response
        return PredictionResponse(
            prediction={
                "outcome": prediction.predicted_outcome.value,
                "probability": prediction.probability,
                "confidence": prediction.confidence_factors.get("overall", 0),
                "outcome_probabilities": [
                    {
                        "outcome": op.outcome_type.value,
                        "probability": op.probability,
                        "confidence": op.confidence
                    }
                    for op in prediction.outcome_probabilities
                ],
                "summary": prediction.summary
            },
            explanation={
                "summary": explanation.summary,
                "detailed": explanation.detailed_explanation,
                "outcome_explanation": explanation.outcome_explanation,
                "factors_explanation": explanation.factors_explanation,
                "precedent_explanation": explanation.precedent_explanation,
                "confidence_explanation": explanation.confidence_explanation,
                "recommendations": explanation.recommendations,
                "considerations": explanation.considerations,
                "scenarios": {
                    "best": explanation.best_case_scenario,
                    "worst": explanation.worst_case_scenario,
                    "likely": explanation.most_likely_scenario
                },
                "key_points": explanation.key_points,
                "risk_factors": explanation.risk_factors,
                "strengths": explanation.strengths
            },
            similar_cases=[
                {
                    "case_id": sc.case_id,
                    "case_number": sc.case_number,
                    "case_title": sc.case_title,
                    "similarity": sc.overall_similarity,
                    "outcome": sc.outcome,
                    "summary": sc.summary,
                    "court": sc.court_name,
                    "date": sc.decision_date.isoformat() if sc.decision_date else None
                }
                for sc in similar_cases[:10]
            ],
            confidence=prediction.confidence_factors
        )
        
    except Exception as e:
        logger.error(f"Error predicting outcome: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze", response_model=CaseAnalysisResponse)
async def analyze_case(request: AnalyzeCaseRequest):
    """
    **Analyze case dan extract features**
    
    Extract informasi penting dari kasus:
    - Case type & category
    - Parties involved
    - Legal bases (laws, articles)
    - Key facts
    - Procedural elements
    
    **Example:**
    ```json
    {
        "case_text": "Gugatan perdata tentang wanprestasi...",
        "case_metadata": {"court_name": "PN Jakarta"}
    }
    ```
    """
    try:
        analyzer = get_case_analyzer()
        features = await analyzer.analyze_case(
            case_text=request.case_text,
            case_metadata=request.case_metadata
        )
        
        return CaseAnalysisResponse(
            features={
                "case_type": features.case_type.value,
                "case_category": features.case_category.value,
                "court_level": features.court_level.value,
                "parties": [
                    {"role": p.role, "name": p.name}
                    for p in features.parties
                ],
                "legal_bases": [
                    {
                        "type": lb.law_type,
                        "citation": lb.citation_text,
                        "relevance": lb.relevance_score
                    }
                    for lb in features.legal_bases
                ],
                "primary_laws": features.primary_laws,
                "key_facts": features.key_facts,
                "claim_amount": features.claim_amount,
                "has_mediation": features.has_mediation,
                "has_expert_witness": features.has_expert_witness,
                "evidence_count": features.evidence_count,
                "witness_count": features.witness_count,
                "complexity": features.factual_complexity
            },
            summary=features.case_summary,
            confidence=features.confidence
        )
        
    except Exception as e:
        logger.error(f"Error analyzing case: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/precedents")
async def find_precedents(request: FindPrecedentsRequest):
    """
    **Find similar precedent cases**
    
    Cari kasus-kasus serupa sebagai preseden:
    - Based on case type & category
    - Legal basis similarity
    - Factual similarity
    
    **Example:**
    ```json
    {
        "case_text": "Kasus PHK dengan dasar UU 13/2003...",
        "limit": 10,
        "min_similarity": 0.5
    }
    ```
    """
    try:
        # Analyze case first
        analyzer = get_case_analyzer()
        features = await analyzer.analyze_case(
            case_text=request.case_text,
            case_metadata=request.case_metadata
        )
        
        # Find similar cases
        finder = get_precedent_finder()
        similar_cases = await finder.find_similar_cases(
            case_features=features,
            limit=request.limit,
            min_similarity=request.min_similarity
        )
        
        return {
            "total_found": len(similar_cases),
            "cases": [
                {
                    "case_id": sc.case_id,
                    "case_number": sc.case_number,
                    "case_title": sc.case_title,
                    "similarity_score": sc.overall_similarity,
                    "type_similarity": sc.type_similarity,
                    "legal_similarity": sc.legal_similarity,
                    "factual_similarity": sc.factual_similarity,
                    "case_type": sc.case_type.value if sc.case_type else None,
                    "outcome": sc.outcome,
                    "outcome_details": sc.outcome_details,
                    "laws_used": sc.laws_used,
                    "court": sc.court_name,
                    "court_level": sc.court_level.value if sc.court_level else None,
                    "decision_date": sc.decision_date.isoformat() if sc.decision_date else None,
                    "summary": sc.summary,
                    "url": sc.case_url
                }
                for sc in similar_cases
            ]
        }
        
    except Exception as e:
        logger.error(f"Error finding precedents: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/quick-predict")
async def quick_predict(
    case_summary: str = Field(..., description="Brief case summary"),
    case_type: str = Field(default="perdata", description="Case type")
):
    """
    **Quick prediction tanpa analisis mendalam**
    
    Untuk quick assessment tanpa detailed analysis.
    """
    try:
        # Simple prediction based on summary
        analyzer = get_case_analyzer()
        features = await analyzer.analyze_case(
            case_text=case_summary,
            case_metadata={"case_type": case_type}
        )
        
        predictor = get_outcome_predictor()
        prediction = await predictor.predict_outcome(case_features=features)
        
        return {
            "outcome": prediction.predicted_outcome.value,
            "probability": round(prediction.probability * 100, 1),
            "confidence": round(prediction.confidence_factors.get("overall", 0) * 100, 1),
            "summary": prediction.summary,
            "positive_factors": prediction.positive_factors[:3],
            "negative_factors": prediction.negative_factors[:3]
        }
        
    except Exception as e:
        logger.error(f"Error in quick predict: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/outcomes")
async def get_outcome_types():
    """
    **Get semua jenis outcome yang didukung**
    """
    return {
        "outcomes": [
            {
                "code": "won",
                "name_id": "Menang",
                "name_en": "Won",
                "description": "Gugatan dikabulkan sepenuhnya"
            },
            {
                "code": "lost",
                "name_id": "Kalah",
                "name_en": "Lost",
                "description": "Gugatan ditolak"
            },
            {
                "code": "partial",
                "name_id": "Menang Sebagian",
                "name_en": "Partially Won",
                "description": "Gugatan dikabulkan sebagian"
            },
            {
                "code": "settled",
                "name_id": "Damai",
                "name_en": "Settled",
                "description": "Penyelesaian damai di luar pengadilan"
            },
            {
                "code": "dismissed",
                "name_id": "Gugatan Ditolak",
                "name_en": "Dismissed",
                "description": "Gugatan ditolak tanpa pemeriksaan"
            }
        ]
    }


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Prediction System",
        "version": "1.0.0"
    }
