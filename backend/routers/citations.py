"""
Citation System REST API

Endpoints untuk sistem sitasi otomatis.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import timedelta
import logging

from ..services.citation import (
    get_citation_enhancer,
    get_citation_detector,
    get_citation_tracker,
    CitationFormat,
    CitationType
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/citations")


# ============================================================================
# Pydantic Models
# ============================================================================

class EnhanceTextRequest(BaseModel):
    """Request untuk enhance text dengan citations"""
    text: str = Field(..., description="Text yang akan dianalisis")
    formats: Optional[List[str]] = Field(
        default=["standard", "markdown", "html"],
        description="Format output (standard, markdown, html, academic, legal, short, json)"
    )
    track: bool = Field(default=True, description="Track penggunaan sitasi")
    user_id: Optional[str] = Field(None, description="ID user (untuk tracking)")
    session_id: Optional[str] = Field(None, description="ID session (untuk tracking)")
    source: str = Field(default="api", description="Sumber penggunaan")


class EnhanceTextResponse(BaseModel):
    """Response dari enhance text"""
    original_text: str
    citations: List[Dict[str, Any]]
    enhanced_text: Dict[str, str]
    statistics: Dict[str, Any]


class DetectCitationsRequest(BaseModel):
    """Request untuk detect citations saja (tanpa linking)"""
    text: str = Field(..., description="Text yang akan dianalisis")
    citation_types: Optional[List[str]] = Field(
        None,
        description="Filter jenis sitasi (uu, pp, perpres, pasal, putusan, dll)"
    )


class DetectCitationsResponse(BaseModel):
    """Response dari detect citations"""
    citations: List[Dict[str, Any]]
    count: int
    by_type: Dict[str, int]


class ExtractCitationsRequest(BaseModel):
    """Request untuk extract citations dengan linking"""
    text: str = Field(..., description="Text yang akan dianalisis")
    link: bool = Field(default=True, description="Link dengan database")


class GetStatisticsResponse(BaseModel):
    """Response statistics"""
    total_citations: int
    unique_citations: int
    total_laws: int
    by_type: Dict[str, int]
    top_citations: List[Dict[str, Any]]
    top_laws: List[Dict[str, Any]]
    time_range: str


class GetTrendingResponse(BaseModel):
    """Response trending citations"""
    trending: List[Dict[str, Any]]
    period: str


# ============================================================================
# Endpoints
# ============================================================================

@router.post("/enhance", response_model=EnhanceTextResponse)
async def enhance_text_with_citations(request: EnhanceTextRequest):
    """
    **Enhance text dengan mendeteksi, link, dan format semua sitasi.**
    
    Proses lengkap:
    1. Deteksi semua sitasi dalam text
    2. Link dengan Knowledge Graph
    3. Format dengan berbagai style
    4. Track penggunaan (opsional)
    5. Return enhanced text
    
    **Contoh:**
    ```json
    {
        "text": "Berdasarkan UU No 13 Tahun 2003 dan Pasal 378 KUHP...",
        "formats": ["markdown", "html"],
        "track": true
    }
    ```
    """
    try:
        enhancer = get_citation_enhancer()
        
        # Parse formats
        format_map = {
            "standard": CitationFormat.STANDARD,
            "academic": CitationFormat.ACADEMIC,
            "legal": CitationFormat.LEGAL,
            "short": CitationFormat.SHORT,
            "markdown": CitationFormat.MARKDOWN,
            "html": CitationFormat.HTML,
            "json": CitationFormat.JSON
        }
        
        formats = [
            format_map.get(f.lower(), CitationFormat.STANDARD)
            for f in request.formats
        ]
        
        # Enhance
        result = await enhancer.enhance_text(
            text=request.text,
            formats=formats,
            track=request.track,
            user_id=request.user_id,
            session_id=request.session_id,
            source=request.source
        )
        
        return EnhanceTextResponse(**result)
        
    except Exception as e:
        logger.error(f"Error enhancing text: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/detect", response_model=DetectCitationsResponse)
async def detect_citations(request: DetectCitationsRequest):
    """
    **Deteksi semua sitasi dalam text (tanpa linking).**
    
    Lebih cepat karena hanya deteksi pattern, tidak query database.
    
    **Contoh:**
    ```json
    {
        "text": "Berdasarkan UU No 13 Tahun 2003 dan Pasal 378 KUHP...",
        "citation_types": ["uu", "pasal"]
    }
    ```
    """
    try:
        detector = get_citation_detector()
        
        # Detect
        if request.citation_types:
            # Map string ke CitationType enum
            type_map = {
                "uu": CitationType.UU,
                "pp": CitationType.PP,
                "perpres": CitationType.PERPRES,
                "permen": CitationType.PERMEN,
                "pasal": CitationType.PASAL,
                "putusan": CitationType.PUTUSAN,
                "kuhp": CitationType.KUHP,
                "perda": CitationType.PERDA,
                "kepres": CitationType.KEPRES,
                "inpres": CitationType.INPRES
            }
            
            types = [
                type_map.get(t.lower())
                for t in request.citation_types
                if t.lower() in type_map
            ]
            
            citations = detector.detect_by_type(request.text, types)
        else:
            citations = detector.detect(request.text)
        
        # Count by type
        by_type = detector.get_citation_count(request.text)
        by_type_str = {k.value: v for k, v in by_type.items()}
        
        # Convert to dict
        citations_dict = [
            {
                "text": c.text,
                "type": c.type.value,
                "normalized": c.normalized,
                "position": {"start": c.start_pos, "end": c.end_pos},
                "confidence": c.confidence,
                "metadata": c.metadata
            }
            for c in citations
        ]
        
        return DetectCitationsResponse(
            citations=citations_dict,
            count=len(citations),
            by_type=by_type_str
        )
        
    except Exception as e:
        logger.error(f"Error detecting citations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract")
async def extract_citations(request: ExtractCitationsRequest):
    """
    **Extract citations dan optionally link dengan database.**
    
    Lebih sederhana dari `/enhance`, hanya return list citations.
    
    **Contoh:**
    ```json
    {
        "text": "Berdasarkan UU No 13 Tahun 2003...",
        "link": true
    }
    ```
    """
    try:
        enhancer = get_citation_enhancer()
        
        citations = await enhancer.get_citations_from_text(
            text=request.text,
            link=request.link
        )
        
        return {
            "citations": citations,
            "count": len(citations)
        }
        
    except Exception as e:
        logger.error(f"Error extracting citations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/statistics", response_model=GetStatisticsResponse)
async def get_citation_statistics(
    days: Optional[int] = Query(None, description="Range waktu dalam hari (None = all time)")
):
    """
    **Get statistik penggunaan sitasi.**
    
    Menampilkan:
    - Total citations
    - Top citations
    - Top laws
    - Distribution by type
    
    **Contoh:** `/api/citations/statistics?days=7`
    """
    try:
        enhancer = get_citation_enhancer()
        
        stats = enhancer.get_tracker_statistics(time_range_days=days)
        
        return GetStatisticsResponse(**stats)
        
    except Exception as e:
        logger.error(f"Error getting statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trending", response_model=GetTrendingResponse)
async def get_trending_citations(
    days: int = Query(7, description="Range waktu dalam hari"),
    limit: int = Query(10, description="Jumlah maksimal hasil")
):
    """
    **Get citations yang sedang trending.**
    
    Menampilkan sitasi yang paling banyak digunakan dalam periode tertentu,
    dengan perbandingan periode sebelumnya.
    
    **Contoh:** `/api/citations/trending?days=7&limit=10`
    """
    try:
        enhancer = get_citation_enhancer()
        
        trending = enhancer.get_trending_citations(days=days, limit=limit)
        
        return GetTrendingResponse(
            trending=trending,
            period=f"Last {days} days"
        )
        
    except Exception as e:
        logger.error(f"Error getting trending: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/types")
async def get_citation_types():
    """
    **Get semua jenis sitasi yang didukung.**
    
    Return list semua CitationType dengan deskripsi.
    """
    types = [
        {
            "code": "uu",
            "name": "Undang-Undang",
            "description": "Undang-Undang Republik Indonesia",
            "example": "UU No. 13 Tahun 2003"
        },
        {
            "code": "pp",
            "name": "Peraturan Pemerintah",
            "description": "Peraturan Pemerintah",
            "example": "PP No. 35 Tahun 2021"
        },
        {
            "code": "perpres",
            "name": "Peraturan Presiden",
            "description": "Peraturan Presiden",
            "example": "Perpres No. 82 Tahun 2018"
        },
        {
            "code": "permen",
            "name": "Peraturan Menteri",
            "description": "Peraturan Menteri",
            "example": "Permen BUMN No. 1 Tahun 2020"
        },
        {
            "code": "pasal",
            "name": "Pasal",
            "description": "Pasal dalam peraturan perundangan",
            "example": "Pasal 378 ayat (1)"
        },
        {
            "code": "putusan",
            "name": "Putusan Pengadilan",
            "description": "Putusan Pengadilan",
            "example": "Putusan No. 123/Pid/2024/PN.Jkt"
        },
        {
            "code": "kuhp",
            "name": "KUHP/KUHPerdata/KUHAP",
            "description": "Kitab Undang-Undang Hukum",
            "example": "KUHP, KUHPerdata"
        },
        {
            "code": "perda",
            "name": "Peraturan Daerah",
            "description": "Peraturan Daerah Provinsi/Kabupaten/Kota",
            "example": "Perda DKI No. 5 Tahun 2015"
        },
        {
            "code": "kepres",
            "name": "Keputusan Presiden",
            "description": "Keputusan Presiden",
            "example": "Keppres No. 10 Tahun 2020"
        },
        {
            "code": "inpres",
            "name": "Instruksi Presiden",
            "description": "Instruksi Presiden",
            "example": "Inpres No. 3 Tahun 2019"
        }
    ]
    
    return {"types": types}


@router.get("/formats")
async def get_citation_formats():
    """
    **Get semua format output yang didukung.**
    
    Return list semua CitationFormat dengan deskripsi.
    """
    formats = [
        {
            "code": "standard",
            "name": "Standard",
            "description": "Format standar Indonesia",
            "example": "UU No. 13 Tahun 2003 tentang Ketenagakerjaan"
        },
        {
            "code": "academic",
            "name": "Academic",
            "description": "Format kutipan akademik (footnote)",
            "example": "Indonesia, Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan."
        },
        {
            "code": "legal",
            "name": "Legal",
            "description": "Format legal brief",
            "example": "UU No. 13/2003 (Ketenagakerjaan)"
        },
        {
            "code": "short",
            "name": "Short",
            "description": "Format ringkas",
            "example": "UU 13/2003"
        },
        {
            "code": "markdown",
            "name": "Markdown",
            "description": "Format Markdown dengan link",
            "example": "[UU No. 13 Tahun 2003](https://...)"
        },
        {
            "code": "html",
            "name": "HTML",
            "description": "Format HTML dengan hyperlink",
            "example": '<a href="...">UU No. 13 Tahun 2003</a>'
        },
        {
            "code": "json",
            "name": "JSON",
            "description": "Format JSON (untuk API)",
            "example": '{"text": "UU No. 13 Tahun 2003", ...}'
        }
    ]
    
    return {"formats": formats}


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Citation System",
        "version": "1.0.0"
    }
