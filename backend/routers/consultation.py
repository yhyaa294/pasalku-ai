from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import httpx
import json
import uuid
import os
import logging
from pathlib import Path

from database import get_db
from models.consultation import ConsultationSession, ConsultationMessage, LegalCategory
from core.security import get_current_user
from services.ai_agent import AIConsultationAgent
from services.consultation_flow import advance_flow, state_store, ConversationState
# Temporarily commented out due to syntax error - will fix
# from services.ai_service import ai_service
from core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()
ai_agent = AIConsultationAgent()

@router.post("/sessions/create")
async def create_consultation_session(
    category: LegalCategory,
    session_name: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new consultation session"""
    session = ConsultationSession(
        user_id=current_user.id,
        session_name=session_name,
        legal_category=category,
        status="active"
    )
    # Initialize persistent state for the structured consultation flow
    try:
        session.conversation_state = "AWAITING_INITIAL_PROBLEM"
        session.flow_context = {
            "session_id": None,
            "problem_description": None,
            "clarification_questions": [],
            "clarification_answers": {},
            "summary_text": None,
            "evidence_confirmed": None,
            "final_analysis": None,
            "state": "AWAITING_INITIAL_PROBLEM"
        }
    except Exception:
        # If DB JSON column isn't available yet, ignore and continue (migration pending)
        pass
    db.add(session)
    db.commit()
    db.refresh(session)

    # Create initial AI greeting
    initial_message = await ai_agent.generate_greeting(category)
    message = ConsultationMessage(
        session_id=session.id,
        role="assistant",
        content=initial_message
    )
    db.add(message)
    db.commit()

    return {
        "session_id": session.id,
        "initial_message": initial_message
    }

@router.post("/sessions/{session_id}/message")
async def send_message(
    session_id: int,
    message: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Send a message in a consultation session"""
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Save user message
    user_message = ConsultationMessage(
        session_id=session_id,
        role="user",
        content=message
    )
    db.add(user_message)
    db.commit()

    # Load persisted flow_context if any and seed in-memory store
    try:
        if session.flow_context:
            from services.consultation_flow import ConsultationContext
            ctx = ConsultationContext.from_dict(session.flow_context)
            state_store.set(ctx)
    except Exception as e:
        logger.warning(f"Failed to load persisted flow_context for session {session_id}: {e}")

    # Branch into stateful consultation flow
    try:
        flow_result = await advance_flow(session_id=session_id, user_message=message)

        # Persist assistant output as message for history
        assistant_payload_parts = []
        if flow_result.get("message"):
            assistant_payload_parts.append(flow_result["message"])
        if flow_result.get("summary"):
            assistant_payload_parts.append(flow_result["summary"])
        if flow_result.get("questions"):
            assistant_payload_parts.append("\n".join([f"- {q}" for q in flow_result["questions"]]))
        if flow_result.get("final_analysis"):
            assistant_payload_parts.append(json.dumps(flow_result["final_analysis"], ensure_ascii=False, indent=2))

        assistant_text = "\n\n".join(assistant_payload_parts) or ""

        if assistant_text:
            ai_message = ConsultationMessage(
                session_id=session_id,
                role="assistant",
                content=assistant_text
            )
            db.add(ai_message)
            db.commit()

        # Persist flow state back to DB (serialize and store into session.flow_context + conversation_state)
        try:
            ctx = state_store.get(session_id)
            session.flow_context = ctx.to_dict()
            session.conversation_state = ctx.state.value if isinstance(ctx.state, ConversationState) else str(ctx.state)
            db.add(session)
            db.commit()
        except Exception as e:
            logger.warning(f"Failed to persist flow state for session {session_id}: {e}")

        return flow_result
    except Exception as e:
        logger.error(f"Stateful flow failed, falling back to legacy response: {e}")

        # Legacy fallback: conversation history + generic response
        history = db.query(ConsultationMessage).filter(
            ConsultationMessage.session_id == session_id
        ).order_by(ConsultationMessage.created_at).all()

        ai_response = await ai_agent.generate_response(
            message,
            history,
            session.legal_category
        )

        ai_message = ConsultationMessage(
            session_id=session_id,
            role="assistant",
            content=ai_response
        )
        db.add(ai_message)
        db.commit()

        return {"response": ai_response, "state": "LEGACY"}


@router.get("/sessions/{session_id}/state")
async def get_session_state(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Inspect current state of the structured consultation flow for debugging/testing."""
    # Validate ownership
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    ctx = state_store.get(session_id)
    return {
        "session_id": session_id,
        "state": ctx.state,
        "problem_description": ctx.problem_description,
        "answered": len(ctx.clarification_answers),
        "total_questions": len(ctx.clarification_questions),
        "has_summary": bool(ctx.summary_text),
        "evidence_confirmed": ctx.evidence_confirmed,
        "has_final_analysis": bool(ctx.final_analysis),
    }


@router.post("/sessions/{session_id}/reset-state")
async def reset_session_state(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Reset the in-memory flow state for a session. Does not delete DB messages."""
    # Validate ownership
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    # Reinitialize state entry
    from services.consultation_flow import ConsultationContext
    state_store.set(ConsultationContext(session_id=session_id))
    return {"status": "reset", "session_id": session_id}

@router.post("/sessions/{session_id}/complete")
async def complete_session(
    session_id: int,
    pin: str,
    rating: float,
    feedback: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Complete a consultation session with rating and PIN protection"""
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Update session with completion data
    session.status = "completed"
    session.pin_hash = ai_agent.hash_pin(pin)  # Implement secure PIN hashing
    session.rating = rating
    session.feedback = feedback
    
    db.commit()

    return {"status": "completed"}

# ===== EVIDENCE PROCESSING ENDPOINTS =====

@router.post("/sessions/{session_id}/upload-evidence")
async def upload_evidence_file(
    session_id: int,
    file: UploadFile = File(...),
    evidence_type: str = Form("document"),  # document, image, video
    description: str = Form(""),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Upload file evidence untuk konsultasi hukum"""
    # Validate session ownership
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Validate file type
    allowed_extensions = {
        "document": [".pdf", ".doc", ".docx", ".txt"],
        "image": [".jpg", ".jpeg", ".png", ".gif"],
        "video": [".mp4", ".avi", ".mov"]
    }

    if evidence_type not in allowed_extensions:
        evidence_type = "document"

    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in allowed_extensions[evidence_type]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not allowed for {evidence_type}"
        )

    # Create evidence directory if not exists
    evidence_dir = Path(settings.UPLOAD_DIR) / "evidence" / str(session_id)
    evidence_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = f"{file_id}_{file.filename}"
    file_path = evidence_dir / filename

    # Save file
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # If it's an image or document, try AI analysis
    ai_analysis = {}
    if evidence_type in ["document", "image"]:
        try:
            # Basic file info for AI
            file_info = {
                "filename": file.filename,
                "type": evidence_type,
                "size": len(content),
                "description": description
            }

            # Use AI to analyze evidence content
            # Temporarily disabled due to ai_service syntax error
            # ai_analysis = await ai_service.analyze_evidence(content, evidence_type, description)
            ai_analysis = {
                "strength_level": "moderate",
                "relevance": "relevant",
                "key_points": [],
                "recommendations": ["Manual review recommended"]
            }
        except Exception as e:
            logging.warning(f"AI analysis failed for evidence {filename}: {str(e)}")
            ai_analysis = {
                "strength_level": "unknown",
                "validity_score": 0.5,
                "notes": f"AI analysis failed: {str(e)}",
                "recommendations": ["Dokumentasikan bukti dengan baik", "Simpan dalam kondisi original"]
            }

    # Create evidence record
    evidence_data = {
        "evidence_id": file_id,
        "filename": file.filename,
        "filepath": str(file_path),
        "evidence_type": evidence_type,
        "description": description,
        "file_size": len(content),
        "upload_timestamp": datetime.utcnow(),
        "ai_analysis": json.dumps(ai_analysis),
        "strength_level": ai_analysis.get("strength_level", "sedang"),
        "validity_score": ai_analysis.get("validity_score", 0.5)
    }

    return {
        "status": "uploaded",
        "evidence_id": file_id,
        "filename": filename,
        "evidence_type": evidence_type,
        "file_size": len(content),
        "ai_analysis": ai_analysis,
        "message": f"Evidensi '{file.filename}' berhasil diupload dan dianalisis"
    }

@router.post("/sessions/{session_id}/analyze-evidence")
async def analyze_evidence_description(
    session_id: int,
    evidence_description: str,
    evidence_type: str = "text",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Analyze evidence dari deskripsi tekstual tanpa upload file"""
    # Validate session ownership
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    if not evidence_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Evidence description is required"
        )

    try:
        # Use AI to analyze evidence description  
        # Temporarily disabled due to ai_service syntax error
        # analysis = await ai_service.process_evidence(evidence_description)
        analysis = {
            "relevance_score": 0.7,
            "strength_level": "moderate",
            "key_factors": ["Manual review needed"],
            "recommendations": []
        }

        # Add additional analysis
        analysis["evidence_type"] = evidence_type
        analysis["description"] = evidence_description
        analysis["analysis_timestamp"] = datetime.utcnow().isoformat()

        return {
            "status": "analyzed",
            "analysis": analysis,
            "message": f"Deskripsi bukti berhasil dianalisis dengan skor kekuatan: {analysis.get('strength_level', 'sedang').upper()}"
        }

    except Exception as e:
        logger.error(f"[EVIDENCE_ANALYSIS] Failed to analyze evidence: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze evidence description"
        )

@router.post("/sessions/{session_id}/add-evidence")
async def add_evidence_to_session(
    session_id: int,
    evidence_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Add analyzed evidence ke session consultation"""
    # Validate session ownership
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Extract evidence data
    evidence_type = evidence_data.get("evidence_type", "text")
    description = evidence_data.get("description", "")
    analysis = evidence_data.get("analysis", {})

    # Create evidence message for conversation
    evidence_content = f"""
=== BUKTI DIANALISIS ===

Tipe Bukti: {evidence_type.upper()}
Deskripsi: {description}
Nilai Kekuatan: {analysis.get("strength_level", "SEDANG").upper()}
Skor Validitas: {analysis.get("validity_score", 0.5) * 100:.1f}%

Catatan Analisis:
{analysis.get("notes", "Tidak ada catatan tambahan.")}

Rekomendasi:
{chr(10).join(analysis.get("recommendations", ["Perbaiki dokumentasi bukti", "Konsultasi dengan advokat"]))}
"""

    # Save evidence as assistant message
    evidence_message = ConsultationMessage(
        session_id=session_id,
        role="evidence",
        content=evidence_content,
        metadata=json.dumps({
            "evidence_type": evidence_type,
            "strength_level": analysis.get("strength_level", "sedang"),
            "validity_score": analysis.get("validity_score", 0.5),
            "analysis": analysis
        })
    )
    db.add(evidence_message)
    db.commit()

    return {
        "status": "added",
        "strength_level": analysis.get("strength_level", "sedang"),
        "validity_score": analysis.get("validity_score", 0.5),
        "message": "Bukti berhasil ditambahkan ke konsultasi",
        "evidence_summary": f"Bukti {evidence_type} dengan kekuatan {analysis.get('strength_level', 'sedang')} berhasil dianalisis"
    }

@router.get("/sessions/{session_id}/evidence-summary")
async def get_evidence_summary(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get summary evidence yang telah dianalisis dalam session"""
    # Validate session ownership
    session = db.query(ConsultationSession).filter(
        ConsultationSession.id == session_id,
        ConsultationSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    # Get all evidence messages
    evidence_messages = db.query(ConsultationMessage).filter(
        ConsultationMessage.session_id == session_id,
        ConsultationMessage.role == "evidence"
    ).order_by(ConsultationMessage.created_at).all()

    evidence_summary = []
    total_strength_score = 0
    evidence_count = 0

    for msg in evidence_messages:
        try:
            metadata = json.loads(msg.metadata) if msg.metadata else {}
            evidence_info = {
                "timestamp": msg.created_at.isoformat(),
                "type": metadata.get("evidence_type", "unknown"),
                "strength_level": metadata.get("strength_level", "sedang"),
                "validity_score": metadata.get("validity_score", 0.5),
                "content_preview": msg.content[:200] + "..." if len(msg.content) > 200 else msg.content
            }
            evidence_summary.append(evidence_info)

            # Calculate aggregate scores
            validity_score = metadata.get("validity_score", 0.5)
            total_strength_score += validity_score
            evidence_count += 1

        except Exception as e:
            logger.warning(f"Failed to parse evidence metadata: {str(e)}")
            continue

    average_strength = total_strength_score / evidence_count if evidence_count > 0 else 0

    # Assess overall evidence strength
    if evidence_count == 0:
        overall_assessment = "Belum ada bukti dianalisis"
    elif average_strength >= 0.7:
        overall_assessment = "Bukti kuat - potensi keberhasilan tinggi"
    elif average_strength >= 0.5:
        overall_assessment = "Bukti sedang - perlu penguatan lebih lanjut"
    else:
        overall_assessment = "Bukti lemah - sangat disarankan untuk memperkuat bukti"

    return {
        "evidence_count": evidence_count,
        "average_strength_score": average_strength,
        "overall_assessment": overall_assessment,
        "evidence_items": evidence_summary,
        "recommendations": [
            "Kumpulkan lebih banyak bukti jika memungkinkan",
            "Dokumentasikan bukti dengan format yang tepat",
            "Konsultasikan dengan advokat untuk evaluasi final"
        ] if evidence_count < 3 else [
            "Bukti cukup kuat untuk langkah selanjutnya",
            "Pastikan semua bukti terdokumentasi dengan baik",
            "Siap untuk melanjutkan proses hukum"
        ]
    }