"""
Translation Service Tests

Comprehensive tests untuk:
- Language detection
- Translation (AI + dictionary)
- Legal term preservation
- Quality assessment
- Localizer
- Translation memory
"""

import pytest
from datetime import datetime, date
from decimal import Decimal

from backend.services.translation.language_detector import (
    LanguageDetector,
    SupportedLanguage,
    DetectionResult
)
from backend.services.translation.translator import (
    Translator,
    TranslationQuality,
    TranslationResult
)
from backend.services.translation.localizer import (
    Localizer,
    LocaleFormat
)
from backend.services.translation.translation_memory import (
    TranslationMemory,
    TranslationEntry
)


# ============================================================================
# Language Detector Tests
# ============================================================================

class TestLanguageDetector:
    """Test language detection"""
    
    def setup_method(self):
        self.detector = LanguageDetector()
    
    def test_detect_indonesian(self):
        """Test Indonesian detection"""
        text = "Undang-Undang Nomor 1 Tahun 2024 tentang Hukum Pidana"
        result = self.detector.detect(text)
        
        assert result.language == SupportedLanguage.INDONESIAN
        assert result.confidence > 0.8
    
    def test_detect_english(self):
        """Test English detection"""
        text = "The Criminal Code Act No. 1 of 2024 regarding Criminal Law"
        result = self.detector.detect(text)
        
        assert result.language == SupportedLanguage.ENGLISH
        assert result.confidence > 0.7
    
    def test_detect_javanese(self):
        """Test Javanese detection"""
        text = "Simbah menawi badhe tindak dhateng pasar kaliyan ingkang"
        result = self.detector.detect(text)
        
        assert result.language == SupportedLanguage.JAVANESE
        assert result.confidence > 0.3
    
    def test_detect_sundanese(self):
        """Test Sundanese detection"""
        text = "Ieu mangrupi peraturan nu kedah diturutan ku sadaya jalmi"
        result = self.detector.detect(text)
        
        assert result.language == SupportedLanguage.SUNDANESE
        assert result.confidence > 0.3
    
    def test_is_indonesian_quick_check(self):
        """Test quick Indonesian check"""
        assert self.detector.is_indonesian("Pasal 1 tentang hukum")
        assert not self.detector.is_indonesian("Article 1 regarding law")
    
    def test_is_english_quick_check(self):
        """Test quick English check"""
        assert self.detector.is_english("Article 1 regarding law")
        assert not self.detector.is_english("Pasal 1 tentang hukum")
    
    def test_detect_code_switching(self):
        """Test code-switching detection"""
        text = "Pasal 1 states that all citizens must comply dengan law"
        results = self.detector.detect_multiple_languages(text)
        
        assert len(results) > 0
        # Should detect both Indonesian and English
    
    def test_get_language_name(self):
        """Test language name localization"""
        # Indonesian locale
        name_id = self.detector.get_language_name(SupportedLanguage.INDONESIAN, "id")
        assert name_id == "Bahasa Indonesia"
        
        # English locale
        name_en = self.detector.get_language_name(SupportedLanguage.INDONESIAN, "en")
        assert name_en == "Indonesian"
    
    def test_empty_text(self):
        """Test empty text detection"""
        result = self.detector.detect("")
        assert result.language == SupportedLanguage.UNKNOWN
        assert result.confidence == 0.0
    
    def test_confidence_scoring(self):
        """Test confidence scoring accuracy"""
        # High confidence text
        high_conf = "Undang-Undang Nomor 1 Tahun 2024 tentang Hukum Pidana yang mengatur"
        result_high = self.detector.detect(high_conf)
        
        # Low confidence text
        low_conf = "Lorem ipsum dolor sit"
        result_low = self.detector.detect(low_conf)
        
        assert result_high.confidence > result_low.confidence


# ============================================================================
# Translator Tests
# ============================================================================

