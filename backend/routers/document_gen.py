"""
Document Generation API Router

REST API endpoints untuk generate dokumen hukum:
- Template management (CRUD)
- Document generation
- Format conversion
- Validation
"""

from fastapi import APIRouter, HTTPException, Response
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

from backend.services.document_gen import (
    get_template_manager,
    get_data_filler,
    get_format_converter,
    get_document_validator,
    TemplateCategory,
    DocumentFormat,
    DocumentTemplate,
    TemplateField
)

router = APIRouter(prefix="/api/documents", tags=["documents"])

# ============= Request Models =============

class TemplateFieldInput(BaseModel):
    """Template field input"""
    name: str
    label: str
    type: str
    required: bool = True
    default_value: Optional[str] = None
    options: List[str] = []
    placeholder: str = ""
    validation_rules: Dict[str, Any] = {}
    help_text: str = ""


class TemplateCreateRequest(BaseModel):
    """Request to create template"""
    template_id: str
    name: str
    category: str  # TemplateCategory value
    content: str
    description: str = ""
    fields: List[TemplateFieldInput] = []
    version: str = "1.0"
    author: Optional[str] = None
    language: str = "id"
    legal_bases: List[str] = []
    applicable_for: List[str] = []
    tags: List[str] = []


class TemplateUpdateRequest(BaseModel):
    """Request to update template"""
    name: Optional[str] = None
    content: Optional[str] = None
    description: Optional[str] = None
    fields: Optional[List[TemplateFieldInput]] = None
    version: Optional[str] = None
    is_active: Optional[bool] = None
    tags: Optional[List[str]] = None


class GenerateDocumentRequest(BaseModel):
    """Request to generate document"""
    template_id: str
    data: Dict[str, Any]
    output_format: str = "docx"  # docx, pdf, html, markdown, txt
    validate: bool = True
    title: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class ValidateDocumentRequest(BaseModel):
    """Request to validate document"""
    template_id: str
    data: Dict[str, Any]
    check_compliance: bool = True


class PreviewRequest(BaseModel):
    """Request to preview filled template"""
    template_id: str
    data: Dict[str, Any]
    max_length: int = 1000


# ============= Response Models =============

class TemplateFieldResponse(BaseModel):
    """Template field response"""
    name: str
    label: str
    type: str
    required: bool
    default_value: Optional[str]
    options: List[str]
    placeholder: str
    help_text: str


class TemplateResponse(BaseModel):
    """Template response"""
    template_id: str
    name: str
    category: str
    description: str
    version: str
    author: Optional[str]
    language: str
    legal_bases: List[str]
    applicable_for: List[str]
    is_active: bool
    is_default: bool
    usage_count: int
    rating: float
    tags: List[str]
    fields: List[TemplateFieldResponse]
    created_at: datetime
    updated_at: datetime


class ValidationIssueResponse(BaseModel):
    """Validation issue"""
    level: str
    field: Optional[str]
    message: str
    suggestion: Optional[str]


class ValidationResponse(BaseModel):
    """Validation result"""
    is_valid: bool
    score: float
    issues: List[ValidationIssueResponse]
    error_count: int
    warning_count: int


class GenerateDocumentResponse(BaseModel):
    """Generated document response"""
    success: bool
    template_id: str
    format: str
    file_path: Optional[str]
    validation: Optional[ValidationResponse]
    error: Optional[str]


class PreviewResponse(BaseModel):
    """Preview response"""
    preview_content: str
    missing_fields: List[str]
    warnings: List[str]


# ============= Endpoints =============

@router.get("/templates", response_model=List[TemplateResponse])
async def list_templates(
    category: Optional[str] = None,
    search: Optional[str] = None,
    tags: Optional[str] = None  # Comma-separated
):
    """
    List available document templates
    
    - **category**: Filter by category (contract, agreement, letter, etc.)
    - **search**: Search in name and description
    - **tags**: Filter by tags (comma-separated)
    """
    try:
        template_manager = get_template_manager()
        
        # Parse category
        cat_filter = None
        if category:
            try:
                cat_filter = TemplateCategory(category)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
        
        # Parse tags
        tag_list = None
        if tags:
            tag_list = [t.strip() for t in tags.split(",")]
        
        # Get templates
        templates = template_manager.list_templates(
            category=cat_filter,
            search=search,
            tags=tag_list
        )
        
        # Convert to response
        return [_template_to_response(t) for t in templates]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: str):
    """
    Get template details by ID
    """
    try:
        template_manager = get_template_manager()
        template = template_manager.get_template(template_id)
        
        if not template:
            raise HTTPException(status_code=404, detail=f"Template {template_id} not found")
        
        return _template_to_response(template)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/templates", response_model=TemplateResponse)
