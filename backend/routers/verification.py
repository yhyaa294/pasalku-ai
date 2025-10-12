"""
Professional Verification Router
Untuk upgrade dari masyarakat umum ke profesional hukum
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import logging
import uuid

from ..database import get_db, get_mongodb
from ..models.user import (
    User, UserRole, VerificationRequest, VerificationStatus
)
from ..middleware.auth import (
    get_current_active_user,
    require_admin,
    log_action
)

logger = logging.getLogger(__name__)

router = APIRouter()


# Pydantic models
class VerificationRequestCreate(BaseModel):
    license_number: str
    organization: str
    specialization: List[str]
    bio: Optional[str] = None


class VerificationRequestResponse(BaseModel):
    id: str
    user_id: str
    status: str
    license_number: Optional[str]
    organization: Optional[str]
    specialization: Optional[List[str]]
    bio: Optional[str]
    documents: Optional[List[dict]]
    review_notes: Optional[str]
    rejection_reason: Optional[str]
    created_at: datetime
    reviewed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class VerificationReviewRequest(BaseModel):
    status: str  # approved or rejected
    review_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


@router.post("/request", tags=["Professional Verification"])
@log_action("verification.requested", "verification_request")
async def request_professional_verification(
    license_number: str = Form(...),
    organization: str = Form(...),
    specialization: str = Form(...),  # Comma-separated
    bio: Optional[str] = Form(None),
    documents: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    mongodb = Depends(get_mongodb),
    request: Request = None
):
    """
    Submit request untuk upgrade ke profesional hukum.
    Requires upload dokumen verifikasi (kartu advokat, surat izin praktik, dll).
    """
    # Check if user already has pending request
    existing_request = db.query(VerificationRequest).filter(
        VerificationRequest.user_id == current_user.id,
        VerificationRequest.status == VerificationStatus.PENDING
    ).first()
    
    if existing_request:
        raise HTTPException(
            status_code=400,
            detail="You already have a pending verification request"
        )
    
    # Check if user is already verified
    if current_user.role == UserRole.PROFESIONAL_HUKUM:
        raise HTTPException(
            status_code=400,
            detail="You are already a verified legal professional"
        )
    
    # Upload documents to MongoDB
    uploaded_docs = []
    for doc in documents:
        # Read file content
        content = await doc.read()
        
        # Store in MongoDB
        doc_id = str(uuid.uuid4())
        mongodb.verification_documents.insert_one({
            "_id": doc_id,
            "user_id": current_user.id,
            "filename": doc.filename,
            "content_type": doc.content_type,
            "size": len(content),
            "content": content,
            "uploaded_at": datetime.utcnow()
        })
        
        uploaded_docs.append({
            "id": doc_id,
            "filename": doc.filename,
            "content_type": doc.content_type,
            "size": len(content)
        })
    
    # Parse specialization
    specialization_list = [s.strip() for s in specialization.split(",")]
    
    # Create verification request
    verification_request = VerificationRequest(
        user_id=current_user.id,
        status=VerificationStatus.PENDING,
        license_number=license_number,
        organization=organization,
        specialization=specialization_list,
        bio=bio,
        documents=uploaded_docs
    )
    
    db.add(verification_request)
    
    # Update user verification status
    current_user.verification_status = VerificationStatus.PENDING
    current_user.verification_requested_at = datetime.utcnow()
    current_user.verification_documents = uploaded_docs
    
    db.commit()
    db.refresh(verification_request)
    
    logger.info(f"Verification request submitted: {verification_request.id} by user {current_user.id}")
    
    return {
        "status": "success",
        "message": "Verification request submitted successfully. Admin will review your request.",
        "request_id": str(verification_request.id),
        "documents_uploaded": len(uploaded_docs)
    }


@router.get("/my-requests", response_model=List[VerificationRequestResponse], tags=["Professional Verification"])
async def get_my_verification_requests(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's verification requests
    """
    requests = db.query(VerificationRequest).filter(
        VerificationRequest.user_id == current_user.id
    ).order_by(VerificationRequest.created_at.desc()).all()
    
    return [
        VerificationRequestResponse(
            id=str(req.id),
            user_id=req.user_id,
            status=req.status.value,
            license_number=req.license_number,
            organization=req.organization,
            specialization=req.specialization,
            bio=req.bio,
            documents=req.documents,
            review_notes=req.review_notes,
            rejection_reason=req.rejection_reason,
            created_at=req.created_at,
            reviewed_at=req.reviewed_at
        )
        for req in requests
    ]


