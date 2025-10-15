"""
Citation Enhancer

Komponen utama yang menggabungkan semua fitur citation system.
Mendeteksi, link, format, dan track sitasi secara otomatis.
"""

import asyncio
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
import logging

from .citation_detector import CitationDetector, get_citation_detector, DetectedCitation
from .citation_linker import CitationLinker, get_citation_linker, LinkedCitation
from .citation_formatter import CitationFormatter, get_citation_formatter, CitationFormat, FormattedCitation
from .citation_tracker import CitationTracker, get_citation_tracker

logger = logging.getLogger(__name__)


@dataclass
class EnhancedCitation:
    """
    Sitasi yang sudah di-enhance lengkap dengan:
    - Detection metadata
    - Link ke database
    - Formatted output
    - Tracking info
    """
    detected: DetectedCitation  # Sitasi yang terdeteksi
    linked: Optional[LinkedCitation] = None  # Link ke database
    formatted: Dict[str, FormattedCitation] = field(default_factory=dict)  # Formatted versions
    tracked: bool = False  # Apakah sudah di-track
    
    def get_formatted(self, format: CitationFormat) -> Optional[FormattedCitation]:
        """Get formatted version"""
        return self.formatted.get(format.value)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert ke dictionary untuk API response"""
        result = {
            "text": self.detected.text,
            "type": self.detected.type.value,
            "normalized": self.detected.normalized,
            "confidence": self.detected.confidence,
            "position": {
                "start": self.detected.start_pos,
                "end": self.detected.end_pos
            },
            "metadata": self.detected.metadata
        }
        
        # Add linked info
        if self.linked:
            result["linked"] = {
                "status": self.linked.status.value,
                "law_id": self.linked.law_id,
                "law_title": self.linked.law_title,
                "law_url": self.linked.law_url,
                "law_summary": self.linked.law_summary,
                "confidence": self.linked.confidence
            }
        
        # Add formatted versions
        if self.formatted:
            result["formatted"] = {
                format_name: fmt.formatted
                for format_name, fmt in self.formatted.items()
            }
        
        return result


class CitationEnhancer:
    """
    Komponen utama Citation System yang menggabungkan semua fitur.
    
    Pipeline:
    1. Detect - Deteksi sitasi dalam teks
    2. Link - Hubungkan dengan Knowledge Graph
    3. Format - Format dengan berbagai style
    4. Track - Simpan ke tracking system
    5. Enhance - Tambahkan metadata dan link
    
    Usage:
        enhancer = CitationEnhancer()
        result = await enhancer.enhance_text(
            "Berdasarkan UU No 13 Tahun 2003 dan Pasal 378 KUHP..."
        )
    """
    
    def __init__(self):
        """Inisialisasi Citation Enhancer"""
        self.detector = get_citation_detector()
        self.linker = get_citation_linker()
        self.formatter = get_citation_formatter()
        self.tracker = get_citation_tracker()
        
        logger.info("Citation Enhancer initialized")
    
    async def enhance_text(
        self,
        text: str,
        formats: Optional[List[CitationFormat]] = None,
        track: bool = True,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        source: str = "api"
    ) -> Dict[str, Any]:
        """
        Enhance text dengan mendeteksi dan memproses semua sitasi.
        
        Args:
            text: Teks yang akan diproses
            formats: List format output yang diinginkan (default: STANDARD, MARKDOWN, HTML)
            track: Apakah mau di-track (default: True)
            user_id: ID user (untuk tracking)
            session_id: ID session (untuk tracking)
            source: Sumber penggunaan (untuk tracking)
        
        Returns:
            Dictionary dengan hasil enhancement:
            {
                "original_text": "...",
                "citations": [...],
                "enhanced_text": {
                    "standard": "...",
                    "markdown": "...",
                    "html": "..."
                },
                "statistics": {...}
            }
        """
        # Default formats
        if formats is None:
            formats = [CitationFormat.STANDARD, CitationFormat.MARKDOWN, CitationFormat.HTML]
        
        # 1. Detect citations
        detected_citations = self.detector.detect(text)
        
        if not detected_citations:
            return {
                "original_text": text,
                "citations": [],
                "enhanced_text": {fmt.value: text for fmt in formats},
                "statistics": {
                    "total_citations": 0,
                    "linked_citations": 0,
                    "citation_types": {}
                }
            }
        
        # 2. Link citations (parallel)
        linked_citations = await self.linker.link_citations(detected_citations)
        
        # 3. Format citations
        enhanced_citations = []
        for i, detected in enumerate(detected_citations):
            linked = linked_citations[i]
            
            # Format dengan semua format yang diminta
            formatted = {}
            for fmt in formats:
                formatted[fmt.value] = self.formatter.format_citation(detected, fmt, linked)
            
            enhanced = EnhancedCitation(
                detected=detected,
                linked=linked,
                formatted=formatted
            )
            enhanced_citations.append(enhanced)
        
        # 4. Track citations (jika diminta)
        if track:
            self.tracker.track_citations(
                citations=detected_citations,
                linked_citations=linked_citations,
                context=text[:200],  # First 200 chars
                user_id=user_id,
                session_id=session_id,
                source=source
            )
            for citation in enhanced_citations:
                citation.tracked = True
        
        # 5. Generate enhanced text versions
        enhanced_text = {}
        for fmt in formats:
            enhanced_text[fmt.value] = self._replace_citations_in_text(
                text=text,
                citations=enhanced_citations,
                format=fmt
            )
        
        # 6. Generate statistics
        statistics = self._generate_statistics(detected_citations, linked_citations)
        
        return {
            "original_text": text,
            "citations": [c.to_dict() for c in enhanced_citations],
            "enhanced_text": enhanced_text,
            "statistics": statistics
        }
    
    async def enhance_citations(
        self,
        citations: List[DetectedCitation],
        formats: Optional[List[CitationFormat]] = None,
        track: bool = True,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> List[EnhancedCitation]:
        """
        Enhance list of citations (tanpa text context).
        
        Args:
            citations: List DetectedCitation
            formats: Format output yang diinginkan
            track: Apakah mau di-track
            user_id: ID user
            session_id: ID session
        
        Returns:
            List EnhancedCitation
        """
        if formats is None:
            formats = [CitationFormat.STANDARD, CitationFormat.MARKDOWN]
        
        # Link citations
        linked_citations = await self.linker.link_citations(citations)
        
        # Format and enhance
        enhanced_citations = []
        for i, detected in enumerate(citations):
            linked = linked_citations[i]
            
            formatted = {}
            for fmt in formats:
                formatted[fmt.value] = self.formatter.format_citation(detected, fmt, linked)
            
            enhanced = EnhancedCitation(
                detected=detected,
                linked=linked,
                formatted=formatted
            )
            enhanced_citations.append(enhanced)
        
        # Track if requested
        if track:
            self.tracker.track_citations(
                citations=citations,
                linked_citations=linked_citations,
                user_id=user_id,
                session_id=session_id
            )
        
        return enhanced_citations
    
    def _replace_citations_in_text(
        self,
        text: str,
        citations: List[EnhancedCitation],
        format: CitationFormat
    ) -> str:
        """
        Replace citations dalam text dengan formatted version.
        
        Args:
            text: Original text
            citations: List EnhancedCitation
            format: Format yang digunakan
        
        Returns:
            Enhanced text
        """
        # Sort citations by position (reverse, agar tidak mengacaukan posisi)
        sorted_citations = sorted(
            citations,
            key=lambda c: c.detected.start_pos,
            reverse=True
        )
        
        enhanced_text = text
        
        for citation in sorted_citations:
            formatted = citation.get_formatted(format)
            if formatted:
                # Replace original text dengan formatted version
                start = citation.detected.start_pos
                end = citation.detected.end_pos
                
                enhanced_text = (
                    enhanced_text[:start] +
                    formatted.formatted +
                    enhanced_text[end:]
                )
        
        return enhanced_text
    
    def _generate_statistics(
        self,
        detected: List[DetectedCitation],
        linked: List[LinkedCitation]
    ) -> Dict[str, Any]:
        """Generate statistik dari citations"""
        total = len(detected)
        linked_count = sum(1 for l in linked if l.is_linked())
        
        # By type
        by_type = {}
        for citation in detected:
            type_name = citation.type.value
            by_type[type_name] = by_type.get(type_name, 0) + 1
        
        # Unique laws
        unique_laws = len(set(l.law_id for l in linked if l.law_id))
        
        # Average confidence
        avg_detect_conf = sum(c.confidence for c in detected) / total if total > 0 else 0.0
        avg_link_conf = sum(l.confidence for l in linked if l.is_linked()) / linked_count if linked_count > 0 else 0.0
        
        return {
            "total_citations": total,
            "linked_citations": linked_count,
            "link_rate": linked_count / total if total > 0 else 0.0,
            "unique_laws": unique_laws,
            "citation_types": by_type,
            "average_detection_confidence": avg_detect_conf,
            "average_linking_confidence": avg_link_conf
        }
    
    async def extract_and_enhance(
        self,
        text: str,
        output_format: CitationFormat = CitationFormat.MARKDOWN
    ) -> str:
        """
        Convenience method: Extract citations dan return enhanced text.
        
        Args:
            text: Original text
            output_format: Format output
        
        Returns:
            Enhanced text dengan citations di-format
        """
        result = await self.enhance_text(
            text=text,
            formats=[output_format],
            track=False
        )
        
        return result["enhanced_text"][output_format.value]
    
    async def get_citations_from_text(
        self,
        text: str,
        link: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Extract dan return list citations dalam format dict.
        
        Args:
            text: Text untuk dianalisis
            link: Apakah mau di-link dengan database
        
        Returns:
            List citations
        """
        detected = self.detector.detect(text)
        
        if not link:
            return [
                {
                    "text": c.text,
                    "type": c.type.value,
                    "normalized": c.normalized,
                    "confidence": c.confidence,
                    "metadata": c.metadata
                }
                for c in detected
            ]
        
        # With linking
        linked = await self.linker.link_citations(detected)
        
        return [
            {
                "text": d.text,
                "type": d.type.value,
                "normalized": d.normalized,
                "confidence": d.confidence,
                "metadata": d.metadata,
                "linked": {
                    "status": l.status.value,
                    "law_id": l.law_id,
                    "law_title": l.law_title,
                    "confidence": l.confidence
                } if l else None
            }
            for d, l in zip(detected, linked)
        ]
    
    def get_tracker_statistics(
        self,
        time_range_days: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Get statistics dari tracker.
        
        Args:
            time_range_days: Range waktu dalam hari (None = all time)
        
        Returns:
            Dictionary dengan statistik
        """
        from datetime import timedelta
        
        time_range = timedelta(days=time_range_days) if time_range_days else None
        stats = self.tracker.get_statistics(time_range=time_range)
        
        return {
            "total_citations": stats.total_citations,
            "unique_citations": stats.unique_citations,
            "total_laws": stats.total_laws,
            "by_type": stats.by_type,
            "top_citations": stats.top_citations,
            "top_laws": stats.top_laws,
            "time_range": stats.time_range
        }
    
    def get_trending_citations(
        self,
        days: int = 7,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get citations yang sedang trending"""
        from datetime import timedelta
        
        return self.tracker.get_trending_citations(
            time_range=timedelta(days=days),
            limit=limit
        )


# Singleton instance
_citation_enhancer: Optional[CitationEnhancer] = None


def get_citation_enhancer() -> CitationEnhancer:
    """Get atau buat Citation Enhancer instance"""
    global _citation_enhancer
    
    if _citation_enhancer is None:
        _citation_enhancer = CitationEnhancer()
    
    return _citation_enhancer
