"""
Comprehensive Test Suite for Citation System

Tests untuk semua komponen citation system.
"""

import pytest
import asyncio
from datetime import datetime

from backend.services.citation import (
    get_citation_detector,
    get_citation_linker,
    get_citation_formatter,
    get_citation_tracker,
    get_citation_enhancer,
    CitationType,
    CitationFormat,
    DetectedCitation,
    LinkStatus
)


# ============================================================================
# Test Data
# ============================================================================

SAMPLE_TEXTS = {
    "uu": "Berdasarkan UU No. 13 Tahun 2003 tentang Ketenagakerjaan",
    "pp": "Sesuai PP No. 35 Tahun 2021 tentang PKWT",
    "perpres": "Menurut Perpres No. 82 Tahun 2018",
    "pasal": "Pasal 378 ayat (2) KUHP mengatur tentang penipuan",
    "multiple": "UU No. 13 Tahun 2003, PP No. 35 Tahun 2021, dan Pasal 378 KUHP",
    "complex": """
        Berdasarkan UU No. 13 Tahun 2003 tentang Ketenagakerjaan Pasal 81 ayat (1),
        pekerja/buruh perempuan berhak mendapat istirahat melahirkan. Hal ini diperkuat
        oleh PP No. 35 Tahun 2021 dan Putusan MA No. 123/Pdt/2023.
    """
}


# ============================================================================
# Test Citation Detector
# ============================================================================

class TestCitationDetector:
    """Test Citation Detector functionality"""
    
    @pytest.fixture
    def detector(self):
        """Get detector instance"""
        return get_citation_detector()
    
    def test_detect_uu(self, detector):
        """Test deteksi UU"""
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        
        assert len(citations) > 0
        assert any(c.type == CitationType.UU for c in citations)
        
        uu_citation = next(c for c in citations if c.type == CitationType.UU)
        assert "13" in uu_citation.metadata.get("nomor", "")
        assert "2003" in uu_citation.metadata.get("tahun", "")
        assert uu_citation.confidence > 0.5
    
    def test_detect_pp(self, detector):
        """Test deteksi PP"""
        citations = detector.detect(SAMPLE_TEXTS["pp"])
        
        assert len(citations) > 0
        assert any(c.type == CitationType.PP for c in citations)
    
    def test_detect_pasal(self, detector):
        """Test deteksi Pasal"""
        citations = detector.detect(SAMPLE_TEXTS["pasal"])
        
        pasal_citations = [c for c in citations if c.type == CitationType.PASAL]
        assert len(pasal_citations) > 0
        
        pasal = pasal_citations[0]
        assert "378" in pasal.metadata.get("nomor", "")
        assert "2" in pasal.metadata.get("ayat", "")
    
    def test_detect_multiple(self, detector):
        """Test deteksi multiple citations"""
        citations = detector.detect(SAMPLE_TEXTS["multiple"])
        
        assert len(citations) >= 3
        
        types = {c.type for c in citations}
        assert CitationType.UU in types
        assert CitationType.PP in types
        assert CitationType.PASAL in types or CitationType.KUHP in types
    
    def test_detect_by_type(self, detector):
        """Test deteksi dengan filter type"""
        text = SAMPLE_TEXTS["multiple"]
        
        uu_only = detector.detect_by_type(text, [CitationType.UU])
        assert all(c.type == CitationType.UU for c in uu_only)
        
        pp_only = detector.detect_by_type(text, [CitationType.PP])
        assert all(c.type == CitationType.PP for c in pp_only)
    
    def test_get_citation_count(self, detector):
        """Test count citations by type"""
        counts = detector.get_citation_count(SAMPLE_TEXTS["complex"])
        
        assert CitationType.UU in counts
        assert counts[CitationType.UU] > 0
    
    def test_normalization(self, detector):
        """Test normalisasi citation text"""
        text1 = "UU No 13 Tahun 2003"
        text2 = "UU No. 13 Tahun 2003"
        text3 = "Undang-Undang Nomor 13 Tahun 2003"
        
        citations1 = detector.detect(text1)
        citations2 = detector.detect(text2)
        citations3 = detector.detect(text3)
        
        # Semua harus detect minimal 1 citation
        assert len(citations1) > 0
        assert len(citations2) > 0
        assert len(citations3) > 0
    
    def test_confidence_scoring(self, detector):
        """Test confidence scoring"""
        # Text dengan context yang jelas
        text_with_context = "Berdasarkan UU No. 13 Tahun 2003 tentang Ketenagakerjaan..."
        citations = detector.detect(text_with_context)
        
        # Confidence harus > 0 dan <= 1.0
        for citation in citations:
            assert 0 < citation.confidence <= 1.0


# ============================================================================
# Test Citation Linker
# ============================================================================

