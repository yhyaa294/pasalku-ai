from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from backend.database import get_db
from backend.models.consultation import Consultation
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/initiate", response_model=Dict[str, Any], tags=["Consultation"])
async def initiate_consultation(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Initiate a new legal consultation session.
    
    Request body:
        - user_id: ID of the user initiating the consultation
        - problem_description: Description of the legal problem

    Returns:
        JSON with session_id and initial response
    """
    user_id = payload.get("user_id")
    problem_description = payload.get("problem_description")

    if not user_id or not problem_description:
        raise HTTPException(status_code=400, detail="user_id and problem_description are required")

    consultation = Consultation(user_id=user_id, problem_description=problem_description)
    db.add(consultation)
    db.commit()
    db.refresh(consultation)

    return {
        "session_id": consultation.id,
        "message": "Consultation initiated successfully."
    }

@router.get("/{session_id}", response_model=Consultation, tags=["Consultation"])
async def get_consultation(session_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a consultation by session ID.

    Returns:
        Consultation details
    """
    consultation = db.query(Consultation).filter(Consultation.id == session_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    return consultation

@router.put("/{session_id}", response_model=Dict[str, Any], tags=["Consultation"])
async def update_consultation(session_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Update an existing consultation.

    Request body:
        - problem_description: Updated description of the legal problem

    Returns:
        Confirmation message
    """
    consultation = db.query(Consultation).filter(Consultation.id == session_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    if "problem_description" in payload:
        consultation.problem_description = payload["problem_description"]

    db.commit()

    return {
        "message": "Consultation updated successfully."
    }

@router.delete("/{session_id}", response_model=Dict[str, Any], tags=["Consultation"])
async def delete_consultation(session_id: str, db: Session = Depends(get_db)):
    """
    Delete a consultation by session ID.

    Returns:
        Confirmation message
    """
    consultation = db.query(Consultation).filter(Consultation.id == session_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    db.delete(consultation)
    db.commit()

    return {
        "message": "Consultation deleted successfully."
    }