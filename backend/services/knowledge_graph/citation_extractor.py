"""
Citation Extractor

Extracts legal citations from AI responses and text.
Matches citations with documents in Knowledge Graph.
"""

import re
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
import logging

from services.knowledge_graph.search_engine import (
    KnowledgeGraphSearchEngine,
    CitationInfo
)


logger = logging.getLogger(__name__)


@dataclass
class ExtractedCitation:
    """Citation extracted from text"""
    raw_text: str  # Original citation text
    citation_type: str  # "law", "regulation", "article", "court_case", "pasal"
    matched_document: Optional[CitationInfo] = None
    confidence: float = 0.0
    start_pos: int = 0
    end_pos: int = 0


class CitationExtractor:
    """
    Extracts and validates legal citations from text.
    
    Supports Indonesian legal citation formats:
    - UU No. X Tahun YYYY
    - Pasal X UU No. Y Tahun Z
    - Peraturan Pemerintah No. X Tahun YYYY
    - Putusan MA/PN/PT No. XXX/XXX/YYYY
    - KUH Pidana/Perdata Pasal X
    """
    
    # Citation regex patterns
    PATTERNS = {
        "law": [
            r"UU\s+(?:No\.?\s*)?(\d+)\s+Tahun\s+(\d{4})",
            r"Undang-Undang\s+(?:Nomor\s+)?(\d+)\s+Tahun\s+(\d{4})",
        ],
        "pasal": [
            r"Pasal\s+(\d+[a-z]?)\s+(?:UU|Undang-Undang)\s+(?:No\.?\s*)?(\d+)\s+Tahun\s+(\d{4})",
            r"Pasal\s+(\d+[a-z]?)\s+(?:ayat\s+\((\d+)\)\s+)?(?:KUH\s*(?:Pidana|Perdata))",
        ],
        "regulation": [
            r"(?:PP|Peraturan Pemerintah)\s+(?:No\.?\s*)?(\d+)\s+Tahun\s+(\d{4})",
            r"(?:Perpres|Peraturan Presiden)\s+(?:No\.?\s*)?(\d+)\s+Tahun\s+(\d{4})",
            r"(?:Permen|Peraturan Menteri)\s+\w+\s+(?:No\.?\s*)?(\d+)\s+Tahun\s+(\d{4})",
        ],
        "court_case": [
            r"Putusan\s+(?:MA|PN|PT)\s+(?:No\.?\s*)?([A-Z0-9/\-]+)",
            r"(?:MA|PN|PT)\s+(?:No\.?\s*)?([A-Z0-9/\-]+)",
        ],
        "article": [
            r"KUH\s*(?:Pidana|Perdata)\s+Pasal\s+(\d+[a-z]?)",
        ]
    }
    
    def __init__(self, search_engine: Optional[KnowledgeGraphSearchEngine] = None):
        """
        Initialize citation extractor.
        
        Args:
            search_engine: Knowledge graph search engine for validation
        """
        self.search_engine = search_engine
        self._compiled_patterns = self._compile_patterns()
    
    def _compile_patterns(self) -> Dict[str, List[re.Pattern]]:
        """Compile regex patterns for efficiency"""
        compiled = {}
        for citation_type, patterns in self.PATTERNS.items():
            compiled[citation_type] = [
                re.compile(pattern, re.IGNORECASE)
                for pattern in patterns
            ]
        return compiled
    
    def extract(self, text: str) -> List[ExtractedCitation]:
        """
        Extract all citations from text.
        
        Args:
            text: Text to extract citations from
        
        Returns:
            List of extracted citations
        """
        citations = []
        
        for citation_type, patterns in self._compiled_patterns.items():
            for pattern in patterns:
                for match in pattern.finditer(text):
                    citation = ExtractedCitation(
                        raw_text=match.group(0),
                        citation_type=citation_type,
                        confidence=0.9,  # High confidence for regex match
                        start_pos=match.start(),
                        end_pos=match.end()
                    )
                    citations.append(citation)
        
        # Sort by position in text
        citations.sort(key=lambda x: x.start_pos)
        
        logger.info(f"Extracted {len(citations)} citations from text")
        return citations
    
    async def extract_and_validate(
        self,
        text: str,
        validate_with_kg: bool = True
    ) -> List[ExtractedCitation]:
        """
        Extract citations and optionally validate against Knowledge Graph.
        
        Args:
            text: Text to extract from
            validate_with_kg: Whether to validate against Knowledge Graph
        
        Returns:
            List of validated citations
        """
        citations = self.extract(text)
        
        if validate_with_kg and self.search_engine:
            for citation in citations:
                try:
                    # Search Knowledge Graph for matching document
                    matched = await self.search_engine.search_by_citation(
                        citation.raw_text
                    )
                    
                    if matched:
                        citation.matched_document = matched
                        citation.confidence = 1.0  # Confirmed by KG
                    else:
                        citation.confidence = 0.5  # Not found in KG
                        
                except Exception as e:
                    logger.warning(f"Citation validation failed: {e}")
        
        return citations
    
    def format_citation(
        self,
        citation: ExtractedCitation,
        style: str = "standard"
    ) -> str:
        """
        Format citation according to style.
        
        Args:
            citation: Citation to format
            style: Citation style ("standard", "short", "full")
        
        Returns:
            Formatted citation string
        """
        if citation.matched_document:
            if style == "full":
                return f"{citation.matched_document.citation_text} - {citation.matched_document.title}"
            elif style == "short":
                return citation.matched_document.citation_text
            else:  # standard
                text = citation.matched_document.citation_text
                if citation.matched_document.url:
                    text += f" [{citation.matched_document.url}]"
                return text
        else:
            return citation.raw_text
    
    def extract_article_numbers(self, text: str) -> List[str]:
        """
        Extract article/pasal numbers from text.
        
        Useful for finding all referenced articles.
        
        Args:
            text: Text to extract from
        
        Returns:
            List of article numbers (e.g., ["39", "40", "116"])
        """
        article_numbers = []
        
        # Pattern for "Pasal X" or "Pasal X ayat (Y)"
        pattern = r"Pasal\s+(\d+[a-z]?)"
        
        for match in re.finditer(pattern, text, re.IGNORECASE):
            article_numbers.append(match.group(1))
        
        return list(set(article_numbers))  # Remove duplicates
    
    def extract_law_numbers(self, text: str) -> List[Dict[str, Any]]:
        """
        Extract law numbers with years.
        
        Args:
            text: Text to extract from
        
        Returns:
            List of dicts with 'number' and 'year'
        """
        laws = []
        
        patterns = [
            r"UU\s+(?:No\.?\s*)?(\d+)\s+Tahun\s+(\d{4})",
            r"Undang-Undang\s+(?:Nomor\s+)?(\d+)\s+Tahun\s+(\d{4})"
        ]
        
        for pattern in patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                laws.append({
                    "number": match.group(1),
                    "year": match.group(2),
                    "full_text": match.group(0)
                })
        
        return laws
    
    def enhance_text_with_links(
        self,
        text: str,
        citations: List[ExtractedCitation],
        link_template: str = "[{text}]({url})"
    ) -> str:
        """
        Enhance text by adding hyperlinks to citations.
        
        Args:
            text: Original text
            citations: Extracted citations with matched documents
            link_template: Template for link formatting (Markdown by default)
        
        Returns:
            Enhanced text with links
        """
        # Sort citations by position (reverse order to maintain positions)
        sorted_citations = sorted(
            citations,
            key=lambda x: x.start_pos,
            reverse=True
        )
        
        enhanced = text
        
        for citation in sorted_citations:
            if citation.matched_document and citation.matched_document.url:
                # Replace citation with linked version
                link = link_template.format(
                    text=citation.raw_text,
                    url=citation.matched_document.url
                )
                
                enhanced = (
                    enhanced[:citation.start_pos] +
                    link +
                    enhanced[citation.end_pos:]
                )
        
        return enhanced
    
    def group_by_type(
        self,
        citations: List[ExtractedCitation]
    ) -> Dict[str, List[ExtractedCitation]]:
        """
        Group citations by type.
        
        Useful for generating organized reference lists.
        
        Args:
            citations: List of citations
        
        Returns:
            Dict mapping citation type to list of citations
        """
        grouped = {}
        
        for citation in citations:
            if citation.citation_type not in grouped:
                grouped[citation.citation_type] = []
            grouped[citation.citation_type].append(citation)
        
        return grouped
    
    def generate_reference_list(
        self,
        citations: List[ExtractedCitation],
        include_unmatched: bool = False
    ) -> str:
        """
        Generate formatted reference list.
        
        Args:
            citations: List of citations
            include_unmatched: Whether to include citations not found in KG
        
        Returns:
            Formatted reference list as Markdown
        """
        # Group by type
        grouped = self.group_by_type(citations)
        
        # Build reference list
        lines = ["## Referensi Hukum\n"]
        
        type_labels = {
            "law": "Undang-Undang",
            "regulation": "Peraturan",
            "court_case": "Putusan Pengadilan",
            "article": "Pasal",
            "pasal": "Pasal"
        }
        
        for citation_type, type_citations in grouped.items():
            label = type_labels.get(citation_type, citation_type.title())
            lines.append(f"\n### {label}\n")
            
            for i, citation in enumerate(type_citations, 1):
                if not include_unmatched and not citation.matched_document:
                    continue
                
                formatted = self.format_citation(citation, style="full")
                lines.append(f"{i}. {formatted}")
        
        return "\n".join(lines)


# Singleton instance
_citation_extractor_instance: Optional[CitationExtractor] = None


def get_citation_extractor(
    search_engine: Optional[KnowledgeGraphSearchEngine] = None
) -> CitationExtractor:
    """
    Get or create singleton citation extractor.
    
    Args:
        search_engine: Optional search engine for validation
    
    Returns:
        CitationExtractor instance
    """
    global _citation_extractor_instance
    
    if _citation_extractor_instance is None:
        _citation_extractor_instance = CitationExtractor(
            search_engine=search_engine
        )
    
    return _citation_extractor_instance