class TestCitationLinker:
    """Test Citation Linker functionality"""
    
    @pytest.fixture
    def linker(self):
        """Get linker instance"""
        return get_citation_linker()
    
    @pytest.fixture
    def detector(self):
        """Get detector instance"""
        return get_citation_detector()
    
    @pytest.mark.asyncio
    async def test_link_citation(self, linker, detector):
        """Test link single citation"""
        # Detect citation first
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        assert len(citations) > 0
        
        citation = citations[0]
        
        # Link
        linked = await linker.link_citation(citation)
        
        # Check result
        assert linked is not None
        assert linked.original == citation
        
        # Status should be one of the enum values
        assert linked.status in [
            LinkStatus.LINKED,
            LinkStatus.NOT_FOUND,
            LinkStatus.AMBIGUOUS,
            LinkStatus.INVALID
        ]
        
        if linked.status == LinkStatus.LINKED:
            assert linked.law_id is not None
            assert linked.law_title is not None
    
    @pytest.mark.asyncio
    async def test_link_citations_batch(self, linker, detector):
        """Test link multiple citations in batch"""
        citations = detector.detect(SAMPLE_TEXTS["complex"])
        
        # Link batch
        linked_citations = await linker.link_citations(citations)
        
        assert len(linked_citations) == len(citations)
        
        # Check all processed
        for linked in linked_citations:
            assert linked.status in [
                LinkStatus.LINKED,
                LinkStatus.NOT_FOUND,
                LinkStatus.AMBIGUOUS,
                LinkStatus.INVALID
            ]
    
    @pytest.mark.asyncio
    async def test_get_citation_details(self, linker, detector):
        """Test get full citation details"""
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        linked = await linker.link_citation(citations[0])
        
        if linked.status == LinkStatus.LINKED:
            details = await linker.get_citation_details(linked)
            
            # Check details
            assert "title" in details
            assert "type" in details
    
    @pytest.mark.asyncio
    async def test_link_statistics(self, linker, detector):
        """Test link statistics"""
        citations = detector.detect(SAMPLE_TEXTS["multiple"])
        await linker.link_citations(citations)
        
        stats = linker.get_link_statistics()
        
        assert "total_processed" in stats
        assert "success_rate" in stats
        assert "by_status" in stats


# ============================================================================
# Test Citation Formatter
# ============================================================================

class TestCitationFormatter:
    """Test Citation Formatter functionality"""
    
    @pytest.fixture
    def formatter(self):
        """Get formatter instance"""
        return get_citation_formatter()
    
    @pytest.fixture
    def detector(self):
        """Get detector instance"""
        return get_citation_detector()
    
    @pytest.mark.asyncio
    async def test_format_standard(self, formatter, detector):
        """Test format standard"""
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        citation = citations[0]
        
        formatted = await formatter.format_citation(
            citation,
            CitationFormat.STANDARD
        )
        
        assert formatted.original == citation
        assert formatted.format == CitationFormat.STANDARD
        assert len(formatted.formatted_text) > 0
    
    @pytest.mark.asyncio
    async def test_format_markdown(self, formatter, detector):
        """Test format markdown"""
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        citation = citations[0]
        
        formatted = await formatter.format_citation(
            citation,
            CitationFormat.MARKDOWN
        )
        
        # Should contain markdown link syntax
        text = formatted.formatted_text
        assert "[" in text or "(" in text
    
    @pytest.mark.asyncio
    async def test_format_html(self, formatter, detector):
        """Test format HTML"""
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        citation = citations[0]
        
        formatted = await formatter.format_citation(
            citation,
            CitationFormat.HTML
        )
        
        # Should contain HTML tags
        text = formatted.formatted_text
        assert "<" in text and ">" in text
    
    @pytest.mark.asyncio
    async def test_format_multiple_formats(self, formatter, detector):
        """Test format dengan multiple formats"""
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        
        formats = [
            CitationFormat.STANDARD,
            CitationFormat.MARKDOWN,
            CitationFormat.HTML
        ]
        
        formatted_list = await formatter.format_citations(citations, formats)
        
        # Should have one formatted citation per input
        assert len(formatted_list) == len(citations)
        
        # Each should have multiple formats
        for formatted in formatted_list:
            assert formatted.format in formats
    
    @pytest.mark.asyncio
    async def test_format_bibliography(self, formatter, detector):
        """Test generate bibliography"""
        citations = detector.detect(SAMPLE_TEXTS["complex"])
        
        formatted_citations = await formatter.format_citations(
            citations,
            [CitationFormat.ACADEMIC]
        )
        
        bibliography = formatter.format_bibliography(formatted_citations)
        
        assert "Daftar Referensi" in bibliography or "Bibliography" in bibliography
        assert len(bibliography) > 0


# ============================================================================
# Test Citation Tracker
# ============================================================================

