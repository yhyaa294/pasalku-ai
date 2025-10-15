
"""
Language Detector

Auto-detect bahasa dari text dengan support untuk:
- Indonesian (id)
- English (en)
- Regional languages (Javanese, Sundanese, etc.)
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum
import re


class SupportedLanguage(Enum):
    """Bahasa yang didukung"""
    INDONESIAN = "id"
    ENGLISH = "en"
    JAVANESE = "jv"
    SUNDANESE = "su"
    BALINESE = "ban"
    MINANGKABAU = "min"
    UNKNOWN = "unknown"


@dataclass
class DetectionResult:
    """Result of language detection"""
    language: SupportedLanguage
    confidence: float  # 0.0 - 1.0
    alternative_languages: List[tuple] = None  # [(lang, confidence)]
    
    def __post_init__(self):
        if self.alternative_languages is None:
            self.alternative_languages = []


class LanguageDetector:
    """
    Detect language dari text
    
    Menggunakan kombinasi:
    - Keyword matching untuk bahasa Indonesia & regional
    - Character pattern analysis
    - Common word frequency
    """
    
    def __init__(self):
        # Load language patterns
        self.patterns = self._load_patterns()
        
        # Common words per language
        self.common_words = self._load_common_words()
        
        # Legal terms per language
        self.legal_terms = self._load_legal_terms()
    
    def detect(self, text: str) -> DetectionResult:
        """
        Detect language dari text
        
        Args:
            text: Text untuk di-detect
        
        Returns:
            DetectionResult dengan bahasa dan confidence
        """
        if not text or not text.strip():
            return DetectionResult(
                language=SupportedLanguage.UNKNOWN,
                confidence=0.0
            )
        
        text_lower = text.lower()
        
        # Calculate scores for each language
        scores = {}
        
        for lang in SupportedLanguage:
            if lang == SupportedLanguage.UNKNOWN:
                continue
            
            score = self._calculate_language_score(text_lower, lang)
            scores[lang] = score
        
        # Get best match
        if not scores:
            return DetectionResult(
                language=SupportedLanguage.UNKNOWN,
                confidence=0.0
            )
        
        # Sort by score
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        best_lang, best_score = sorted_scores[0]
        
        # Alternative languages
        alternatives = [(lang.value, score) for lang, score in sorted_scores[1:3]]
        
        # Normalize confidence (0.0 - 1.0)
        confidence = min(best_score / 100.0, 1.0)
        
        return DetectionResult(
            language=best_lang,
            confidence=confidence,
            alternative_languages=alternatives
        )
    
    def is_indonesian(self, text: str) -> bool:
        """Check if text is Indonesian"""
        result = self.detect(text)
        return result.language == SupportedLanguage.INDONESIAN and result.confidence > 0.5
    
    def is_english(self, text: str) -> bool:
        """Check if text is English"""
        result = self.detect(text)
        return result.language == SupportedLanguage.ENGLISH and result.confidence > 0.5
    
    def _calculate_language_score(self, text: str, language: SupportedLanguage) -> float:
        """Calculate score untuk bahasa tertentu"""
        score = 0.0
        
        # 1. Common words matching (40 points)
        common_words = self.common_words.get(language, [])
        word_matches = sum(1 for word in common_words if word in text)
        score += min(word_matches * 4, 40)
        
        # 2. Legal terms matching (30 points)
        legal_terms = self.legal_terms.get(language, [])
        legal_matches = sum(1 for term in legal_terms if term in text)
        score += min(legal_matches * 6, 30)
        
        # 3. Pattern matching (20 points)
        patterns = self.patterns.get(language, [])
        pattern_matches = sum(1 for pattern in patterns if re.search(pattern, text))
        score += min(pattern_matches * 5, 20)
        
        # 4. Character analysis (10 points)
        if language == SupportedLanguage.ENGLISH:
            # English has more spaces between words
            word_count = len(text.split())
            if word_count > 0:
                avg_word_len = len(text) / word_count
                if 4 <= avg_word_len <= 6:
                    score += 10
        elif language == SupportedLanguage.INDONESIAN:
            # Indonesian has specific suffixes
            indonesian_suffixes = ['-kan', '-an', '-nya', '-i', '-lah']
            suffix_count = sum(1 for suffix in indonesian_suffixes if suffix in text)
            score += min(suffix_count * 2, 10)
        
        return score
    
    def _load_patterns(self) -> Dict[SupportedLanguage, List[str]]:
        """Load regex patterns per language"""
        return {
            SupportedLanguage.INDONESIAN: [
                r'\byang\b',
                r'\bdi\b',
                r'\bke\b',
                r'\bdari\b',
                r'\buntuk\b',
                r'\bdengan\b',
                r'\btersebut\b',
                r'\bpada\b',
            ],
            SupportedLanguage.ENGLISH: [
                r'\bthe\b',
                r'\bis\b',
                r'\bare\b',
                r'\bwas\b',
                r'\bwere\b',
                r'\bhas\b',
                r'\bhave\b',
                r'\bwill\b',
            ],
            SupportedLanguage.JAVANESE: [
                r'\bsimbah\b',
                r'\beyang\b',
                r'\bingkang\b',
                r'\bkaliyan\b',
                r'\bmenawi\b',
            ],
            SupportedLanguage.SUNDANESE: [
                r'\bnu\b',
                r'\bka\b',
                r'\bdi\b',
                r'\btea\b',
                r'\bkeur\b',
            ],
        }
    
    def _load_common_words(self) -> Dict[SupportedLanguage, List[str]]:
        """Load common words per language"""
        return {
            SupportedLanguage.INDONESIAN: [
                'dan', 'yang', 'di', 'ke', 'dari', 'untuk', 'pada', 'dengan',
                'adalah', 'ini', 'itu', 'atau', 'akan', 'telah', 'oleh',
                'sebagai', 'dalam', 'dapat', 'tidak', 'juga', 'ada', 'sudah',
                'harus', 'kami', 'mereka', 'saya', 'anda', 'kita', 'nya'
            ],
            SupportedLanguage.ENGLISH: [
                'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
                'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
                'can', 'could', 'should', 'may', 'might', 'must',
                'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than',
                'to', 'from', 'at', 'by', 'for', 'with', 'about'
            ],
            SupportedLanguage.JAVANESE: [
                'lan', 'karo', 'ing', 'wonten', 'kalih', 'saking',
                'dhateng', 'punika', 'menika', 'niku', 'niki'
            ],
            SupportedLanguage.SUNDANESE: [
                'jeung', 'sareng', 'di', 'ka', 'ti', 'ku',
                'teh', 'mah', 'ge', 'oge', 'keur'
            ],
        }
    
    def _load_legal_terms(self) -> Dict[SupportedLanguage, List[str]]:
        """Load legal terms per language"""
        return {
            SupportedLanguage.INDONESIAN: [
                'undang-undang', 'pasal', 'peraturan', 'hukum', 'perjanjian',
                'kontrak', 'gugatan', 'tergugat', 'penggugat', 'hakim',
                'pengadilan', 'putusan', 'mahkamah', 'advokat', 'jaksa',
                'terdakwa', 'saksi', 'bukti', 'pelanggaran', 'pidana',
                'perdata', 'administrasi', 'tata usaha', 'negara'
            ],
            SupportedLanguage.ENGLISH: [
                'law', 'act', 'regulation', 'article', 'section',
                'agreement', 'contract', 'lawsuit', 'plaintiff', 'defendant',
                'judge', 'court', 'verdict', 'attorney', 'lawyer',
                'prosecutor', 'accused', 'witness', 'evidence', 'violation',
                'criminal', 'civil', 'administrative'
            ],
            SupportedLanguage.JAVANESE: [
                'ukum', 'pranatan', 'prajanjian', 'pengadilan',
                'hakim', 'terdakwa', 'saksi', 'bukti'
            ],
            SupportedLanguage.SUNDANESE: [
                'hukum', 'aturan', 'perjanjian', 'pangadilan',
                'hakim', 'terdakwa', 'saksi', 'bukti'
            ],
        }
    
    def detect_multiple_languages(self, text: str) -> List[DetectionResult]:
        """
        Detect if text contains multiple languages (code-switching)
        
        Returns:
            List of detected languages with their segments
        """
        # Split text into sentences
        sentences = re.split(r'[.!?]+', text)
        
        detections = []
        
        for sentence in sentences:
            if not sentence.strip():
                continue
            
            result = self.detect(sentence)
            if result.confidence > 0.3:  # Only include confident detections
                detections.append(result)
        
        # Group by language
        language_counts = {}
        for detection in detections:
            lang = detection.language
            if lang not in language_counts:
                language_counts[lang] = 0
            language_counts[lang] += 1
        
        # Create results
        results = []
        for lang, count in language_counts.items():
            confidence = count / len(detections) if detections else 0
            results.append(DetectionResult(
                language=lang,
                confidence=confidence
            ))
        
        # Sort by confidence
        results.sort(key=lambda x: x.confidence, reverse=True)
        
        return results
    
    def get_language_name(self, language: SupportedLanguage, locale: str = "id") -> str:
        """Get human-readable language name"""
        names = {
            SupportedLanguage.INDONESIAN: {
                "id": "Bahasa Indonesia",
                "en": "Indonesian"
            },
            SupportedLanguage.ENGLISH: {
                "id": "Bahasa Inggris",
                "en": "English"
            },
            SupportedLanguage.JAVANESE: {
                "id": "Bahasa Jawa",
                "en": "Javanese"
            },
            SupportedLanguage.SUNDANESE: {
                "id": "Bahasa Sunda",
                "en": "Sundanese"
            },
            SupportedLanguage.BALINESE: {
                "id": "Bahasa Bali",
                "en": "Balinese"
            },
            SupportedLanguage.MINANGKABAU: {
                "id": "Bahasa Minangkabau",
                "en": "Minangkabau"
            },
            SupportedLanguage.UNKNOWN: {
                "id": "Tidak Diketahui",
                "en": "Unknown"
            }
        }
        
        return names.get(language, {}).get(locale, language.value)
