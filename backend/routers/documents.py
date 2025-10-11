"""
Router untuk upload dan analisis dokumen hukum
- Upload dokumen dengan OCR processing
- AI-powered document analysis
- Storage di MongoDB
"""
import logging
import os
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from bson import ObjectId

from backend.core.security_updated import get_current_user
from backend.core.config import get_settings
from backend.services.blockchain_databases import get_mongodb_cursor
from backend.services.ai_service_enhanced import ai_service_enhanced as ai_service
from backend.services.document_service import document_service
from backend.models import User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/documents", tags=["Documents"])
settings = get_settings()

# Pydantic Models
class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    file_size: int
    content_type: str
    upload_timestamp: str
    status: str
    analysis_status: str = "pending"

class DocumentAnalysisResponse(BaseModel):
    document_id: str
    analysis_status: str
    extracted_text: Optional[str] = None
    ai_insights: Optional[Dict[str, Any]] = None
    legal_references: Optional[List[str]] = None
    summary: Optional[str] = None
    risk_assessment: Optional[str] = None
    analysis_timestamp: Optional[str] = None

class DocumentListResponse(BaseModel):
    documents: List[Dict[str, Any]]
    total_count: int
    limit: int
    offset: int

# File validation
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.tiff'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    # Check file extension
    file_path = Path(file.filename)
    if file_path.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Check file size
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE/1024/1024}MB"
        )

async def save_to_mongodb(document_data: Dict[str, Any]) -> str:
    """Save document metadata to MongoDB"""
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="MongoDB connection failed")

        db = mongodb["pasalku_ai_analytics"]
        collection = db["documents"]

        # Insert document metadata
        result = await collection.insert_one(document_data)
        return str(result.inserted_id)

    except Exception as e:
        logger.error(f"MongoDB save error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save document metadata")

async def get_from_mongodb(document_id: str) -> Dict[str, Any]:
    """Retrieve document from MongoDB"""
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="MongoDB connection failed")

        db = mongodb["pasalku_ai_analytics"]
        collection = db["documents"]

        document = await collection.find_one({"_id": ObjectId(document_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        return document

    except Exception as e:
        logger.error(f"MongoDB retrieval error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve document")

async def process_document_background(
    document_id: str,
    file_content: bytes,
    file_type: str,
    filename: str
):
    """Background task untuk document processing"""
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            logger.error("MongoDB not available for background processing")
            return

        db = mongodb["pasalku_ai_analytics"]
        collection = db["documents"]

        # Process document
        success = await document_service.process_document_async(
            document_id=document_id,
            file_content=file_content,
            file_type=file_type,
            filename=filename,
            mongodb_collection=collection
        )

        if success:
            logger.info(f"Background processing completed for document: {document_id}")
        else:
            logger.error(f"Background processing failed for document: {document_id}")

    except Exception as e:
        logger.error(f"Background processing error: {str(e)}")

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    """
    Upload dokumen hukum untuk analisis AI
    - Validasi file type dan size
    - Extract text (untuk image/doc menggunakan OCR)
    - AI-powered analysis
    - Store di MongoDB
    """
    try:
        # Validate file
        validate_file(file)

        # Generate unique document ID
        document_id = str(uuid.uuid4())

        # Read file content
        file_content = await file.read()

        # Basic document metadata
        document_data = {
            "_id": ObjectId(),
            "document_id": document_id,
            "filename": file.filename,
            "original_filename": file.filename,
            "content_type": file.content_type,
            "file_size": len(file_content),
            "user_id": str(user.id),
            "user_email": user.email,
            "upload_timestamp": datetime.utcnow(),
            "status": "uploaded",
            "analysis_status": "pending",
            "file_content": file_content,  # Store binary data
            "metadata": {
                "processed": False,
                "extracted_text": None,
                "ai_analysis": None
            }
        }

        # Save to MongoDB
        await save_to_mongodb(document_data)

        # Trigger async document analysis
        background_tasks.add_task(
            process_document_background,
            document_id=document_id,
            file_content=file_content,
            file_type=file.content_type,
            filename=file.filename
        )

        logger.info(f"Document uploaded: {document_id} by user {user.email}")

        return DocumentUploadResponse(
            document_id=document_id,
            filename=file.filename,
            file_size=len(file_content),
            content_type=file.content_type,
            upload_timestamp=document_data["upload_timestamp"].isoformat(),
            status="uploaded",
            analysis_status="pending"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Document upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload document")

@router.get("/{document_id}", response_model=DocumentAnalysisResponse)
async def get_document_analysis(
    document_id: str,
    user: User = Depends(get_current_user)
):
    """
    Get document analysis hasil
    - Status analysis
    - Extracted text
    - AI insights & legal references
    - Risk assessment
    """
    try:
        # Get document from MongoDB
        document = await get_from_mongodb(document_id)

        # Check ownership
        if document.get("user_id") != str(user.id):
            raise HTTPException(status_code=403, detail="Access denied")

        return DocumentAnalysisResponse(
            document_id=document_id,
            analysis_status=document.get("analysis_status", "pending"),
            extracted_text=document.get("metadata", {}).get("extracted_text"),
            ai_insights=document.get("metadata", {}).get("ai_analysis"),
            legal_references=document.get("metadata", {}).get("legal_references", []),
            summary=document.get("metadata", {}).get("summary"),
            risk_assessment=document.get("metadata", {}).get("risk_assessment"),
            analysis_timestamp=document.get("analysis_timestamp")
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get document analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve document analysis")

@router.get("/", response_model=DocumentListResponse)
async def list_user_documents(
    limit: int = 20,
    offset: int = 0,
    user: User = Depends(get_current_user)
):
    """
    List semua dokumen user yang sudah diupload
    - Dengan pagination
    - Filter by user
    - Include analysis status
    """
    try:
        mongodb = get_mongodb_cursor()
        if not mongodb:
            raise HTTPException(status_code=500, detail="MongoDB connection failed")

        db = mongodb["pasalku_ai_analytics"]
        collection = db["documents"]

        # Query user's documents
        cursor = collection.find(
            {"user_id": str(user.id)}
        ).sort("upload_timestamp", -1).skip(offset).limit(limit)

        documents = []
        async for doc in cursor:
            documents.append({
                "document_id": doc.get("document_id"),
                "filename": doc.get("filename"),
                "file_size": doc.get("file_size"),
                "content_type": doc.get("content_type"),
                "upload_timestamp": doc.get("upload_timestamp").isoformat() if doc.get("upload_timestamp") else None,
                "status": doc.get("status"),
                "analysis_status": doc.get("analysis_status")
            })

        # Get total count
        total_count = await collection.count_documents({"user_id": str(user.id)})

        return DocumentListResponse(
            documents=documents,
            total_count=total_count,
            limit=limit,
            offset=offset
        )

    except Exception as e:
        logger.error(f"List documents error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list documents")

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    user: User = Depends(get_current_user)
):
    """
    Delete document dan semua analysis terkait
    - Hard delete dari MongoDB
    - Check ownership sebelum delete
    """
    try:
        # Get document first to verify ownership
        document = await get_from_mongodb(document_id)

        if document.get("user_id") != str(user.id):
            raise HTTPException(status_code=403, detail="Access denied")

        # Delete from MongoDB
        mongodb = get_mongodb_cursor()
        if mongodb:
            db = mongodb["pasalku_ai_analytics"]
            collection = db["documents"]

            result = await collection.delete_one({"_id": ObjectId(document_id)})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Document not found")

        logger.info(f"Document deleted: {document_id} by user {user.email}")
        return {"message": "Document deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete document error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete document")