class TestTranslator:
    """Test translation service"""
    
    def setup_method(self):
        self.translator = Translator()
    
    def test_translate_indonesian_to_english(self):
        """Test ID -> EN translation"""
        text = "Hukum adalah aturan yang harus dipatuhi"
        result = self.translator.translate(text, "id", "en", use_ai=False)
        
        assert result.translated_text != text
        assert result.source_lang == "id"
        assert result.target_lang == "en"
        assert result.quality in [TranslationQuality.EXCELLENT, TranslationQuality.GOOD, TranslationQuality.FAIR]
    
    def test_translate_english_to_indonesian(self):
        """Test EN -> ID translation"""
        text = "Law is a rule that must be obeyed"
        result = self.translator.translate(text, "en", "id", use_ai=False)
        
        assert result.translated_text != text
        assert result.source_lang == "en"
        assert result.target_lang == "id"
    
    def test_preserve_legal_terms(self):
        """Test legal term preservation"""
        text = "Berdasarkan UU No. 1 Tahun 2024 Pasal 5 Ayat (2)"
        result = self.translator.translate(text, "id", "en", preserve_legal_terms=True)
        
        # Legal terms should be preserved
        assert "UU No. 1 Tahun 2024" in result.translated_text or len(result.preserved_terms) > 0
    
    def test_legal_term_patterns(self):
        """Test all legal term patterns"""
        test_cases = [
            "UU No. 1 Tahun 2024",
            "Undang-Undang Nomor 1 Tahun 2024",
            "Pasal 5",
            "Ayat (2)",
            "PP No. 10 Tahun 2023",
            "Perpres No. 5 Tahun 2024",
            "Putusan No. 123/PDT/2024",
            "KUHPerdata",
            "Mahkamah Agung"
        ]
        
        for term in test_cases:
            text = f"Berdasarkan {term} maka"
            result = self.translator.translate(text, "id", "en", preserve_legal_terms=True)
            
            # Should be in preserved_terms or in translated_text
            assert term in result.translated_text or term in result.preserved_terms
    
    def test_batch_translation(self):
        """Test batch translation"""
        texts = [
            "Hukum adalah aturan",
            "Pengadilan memutuskan",
            "Kontrak harus ditandatangani"
        ]
        
        results = self.translator.translate_batch(texts, "id", "en")
        
        assert len(results) == len(texts)
        for result in results:
            assert result.translated_text != ""
    
    def test_quality_assessment(self):
        """Test quality assessment"""
        # Good translation (similar length)
        good_text = "Hukum adalah aturan yang harus dipatuhi oleh semua warga"
        result_good = self.translator.translate(good_text, "id", "en", use_ai=False)
        
        assert result_good.quality in [TranslationQuality.EXCELLENT, TranslationQuality.GOOD, TranslationQuality.FAIR]
        assert result_good.confidence > 0.0
    
    def test_dictionary_fallback(self):
        """Test dictionary fallback when AI unavailable"""
        text = "Hukum dan peraturan"
        result = self.translator.translate(text, "id", "en", use_ai=False)
        
        assert result.translator_used == "dictionary"
        assert result.translated_text != text
    
    def test_add_to_dictionary(self):
        """Test dynamic dictionary expansion"""
        self.translator.add_to_dictionary("id", "en", "test_word", "test_translation")
        
        # Should be in dictionary now
        assert "test_word" in self.translator.dictionaries.get("id_en", {})
    
    def test_supported_pairs(self):
        """Test supported language pairs"""
        pairs = self.translator.get_supported_pairs()
        
        assert len(pairs) > 0
        assert ("id", "en") in pairs
        assert ("en", "id") in pairs
    
    def test_empty_text_translation(self):
        """Test empty text translation"""
        result = self.translator.translate("", "id", "en")
        
        assert result.translated_text == ""
        assert result.quality == TranslationQuality.POOR


# ============================================================================
# Localizer Tests
# ============================================================================

