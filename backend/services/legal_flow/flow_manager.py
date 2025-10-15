"""
Legal Flow Manager

Manages the 4-step legal consultation workflow and session state.
"""

import asyncio
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import logging
import uuid


logger = logging.getLogger(__name__)


class FlowStep(str, Enum):
    """Legal consultation flow steps"""
    DESCRIBE_CASE = "describe_case"  # Step 1: Uraikan Perkara
    CLARIFICATION = "clarification"   # Step 2: Klarifikasi AI
    UPLOAD_EVIDENCE = "upload_evidence"  # Step 3: Upload Bukti
    LEGAL_ANALYSIS = "legal_analysis"  # Step 4: Analisis Berdasar Hukum


@dataclass
class FlowSession:
    """Legal consultation flow session"""
    session_id: str
    user_id: str
    current_step: FlowStep
    status: str  # active, completed, abandoned
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    # Step 1: Case Description
    case_description: Optional[str] = None
    extracted_entities: List[Dict[str, Any]] = field(default_factory=list)
    legal_context: Optional[Dict[str, Any]] = None
    
    # Step 2: Clarifications
    clarification_questions: List[Dict[str, Any]] = field(default_factory=list)
    clarification_answers: List[Dict[str, Any]] = field(default_factory=list)
    
    # Step 3: Evidence
    uploaded_documents: List[Dict[str, Any]] = field(default_factory=list)
    document_analysis: List[Dict[str, Any]] = field(default_factory=list)
    
    # Step 4: Legal Analysis
    legal_analysis: Optional[Dict[str, Any]] = None
    citations: List[Dict[str, Any]] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    
    # Metadata
    metadata: Dict[str, Any] = field(default_factory=dict)
    is_completed: bool = False


class LegalFlowManager:
    """
    Manages the 4-step legal consultation workflow.
    
    Workflow:
    1. Describe Case: User describes their legal issue
       - Extract entities (people, places, dates, laws)
       - Classify legal context (pidana, perdata, bisnis, etc.)
       
    2. AI Clarification: AI asks clarifying questions
       - Generate targeted questions based on context
       - Collect additional information
       
    3. Upload Evidence: User uploads supporting documents
       - Process documents (OCR, analysis)
       - Extract relevant information
       
    4. Legal Analysis: Comprehensive legal analysis
       - Search Knowledge Graph for relevant laws
       - Generate analysis with citations
       - Provide recommendations
    """
    
    def __init__(self):
        self.sessions: Dict[str, FlowSession] = {}
    
    async def create_session(
        self,
        user_id: str,
        initial_description: Optional[str] = None
    ) -> FlowSession:
        """
        Create a new legal consultation session.
        
        Args:
            user_id: User identifier
            initial_description: Optional initial case description
        
        Returns:
            New flow session
        """
        session_id = str(uuid.uuid4())
        now = datetime.now()
        
        session = FlowSession(
            session_id=session_id,
            user_id=user_id,
            current_step=FlowStep.DESCRIBE_CASE,
            status="active",
            created_at=now,
            updated_at=now,
            case_description=initial_description
        )
        
        self.sessions[session_id] = session
        
        logger.info(f"Created legal flow session: {session_id} for user: {user_id}")
        
        return session
    
    async def get_session(self, session_id: str) -> Optional[FlowSession]:
        """Get session by ID"""
        return self.sessions.get(session_id)
    
    async def update_session(self, session: FlowSession) -> FlowSession:
        """Update session state"""
        session.updated_at = datetime.now()
        self.sessions[session.session_id] = session
        return session
    
    async def advance_step(
        self,
        session_id: str,
        next_step: FlowStep
    ) -> FlowSession:
        """
        Advance session to next step.
        
        Args:
            session_id: Session identifier
            next_step: Next flow step
        
        Returns:
            Updated session
        """
        session = await self.get_session(session_id)
        if not session:
            raise ValueError(f"Session not found: {session_id}")
        
        # Validate step transition
        valid_transitions = {
            FlowStep.DESCRIBE_CASE: [FlowStep.CLARIFICATION],
            FlowStep.CLARIFICATION: [FlowStep.UPLOAD_EVIDENCE, FlowStep.LEGAL_ANALYSIS],
            FlowStep.UPLOAD_EVIDENCE: [FlowStep.LEGAL_ANALYSIS],
            FlowStep.LEGAL_ANALYSIS: []  # Final step
        }
        
        if next_step not in valid_transitions.get(session.current_step, []):
            raise ValueError(
                f"Invalid step transition: {session.current_step} -> {next_step}"
            )
        
        session.current_step = next_step
        session = await self.update_session(session)
        
        logger.info(f"Session {session_id} advanced to {next_step}")
        
        return session
    
    async def complete_session(self, session_id: str) -> FlowSession:
        """Mark session as completed"""
        session = await self.get_session(session_id)
        if not session:
            raise ValueError(f"Session not found: {session_id}")
        
        session.is_completed = True
        session.status = "completed"
        session.completed_at = datetime.now()
        session = await self.update_session(session)
        
        logger.info(f"Session {session_id} completed")
        
        return session
    
    async def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        """
        Get comprehensive session summary.
        
        Args:
            session_id: Session identifier
        
        Returns:
            Summary dictionary with all steps
        """
        session = await self.get_session(session_id)
        if not session:
            raise ValueError(f"Session not found: {session_id}")
        
        return {
            "session_id": session.session_id,
            "user_id": session.user_id,
            "current_step": session.current_step.value,
            "is_completed": session.is_completed,
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat(),
            
            "step_1_describe_case": {
                "case_description": session.case_description,
                "extracted_entities": session.extracted_entities,
                "legal_context": session.legal_context
            },
            
            "step_2_clarification": {
                "questions": session.clarification_questions,
                "answers": session.clarification_answers,
                "clarification_complete": len(session.clarification_answers) >= len(session.clarification_questions)
            },
            
            "step_3_evidence": {
                "uploaded_documents": session.uploaded_documents,
                "document_analysis": session.document_analysis,
                "total_documents": len(session.uploaded_documents)
            },
            
            "step_4_legal_analysis": {
                "analysis": session.legal_analysis,
                "citations": session.citations,
                "recommendations": session.recommendations,
                "total_citations": len(session.citations)
            },
            
            "metadata": session.metadata
        }
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            logger.info(f"Deleted session: {session_id}")
            return True
        return False
    
    async def get_user_sessions(self, user_id: str) -> List[FlowSession]:
        """Get all sessions for a user"""
        return [
            session for session in self.sessions.values()
            if session.user_id == user_id
        ]
    
    async def cleanup_old_sessions(self, max_age_hours: int = 24) -> int:
        """
        Clean up old sessions.
        
        Args:
            max_age_hours: Maximum session age in hours
        
        Returns:
            Number of deleted sessions
        """
        now = datetime.now()
        to_delete = []
        
        for session_id, session in self.sessions.items():
            age_hours = (now - session.updated_at).total_seconds() / 3600
            if age_hours > max_age_hours and not session.is_completed:
                to_delete.append(session_id)
        
        for session_id in to_delete:
            del self.sessions[session_id]
        
        if to_delete:
            logger.info(f"Cleaned up {len(to_delete)} old sessions")
        
        return len(to_delete)


# Singleton instance
_flow_manager_instance: Optional[LegalFlowManager] = None


def get_legal_flow_manager() -> LegalFlowManager:
    """Get or create singleton flow manager instance"""
    global _flow_manager_instance
    
    if _flow_manager_instance is None:
        _flow_manager_instance = LegalFlowManager()
    
    return _flow_manager_instance