async def create_template(request: TemplateCreateRequest):
    """
    Create new document template
    """
    try:
        template_manager = get_template_manager()
        
        # Parse category
        try:
            category = TemplateCategory(request.category)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid category: {request.category}")
        
        # Convert fields
        fields = [
            TemplateField(
                name=f.name,
                label=f.label,
                type=f.type,
                required=f.required,
                default_value=f.default_value,
                options=f.options,
                placeholder=f.placeholder,
                validation_rules=f.validation_rules,
                help_text=f.help_text
            )
            for f in request.fields
        ]
        
        # Create template
        template = DocumentTemplate(
            template_id=request.template_id,
            name=request.name,
            category=category,
            content=request.content,
            description=request.description,
            fields=fields,
            version=request.version,
            author=request.author,
            language=request.language,
            legal_bases=request.legal_bases,
            applicable_for=request.applicable_for,
            tags=request.tags
        )
        
        created = template_manager.create_template(template)
        
        return _template_to_response(created)
    
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/templates/{template_id}", response_model=TemplateResponse)
async def update_template(template_id: str, request: TemplateUpdateRequest):
    """
    Update existing template
    """
    try:
        template_manager = get_template_manager()
        
        # Prepare updates
        updates = {}
        if request.name is not None:
            updates["name"] = request.name
        if request.content is not None:
            updates["content"] = request.content
        if request.description is not None:
            updates["description"] = request.description
        if request.version is not None:
            updates["version"] = request.version
        if request.is_active is not None:
            updates["is_active"] = request.is_active
        if request.tags is not None:
            updates["tags"] = request.tags
        if request.fields is not None:
            updates["fields"] = [
                TemplateField(
                    name=f.name,
                    label=f.label,
                    type=f.type,
                    required=f.required,
                    default_value=f.default_value,
                    options=f.options,
                    placeholder=f.placeholder,
                    validation_rules=f.validation_rules,
                    help_text=f.help_text
                )
                for f in request.fields
            ]
        
        updated = template_manager.update_template(template_id, updates)
        
        return _template_to_response(updated)
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    """
    Delete template
    """
    try:
        template_manager = get_template_manager()
        success = template_manager.delete_template(template_id)
        
        if not success:
            raise HTTPException(status_code=404, detail=f"Template {template_id} not found")
        
        return {"success": True, "message": f"Template {template_id} deleted"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=GenerateDocumentResponse)
