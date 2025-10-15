 """
Legal Flow API Router

REST API endpoints for 4-step legal consultation workflow.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from services.legal_flow import (
    get_legal_flow_manager,
    get_entity_extractor,
    get_context_classifier,
    get_clarification_generator,
    get_legal_analyzer,
    FlowStep,
    EntityType,
    LegalDomain
)


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/legal-flow", tags=["Legal Flow"])


# ==================== Request/Response Models ====================

class CreateSessionRequest(BaseModel):
    """Request to create new legal flow session"""
    user_id: str = Field(..., description="User identifier")
    initial_description: Optional[str] = Field(None, description="Initial case description")


class SessionResponse(BaseModel):
    """Session information response"""
    success: bool
    session_id: str
    current_step: str
    message: str


class Step1Request(BaseModel):
    """Step 1: Describe Case"""
    session_id: str
    case_description: str = Field(..., min_length=50, description="Case description (min 50 chars)")


class Step1Response(BaseModel):
    """Step 1 response with extracted entities and context"""
    success: bool
    session_id: str
    entities: List[Dict[str, Any]]
    legal_context: Dict[str, Any]
    formatted_entities: str
    formatted_context: str
    next_step: str


class Step2Request(BaseModel):
    """Step 2: Get Clarification Questions"""
    session_id: str


class Step2Response(BaseModel):
    """Step 2 response with clarification questions"""
    success: bool
    session_id: str
    questions: List[Dict[str, Any]]
    formatted_questions: str
    next_step: str


class Step2AnswerRequest(BaseModel):
    """Submit answers to clarification questions"""
    session_id: str
    answers: List[Dict[str, str]] = Field(
        ...,
        description="List of {question_id: str, answer: str}"
    )


class Step3Request(BaseModel):
    """Step 3: Upload Evidence (metadata)"""
    session_id: str
    document_info: Dict[str, Any] = Field(
        ...,
        description="Document metadata (filename, type, etc.)"
    )


class Step3Response(BaseModel):
    """Step 3 response"""
    success: bool
    session_id: str
    uploaded_documents: List[Dict[str, Any]]
    message: str
    next_step: str


class Step4Request(BaseModel):
    """Step 4: Request Legal Analysis"""
    session_id: str


class Step4Response(BaseModel):
    """Step 4 response with comprehensive legal analysis"""
    success: bool
    session_id: str
    analysis: Dict[str, Any]
    formatted_analysis: str
    is_completed: bool


class SessionSummaryResponse(BaseModel):
    """Complete session summary"""
    success: bool
    summary: Dict[str, Any]


# ==================== API Endpoints ====================

@router.post("/session/create", response_model=SessionResponse)
async def create_session(request: CreateSessionRequest):
    """
    Create a new legal consultation session.
    
    This initiates the 4-step legal flow.
    """
    try:
        flow_manager = get_legal_flow_manager()
        
        session = await flow_manager.create_session(
            user_id=request.user_id,
            initial_description=request.initial_description
        )
        
        return SessionResponse(
            success=True,
            session_id=session.session_id,
            current_step=session.current_step.value,
            message="Session created successfully. Start with Step 1: Describe your case."
        )
    
    except Exception as e:
        logger.error(f"Failed to create session: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/step1/describe-case", response_model=Step1Response)
async def step1_describe_case(request: Step1Request):
    """
    Step 1: Describe Case
    
    User describes their legal issue. System extracts entities
    and classifies legal context.
    """
    try:
        flow_manager = get_legal_flow_manager()
        entity_extractor = get_entity_extractor()
        context_classifier = get_context_classifier()
        
        # Get session
        session = await flow_manager.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate step
        if session.current_step != FlowStep.DESCRIBE_CASE:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid step. Current step is {session.current_step.value}"
            )
        
        # Extract entities
        entities = await entity_extractor.extract(
            request.case_description,
            use_ai=True
        )
        
        # Classify legal context
        legal_context = await context_classifier.classify(
            request.case_description,
            use_ai=True
        )
        
        # Update session
        session.case_description = request.case_description
        session.extracted_entities = [
            {
                "entity_type": e.entity_type.value,
                "text": e.text,
                "confidence": e.confidence,
                "context": e.context
            }
            for e in entities
        ]
        session.legal_context = {
            "primary_domain": legal_context.primary_domain.value,
            "secondary_domains": [d.value for d in legal_context.secondary_domains],
            "confidence": legal_context.confidence,
            "is_criminal": legal_context.is_criminal,
            "is_civil": legal_context.is_civil,
            "is_urgent": legal_context.is_urgent,
            "complexity_score": legal_context.complexity_score,
            "suggested_expertise": legal_context.suggested_expertise,
            "explanation": legal_context.explanation
        }
        
        # Advance to clarification step
        session = await flow_manager.advance_step(
            request.session_id,
            FlowStep.CLARIFICATION
        )
        
        # Format responses
        formatted_entities = entity_extractor.format_entities(entities, include_context=False)
        formatted_context = context_classifier.format_context(legal_context)
        
        return Step1Response(
            success=True,
            session_id=session.session_id,
            entities=session.extracted_entities,
            legal_context=session.legal_context,
            formatted_entities=formatted_entities,
            formatted_context=formatted_context,
            next_step="step2_clarification"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Step 1 failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/step2/get-questions", response_model=Step2Response)
async def step2_get_questions(request: Step2Request):
    """
    Step 2: Get Clarification Questions
    
    AI generates targeted questions based on case context.
    """
    try:
        flow_manager = get_legal_flow_manager()
        clarification_generator = get_clarification_generator()
        
        # Get session
        session = await flow_manager.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate step
        if session.current_step != FlowStep.CLARIFICATION:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid step. Current step is {session.current_step.value}"
            )
        
        # Reconstruct legal context from session
        from services.legal_flow.context_classifier import LegalContext, LegalDomain
        legal_context = LegalContext(
            primary_domain=LegalDomain(session.legal_context["primary_domain"]),
            secondary_domains=[LegalDomain(d) for d in session.legal_context["secondary_domains"]],
            confidence=session.legal_context["confidence"],
            is_criminal=session.legal_context["is_criminal"],
            is_civil=session.legal_context["is_civil"],
            is_urgent=session.legal_context["is_urgent"],
            keywords=[],
            complexity_score=session.legal_context["complexity_score"],
            suggested_expertise=session.legal_context["suggested_expertise"],
            explanation=session.legal_context["explanation"],
            metadata={}
        )
        
        # Generate questions
        questions = await clarification_generator.generate_questions(
            case_description=session.case_description,
            legal_context=legal_context,
            extracted_entities=session.extracted_entities,
            max_questions=5
        )
        
        # Store questions in session
        session.clarification_questions = [
            {
                "question_id": q.question_id,
                "question_type": q.question_type.value,
                "question_text": q.question_text,
                "importance": q.importance,
                "suggested_answers": q.suggested_answers
            }
            for q in questions
        ]
        session = await flow_manager.update_session(session)
        
        # Format questions
        formatted_questions = clarification_generator.format_questions(
            questions,
            include_options=True
        )
        
        return Step2Response(
            success=True,
            session_id=session.session_id,
            questions=session.clarification_questions,
            formatted_questions=formatted_questions,
            next_step="step2_answer_questions"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Step 2 get questions failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/step2/submit-answers", response_model=SessionResponse)
async def step2_submit_answers(request: Step2AnswerRequest):
    """
    Step 2: Submit Clarification Answers
    
    User answers the clarification questions.
    """
    try:
        flow_manager = get_legal_flow_manager()
        
        # Get session
        session = await flow_manager.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Store answers
        session.clarification_answers = request.answers
        session = await flow_manager.update_session(session)
        
        return SessionResponse(
            success=True,
            session_id=session.session_id,
            current_step=session.current_step.value,
            message="Answers recorded. You can now upload evidence (Step 3) or skip to legal analysis (Step 4)."
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Step 2 submit answers failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/step3/upload-evidence", response_model=Step3Response)
async def step3_upload_evidence(request: Step3Request):
    """
    Step 3: Upload Evidence
    
    User uploads supporting documents. (File upload handled separately)
    This endpoint records document metadata.
    """
    try:
        flow_manager = get_legal_flow_manager()
        
        # Get session
        session = await flow_manager.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Advance to upload evidence step if not already there
        if session.current_step == FlowStep.CLARIFICATION:
            session = await flow_manager.advance_step(
                request.session_id,
                FlowStep.UPLOAD_EVIDENCE
            )
        
        # Add document info
        session.uploaded_documents.append(request.document_info)
        session = await flow_manager.update_session(session)
        
        return Step3Response(
            success=True,
            session_id=session.session_id,
            uploaded_documents=session.uploaded_documents,
            message=f"Document recorded. Total: {len(session.uploaded_documents)} document(s).",
            next_step="step4_legal_analysis"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Step 3 failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/step4/analyze", response_model=Step4Response)
async def step4_analyze(request: Step4Request):
    """
    Step 4: Legal Analysis
    
    Performs comprehensive legal analysis using Knowledge Graph
    and AI consensus.
    """
    try:
        flow_manager = get_legal_flow_manager()
        legal_analyzer = get_legal_analyzer()
        
        # Get session
        session = await flow_manager.get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Advance to legal analysis step if needed
        if session.current_step in [FlowStep.CLARIFICATION, FlowStep.UPLOAD_EVIDENCE]:
            session = await flow_manager.advance_step(
                request.session_id,
                FlowStep.LEGAL_ANALYSIS
            )
        
        # Reconstruct legal context
        from services.legal_flow.context_classifier import LegalContext, LegalDomain
        legal_context = LegalContext(
            primary_domain=LegalDomain(session.legal_context["primary_domain"]),
            secondary_domains=[LegalDomain(d) for d in session.legal_context["secondary_domains"]],
            confidence=session.legal_context["confidence"],
            is_criminal=session.legal_context["is_criminal"],
            is_civil=session.legal_context["is_civil"],
            is_urgent=session.legal_context["is_urgent"],
            keywords=[],
            complexity_score=session.legal_context["complexity_score"],
            suggested_expertise=session.legal_context["suggested_expertise"],
            explanation=session.legal_context["explanation"],
            metadata={}
        )
        
        # Perform analysis
        analysis = await legal_analyzer.analyze(
            case_description=session.case_description,
            legal_context=legal_context,
            clarification_answers=session.clarification_answers,
            document_evidence=session.uploaded_documents if session.uploaded_documents else None
        )
        
        # Store analysis in session
        session.legal_analysis = {
            "analysis_id": analysis.analysis_id,
            "summary": analysis.summary,
            "detailed_analysis": analysis.detailed_analysis,
            "legal_basis": analysis.legal_basis,
            "confidence": analysis.confidence,
            "analysis_date": analysis.analysis_date.isoformat()
        }
        session.citations = analysis.citations
        session.recommendations = analysis.recommendations
        
        # Mark session as completed
        session = await flow_manager.complete_session(request.session_id)
        
        # Format analysis
        formatted_analysis = legal_analyzer.format_analysis(analysis)
        
        return Step4Response(
            success=True,
            session_id=session.session_id,
            analysis={
                "summary": analysis.summary,
                "detailed_analysis": analysis.detailed_analysis,
                "legal_basis": analysis.legal_basis,
                "citations": analysis.citations,
                "recommendations": analysis.recommendations,
                "risks": analysis.risks,
                "next_steps": analysis.next_steps,
                "confidence": analysis.confidence,
                "metadata": analysis.metadata
            },
            formatted_analysis=formatted_analysis,
            is_completed=True
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Step 4 failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}/summary", response_model=SessionSummaryResponse)
async def get_session_summary(session_id: str):
    """
    Get complete session summary.
    
    Returns all information from all 4 steps.
    """
    try:
        flow_manager = get_legal_flow_manager()
        
        summary = await flow_manager.get_session_summary(session_id)
        
        return SessionSummaryResponse(
            success=True,
            summary=summary
        )
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to get session summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a session"""
    try:
        flow_manager = get_legal_flow_manager()
        
        deleted = await flow_manager.delete_session(session_id)
        
        if not deleted:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {"success": True, "message": "Session deleted"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete session: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/user/{user_id}/sessions")
async def get_user_sessions(user_id: str):
    """Get all sessions for a user"""
    try:
        flow_manager = get_legal_flow_manager()
        
        sessions = await flow_manager.get_user_sessions(user_id)
        
        return {
            "success": True,
            "user_id": user_id,
            "total_sessions": len(sessions),
            "sessions": [
                {
                    "session_id": s.session_id,
                    "current_step": s.current_step.value,
                    "is_completed": s.is_completed,
                    "created_at": s.created_at.isoformat(),
                    "updated_at": s.updated_at.isoformat()
                }
                for s in sessions
            ]
        }
    
    except Exception as e:
        logger.error(f"Failed to get user sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "service": "Legal Flow API",
        "status": "healthy",
        "version": "1.0.0"
    }
