"""
Knowledge Graph API Router

REST API endpoints for semantic search, citation extraction, and legal document queries.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import time

from services.knowledge_graph.search_engine import (
    get_search_engine,
    SearchResult,
    CitationInfo
)
from services.knowledge_graph.citation_extractor import (
    get_citation_extractor,
    ExtractedCitation
)
from services.knowledge_graph.relevance_ranker import (
    get_relevance_ranker,
    RankedResult
)


# Request/Response Models
class SearchRequest(BaseModel):
    """Request model for semantic search"""
    query: str = Field(..., description="Legal question or search keywords")
    document_types: Optional[List[str]] = Field(
        None,
        description="Filter by document types: law, regulation, court_case, article"
    )
    domains: Optional[List[str]] = Field(
        None,
        description="Filter by legal domains: pidana, perdata, bisnis, etc."
    )
    max_results: int = Field(10, ge=1, le=50, description="Maximum results to return")
    use_ai_enhancement: bool = Field(
        True,
        description="Use AI to enhance query understanding and generate summary"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "query": "Bagaimana prosedur mengurus perceraian di Indonesia?",
                "document_types": ["law", "regulation"],
                "max_results": 10,
                "use_ai_enhancement": True
            }
        }


class CitationResponse(BaseModel):
    """Response model for single citation"""
    document_id: str
    document_type: str
    title: str
    citation_text: str
    url: Optional[str]
    relevance_score: float
    excerpt: Optional[str]


class SearchResponse(BaseModel):
    """Response model for search results"""
    success: bool
    query: str
    total_results: int
    results: List[CitationResponse]
    search_time: float
    ai_enhanced: bool
    ai_summary: Optional[str]
    consensus_confidence: Optional[float]
    metadata: Dict[str, Any]


class ExtractCitationsRequest(BaseModel):
    """Request model for citation extraction"""
    text: str = Field(..., description="Text to extract citations from")
    validate_with_kg: bool = Field(
        True,
        description="Validate citations against Knowledge Graph"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "text": "Berdasarkan Pasal 39 UU No. 1 Tahun 1974 tentang Perkawinan, perceraian dapat dilakukan...",
                "validate_with_kg": True
            }
        }


class ExtractedCitationResponse(BaseModel):
    """Response model for extracted citation"""
    raw_text: str
    citation_type: str
    confidence: float
    matched_document: Optional[CitationResponse]


class ExtractCitationsResponse(BaseModel):
    """Response model for citation extraction"""
    success: bool
    total_citations: int
    citations: List[ExtractedCitationResponse]
    reference_list: str
    metadata: Dict[str, Any]


class CitationLookupRequest(BaseModel):
    """Request model for citation lookup"""
    citation: str = Field(..., description="Legal citation to look up")
    
    class Config:
        schema_extra = {
            "example": {
                "citation": "UU No. 1 Tahun 1974"
            }
        }


# Router
router = APIRouter(
    prefix="/api/knowledge-graph",
    tags=["Knowledge Graph"]
)


@router.post("/search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """
    Perform semantic search across legal documents.
    
    This endpoint provides intelligent search across the legal document
    Knowledge Graph with optional AI enhancement.
    
    **Features:**
    - Full-text search with EdgeDB
    - Semantic understanding of legal queries
    - AI-powered query enhancement
    - Automatic relevance ranking
    - Citation extraction and formatting
    - Optional AI summary of results
    
    **AI Enhancement:**
    When enabled, the system:
    1. Extracts legal concepts from your query using Dual AI Consensus
    2. Generates an intelligent summary of search results
    3. Provides confidence scores for the summary
    
    **Example Queries:**
    - "Bagaimana cara mengurus perceraian?"
    - "Apa sanksi pidana untuk korupsi?"
    - "Pasal berapa yang mengatur hak cipta?"
    """
    try:
        start_time = time.time()
        
        # Get search engine
        search_engine = get_search_engine(enable_ai_enhancement=request.use_ai_enhancement)
        
        # Perform search
        result = await search_engine.search(
            query=request.query,
            document_types=request.document_types,
            domains=request.domains,
            max_results=request.max_results,
            use_ai_enhancement=request.use_ai_enhancement
        )
        
        # Convert results to response format
        citations = [
            CitationResponse(
                document_id=c.document_id,
                document_type=c.document_type,
                title=c.title,
                citation_text=c.citation_text,
                url=c.url,
                relevance_score=c.relevance_score,
                excerpt=c.excerpt
            )
            for c in result.results
        ]
        
        return SearchResponse(
            success=True,
            query=result.query,
            total_results=result.total_results,
            results=citations,
            search_time=time.time() - start_time,
            ai_enhanced=result.ai_enhanced,
            ai_summary=result.ai_summary,
            consensus_confidence=result.consensus_confidence,
            metadata=result.metadata
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(e)}"
        )


@router.post("/extract-citations", response_model=ExtractCitationsResponse)
async def extract_citations(request: ExtractCitationsRequest):
    """
    Extract legal citations from text.
    
    This endpoint identifies and validates legal citations in any text,
    matching them with documents in the Knowledge Graph.
    
    **Supported Citation Formats:**
    - Laws: "UU No. 1 Tahun 2023", "Undang-Undang Nomor 1 Tahun 2023"
    - Articles: "Pasal 39 UU No. 1 Tahun 1974"
    - Regulations: "PP No. 45 Tahun 2022", "Perpres No. 10 Tahun 2023"
    - Court Cases: "Putusan MA No. 123/Pid/2023"
    - Legal Codes: "KUH Pidana Pasal 362"
    
    **Validation:**
    When `validate_with_kg` is true, citations are:
    - Matched against Knowledge Graph documents
    - Enriched with full document information
    - Confidence scores adjusted based on validation
    
    **Output:**
    - List of extracted citations with confidence scores
    - Formatted reference list (Markdown)
    - Validated document information
    """
    try:
        # Get search engine for validation
        search_engine = get_search_engine() if request.validate_with_kg else None
        
        # Get citation extractor
        extractor = get_citation_extractor(search_engine=search_engine)
        
        # Extract and validate citations
        citations = await extractor.extract_and_validate(
            text=request.text,
            validate_with_kg=request.validate_with_kg
        )
        
        # Generate reference list
        reference_list = extractor.generate_reference_list(
            citations=citations,
            include_unmatched=False
        )
        
        # Convert to response format
        citations_response = []
        for citation in citations:
            matched_doc = None
            if citation.matched_document:
                matched_doc = CitationResponse(
                    document_id=citation.matched_document.document_id,
                    document_type=citation.matched_document.document_type,
                    title=citation.matched_document.title,
                    citation_text=citation.matched_document.citation_text,
                    url=citation.matched_document.url,
                    relevance_score=citation.matched_document.relevance_score,
                    excerpt=citation.matched_document.excerpt
                )
            
            citations_response.append(
                ExtractedCitationResponse(
                    raw_text=citation.raw_text,
                    citation_type=citation.citation_type,
                    confidence=citation.confidence,
                    matched_document=matched_doc
                )
            )
        
        return ExtractCitationsResponse(
            success=True,
            total_citations=len(citations),
            citations=citations_response,
            reference_list=reference_list,
            metadata={
                "validated": request.validate_with_kg,
                "matched_count": sum(1 for c in citations if c.matched_document),
                "unmatched_count": sum(1 for c in citations if not c.matched_document)
            }
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Citation extraction failed: {str(e)}"
        )


@router.post("/lookup-citation", response_model=CitationResponse)
async def lookup_citation(request: CitationLookupRequest):
    """
    Look up a specific legal citation.
    
    Find detailed information about a specific law, regulation, or court case
    by its citation.
    
    **Examples:**
    - "UU No. 1 Tahun 1974"
    - "PP No. 45 Tahun 2022"
    - "Putusan MA No. 123/Pid/2023"
    """
    try:
        search_engine = get_search_engine()
        
        result = await search_engine.search_by_citation(request.citation)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Citation not found: {request.citation}"
            )
        
        return CitationResponse(
            document_id=result.document_id,
            document_type=result.document_type,
            title=result.title,
            citation_text=result.citation_text,
            url=result.url,
            relevance_score=result.relevance_score,
            excerpt=result.excerpt
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Citation lookup failed: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Health check for Knowledge Graph services.
    
    Checks availability of:
    - EdgeDB connection
    - Search engine
    - Citation extractor
    - AI enhancement services
    """
    try:
        # Check EdgeDB connection
        search_engine = get_search_engine()
        edgedb_status = "connected"
        
        # Check AI services
        ai_status = "available" if search_engine.enable_ai_enhancement else "disabled"
        
        return {
            "status": "healthy",
            "edgedb": edgedb_status,
            "search_engine": "operational",
            "citation_extractor": "operational",
            "ai_enhancement": ai_status
        }
        
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e)
        }


@router.get("/stats")
async def get_statistics():
    """
    Get Knowledge Graph statistics.
    
    Returns statistics about:
    - Total documents in Knowledge Graph
    - Documents by type
    - Popular searches
    - Citation usage
    """
    try:
        # Placeholder: Would query actual stats from EdgeDB
        return {
            "total_documents": 0,
            "by_type": {
                "law": 0,
                "regulation": 0,
                "court_case": 0,
                "article": 0
            },
            "note": "Statistics will be populated when data is imported"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get statistics: {str(e)}"
        )