async def generate_document(request: GenerateDocumentRequest):
    """
    Generate document from template
    
    Full pipeline:
    1. Get template
    2. Fill template with data
    3. Validate (optional)
    4. Convert to requested format
    5. Return file
    """
    try:
        template_manager = get_template_manager()
        data_filler = get_data_filler()
        format_converter = get_format_converter()
        validator = get_document_validator()
        
        # 1. Get template
        template = template_manager.get_template(request.template_id)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template {request.template_id} not found")
        
        # 2. Fill template
        fill_result = data_filler.fill_template(
            template.content,
            request.data,
            required_fields=[f.name for f in template.fields if f.required]
        )
        
        if not fill_result.success:
            return GenerateDocumentResponse(
                success=False,
                template_id=request.template_id,
                format=request.output_format,
                error=f"Failed to fill template: {', '.join(fill_result.errors)}"
            )
        
        filled_content = fill_result.filled_content
        
        # 3. Validate (optional)
        validation_response = None
        if request.validate:
            validation = validator.validate_document(
                filled_content,
                template.fields,
                request.data
            )
            
            validation_response = ValidationResponse(
                is_valid=validation.is_valid,
                score=validation.score,
                issues=[
                    ValidationIssueResponse(
                        level=issue.level.value,
                        field=issue.field,
                        message=issue.message,
                        suggestion=issue.suggestion
                    )
                    for issue in validation.issues
                ],
                error_count=len(validation.get_errors()),
                warning_count=len(validation.get_warnings())
            )
            
            # If has errors and validation required, don't generate
            if not validation.is_valid and request.validate:
                return GenerateDocumentResponse(
                    success=False,
                    template_id=request.template_id,
                    format=request.output_format,
                    validation=validation_response,
                    error="Validation failed with errors"
                )
        
        # 4. Convert to format
        try:
            doc_format = DocumentFormat(request.output_format.lower())
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid format: {request.output_format}")
        
        conversion = format_converter.convert(
            filled_content,
            doc_format,
            title=request.title or template.name,
            metadata=request.metadata
        )
        
        if not conversion.success:
            return GenerateDocumentResponse(
                success=False,
                template_id=request.template_id,
                format=request.output_format,
                validation=validation_response,
                error=conversion.error
            )
        
        # 5. Increment usage
        template_manager.increment_usage(request.template_id)
        
        return GenerateDocumentResponse(
            success=True,
            template_id=request.template_id,
            format=request.output_format,
            file_path=conversion.file_path,
            validation=validation_response
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/{file_path:path}")
async def download_document(file_path: str):
    """
    Download generated document
    """
    try:
        from pathlib import Path
        
        file = Path(file_path)
        if not file.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Read file
        with open(file, 'rb') as f:
            content = f.read()
        
        # Determine media type
        media_types = {
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.pdf': 'application/pdf',
            '.html': 'text/html',
            '.md': 'text/markdown',
            '.txt': 'text/plain'
        }
        
        media_type = media_types.get(file.suffix, 'application/octet-stream')
        
        return Response(
            content=content,
            media_type=media_type,
            headers={
                'Content-Disposition': f'attachment; filename="{file.name}"'
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/validate", response_model=ValidationResponse)
async def validate_document(request: ValidateDocumentRequest):
    """
    Validate document data without generating
    """
    try:
        template_manager = get_template_manager()
        data_filler = get_data_filler()
        validator = get_document_validator()
        
        # Get template
        template = template_manager.get_template(request.template_id)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template {request.template_id} not found")
        
        # Fill template
        fill_result = data_filler.fill_template(
            template.content,
            request.data,
            required_fields=[f.name for f in template.fields if f.required]
        )
        
        if not fill_result.success:
            # Return validation errors
            return ValidationResponse(
                is_valid=False,
                score=0.0,
                issues=[
                    ValidationIssueResponse(
                        level="error",
                        field=None,
                        message=error,
                        suggestion=None
                    )
                    for error in fill_result.errors
                ],
                error_count=len(fill_result.errors),
                warning_count=0
            )
        
        # Validate
        validation = validator.validate_document(
            fill_result.filled_content,
            template.fields,
            request.data,
            check_compliance=request.check_compliance
        )
        
        return ValidationResponse(
            is_valid=validation.is_valid,
            score=validation.score,
            issues=[
                ValidationIssueResponse(
                    level=issue.level.value,
                    field=issue.field,
                    message=issue.message,
                    suggestion=issue.suggestion
                )
                for issue in validation.issues
            ],
            error_count=len(validation.get_errors()),
            warning_count=len(validation.get_warnings())
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/preview", response_model=PreviewResponse)
async def preview_document(request: PreviewRequest):
    """
    Preview filled document (text only, truncated)
    """
    try:
        template_manager = get_template_manager()
        data_filler = get_data_filler()
        
        # Get template
        template = template_manager.get_template(request.template_id)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template {request.template_id} not found")
        
        # Preview
        preview = data_filler.preview_template(
            template.content,
            request.data,
            max_length=request.max_length
        )
        
        # Get fill result for warnings
        fill_result = data_filler.fill_template(
            template.content,
            request.data
        )
        
        return PreviewResponse(
            preview_content=preview,
            missing_fields=fill_result.missing_fields,
            warnings=fill_result.warnings
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "document_generation",
        "timestamp": datetime.now().isoformat()
    }


# ============= Helper Functions =============

def _template_to_response(template: DocumentTemplate) -> TemplateResponse:
    """Convert DocumentTemplate to TemplateResponse"""
    return TemplateResponse(
        template_id=template.template_id,
        name=template.name,
        category=template.category.value,
        description=template.description,
        version=template.version,
        author=template.author,
        language=template.language,
        legal_bases=template.legal_bases,
        applicable_for=template.applicable_for,
        is_active=template.is_active,
        is_default=template.is_default,
        usage_count=template.usage_count,
        rating=template.rating,
        tags=template.tags,
        fields=[
            TemplateFieldResponse(
                name=f.name,
                label=f.label,
                type=f.type,
                required=f.required,
                default_value=f.default_value,
                options=f.options,
                placeholder=f.placeholder,
                help_text=f.help_text
            )
            for f in template.fields
        ],
        created_at=template.created_at,
        updated_at=template.updated_at
    )
