"""
Citation Linker

Menghubungkan sitasi yang terdeteksi dengan database hukum di Knowledge Graph.
Memverifikasi keberadaan hukum dan mengambil metadata lengkap.
"""

import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import logging

from .citation_detector import DetectedCitation, CitationType
from ..knowledge_graph.search_engine import get_search_engine

logger = logging.getLogger(__name__)


class LinkStatus(Enum):
    """Status linking sitasi"""
    LINKED = "linked"  # Berhasil di-link dengan database
    NOT_FOUND = "not_found"  # Tidak ditemukan di database
    AMBIGUOUS = "ambiguous"  # Ada multiple matches
    INVALID = "invalid"  # Format invalid
    ERROR = "error"  # Error saat linking


@dataclass
class LinkedCitation:
    """Sitasi yang sudah di-link dengan database"""
    citation: DetectedCitation  # Sitasi asli
    status: LinkStatus  # Status linking
    law_id: Optional[str] = None  # ID hukum di database
    law_title: Optional[str] = None  # Judul lengkap hukum
    law_url: Optional[str] = None  # URL ke full text
    law_summary: Optional[str] = None  # Ringkasan hukum
    metadata: Dict[str, Any] = None  # Metadata tambahan dari database
    alternatives: List[Dict[str, Any]] = None  # Alternatif jika ambiguous
    confidence: float = 0.0  # Confidence linking (0.0-1.0)
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
        if self.alternatives is None:
            self.alternatives = []
    
    def is_linked(self) -> bool:
        """Cek apakah sitasi berhasil di-link"""
        return self.status == LinkStatus.LINKED
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert ke dictionary"""
        return {
            "citation_text": self.citation.text,
            "citation_type": self.citation.type.value,
            "status": self.status.value,
            "law_id": self.law_id,
            "law_title": self.law_title,
            "law_url": self.law_url,
            "law_summary": self.law_summary,
            "confidence": self.confidence,
            "metadata": self.metadata,
            "alternatives": self.alternatives
        }


class CitationLinker:
    """
    Menghubungkan sitasi dengan database hukum.
    
    Proses:
    1. Ambil sitasi yang terdeteksi
    2. Search di Knowledge Graph
    3. Verifikasi match
    4. Ambil metadata lengkap
    5. Return LinkedCitation
    """
    
    def __init__(self):
        """Inisialisasi Citation Linker"""
        self.search_engine = None  # Akan di-init on demand
        logger.info("Citation Linker initialized")
    
    def _get_search_engine(self):
        """Get search engine instance (lazy loading)"""
        if self.search_engine is None:
            self.search_engine = get_search_engine()
        return self.search_engine
    
    async def link_citation(
        self,
        citation: DetectedCitation
    ) -> LinkedCitation:
        """
        Link single citation dengan database.
        
        Args:
            citation: Sitasi yang terdeteksi
        
        Returns:
            LinkedCitation dengan status dan metadata
        """
        try:
            # Build search query berdasarkan jenis sitasi
            search_query = self._build_search_query(citation)
            
            # Search di Knowledge Graph
            search_engine = self._get_search_engine()
            results = await search_engine.search(
                query=search_query,
                limit=5,
                min_score=0.5
            )
            
            # Jika tidak ada hasil
            if not results or len(results) == 0:
                return LinkedCitation(
                    citation=citation,
                    status=LinkStatus.NOT_FOUND,
                    confidence=0.0
                )
            
            # Ambil best match
            best_match = results[0]
            
            # Verifikasi apakah benar-benar match
            is_valid, confidence = self._verify_match(citation, best_match)
            
            if not is_valid:
                return LinkedCitation(
                    citation=citation,
                    status=LinkStatus.NOT_FOUND,
                    confidence=confidence
                )
            
            # Jika ada multiple strong matches, tandai sebagai ambiguous
            if len(results) > 1 and results[1].get("score", 0) > 0.8:
                alternatives = [
                    {
                        "law_id": r.get("id"),
                        "title": r.get("title"),
                        "score": r.get("score")
                    }
                    for r in results[1:3]  # Max 2 alternatives
                ]
                
                return LinkedCitation(
                    citation=citation,
                    status=LinkStatus.AMBIGUOUS,
                    law_id=best_match.get("id"),
                    law_title=best_match.get("title"),
                    law_url=best_match.get("url"),
                    law_summary=best_match.get("summary"),
                    metadata=best_match.get("metadata", {}),
                    alternatives=alternatives,
                    confidence=confidence
                )
            
            # Success! Link established
            return LinkedCitation(
                citation=citation,
                status=LinkStatus.LINKED,
                law_id=best_match.get("id"),
                law_title=best_match.get("title"),
                law_url=best_match.get("url"),
                law_summary=best_match.get("summary", "")[:200],  # Max 200 chars
                metadata=best_match.get("metadata", {}),
                confidence=confidence
            )
            
        except Exception as e:
            logger.error(f"Error linking citation: {e}")
            return LinkedCitation(
                citation=citation,
                status=LinkStatus.ERROR,
                confidence=0.0,
                metadata={"error": str(e)}
            )
    
    async def link_citations(
        self,
        citations: List[DetectedCitation]
    ) -> List[LinkedCitation]:
        """
        Link multiple citations secara parallel.
        
        Args:
            citations: List sitasi yang terdeteksi
        
        Returns:
            List LinkedCitation
        """
        # Link semua citations secara parallel
        tasks = [self.link_citation(c) for c in citations]
        linked = await asyncio.gather(*tasks)
        
        logger.info(
            f"Linked {len([l for l in linked if l.is_linked()])}/{len(citations)} citations"
        )
        
        return linked
    
    def _build_search_query(self, citation: DetectedCitation) -> str:
        """
        Build search query berdasarkan jenis sitasi.
        
        Returns:
            Search query string
        """
        metadata = citation.metadata
        
        if citation.type == CitationType.UU:
            # UU No 13 Tahun 2003
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            return f"Undang-Undang Nomor {nomor} Tahun {tahun}"
        
        elif citation.type == CitationType.PP:
            # PP No 35 Tahun 2021
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            return f"Peraturan Pemerintah Nomor {nomor} Tahun {tahun}"
        
        elif citation.type == CitationType.PERPRES:
            # Perpres No 82 Tahun 2018
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            return f"Peraturan Presiden Nomor {nomor} Tahun {tahun}"
        
        elif citation.type == CitationType.PERMEN:
            # Permen ... No 1 Tahun 2020
            return citation.text  # Use original text
        
        elif citation.type == CitationType.PASAL:
            # Pasal 378
            pasal = metadata.get("pasal", "")
            return f"Pasal {pasal}"
        
        elif citation.type == CitationType.PUTUSAN:
            # Putusan No ...
            return citation.text
        
        elif citation.type == CitationType.KUHP:
            # KUHP, KUHPerdata, KUHAP
            return citation.text
        
        elif citation.type == CitationType.PERDA:
            # Perda DKI No 5 Tahun 2015
            daerah = metadata.get("daerah", "")
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            return f"Peraturan Daerah {daerah} Nomor {nomor} Tahun {tahun}"
        
        elif citation.type == CitationType.KEPRES:
            # Keppres No 10 Tahun 2020
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            return f"Keputusan Presiden Nomor {nomor} Tahun {tahun}"
        
        elif citation.type == CitationType.INPRES:
            # Inpres No 3 Tahun 2019
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            return f"Instruksi Presiden Nomor {nomor} Tahun {tahun}"
        
        # Default: use normalized text
        return citation.normalized
    
    def _verify_match(
        self,
        citation: DetectedCitation,
        search_result: Dict[str, Any]
    ) -> tuple[bool, float]:
        """
        Verifikasi apakah search result benar-benar match dengan sitasi.
        
        Returns:
            (is_valid, confidence)
        """
        confidence = search_result.get("score", 0.0)
        
        # Jika score terlalu rendah, reject
        if confidence < 0.5:
            return False, confidence
        
        # Verifikasi nomor dan tahun untuk UU, PP, Perpres
        if citation.type in [CitationType.UU, CitationType.PP, CitationType.PERPRES]:
            metadata = citation.metadata
            result_title = search_result.get("title", "").lower()
            
            nomor = metadata.get("nomor", "")
            tahun = metadata.get("tahun", "")
            
            # Cek apakah nomor dan tahun ada di title
            if nomor and str(nomor) not in result_title:
                confidence *= 0.5
            
            if tahun and str(tahun) not in result_title:
                confidence *= 0.5
            
            # Jika confidence drop terlalu banyak, reject
            if confidence < 0.5:
                return False, confidence
        
        # Valid!
        return True, confidence
    
    async def get_citation_details(
        self,
        law_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get detail lengkap dari hukum berdasarkan ID.
        
        Args:
            law_id: ID hukum di database
        
        Returns:
            Detail hukum atau None
        """
        try:
            search_engine = self._get_search_engine()
            # Implementasi tergantung search engine
            # Untuk sekarang return dummy
            return {
                "id": law_id,
                "title": "Detail akan diambil dari database",
                "content": "...",
                "metadata": {}
            }
        except Exception as e:
            logger.error(f"Error getting citation details: {e}")
            return None
    
    def get_link_statistics(
        self,
        linked_citations: List[LinkedCitation]
    ) -> Dict[str, Any]:
        """
        Get statistik linking.
        
        Returns:
            Dictionary dengan statistik
        """
        total = len(linked_citations)
        linked = len([l for l in linked_citations if l.status == LinkStatus.LINKED])
        not_found = len([l for l in linked_citations if l.status == LinkStatus.NOT_FOUND])
        ambiguous = len([l for l in linked_citations if l.status == LinkStatus.AMBIGUOUS])
        error = len([l for l in linked_citations if l.status == LinkStatus.ERROR])
        
        avg_confidence = sum(l.confidence for l in linked_citations) / total if total > 0 else 0.0
        
        return {
            "total": total,
            "linked": linked,
            "not_found": not_found,
            "ambiguous": ambiguous,
            "error": error,
            "success_rate": linked / total if total > 0 else 0.0,
            "average_confidence": avg_confidence
        }


# Singleton instance
_citation_linker: Optional[CitationLinker] = None


def get_citation_linker() -> CitationLinker:
    """Get atau buat Citation Linker instance"""
    global _citation_linker
    
    if _citation_linker is None:
        _citation_linker = CitationLinker()
    
    return _citation_linker