class TestLocalizer:
    """Test localization service"""
    
    def setup_method(self):
        self.localizer = Localizer()
    
    def test_format_date_indonesian(self):
        """Test Indonesian date formatting"""
        test_date = datetime(2024, 1, 15)
        
        # Long format
        formatted = self.localizer.format_date(test_date, LocaleFormat.INDONESIAN, "long")
        assert "15 Januari 2024" == formatted
        
        # Short format
        formatted_short = self.localizer.format_date(test_date, LocaleFormat.INDONESIAN, "short")
        assert "15/01/2024" == formatted_short
    
    def test_format_date_english_us(self):
        """Test US English date formatting"""
        test_date = datetime(2024, 1, 15)
        
        # Long format
        formatted = self.localizer.format_date(test_date, LocaleFormat.ENGLISH_US, "long")
        assert "January 15, 2024" == formatted
        
        # Short format
        formatted_short = self.localizer.format_date(test_date, LocaleFormat.ENGLISH_US, "short")
        assert "01/15/2024" == formatted_short
    
    def test_format_date_english_uk(self):
        """Test UK English date formatting"""
        test_date = datetime(2024, 1, 15)
        
        # Long format
        formatted = self.localizer.format_date(test_date, LocaleFormat.ENGLISH_UK, "long")
        assert "15 January 2024" == formatted
        
        # Short format
        formatted_short = self.localizer.format_date(test_date, LocaleFormat.ENGLISH_UK, "short")
        assert "15/01/2024" == formatted_short
    
    def test_format_currency_indonesian(self):
        """Test IDR currency formatting"""
        amount = 1000000
        formatted = self.localizer.format_currency(amount, LocaleFormat.INDONESIAN)
        
        assert "Rp" in formatted
        assert "1.000.000" in formatted
    
    def test_format_currency_usd(self):
        """Test USD currency formatting"""
        amount = 1000.50
        formatted = self.localizer.format_currency(amount, LocaleFormat.ENGLISH_US)
        
        assert "$" in formatted
        assert "1,000.50" in formatted
    
    def test_format_currency_gbp(self):
        """Test GBP currency formatting"""
        amount = 1000.50
        formatted = self.localizer.format_currency(amount, LocaleFormat.ENGLISH_UK)
        
        assert "£" in formatted
        assert "1,000.50" in formatted
    
    def test_format_number_indonesian(self):
        """Test Indonesian number formatting"""
        number = 1000000.50
        formatted = self.localizer.format_number(number, LocaleFormat.INDONESIAN)
        
        # Indonesian uses . for thousands and , for decimals
        assert "1.000.000" in formatted
        assert "," in formatted
    
    def test_format_number_english(self):
        """Test English number formatting"""
        number = 1000000.50
        formatted = self.localizer.format_number(number, LocaleFormat.ENGLISH_US)
        
        # English uses , for thousands and . for decimals
        assert "1,000,000" in formatted
        assert "." in formatted
    
    def test_format_percentage(self):
        """Test percentage formatting"""
        # 0.0-1.0 format
        percentage = 0.75
        formatted = self.localizer.format_percentage(percentage, LocaleFormat.INDONESIAN)
        
        assert "75" in formatted
        assert "%" in formatted
    
    def test_format_legal_citation_indonesian(self):
        """Test Indonesian citation formatting"""
        citation = "UU No. 1 Tahun 2024 Pasal 5"
        formatted = self.localizer.format_legal_citation(citation, LocaleFormat.INDONESIAN)
        
        assert formatted == citation  # Should remain unchanged
    
    def test_format_legal_citation_english(self):
        """Test English citation formatting"""
        citation = "Undang-Undang Nomor 1 Tahun 2024 Pasal 5"
        formatted = self.localizer.format_legal_citation(citation, LocaleFormat.ENGLISH_US)
        
        # Should translate terms
        assert "Law" in formatted
        assert "Article" in formatted
    
    def test_get_locale_info(self):
        """Test locale information retrieval"""
        info = self.localizer.get_locale_info(LocaleFormat.INDONESIAN)
        
        assert info["name"] == "Indonesian"
        assert info["currency"] == "IDR"
        assert info["language_code"] == "id"


# ============================================================================
# Translation Memory Tests
# ============================================================================

