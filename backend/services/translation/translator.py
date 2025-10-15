"""
Translator

Translation service dengan:
- Legal terminology preservation
- Translation memory integration
- Multiple translation providers
- Quality scoring
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional
from enum import Enum
import re
from datetime import datetime


class TranslationQuality(Enum):
    """Quality level of translation"""
    EXCELLENT = "excellent"  # 0.9 - 1.0
    GOOD = "good"           # 0.7 - 0.9
    FAIR = "fair"           # 0.5 - 0.7
    POOR = "poor"           # < 0.5


@dataclass
class TranslationResult:
    """Result of translation"""
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    quality: TranslationQuality
    confidence: float
    preserved_terms: List[str] = field(default_factory=list)
    alternatives: List[str] = field(default_factory=list)
    translator_used: str = "internal"
    timestamp: datetime = field(default_factory=datetime.now)


class Translator:
    """
    Translation service dengan legal terminology preservation
    
    Features:
    - Preserve legal terms (UU, Pasal, etc.)
    - Context-aware translation
    - Translation memory integration
    - Quality scoring
    """
    
    def __init__(self):
        # Legal terms yang tidak ditranslate
        self.protected_terms = self._load_protected_terms()
        
        # Translation dictionaries
        self.dictionaries = self._load_dictionaries()
        
        # AI translation available?
        self.ai_available = False
        try:
            from backend.services.ai_agent import AIAgent
            self.ai_agent = AIAgent()
            self.ai_available = True
        except:
            self.ai_agent = None
    
    def translate(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        preserve_legal_terms: bool = True,
        use_ai: bool = True
    ) -> TranslationResult:
        """
        Translate text dari source_lang ke target_lang
        
        Args:
            text: Text untuk ditranslate
            source_lang: Source language code (id, en, etc.)
            target_lang: Target language code
            preserve_legal_terms: Preserve legal terminology
            use_ai: Use AI for translation (fallback to dictionary)
        
        Returns:
            TranslationResult
        """
        if not text or not text.strip():
            return TranslationResult(
                source_text=text,
                translated_text=text,
                source_lang=source_lang,
                target_lang=target_lang,
                quality=TranslationQuality.POOR,
                confidence=0.0
            )
        
        # If same language, return as-is
        if source_lang == target_lang:
            return TranslationResult(
                source_text=text,
                translated_text=text,
                source_lang=source_lang,
                target_lang=target_lang,
                quality=TranslationQuality.EXCELLENT,
                confidence=1.0
            )
        
        # Extract and protect legal terms
        protected_terms = []
        protected_text = text
        
        if preserve_legal_terms:
            protected_text, protected_terms = self._protect_legal_terms(text)
        
        # Translate
        if use_ai and self.ai_available:
            translated = self._translate_with_ai(protected_text, source_lang, target_lang)
            translator_used = "ai"
        else:
            translated = self._translate_with_dictionary(protected_text, source_lang, target_lang)
            translator_used = "dictionary"
        
        # Restore protected terms
        if preserve_legal_terms:
            translated = self._restore_protected_terms(translated, protected_terms)
        
        # Calculate quality
        quality, confidence = self._assess_quality(text, translated, source_lang, target_lang)
        
        return TranslationResult(
            source_text=text,
            translated_text=translated,
            source_lang=source_lang,
            target_lang=target_lang,
            quality=quality,
            confidence=confidence,
            preserved_terms=protected_terms,
            translator_used=translator_used
        )
    
    def translate_batch(
        self,
        texts: List[str],
        source_lang: str,
        target_lang: str
    ) -> List[TranslationResult]:
        """Translate multiple texts"""
        return [self.translate(text, source_lang, target_lang) for text in texts]
    
    def _protect_legal_terms(self, text: str) -> tuple:
        """
        Extract and replace legal terms dengan placeholders
        
        Returns:
            (protected_text, list of protected terms)
        """
        protected_terms = []
        protected_text = text
        
        for term_pattern in self.protected_terms:
            matches = re.finditer(term_pattern, text, re.IGNORECASE)
            for match in matches:
                term = match.group()
                if term not in protected_terms:
                    protected_terms.append(term)
                    placeholder = f"__LEGAL_TERM_{len(protected_terms)}__"
                    protected_text = protected_text.replace(term, placeholder, 1)
        
        return protected_text, protected_terms
    
    def _restore_protected_terms(self, text: str, protected_terms: List[str]) -> str:
        """Restore protected legal terms"""
        restored = text
        
        for i, term in enumerate(protected_terms, 1):
            placeholder = f"__LEGAL_TERM_{i}__"
            restored = restored.replace(placeholder, term)
        
        return restored
    
    def _translate_with_ai(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate using AI"""
        if not self.ai_agent:
            return self._translate_with_dictionary(text, source_lang, target_lang)
        
        try:
            prompt = f"""Translate the following legal text from {source_lang} to {target_lang}.
Maintain legal terminology and formal tone.
Do not translate legal citations (like UU No. X Tahun XXXX, Pasal X, etc).

Text to translate:
{text}

Translation:"""
            
            response = self.ai_agent.generate(prompt, max_tokens=2000)
            
            if response and response.strip():
                return response.strip()
            
        except Exception as e:
            print(f"AI translation failed: {e}")
        
        # Fallback to dictionary
        return self._translate_with_dictionary(text, source_lang, target_lang)
    
    def _translate_with_dictionary(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate using dictionary (word-by-word)"""
        # Get dictionary
        dict_key = f"{source_lang}_{target_lang}"
        dictionary = self.dictionaries.get(dict_key, {})
        
        if not dictionary:
            # No dictionary available
            return text
        
        # Split into words
        words = text.split()
        translated_words = []
        
        for word in words:
            # Clean word (remove punctuation for lookup)
            clean_word = re.sub(r'[^\w\s]', '', word).lower()
            
            # Lookup in dictionary
            if clean_word in dictionary:
                translated_word = dictionary[clean_word]
                
                # Preserve capitalization
                if word[0].isupper():
                    translated_word = translated_word.capitalize()
                
                # Restore punctuation
                punctuation = re.findall(r'[^\w\s]', word)
                if punctuation:
                    translated_word += ''.join(punctuation)
                
                translated_words.append(translated_word)
            else:
                translated_words.append(word)
        
        return ' '.join(translated_words)
    
    def _assess_quality(
        self,
        source: str,
        translated: str,
        source_lang: str,
        target_lang: str
    ) -> tuple:
        """
        Assess translation quality
        
        Returns:
            (quality, confidence)
        """
        confidence = 0.0
        
        # Factor 1: Length similarity (0.3)
        len_ratio = min(len(translated), len(source)) / max(len(translated), len(source))
        confidence += len_ratio * 0.3
        
        # Factor 2: Not unchanged (0.2)
        if source != translated:
            confidence += 0.2
        
        # Factor 3: Has translation (0.2)
        if translated.strip():
            confidence += 0.2
        
        # Factor 4: Preserved structure (0.3)
        # Count sentences
        source_sentences = len(re.findall(r'[.!?]+', source))
        translated_sentences = len(re.findall(r'[.!?]+', translated))
        
        if source_sentences > 0:
            sentence_ratio = min(translated_sentences, source_sentences) / max(translated_sentences, source_sentences)
            confidence += sentence_ratio * 0.3
        else:
            confidence += 0.3
        
        # Determine quality
        if confidence >= 0.9:
            quality = TranslationQuality.EXCELLENT
        elif confidence >= 0.7:
            quality = TranslationQuality.GOOD
        elif confidence >= 0.5:
            quality = TranslationQuality.FAIR
        else:
            quality = TranslationQuality.POOR
        
        return quality, confidence
    
    def _load_protected_terms(self) -> List[str]:
        """Load legal terms yang harus di-preserve"""
        return [
            # Undang-undang patterns
            r'UU\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
            r'Undang-Undang\s+Nomor\s+\d+\s+Tahun\s+\d{4}',
            
            # Pasal patterns
            r'Pasal\s+\d+[a-z]?',
            r'Ayat\s+\(\d+\)',
            
            # Peraturan patterns
            r'PP\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
            r'Peraturan\s+Pemerintah\s+Nomor\s+\d+\s+Tahun\s+\d{4}',
            r'Perpres\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
            r'Permen\s+\w+\s+No\.?\s*\d+\s+Tahun\s+\d{4}',
            
            # Court decisions
            r'Putusan\s+No\.?\s*[\w/]+',
            r'Mahkamah\s+Agung',
            r'Mahkamah\s+Konstitusi',
            
            # Specific legal terms
            r'\bKUHPerdata\b',
            r'\bKUHPidana\b',
            r'\bKUHP\b',
            r'\bKUHAP\b',
            r'\bKUHD\b',
        ]
    
    def _load_dictionaries(self) -> Dict[str, Dict[str, str]]:
        """Load translation dictionaries"""
        return {
            # Indonesian -> English
            "id_en": {
                # Common words
                "dan": "and",
                "atau": "or",
                "yang": "which",
                "di": "in",
                "ke": "to",
                "dari": "from",
                "untuk": "for",
                "dengan": "with",
                "pada": "on",
                "dalam": "in",
                "adalah": "is",
                "ini": "this",
                "itu": "that",
                "tidak": "not",
                
                # Legal terms
                "hukum": "law",
                "undang-undang": "law",
                "peraturan": "regulation",
                "perjanjian": "agreement",
                "kontrak": "contract",
                "gugatan": "lawsuit",
                "tergugat": "defendant",
                "penggugat": "plaintiff",
                "hakim": "judge",
                "pengadilan": "court",
                "putusan": "verdict",
                "advokat": "lawyer",
                "jaksa": "prosecutor",
                "terdakwa": "accused",
                "saksi": "witness",
                "bukti": "evidence",
                "pelanggaran": "violation",
                "pidana": "criminal",
                "perdata": "civil",
                
                # Legal actions
                "menggugat": "to sue",
                "menuntut": "to prosecute",
                "membela": "to defend",
                "memutuskan": "to decide",
                "mengadili": "to adjudicate",
                "menghukum": "to sentence",
                "membebaskan": "to acquit",
            },
            
            # English -> Indonesian
            "en_id": {
                # Common words
                "and": "dan",
                "or": "atau",
                "which": "yang",
                "in": "di",
                "to": "ke",
                "from": "dari",
                "for": "untuk",
                "with": "dengan",
                "on": "pada",
                "is": "adalah",
                "this": "ini",
                "that": "itu",
                "not": "tidak",
                
                # Legal terms
                "law": "hukum",
                "regulation": "peraturan",
                "agreement": "perjanjian",
                "contract": "kontrak",
                "lawsuit": "gugatan",
                "defendant": "tergugat",
                "plaintiff": "penggugat",
                "judge": "hakim",
                "court": "pengadilan",
                "verdict": "putusan",
                "lawyer": "advokat",
                "attorney": "advokat",
                "prosecutor": "jaksa",
                "accused": "terdakwa",
                "witness": "saksi",
                "evidence": "bukti",
                "violation": "pelanggaran",
                "criminal": "pidana",
                "civil": "perdata",
                
                # Legal actions
                "sue": "menggugat",
                "prosecute": "menuntut",
                "defend": "membela",
                "decide": "memutuskan",
                "adjudicate": "mengadili",
                "sentence": "menghukum",
                "acquit": "membebaskan",
            }
        }
    
    def get_supported_pairs(self) -> List[tuple]:
        """Get supported language pairs"""
        return [
            ("id", "en"),
            ("en", "id"),
            # Add more as dictionaries expand
        ]
    
    def add_to_dictionary(
        self,
        source_lang: str,
        target_lang: str,
        source_word: str,
        target_word: str
    ):
        """Add word pair to dictionary"""
        dict_key = f"{source_lang}_{target_lang}"
        
        if dict_key not in self.dictionaries:
            self.dictionaries[dict_key] = {}
        
        self.dictionaries[dict_key][source_word.lower()] = target_word
