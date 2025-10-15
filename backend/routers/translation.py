"""
Translation API Router

REST API endpoints untuk translation services
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from backend.services.translation import (
    get_language_detector,
    get_translator,
    get_localizer,
    get_translation_memory
)
from backend.services.translation.language_detector import SupportedLanguage
from backend.services.translation.localizer import LocaleFormat


router = APIRouter(prefix="/api/translation", tags=["translation"])


# Request Models
class DetectRequest(BaseModel):
    """Language detection request"""
    text: str = Field(..., description="Text to detect language")


class TranslateRequest(BaseModel):
    """Translation request"""
    text: str = Field(..., description="Text to translate")
    source_lang: str = Field(..., description="Source language code (id, en, etc.)")
    target_lang: str = Field(..., description="Target language code (id, en, etc.)")
    preserve_legal_terms: bool = Field(True, description="Preserve legal terms during translation")
    use_ai: bool = Field(True, description="Use AI translation (fallback to dictionary if False)")


class BatchTranslateRequest(BaseModel):
    """Batch translation request"""
    texts: List[str] = Field(..., description="List of texts to translate")
    source_lang: str = Field(..., description="Source language code")
    target_lang: str = Field(..., description="Target language code")
    preserve_legal_terms: bool = Field(True, description="Preserve legal terms")


class LocalizeRequest(BaseModel):
    """Localization request"""
    value_type: str = Field(..., description="Type: 'date', 'currency', 'number', 'percentage', 'citation'")
    value: str = Field(..., description="Value to localize")
    locale: str = Field("id_ID", description="Locale format (id_ID, en_US, en_GB)")
    format_style: Optional[str] = Field("long", description="Format style for dates")
    currency_code: Optional[str] = Field(None, description="Currency code for currency formatting")
    decimal_places: Optional[int] = Field(2, description="Decimal places for numbers")


# Response Models
class DetectionResponse(BaseModel):
    """Language detection response"""
    detected_language: str
    language_name: str
    confidence: float
    alternatives: List[dict]


class TranslationResponse(BaseModel):
    """Translation response"""
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    quality: str
    confidence: float
    preserved_terms: List[str]
    translator_used: str
    from_cache: bool = False
    timestamp: str


class LocalizationResponse(BaseModel):
    """Localization response"""
    value_type: str
    original_value: str
    localized_value: str
    locale: str


@router.post("/detect", response_model=DetectionResponse)
async def detect_language(request: DetectRequest):
    """
    Detect language dari text
    
    Returns:
        - detected_language: Language code
        - language_name: Human-readable language name
        - confidence: Confidence score (0.0-1.0)
        - alternatives: Alternative languages dengan scores
    """
    try:
        detector = get_language_detector()
        result = detector.detect(request.text)
        
        return DetectionResponse(
            detected_language=result.language.value,
            language_name=detector.get_language_name(result.language, "id"),
            confidence=result.confidence,
            alternatives=[
                {
                    "language": alt.language.value,
                    "language_name": detector.get_language_name(alt.language, "id"),
                    "confidence": alt.confidence
                }
                for alt in result.alternative_languages
            ]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Language detection failed: {str(e)}")


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslateRequest):
    """
    Translate text dari source language ke target language
    
    Returns:
        - translated_text: Translated text
        - quality: Translation quality (EXCELLENT, GOOD, FAIR, POOR)
        - confidence: Confidence score
        - preserved_terms: List of preserved legal terms
        - from_cache: Whether translation from cache
    """
    try:
        # Check translation memory first
        memory = get_translation_memory()
        cached = memory.get_translation(
            request.text,
            request.source_lang,
            request.target_lang
        )
        
        if cached:
            return TranslationResponse(
                source_text=cached.source_text,
                translated_text=cached.translated_text,
                source_lang=cached.source_lang,
                target_lang=cached.target_lang,
                quality=cached.quality or "GOOD",
                confidence=cached.confidence or 0.9,
                preserved_terms=[],
                translator_used="cache",
                from_cache=True,
                timestamp=cached.timestamp.isoformat()
            )
        
        # Translate
        translator = get_translator()
        result = translator.translate(
            request.text,
            request.source_lang,
            request.target_lang,
            request.preserve_legal_terms,
            request.use_ai
        )
        
        # Add to memory
        memory.add_translation(
            result.source_text,
            result.translated_text,
            result.source_lang,
            result.target_lang,
            result.quality.value,
            result.confidence
        )
        
        return TranslationResponse(
            source_text=result.source_text,
            translated_text=result.translated_text,
            source_lang=result.source_lang,
            target_lang=result.target_lang,
            quality=result.quality.value,
            confidence=result.confidence,
            preserved_terms=result.preserved_terms,
            translator_used=result.translator_used,
            from_cache=False,
            timestamp=result.timestamp.isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")


@router.post("/batch-translate", response_model=List[TranslationResponse])
async def batch_translate(request: BatchTranslateRequest):
    """
    Translate multiple texts sekaligus
    
    Returns:
        List of translation results
    """
    try:
        translator = get_translator()
        memory = get_translation_memory()
        
        results = []
        
        for text in request.texts:
            # Check cache
            cached = memory.get_translation(
                text,
                request.source_lang,
                request.target_lang
            )
            
            if cached:
                results.append(TranslationResponse(
                    source_text=cached.source_text,
                    translated_text=cached.translated_text,
                    source_lang=cached.source_lang,
                    target_lang=cached.target_lang,
                    quality=cached.quality or "GOOD",
                    confidence=cached.confidence or 0.9,
                    preserved_terms=[],
                    translator_used="cache",
                    from_cache=True,
                    timestamp=cached.timestamp.isoformat()
                ))
            else:
                # Translate
                result = translator.translate(
                    text,
                    request.source_lang,
                    request.target_lang,
                    request.preserve_legal_terms
                )
                
                # Add to memory
                memory.add_translation(
                    result.source_text,
                    result.translated_text,
                    result.source_lang,
                    result.target_lang,
                    result.quality.value,
                    result.confidence
                )
                
                results.append(TranslationResponse(
                    source_text=result.source_text,
                    translated_text=result.translated_text,
                    source_lang=result.source_lang,
                    target_lang=result.target_lang,
                    quality=result.quality.value,
                    confidence=result.confidence,
                    preserved_terms=result.preserved_terms,
                    translator_used=result.translator_used,
                    from_cache=False,
                    timestamp=result.timestamp.isoformat()
                ))
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch translation failed: {str(e)}")


@router.post("/localize", response_model=LocalizationResponse)
async def localize_value(request: LocalizeRequest):
    """
    Localize value (date, currency, number, etc.) untuk locale tertentu
    
    Supported value_types:
        - date: Format date
        - currency: Format currency
        - number: Format number
        - percentage: Format percentage
        - citation: Format legal citation
    """
    try:
        localizer = get_localizer()
        
        # Parse locale
        locale_map = {
            "id_ID": LocaleFormat.INDONESIAN,
            "en_US": LocaleFormat.ENGLISH_US,
            "en_GB": LocaleFormat.ENGLISH_UK
        }
        locale = locale_map.get(request.locale, LocaleFormat.INDONESIAN)
        
        localized = None
        
        if request.value_type == "date":
            # Parse date
            try:
                date_value = datetime.fromisoformat(request.value.replace('Z', '+00:00'))
                localized = localizer.format_date(date_value, locale, request.format_style)
            except:
                localized = request.value
        
        elif request.value_type == "currency":
            try:
                amount = float(request.value)
                localized = localizer.format_currency(amount, locale, request.currency_code)
            except:
                localized = request.value
        
        elif request.value_type == "number":
            try:
                number = float(request.value)
                localized = localizer.format_number(number, locale, request.decimal_places)
            except:
                localized = request.value
        
        elif request.value_type == "percentage":
            try:
                percentage = float(request.value)
                localized = localizer.format_percentage(percentage, locale, request.decimal_places)
            except:
                localized = request.value
        
        elif request.value_type == "citation":
            localized = localizer.format_legal_citation(request.value, locale)
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown value_type: {request.value_type}")
        
        return LocalizationResponse(
            value_type=request.value_type,
            original_value=request.value,
            localized_value=localized,
            locale=request.locale
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Localization failed: {str(e)}")


@router.get("/supported-languages")
async def get_supported_languages():
    """
    Get list of supported languages
    
    Returns:
        List of supported languages dengan codes dan names
    """
    detector = get_language_detector()
    
    languages = []
    
    for lang in SupportedLanguage:
        if lang == SupportedLanguage.UNKNOWN:
            continue
        
        languages.append({
            "code": lang.value,
            "name": detector.get_language_name(lang, "en"),
            "native_name": detector.get_language_name(lang, "id")
        })
    
    return {
        "languages": languages,
        "total": len(languages)
    }


@router.get("/supported-pairs")
async def get_supported_pairs():
    """
    Get list of supported language pairs untuk translation
    
    Returns:
        List of supported language pairs
    """
    translator = get_translator()
    pairs = translator.get_supported_pairs()
    
    return {
        "pairs": [
            {
                "source": source,
                "target": target
            }
            for source, target in pairs
        ],
        "total": len(pairs)
    }


@router.get("/memory/search")
async def search_translation_memory(
    query: str = Query(..., description="Search query"),
    source_lang: str = Query("id", description="Source language"),
    target_lang: str = Query("en", description="Target language"),
    threshold: float = Query(0.7, description="Similarity threshold", ge=0.0, le=1.0),
    limit: int = Query(5, description="Max results", ge=1, le=20)
):
    """
    Search translation memory dengan fuzzy matching
    
    Returns:
        Similar translations dengan similarity scores
    """
    try:
        memory = get_translation_memory()
        results = memory.find_similar(
            query,
            source_lang,
            target_lang,
            threshold,
            limit
        )
        
        return {
            "query": query,
            "results": [
                {
                    "source_text": entry.source_text,
                    "translated_text": entry.translated_text,
                    "similarity": similarity,
                    "quality": entry.quality,
                    "confidence": entry.confidence,
                    "usage_count": entry.usage_count,
                    "timestamp": entry.timestamp.isoformat()
                }
                for entry, similarity in results
            ],
            "total": len(results)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Memory search failed: {str(e)}")


@router.get("/memory/stats")
async def get_memory_statistics():
    """
    Get translation memory statistics
    
    Returns:
        Cache statistics (hits, misses, hit rate, etc.)
    """
    memory = get_translation_memory()
    stats = memory.get_statistics()
    
    return stats


@router.delete("/memory/clear")
async def clear_translation_memory():
    """
    Clear translation memory cache
    
    Returns:
        Success message
    """
    try:
        memory = get_translation_memory()
        memory.clear_cache()
        
        return {
            "status": "success",
            "message": "Translation memory cleared successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear memory: {str(e)}")


@router.get("/health")
async def health_check():
    """
    Health check endpoint
    
    Returns:
        System health status
    """
    try:
        detector = get_language_detector()
        translator = get_translator()
        localizer = get_localizer()
        memory = get_translation_memory()
        
        # Test detection
        test_detection = detector.detect("Ini adalah teks bahasa Indonesia")
        
        # Get stats
        memory_stats = memory.get_statistics()
        
        return {
            "status": "healthy",
            "services": {
                "language_detector": "operational",
                "translator": "operational",
                "localizer": "operational",
                "translation_memory": "operational"
            },
            "statistics": {
                "supported_languages": len([l for l in SupportedLanguage if l != SupportedLanguage.UNKNOWN]),
                "supported_pairs": len(translator.get_supported_pairs()),
                "cached_translations": memory_stats["total_entries"],
                "cache_hit_rate": memory_stats["hit_rate"]
            },
            "test_detection": {
                "text": "Ini adalah teks bahasa Indonesia",
                "detected": test_detection.language.value,
                "confidence": test_detection.confidence
            }
        }
    
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
