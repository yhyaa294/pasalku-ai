"""
Multi-Language Translation Service

Service untuk support multiple languages:
- Language detection
- Translation dengan legal terminology preservation
- Localization (dates, currency, citations)
- Translation memory untuk konsistensi
"""

__version__ = "1.0.0"

# Core components
from .language_detector import (
    LanguageDetector,
    DetectionResult,
    SupportedLanguage
)

from .translator import (
    Translator,
    TranslationResult,
    TranslationQuality
)

from .localizer import (
    Localizer,
    LocaleFormat
)

from .translation_memory import (
    TranslationMemory,
    TranslationEntry
)

# Singleton instances
_language_detector = None
_translator = None
_localizer = None
_translation_memory = None


def get_language_detector() -> LanguageDetector:
    """Get singleton LanguageDetector instance"""
    global _language_detector
    if _language_detector is None:
        _language_detector = LanguageDetector()
    return _language_detector


def get_translator() -> Translator:
    """Get singleton Translator instance"""
    global _translator
    if _translator is None:
        _translator = Translator()
    return _translator


def get_localizer() -> Localizer:
    """Get singleton Localizer instance"""
    global _localizer
    if _localizer is None:
        _localizer = Localizer()
    return _localizer


def get_translation_memory() -> TranslationMemory:
    """Get singleton TranslationMemory instance"""
    global _translation_memory
    if _translation_memory is None:
        _translation_memory = TranslationMemory(
            cache_file="translation_memory.json",
            ttl_days=30,
            max_entries=10000
        )
    return _translation_memory


__all__ = [
    # Language detection
    "LanguageDetector",
    "DetectionResult",
    "SupportedLanguage",
    
    # Translation
    "Translator",
    "TranslationResult",
    "TranslationQuality",
    
    # Localization
    "Localizer",
    "LocaleFormat",
    
    # Translation memory
    "TranslationMemory",
    "TranslationEntry",
    
    # Singletons
    "get_language_detector",
    "get_translator",
    "get_localizer",
    "get_translation_memory",
]
