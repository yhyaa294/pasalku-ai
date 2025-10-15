"""
Knowledge Graph Search Engine

Implements semantic search across legal documents in EdgeDB Knowledge Graph.
Integrates with Dual AI Consensus Engine for enhanced search results.
"""

import asyncio
import re
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
import logging

import edgedb

from ..edgedb.connection import get_edgedb_manager
from ..ai.consensus_engine import get_consensus_engine, DualAIConsensusEngine
from ..ark_ai_service import ArkAIService
from ..ai.groq_service import get_groq_service


logger = logging.getLogger(__name__)


@dataclass
class CitationInfo:
    """Citation information for a legal document"""
    document_id: str
    document_type: str  # "law", "regulation", "court_case", "article"
    title: str
    citation_text: str  # e.g., "Pasal 1 UU No. 1 Tahun 2023"
    url: Optional[str] = None
    relevance_score: float = 0.0
    excerpt: Optional[str] = None  # Relevant excerpt from document


@dataclass
class SearchResult:
    """Result from semantic search"""
    query: str
    total_results: int
    results: List[CitationInfo] = field(default_factory=list)
    search_time: float = 0.0
    ai_enhanced: bool = False
    ai_summary: Optional[str] = None
    consensus_confidence: Optional[float] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


class KnowledgeGraphSearchEngine:
    """
    Semantic search engine for legal documents in Knowledge Graph.
    
    Features:
    - Full-text search across legal documents
    - Semantic similarity matching
    - AI-enhanced query understanding
    - Citation extraction and ranking
    - Integration with Dual AI Consensus
    """
    
    def __init__(
        self,
        edgedb_client: Optional[edgedb.AsyncIOClient] = None,
        consensus_engine: Optional[DualAIConsensusEngine] = None,
        enable_ai_enhancement: bool = True
    ):
        """
        Initialize search engine.
        
        Args:
            edgedb_client: EdgeDB client instance
            consensus_engine: Dual AI consensus engine for query enhancement
            enable_ai_enhancement: Whether to use AI for query enhancement
        """
        self.edgedb_manager = get_edgedb_manager()
        self.edgedb_client = edgedb_client
        self.enable_ai_enhancement = enable_ai_enhancement
        
        # Initialize AI consensus engine if enabled
        if enable_ai_enhancement and consensus_engine is None:
            try:
                byteplus = ArkAIService()
                groq = get_groq_service()
                self.consensus_engine = get_consensus_engine(byteplus, groq)
            except Exception as e:
                logger.warning(f"Failed to initialize consensus engine: {e}")
                self.consensus_engine = None
                self.enable_ai_enhancement = False
        else:
            self.consensus_engine = consensus_engine
    
    async def search(
        self,
        query: str,
        document_types: Optional[List[str]] = None,
        domains: Optional[List[str]] = None,
        max_results: int = 10,
        use_ai_enhancement: bool = True
    ) -> SearchResult:
        """
        Perform semantic search across knowledge graph.
        
        Args:
            query: Search query (legal question or keywords)
            document_types: Filter by document types (law, regulation, court_case, article)
            domains: Filter by legal domains (pidana, perdata, bisnis, etc.)
            max_results: Maximum number of results to return
            use_ai_enhancement: Whether to use AI for query enhancement
        
        Returns:
            SearchResult with citations and optional AI summary
        """
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Step 1: Extract search keywords and legal concepts
            keywords = await self._extract_keywords(query, use_ai_enhancement)
            logger.info(f"Extracted keywords: {keywords}")
            
            # Step 2: Search EdgeDB with full-text search
            raw_results = await self._search_edgedb(
                keywords=keywords,
                document_types=document_types,
                domains=domains,
                limit=max_results
            )
            
            # Step 3: Rank results by relevance
            ranked_results = await self._rank_results(
                query=query,
                results=raw_results
            )
            
            # Step 4: Optionally enhance with AI summary
            ai_summary = None
            consensus_confidence = None
            
            if use_ai_enhancement and self.enable_ai_enhancement and ranked_results:
                ai_summary, consensus_confidence = await self._generate_ai_summary(
                    query=query,
                    results=ranked_results[:5]  # Use top 5 for context
                )
            
            # Calculate search time
            search_time = asyncio.get_event_loop().time() - start_time
            
            return SearchResult(
                query=query,
                total_results=len(ranked_results),
                results=ranked_results[:max_results],
                search_time=search_time,
                ai_enhanced=ai_summary is not None,
                ai_summary=ai_summary,
                consensus_confidence=consensus_confidence,
                metadata={
                    "keywords": keywords,
                    "document_types_filter": document_types,
                    "domains_filter": domains,
                    "ai_enhancement_enabled": use_ai_enhancement and self.enable_ai_enhancement
                }
            )
            
        except Exception as e:
            logger.error(f"Search failed: {e}", exc_info=True)
            return SearchResult(
                query=query,
                total_results=0,
                results=[],
                search_time=asyncio.get_event_loop().time() - start_time,
                metadata={"error": str(e)}
            )
    
    async def _extract_keywords(
        self,
        query: str,
        use_ai: bool = True
    ) -> List[str]:
        """
        Extract keywords from query.
        
        Uses AI to understand legal concepts if enabled,
        otherwise falls back to simple keyword extraction.
        """
        # Simple keyword extraction (fallback)
        simple_keywords = [
            word.lower()
            for word in re.findall(r'\b\w+\b', query)
            if len(word) > 3  # Filter short words
        ]
        
        if not use_ai or not self.enable_ai_enhancement:
            return simple_keywords
        
        try:
            # Use AI to extract legal concepts
            prompt = f"""
            Ekstrak konsep hukum utama dari pertanyaan ini: "{query}"
            
            Berikan:
            1. Kata kunci hukum yang relevan
            2. Pasal/UU yang mungkin terkait
            3. Topik hukum utama
            
            Format jawaban sebagai daftar kata kunci, dipisahkan koma.
            Contoh: perceraian, hukum keluarga, pasal 39, UU Perkawinan
            """
            
            result = await self.consensus_engine.get_consensus_response(
                prompt=prompt,
                system_prompt="Anda adalah AI legal researcher yang ahli mengidentifikasi konsep hukum.",
                temperature=0.3,  # Low temperature for focused extraction
                max_tokens=200
            )
            
            # Parse AI response to extract keywords
            ai_keywords = [
                kw.strip().lower()
                for kw in result.final_content.split(',')
                if kw.strip()
            ]
            
            # Combine AI keywords with simple keywords
            all_keywords = list(set(simple_keywords + ai_keywords))
            return all_keywords[:20]  # Limit to top 20 keywords
            
        except Exception as e:
            logger.warning(f"AI keyword extraction failed: {e}")
            return simple_keywords
    
    async def _search_edgedb(
        self,
        keywords: List[str],
        document_types: Optional[List[str]] = None,
        domains: Optional[List[str]] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Search EdgeDB using full-text search.
        
        Returns raw results from database.
        """
        try:
            client = self.edgedb_client or await self.edgedb_manager.get_client()
            
            # Build search query
            search_text = " ".join(keywords)
            
            # Query for LegalDocuments
            query = """
                WITH search_text := <str>$search_text,
                     limit := <int64>$limit
                SELECT LegalDocument {
                    id,
                    title,
                    document_number,
                    document_type,
                    content,
                    summary,
                    issued_date,
                    issuing_authority,
                    url,
                    metadata
                }
                FILTER contains_insensitive(LegalDocument.title, search_text)
                    OR contains_insensitive(LegalDocument.content, search_text)
                    OR contains_insensitive(LegalDocument.summary, search_text)
                LIMIT limit
            """
            
            results = await client.query(query, search_text=search_text, limit=limit)
            
            # Convert EdgeDB results to dicts
            documents = []
            for doc in results:
                documents.append({
                    "id": str(doc.id),
                    "title": doc.title,
                    "document_number": doc.document_number,
                    "document_type": str(doc.document_type),
                    "content": doc.content[:500] if doc.content else "",  # Truncate
                    "summary": doc.summary,
                    "issued_date": doc.issued_date,
                    "issuing_authority": doc.issuing_authority,
                    "url": doc.url,
                    "metadata": doc.metadata or {}
                })
            
            logger.info(f"Found {len(documents)} documents in EdgeDB")
            return documents
            
        except Exception as e:
            logger.error(f"EdgeDB search failed: {e}", exc_info=True)
            return []
    
    async def _rank_results(
        self,
        query: str,
        results: List[Dict[str, Any]]
    ) -> List[CitationInfo]:
        """
        Rank search results by relevance to query.
        
        Uses simple scoring based on:
        - Keyword matches in title (high weight)
        - Keyword matches in content (medium weight)
        - Document type relevance (law > regulation > case > article)
        - Recency (newer documents slightly preferred)
        """
        query_lower = query.lower()
        query_words = set(re.findall(r'\b\w+\b', query_lower))
        
        ranked = []
        
        for doc in results:
            score = 0.0
            
            # Title match (weight: 3.0)
            title_lower = doc.get("title", "").lower()
            title_words = set(re.findall(r'\b\w+\b', title_lower))
            title_match = len(query_words & title_words) / max(len(query_words), 1)
            score += title_match * 3.0
            
            # Content match (weight: 1.0)
            content_lower = doc.get("content", "").lower()
            content_words = set(re.findall(r'\b\w+\b', content_lower))
            content_match = len(query_words & content_words) / max(len(query_words), 1)
            score += content_match * 1.0
            
            # Document type weight
            doc_type = doc.get("document_type", "").lower()
            type_weights = {
                "law": 1.5,
                "regulation": 1.3,
                "court_case": 1.1,
                "article": 1.0
            }
            score *= type_weights.get(doc_type, 1.0)
            
            # Recency bonus (up to 0.2 for docs from last year)
            issued_date = doc.get("issued_date")
            if issued_date:
                try:
                    from datetime import datetime, timedelta
                    age_days = (datetime.now() - issued_date).days
                    if age_days < 365:
                        score += 0.2 * (1 - age_days / 365)
                except:
                    pass
            
            # Create citation
            citation = CitationInfo(
                document_id=doc["id"],
                document_type=doc_type,
                title=doc["title"],
                citation_text=self._format_citation(doc),
                url=doc.get("url"),
                relevance_score=score,
                excerpt=doc.get("summary") or doc.get("content", "")[:200]
            )
            
            ranked.append(citation)
        
        # Sort by relevance score (descending)
        ranked.sort(key=lambda x: x.relevance_score, reverse=True)
        
        return ranked
    
    def _format_citation(self, doc: Dict[str, Any]) -> str:
        """
        Format document as legal citation.
        
        Examples:
        - "UU No. 1 Tahun 2023 tentang KUHP"
        - "Putusan MA No. 123/Pid/2023"
        - "Peraturan Pemerintah No. 45 Tahun 2022"
        """
        doc_type = doc.get("document_type", "").lower()
        doc_number = doc.get("document_number", "")
        title = doc.get("title", "")
        
        if doc_type == "law":
            return f"UU {doc_number} - {title}"
        elif doc_type == "regulation":
            return f"Peraturan {doc_number} - {title}"
        elif doc_type == "court_case":
            return f"Putusan {doc_number} - {title}"
        else:
            return f"{title}"
    
    async def _generate_ai_summary(
        self,
        query: str,
        results: List[CitationInfo]
    ) -> Tuple[Optional[str], Optional[float]]:
        """
        Generate AI summary of search results using consensus engine.
        
        Returns:
            Tuple of (summary text, consensus confidence)
        """
        if not results or not self.consensus_engine:
            return None, None
        
        try:
            # Build context from top results
            context = "Dokumen hukum yang relevan:\n\n"
            for i, result in enumerate(results[:5], 1):
                context += f"{i}. {result.citation_text}\n"
                context += f"   Ringkasan: {result.excerpt[:150]}...\n\n"
            
            # Generate summary
            prompt = f"""
            Pertanyaan pengguna: "{query}"
            
            {context}
            
            Berdasarkan dokumen hukum di atas, berikan ringkasan singkat yang menjawab pertanyaan pengguna.
            Sebutkan dokumen hukum yang relevan dengan format sitasi yang tepat.
            """
            
            result = await self.consensus_engine.get_consensus_response(
                prompt=prompt,
                system_prompt="Anda adalah AI legal assistant Pasalku.ai yang memberikan ringkasan hukum akurat dengan sitasi.",
                temperature=0.6,
                max_tokens=800
            )
            
            return result.final_content, result.consensus_confidence
            
        except Exception as e:
            logger.error(f"AI summary generation failed: {e}", exc_info=True)
            return None, None
    
    async def search_by_citation(
        self,
        citation: str
    ) -> Optional[CitationInfo]:
        """
        Search for specific legal document by citation.
        
        Args:
            citation: Legal citation (e.g., "UU No. 1 Tahun 2023", "Pasal 39")
        
        Returns:
            CitationInfo if found, None otherwise
        """
        try:
            client = self.edgedb_client or await self.edgedb_manager.get_client()
            
            # Search by document number or title
            query = """
                WITH citation_text := <str>$citation
                SELECT LegalDocument {
                    id,
                    title,
                    document_number,
                    document_type,
                    content,
                    summary,
                    url
                }
                FILTER contains_insensitive(LegalDocument.document_number, citation_text)
                    OR contains_insensitive(LegalDocument.title, citation_text)
                LIMIT 1
            """
            
            results = await client.query(query, citation=citation)
            
            if results:
                doc = results[0]
                return CitationInfo(
                    document_id=str(doc.id),
                    document_type=str(doc.document_type),
                    title=doc.title,
                    citation_text=self._format_citation({
                        "document_type": str(doc.document_type),
                        "document_number": doc.document_number,
                        "title": doc.title
                    }),
                    url=doc.url,
                    relevance_score=1.0,
                    excerpt=doc.summary or doc.content[:200] if doc.content else None
                )
            
            return None
            
        except Exception as e:
            logger.error(f"Citation search failed: {e}", exc_info=True)
            return None


# Singleton instance
_search_engine_instance: Optional[KnowledgeGraphSearchEngine] = None


def get_search_engine(
    edgedb_client: Optional[edgedb.AsyncIOClient] = None,
    consensus_engine: Optional[DualAIConsensusEngine] = None,
    enable_ai_enhancement: bool = True
) -> KnowledgeGraphSearchEngine:
    """
    Get or create singleton search engine instance.
    
    Args:
        edgedb_client: Optional EdgeDB client
        consensus_engine: Optional consensus engine
        enable_ai_enhancement: Whether to enable AI features
    
    Returns:
        KnowledgeGraphSearchEngine instance
    """
    global _search_engine_instance
    
    if _search_engine_instance is None:
        _search_engine_instance = KnowledgeGraphSearchEngine(
            edgedb_client=edgedb_client,
            consensus_engine=consensus_engine,
            enable_ai_enhancement=enable_ai_enhancement
        )
    
    return _search_engine_instance
