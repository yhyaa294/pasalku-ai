"""
API endpoints for Legal Term Detection
Integrates with chat system to provide contextual explanations
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from services.term_detector import LegalTermDetector

router = APIRouter(prefix="/api/terms", tags=["Legal Terms"])

# Initialize detector
detector = LegalTermDetector()

class TextAnalysisRequest(BaseModel):
    text: str
    context: Optional[str] = None  # Optional context (e.g., chat message ID)

class TextAnalysisResponse(BaseModel):
    original_text: str
    detected_terms: List[Dict[str, Any]]
    terms_count: int

class TermDetailRequest(BaseModel):
    term: str

@router.post("/detect", response_model=TextAnalysisResponse)
async def detect_terms_in_text(request: TextAnalysisRequest):
    """
    Detect legal terms in the provided text
    
    This endpoint is called by the frontend after AI generates a response
    to automatically highlight legal terms.
    """
    try:
        result = await detector.annotate_text(request.text)
        return TextAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Term detection failed: {str(e)}")

@router.get("/term/{term_name}")
async def get_term_details(term_name: str):
    """
    Get detailed information about a specific legal term
    
    Used when user hovers/clicks on a highlighted term
    """
    try:
        # Search for term in detector's database
        term_name_normalized = term_name.lower().replace("-", " ")
        
        for pattern, term_data in detector.legal_terms_patterns.items():
            if term_data['term'].lower() == term_name_normalized:
                return {
                    'term': term_data['term'],
                    'definition_formal': term_data['definition_formal'],
                    'definition_simple': term_data['definition_simple'],
                    'analogy': term_data['analogy'],
                    'category': term_data['category'],
                    'related_articles': term_data['related_articles'],
                    'learn_more_url': f'/sumber-daya/kamus/{term_name}'
                }
        
        raise HTTPException(status_code=404, detail=f"Term '{term_name}' not found")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch term details: {str(e)}")

@router.get("/search")
async def search_terms(q: str, limit: int = 10):
    """
    Search legal terms by keyword
    
    Used in the Kamus Hukum search feature
    """
    try:
        results = []
        query_lower = q.lower()
        
        for pattern, term_data in detector.legal_terms_patterns.items():
            if query_lower in term_data['term'].lower() or \
               query_lower in term_data['definition_simple'].lower():
                results.append({
                    'term': term_data['term'],
                    'definition_simple': term_data['definition_simple'],
                    'category': term_data['category'],
                    'url': f'/sumber-daya/kamus/{term_data["term"].lower().replace(" ", "-")}'
                })
                
                if len(results) >= limit:
                    break
        
        return {
            'query': q,
            'results': results,
            'total': len(results)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/categories")
async def get_term_categories():
    """
    Get all available term categories
    """
    categories = set()
    for term_data in detector.legal_terms_patterns.values():
        categories.add(term_data['category'])
    
    return {
        'categories': list(categories),
        'total': len(categories)
    }

# Register this router in your main FastAPI app:
# app.include_router(router)