class TestCitationTracker:
    """Test Citation Tracker functionality"""
    
    @pytest.fixture
    def tracker(self):
        """Get tracker instance"""
        return get_citation_tracker()
    
    @pytest.fixture
    def detector(self):
        """Get detector instance"""
        return get_citation_detector()
    
    @pytest.mark.asyncio
    async def test_track_citation(self, tracker, detector):
        """Test track single citation"""
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        citation = citations[0]
        
        # Track
        await tracker.track_citation(
            citation,
            user_id="test_user",
            session_id="test_session"
        )
        
        # Check recorded
        stats = tracker.get_statistics()
        assert stats.total_citations > 0
    
    @pytest.mark.asyncio
    async def test_track_citations_batch(self, tracker, detector):
        """Test track multiple citations"""
        citations = detector.detect(SAMPLE_TEXTS["complex"])
        
        await tracker.track_citations(
            citations,
            user_id="test_user",
            session_id="test_session"
        )
        
        stats = tracker.get_statistics()
        assert stats.total_citations >= len(citations)
    
    @pytest.mark.asyncio
    async def test_get_statistics(self, tracker, detector):
        """Test get statistics"""
        # Track some citations
        citations = detector.detect(SAMPLE_TEXTS["multiple"])
        await tracker.track_citations(citations, user_id="test_user")
        
        # Get stats
        stats = tracker.get_statistics()
        
        assert stats.total_citations > 0
        assert stats.unique_citations > 0
        assert len(stats.by_type) > 0
    
    @pytest.mark.asyncio
    async def test_get_trending(self, tracker, detector):
        """Test get trending citations"""
        # Track multiple times
        citations = detector.detect(SAMPLE_TEXTS["uu"])
        
        for _ in range(5):
            await tracker.track_citations(citations, user_id=f"user_{_}")
        
        # Get trending
        trending = tracker.get_trending_citations(days=7, limit=10)
        
        assert len(trending) > 0
        assert "citation" in trending[0]
        assert "count" in trending[0]
    
    @pytest.mark.asyncio
    async def test_get_user_history(self, tracker, detector):
        """Test get user history"""
        user_id = "test_user_history"
        
        # Track some citations
        citations = detector.detect(SAMPLE_TEXTS["complex"])
        await tracker.track_citations(citations, user_id=user_id)
        
        # Get history
        history = tracker.get_user_history(user_id)
        
        assert len(history) > 0


# ============================================================================
# Test Citation Enhancer (Integration)
# ============================================================================

class TestCitationEnhancer:
    """Test Citation Enhancer (Full Pipeline)"""
    
    @pytest.fixture
    def enhancer(self):
        """Get enhancer instance"""
        return get_citation_enhancer()
    
    @pytest.mark.asyncio
    async def test_enhance_text_simple(self, enhancer):
        """Test enhance simple text"""
        result = await enhancer.enhance_text(
            text=SAMPLE_TEXTS["uu"],
            formats=[CitationFormat.STANDARD, CitationFormat.MARKDOWN]
        )
        
        assert "original_text" in result
        assert "citations" in result
        assert "enhanced_text" in result
        assert "statistics" in result
        
        # Should have detected citations
        assert len(result["citations"]) > 0
        
        # Should have enhanced text in multiple formats
        assert CitationFormat.STANDARD.value in result["enhanced_text"]
        assert CitationFormat.MARKDOWN.value in result["enhanced_text"]
    
    @pytest.mark.asyncio
    async def test_enhance_text_complex(self, enhancer):
        """Test enhance complex text with multiple citations"""
        result = await enhancer.enhance_text(
            text=SAMPLE_TEXTS["complex"],
            formats=[CitationFormat.MARKDOWN, CitationFormat.HTML]
        )
        
        # Should detect multiple citations
        assert len(result["citations"]) >= 3
        
        # Enhanced text should be different from original
        original = result["original_text"]
        enhanced_md = result["enhanced_text"][CitationFormat.MARKDOWN.value]
        
        # Markdown should have links
        assert "[" in enhanced_md or "(" in enhanced_md
    
    @pytest.mark.asyncio
    async def test_extract_and_enhance(self, enhancer):
        """Test convenience method"""
        citations = await enhancer.extract_and_enhance(
            text=SAMPLE_TEXTS["multiple"]
        )
        
        assert len(citations) > 0
        
        # Should have all metadata
        for citation in citations:
            assert "detected" in citation
            assert "linked" in citation
            assert "formatted" in citation
    
    @pytest.mark.asyncio
    async def test_get_citations_from_text(self, enhancer):
        """Test extract citations with linking"""
        citations = await enhancer.get_citations_from_text(
            text=SAMPLE_TEXTS["complex"],
            link=True
        )
        
        assert len(citations) > 0
        
        # With linking
        for citation in citations:
            assert "detected" in citation
            assert "linked" in citation
    
    @pytest.mark.asyncio
    async def test_tracking_enabled(self, enhancer):
        """Test tracking is working"""
        # Clear stats first
        user_id = "test_tracking_user"
        
        # Enhance with tracking
        await enhancer.enhance_text(
            text=SAMPLE_TEXTS["uu"],
            track=True,
            user_id=user_id
        )
        
        # Check stats
        stats = enhancer.get_tracker_statistics()
        assert stats["total_citations"] > 0


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