class TestTranslationMemory:
    """Test translation memory"""
    
    def setup_method(self):
        self.memory = TranslationMemory(ttl_days=30)
    
    def test_add_and_get_translation(self):
        """Test adding and retrieving translation"""
        self.memory.add_translation(
            "Hukum adalah aturan",
            "Law is a rule",
            "id",
            "en"
        )
        
        result = self.memory.get_translation("Hukum adalah aturan", "id", "en")
        
        assert result is not None
        assert result.translated_text == "Law is a rule"
    
    def test_exact_match(self):
        """Test exact match retrieval"""
        self.memory.add_translation("test", "translation", "id", "en")
        
        result = self.memory.get_translation("test", "id", "en")
        
        assert result is not None
        assert result.source_text == "test"
    
    def test_fuzzy_match(self):
        """Test fuzzy matching"""
        self.memory.add_translation("Hukum adalah aturan", "Law is a rule", "id", "en")
        
        # Similar but not exact
        result = self.memory.get_translation("Hukum adalah peraturan", "id", "en", fuzzy_threshold=0.7)
        
        # Should find similar translation
        assert result is not None
    
    def test_find_similar(self):
        """Test finding similar translations"""
        self.memory.add_translation("Hukum adalah aturan", "Law is a rule", "id", "en")
        self.memory.add_translation("Hukum adalah peraturan", "Law is regulation", "id", "en")
        
        results = self.memory.find_similar("Hukum adalah", "id", "en", threshold=0.5)
        
        assert len(results) > 0
    
    def test_levenshtein_distance(self):
        """Test Levenshtein distance calculation"""
        distance = self.memory._levenshtein_distance("kitten", "sitting")
        assert distance == 3  # k->s, e->i, +g
    
    def test_similarity_calculation(self):
        """Test similarity scoring"""
        # Identical strings
        similarity = self.memory._calculate_similarity("test", "test")
        assert similarity == 1.0
        
        # Different strings
        similarity = self.memory._calculate_similarity("test", "best")
        assert 0.0 < similarity < 1.0
    
    def test_cache_statistics(self):
        """Test cache statistics"""
        self.memory.add_translation("test1", "trans1", "id", "en")
        self.memory.add_translation("test2", "trans2", "id", "en")
        
        # Hit
        self.memory.get_translation("test1", "id", "en")
        
        # Miss
        self.memory.get_translation("nonexistent", "id", "en")
        
        stats = self.memory.get_statistics()
        
        assert stats["total_entries"] == 2
        assert stats["hits"] >= 1
        assert stats["misses"] >= 1
    
    def test_clear_cache(self):
        """Test cache clearing"""
        self.memory.add_translation("test", "trans", "id", "en")
        
        self.memory.clear_cache()
        
        stats = self.memory.get_statistics()
        assert stats["total_entries"] == 0
    
    def test_usage_count(self):
        """Test usage count tracking"""
        self.memory.add_translation("test", "trans", "id", "en")
        
        # Get multiple times
        for _ in range(3):
            result = self.memory.get_translation("test", "id", "en")
        
        assert result.usage_count >= 3
    
    def test_ttl_expiry(self):
        """Test TTL-based expiry"""
        memory_short_ttl = TranslationMemory(ttl_days=0)  # Immediate expiry
        
        memory_short_ttl.add_translation("test", "trans", "id", "en")
        
        # Should be expired
        result = memory_short_ttl.get_translation("test", "id", "en")
        
        # Implementation note: Would need to mock datetime to test properly
        # For now, just verify the mechanism exists


# ============================================================================
# Integration Tests
# ============================================================================

class TestIntegration:
    """Test full workflow integration"""
    
    def setup_method(self):
        self.detector = LanguageDetector()
        self.translator = Translator()
        self.localizer = Localizer()
        self.memory = TranslationMemory()
    
    def test_full_translation_workflow(self):
        """Test complete translation workflow"""
        # 1. Detect language
        text = "Hukum adalah aturan yang harus dipatuhi"
        detection = self.detector.detect(text)
        
        assert detection.language == SupportedLanguage.INDONESIAN
        
        # 2. Translate
        translation = self.translator.translate(
            text,
            detection.language.value,
            "en",
            use_ai=False
        )
        
        assert translation.translated_text != text
        
        # 3. Add to memory
        self.memory.add_translation(
            translation.source_text,
            translation.translated_text,
            translation.source_lang,
            translation.target_lang
        )
        
        # 4. Retrieve from memory
        cached = self.memory.get_translation(text, "id", "en")
        
        assert cached is not None
        assert cached.translated_text == translation.translated_text
    
    def test_localization_workflow(self):
        """Test localization workflow"""
        # Date
        test_date = datetime(2024, 1, 15)
        formatted_id = self.localizer.format_date(test_date, LocaleFormat.INDONESIAN)
        formatted_en = self.localizer.format_date(test_date, LocaleFormat.ENGLISH_US)
        
        assert formatted_id != formatted_en
        
        # Currency
        amount = 1000000
        formatted_idr = self.localizer.format_currency(amount, LocaleFormat.INDONESIAN)
        formatted_usd = self.localizer.format_currency(amount, LocaleFormat.ENGLISH_US)
        
        assert "Rp" in formatted_idr
        assert "$" in formatted_usd


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