@router.get("/status", tags=["Professional Verification"])
async def get_verification_status(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current verification status
    """
    return {
        "user_id": current_user.id,
        "role": current_user.role.value,
        "verification_status": current_user.verification_status.value,
        "is_professional": current_user.is_professional,
        "verification_requested_at": current_user.verification_requested_at,
        "verified_at": current_user.verified_at,
        "professional_info": {
            "license_number": current_user.professional_license_number,
            "organization": current_user.professional_organization,
            "specialization": current_user.professional_specialization,
            "bio": current_user.professional_bio
        } if current_user.is_professional else None
    }


# Admin endpoints
@router.get("/pending", tags=["Admin - Verification"])
async def get_pending_verifications(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Get all pending verification requests (Admin only)
    """
    requests = db.query(VerificationRequest).filter(
        VerificationRequest.status == VerificationStatus.PENDING
    ).order_by(VerificationRequest.created_at.asc()).offset(skip).limit(limit).all()
    
    result = []
    for req in requests:
        # Get user info
        user = db.query(User).filter(User.id == req.user_id).first()
        
        result.append({
            "request_id": str(req.id),
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "created_at": user.created_at
            },
            "license_number": req.license_number,
            "organization": req.organization,
            "specialization": req.specialization,
            "bio": req.bio,
            "documents": req.documents,
            "created_at": req.created_at
        })
    
    return {
        "total": db.query(VerificationRequest).filter(
            VerificationRequest.status == VerificationStatus.PENDING
        ).count(),
        "requests": result
    }


@router.get("/all", tags=["Admin - Verification"])
async def get_all_verifications(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Get all verification requests with optional status filter (Admin only)
    """
    query = db.query(VerificationRequest)
    
    if status:
        try:
            status_enum = VerificationStatus(status)
            query = query.filter(VerificationRequest.status == status_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status")
    
    requests = query.order_by(VerificationRequest.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for req in requests:
        user = db.query(User).filter(User.id == req.user_id).first()
        
        result.append({
            "request_id": str(req.id),
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name
            },
            "status": req.status.value,
            "license_number": req.license_number,
            "organization": req.organization,
            "specialization": req.specialization,
            "documents": req.documents,
            "review_notes": req.review_notes,
            "rejection_reason": req.rejection_reason,
            "created_at": req.created_at,
            "reviewed_at": req.reviewed_at,
            "reviewed_by": req.reviewed_by
        })
    
    return {
        "total": query.count(),
        "requests": result
    }


@router.post("/{request_id}/review", tags=["Admin - Verification"])
@log_action("verification.reviewed", "verification_request")
async def review_verification_request(
    request_id: str,
    review: VerificationReviewRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Review and approve/reject verification request (Admin only)
    """
    # Validate status
    if review.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")
    
    # Get verification request
    verification_req = db.query(VerificationRequest).filter(
        VerificationRequest.id == uuid.UUID(request_id)
    ).first()
    
    if not verification_req:
        raise HTTPException(status_code=404, detail="Verification request not found")
    
    if verification_req.status != VerificationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Request has already been reviewed")
    
    # Get user
    user = db.query(User).filter(User.id == verification_req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update verification request
    verification_req.status = VerificationStatus.APPROVED if review.status == "approved" else VerificationStatus.REJECTED
    verification_req.reviewed_by = current_user.id
    verification_req.reviewed_at = datetime.utcnow()
    verification_req.review_notes = review.review_notes
    
    if review.status == "approved":
        # Approve - upgrade user to professional
        user.role = UserRole.PROFESIONAL_HUKUM
        user.verification_status = VerificationStatus.APPROVED
        user.verified_at = datetime.utcnow()
        user.verified_by = current_user.id
        user.professional_license_number = verification_req.license_number
        user.professional_organization = verification_req.organization
        user.professional_specialization = verification_req.specialization
        user.professional_bio = verification_req.bio
        
        logger.info(f"Verification approved: {request_id} for user {user.id} by admin {current_user.id}")
        
        message = "Verification approved. User upgraded to legal professional."
    else:
        # Reject
        verification_req.rejection_reason = review.rejection_reason
        user.verification_status = VerificationStatus.REJECTED
        
        logger.info(f"Verification rejected: {request_id} for user {user.id} by admin {current_user.id}")
        
        message = "Verification rejected."
    
    db.commit()
    
    # TODO: Send notification to user (email/SMS via Supabase)
    
    return {
        "status": "success",
        "message": message,
        "request_id": request_id,
        "decision": review.status,
        "user_id": user.id,
        "new_role": user.role.value if review.status == "approved" else user.role.value
    }


@router.get("/{request_id}/documents/{document_id}", tags=["Admin - Verification"])
async def download_verification_document(
    request_id: str,
    document_id: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
    mongodb = Depends(get_mongodb)
):
    """
    Download verification document (Admin only)
    """
    from fastapi.responses import StreamingResponse
    import io
    
    # Verify request exists and belongs to admin's review
    verification_req = db.query(VerificationRequest).filter(
        VerificationRequest.id == uuid.UUID(request_id)
    ).first()
    
    if not verification_req:
        raise HTTPException(status_code=404, detail="Verification request not found")
    
    # Get document from MongoDB
    document = mongodb.verification_documents.find_one({"_id": document_id})
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Verify document belongs to this verification request
    if document["user_id"] != verification_req.user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Return document as streaming response
    return StreamingResponse(
        io.BytesIO(document["content"]),
        media_type=document["content_type"],
        headers={
            "Content-Disposition": f'attachment; filename="{document["filename"]}"'
        }
    )
