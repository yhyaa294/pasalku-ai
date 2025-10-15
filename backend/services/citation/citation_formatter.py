"""
Citation Formatter

Memformat sitasi hukum dengan berbagai style dan output format.
Mendukung format akademik, legal, dan user-friendly.
"""

from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from enum import Enum
import logging

from .citation_detector import DetectedCitation, CitationType
from .citation_linker import LinkedCitation

logger = logging.getLogger(__name__)


class CitationFormat(Enum):
    """Format output sitasi"""
    STANDARD = "standard"  # Format standar Indonesia
    ACADEMIC = "academic"  # Format akademik (footnote)
    LEGAL = "legal"  # Format legal brief
    SHORT = "short"  # Format pendek
    MARKDOWN = "markdown"  # Format Markdown dengan link
    HTML = "html"  # Format HTML dengan hyperlink
    JSON = "json"  # Format JSON (untuk API)


@dataclass
class FormattedCitation:
    """Sitasi yang sudah diformat"""
    original: str  # Text asli
    formatted: str  # Text yang sudah diformat
    format: CitationFormat  # Format yang digunakan
    html: Optional[str] = None  # HTML version (if applicable)
    markdown: Optional[str] = None  # Markdown version (if applicable)
    metadata: Dict[str, Any] = None  # Metadata tambahan
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class CitationFormatter:
    """
    Format sitasi hukum dengan berbagai style.
    
    Mendukung berbagai format output sesuai kebutuhan:
    - Standard: Format resmi Indonesia
    - Academic: Format kutipan akademik
    - Legal: Format legal document
    - Short: Format ringkas
    - Markdown/HTML: Format dengan hyperlink
    """
    
    def __init__(self):
        """Inisialisasi Citation Formatter"""
        logger.info("Citation Formatter initialized")
    
    def format_citation(
        self,
        citation: DetectedCitation,
        format: CitationFormat = CitationFormat.STANDARD,
        linked: Optional[LinkedCitation] = None
    ) -> FormattedCitation:
        """
        Format single citation.
        
        Args:
            citation: Sitasi yang terdeteksi
            format: Format output yang diinginkan
            linked: LinkedCitation (opsional, untuk metadata tambahan)
        
        Returns:
            FormattedCitation
        """
        if format == CitationFormat.STANDARD:
            return self._format_standard(citation, linked)
        elif format == CitationFormat.ACADEMIC:
            return self._format_academic(citation, linked)
        elif format == CitationFormat.LEGAL:
            return self._format_legal(citation, linked)
        elif format == CitationFormat.SHORT:
            return self._format_short(citation, linked)
        elif format == CitationFormat.MARKDOWN:
            return self._format_markdown(citation, linked)
        elif format == CitationFormat.HTML:
            return self._format_html(citation, linked)
        elif format == CitationFormat.JSON:
            return self._format_json(citation, linked)
        else:
            return self._format_standard(citation, linked)
    
    def format_citations(
        self,
        citations: List[DetectedCitation],
        format: CitationFormat = CitationFormat.STANDARD,
        linked_citations: Optional[List[LinkedCitation]] = None
    ) -> List[FormattedCitation]:
        """Format multiple citations"""
        # Map citations ke linked citations
        linked_map = {}
        if linked_citations:
            for linked in linked_citations:
                linked_map[linked.citation.text] = linked
        
        formatted = []
        for citation in citations:
            linked = linked_map.get(citation.text)
            formatted.append(self.format_citation(citation, format, linked))
        
        return formatted
    
    def _format_standard(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation]
    ) -> FormattedCitation:
        """
        Format standard Indonesia.
        
        Contoh:
        - UU No. 13 Tahun 2003 tentang Ketenagakerjaan
        - Pasal 378 KUHP
        - PP No. 35 Tahun 2021 tentang PKWT
        """
        formatted = citation.normalized
        
        # Tambahkan title jika ada
        if linked and linked.law_title:
            # Extract nomor/tahun dari title
            if citation.type in [CitationType.UU, CitationType.PP, CitationType.PERPRES]:
                # Format: "UU No. 13 Tahun 2003 tentang Ketenagakerjaan"
                parts = linked.law_title.split(" tentang ", 1)
                if len(parts) > 1:
                    formatted = f"{citation.normalized} tentang {parts[1]}"
        
        return FormattedCitation(
            original=citation.text,
            formatted=formatted,
            format=CitationFormat.STANDARD,
            metadata={
                "type": citation.type.value,
                "confidence": citation.confidence
            }
        )
    
    def _format_academic(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation]
    ) -> FormattedCitation:
        """
        Format akademik (footnote style).
        
        Contoh:
        - Indonesia, Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan.
        - Kitab Undang-Undang Hukum Pidana [Pasal 378].
        """
        if citation.type == CitationType.UU:
            if linked and linked.law_title:
                formatted = f"Indonesia, {linked.law_title}."
            else:
                formatted = f"Indonesia, {citation.normalized}."
        
        elif citation.type == CitationType.PASAL:
            formatted = f"[{citation.normalized}]"
        
        elif citation.type == CitationType.KUHP:
            formatted = f"Kitab Undang-Undang Hukum Pidana."
        
        elif citation.type == CitationType.PUTUSAN:
            formatted = f"Putusan Pengadilan {citation.normalized}."
        
        else:
            formatted = f"{citation.normalized}."
        
        return FormattedCitation(
            original=citation.text,
            formatted=formatted,
            format=CitationFormat.ACADEMIC,
            metadata={
                "type": citation.type.value,
                "style": "footnote"
            }
        )
    
    def _format_legal(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation]
    ) -> FormattedCitation:
        """
        Format legal document.
        
        Contoh:
        - UU No. 13/2003 (Ketenagakerjaan)
        - Pasal 378 KUHP
        """
        metadata = citation.metadata
        
        if citation.type == CitationType.UU:
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            formatted = f"UU No. {nomor}/{tahun}"
            
            if linked and linked.law_title:
                # Extract short title
                parts = linked.law_title.split(" tentang ", 1)
                if len(parts) > 1:
                    short_title = parts[1][:30]  # Max 30 chars
                    formatted += f" ({short_title})"
        
        elif citation.type == CitationType.PP:
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            formatted = f"PP No. {nomor}/{tahun}"
        
        elif citation.type == CitationType.PASAL:
            formatted = citation.normalized
        
        else:
            formatted = citation.normalized
        
        return FormattedCitation(
            original=citation.text,
            formatted=formatted,
            format=CitationFormat.LEGAL,
            metadata={
                "type": citation.type.value,
                "style": "legal_brief"
            }
        )
    
    def _format_short(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation]
    ) -> FormattedCitation:
        """
        Format pendek/ringkas.
        
        Contoh:
        - UU 13/2003
        - Pasal 378
        - PP 35/2021
        """
        metadata = citation.metadata
        
        if citation.type == CitationType.UU:
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            formatted = f"UU {nomor}/{tahun}"
        
        elif citation.type == CitationType.PP:
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            formatted = f"PP {nomor}/{tahun}"
        
        elif citation.type == CitationType.PERPRES:
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            formatted = f"Perpres {nomor}/{tahun}"
        
        elif citation.type == CitationType.PASAL:
            pasal = metadata.get("pasal", "")
            ayat = metadata.get("ayat")
            if ayat:
                formatted = f"Ps. {pasal}({ayat})"
            else:
                formatted = f"Ps. {pasal}"
        
        else:
            # Try to shorten
            formatted = citation.normalized[:50]
        
        return FormattedCitation(
            original=citation.text,
            formatted=formatted,
            format=CitationFormat.SHORT,
            metadata={
                "type": citation.type.value,
                "style": "short"
            }
        )
    
    def _format_markdown(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation]
    ) -> FormattedCitation:
        """
        Format Markdown dengan link.
        
        Contoh:
        - [UU No. 13 Tahun 2003](https://...)
        - [Pasal 378 KUHP](#pasal-378)
        """
        formatted = citation.normalized
        
        # Jika ada link, buat markdown link
        if linked and linked.law_url:
            formatted = f"[{citation.normalized}]({linked.law_url})"
            
            # Tambahkan tooltip jika ada summary
            if linked.law_summary:
                formatted = f"[{citation.normalized}]({linked.law_url} \"{linked.law_summary}\")"
        else:
            # No link, but still format as bold
            formatted = f"**{citation.normalized}**"
        
        return FormattedCitation(
            original=citation.text,
            formatted=formatted,
            format=CitationFormat.MARKDOWN,
            markdown=formatted,
            metadata={
                "type": citation.type.value,
                "has_link": linked is not None and linked.law_url is not None
            }
        )
    
    def _format_html(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation]
    ) -> FormattedCitation:
        """
        Format HTML dengan hyperlink dan tooltip.
        
        Contoh:
        - <a href="..." title="...">UU No. 13 Tahun 2003</a>
        """
        formatted = citation.normalized
        html = None
        
        if linked and linked.law_url:
            # Buat HTML link dengan tooltip
            title = ""
            if linked.law_summary:
                title = f' title="{linked.law_summary}"'
            
            html = f'<a href="{linked.law_url}" class="citation-link"{title}>{citation.normalized}</a>'
            formatted = html
        else:
            # No link, use span dengan class
            html = f'<span class="citation citation-{citation.type.value}">{citation.normalized}</span>'
            formatted = html
        
        return FormattedCitation(
            original=citation.text,
            formatted=formatted,
            format=CitationFormat.HTML,
            html=html,
            metadata={
                "type": citation.type.value,
                "has_link": linked is not None and linked.law_url is not None
            }
        )
    
    def _format_json(
        self,
        citation: DetectedCitation,
        linked: Optional[LinkedCitation]
    ) -> FormattedCitation:
        """
        Format JSON untuk API response.
        """
        data = {
            "text": citation.text,
            "normalized": citation.normalized,
            "type": citation.type.value,
            "confidence": citation.confidence,
            "metadata": citation.metadata
        }
        
        if linked:
            data["linked"] = {
                "status": linked.status.value,
                "law_id": linked.law_id,
                "law_title": linked.law_title,
                "law_url": linked.law_url,
                "law_summary": linked.law_summary,
                "confidence": linked.confidence
            }
        
        import json
        formatted = json.dumps(data, ensure_ascii=False, indent=2)
        
        return FormattedCitation(
            original=citation.text,
            formatted=formatted,
            format=CitationFormat.JSON,
            metadata=data
        )
    
    def format_bibliography(
        self,
        citations: List[DetectedCitation],
        linked_citations: Optional[List[LinkedCitation]] = None
    ) -> str:
        """
        Buat daftar pustaka dari citations.
        
        Returns:
            String formatted bibliography
        """
        # Map linked citations
        linked_map = {}
        if linked_citations:
            for linked in linked_citations:
                linked_map[linked.citation.text] = linked
        
        # Group by type
        by_type = {}
        for citation in citations:
            if citation.type not in by_type:
                by_type[citation.type] = []
            by_type[citation.type].append(citation)
        
        # Build bibliography
        bibliography = "# DAFTAR PUSTAKA\n\n"
        
        # UU section
        if CitationType.UU in by_type:
            bibliography += "## Undang-Undang\n"
            for citation in by_type[CitationType.UU]:
                linked = linked_map.get(citation.text)
                formatted = self._format_academic(citation, linked)
                bibliography += f"- {formatted.formatted}\n"
            bibliography += "\n"
        
        # PP section
        if CitationType.PP in by_type:
            bibliography += "## Peraturan Pemerintah\n"
            for citation in by_type[CitationType.PP]:
                linked = linked_map.get(citation.text)
                formatted = self._format_academic(citation, linked)
                bibliography += f"- {formatted.formatted}\n"
            bibliography += "\n"
        
        # Putusan section
        if CitationType.PUTUSAN in by_type:
            bibliography += "## Putusan Pengadilan\n"
            for citation in by_type[CitationType.PUTUSAN]:
                linked = linked_map.get(citation.text)
                formatted = self._format_academic(citation, linked)
                bibliography += f"- {formatted.formatted}\n"
            bibliography += "\n"
        
        return bibliography


# Singleton instance
_citation_formatter: Optional[CitationFormatter] = None


def get_citation_formatter() -> CitationFormatter:
    """Get atau buat Citation Formatter instance"""
    global _citation_formatter
    
    if _citation_formatter is None:
        _citation_formatter = CitationFormatter()
    
    return _citation_formatter
