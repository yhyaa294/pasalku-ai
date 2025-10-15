"""
Relevance Ranker

Advanced relevance ranking for search results using multiple signals.
"""

import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging
from datetime import datetime

from services.knowledge_graph.search_engine import CitationInfo


logger = logging.getLogger(__name__)


@dataclass
class RankedResult:
    """Search result with detailed ranking scores"""
    citation: CitationInfo
    total_score: float
    keyword_score: float
    semantic_score: float
    authority_score: float
    recency_score: float
    usage_score: float
    ranking_metadata: Dict[str, Any]


class RelevanceRanker:
    """
    Advanced relevance ranking for legal document search results.
    
    Uses multiple signals:
    - Keyword matching (TF-IDF style)
    - Semantic similarity
    - Document authority (law > regulation > case > article)
    - Recency (newer documents preferred)
    - Usage statistics (popular documents boosted)
    """
    
    # Weights for different ranking signals
    WEIGHTS = {
        "keyword": 0.35,
        "semantic": 0.25,
        "authority": 0.20,
        "recency": 0.10,
        "usage": 0.10
    }
    
    # Authority scores by document type
    AUTHORITY_SCORES = {
        "law": 1.0,
        "regulation": 0.8,
        "court_case": 0.6,
        "article": 0.4,
        "commentary": 0.2
    }
    
    def __init__(self):
        """Initialize relevance ranker"""
        pass
    
    async def rank(
        self,
        query: str,
        results: List[CitationInfo],
        enable_semantic: bool = True,
        enable_usage_stats: bool = False
    ) -> List[RankedResult]:
        """
        Rank search results by relevance.
        
        Args:
            query: Original search query
            results: List of search results to rank
            enable_semantic: Whether to use semantic similarity
            enable_usage_stats: Whether to use usage statistics
        
        Returns:
            Ranked list of results with scoring details
        """
        ranked_results = []
        
        for citation in results:
            # Calculate individual scores
            keyword_score = self._calculate_keyword_score(query, citation)
            
            semantic_score = 0.0
            if enable_semantic:
                semantic_score = await self._calculate_semantic_score(
                    query, citation
                )
            
            authority_score = self._calculate_authority_score(citation)
            recency_score = self._calculate_recency_score(citation)
            
            usage_score = 0.0
            if enable_usage_stats:
                usage_score = self._calculate_usage_score(citation)
            
            # Calculate weighted total score
            total_score = (
                self.WEIGHTS["keyword"] * keyword_score +
                self.WEIGHTS["semantic"] * semantic_score +
                self.WEIGHTS["authority"] * authority_score +
                self.WEIGHTS["recency"] * recency_score +
                self.WEIGHTS["usage"] * usage_score
            )
            
            ranked_result = RankedResult(
                citation=citation,
                total_score=total_score,
                keyword_score=keyword_score,
                semantic_score=semantic_score,
                authority_score=authority_score,
                recency_score=recency_score,
                usage_score=usage_score,
                ranking_metadata={
                    "weights": self.WEIGHTS,
                    "semantic_enabled": enable_semantic,
                    "usage_stats_enabled": enable_usage_stats
                }
            )
            
            ranked_results.append(ranked_result)
        
        # Sort by total score (descending)
        ranked_results.sort(key=lambda x: x.total_score, reverse=True)
        
        logger.info(f"Ranked {len(ranked_results)} results")
        return ranked_results
    
    def _calculate_keyword_score(
        self,
        query: str,
        citation: CitationInfo
    ) -> float:
        """
        Calculate keyword matching score.
        
        Uses simple TF-IDF style scoring:
        - Count keyword matches in title (high weight)
        - Count keyword matches in excerpt (medium weight)
        - Normalize by query length
        """
        import re
        
        query_lower = query.lower()
        query_words = set(re.findall(r'\b\w+\b', query_lower))
        
        if not query_words:
            return 0.0
        
        # Title matching (weight: 3.0)
        title_lower = citation.title.lower()
        title_words = set(re.findall(r'\b\w+\b', title_lower))
        title_matches = len(query_words & title_words)
        title_score = (title_matches / len(query_words)) * 3.0
        
        # Excerpt matching (weight: 1.0)
        excerpt_score = 0.0
        if citation.excerpt:
            excerpt_lower = citation.excerpt.lower()
            excerpt_words = set(re.findall(r'\b\w+\b', excerpt_lower))
            excerpt_matches = len(query_words & excerpt_words)
            excerpt_score = (excerpt_matches / len(query_words)) * 1.0
        
        # Citation text matching (weight: 2.0)
        citation_lower = citation.citation_text.lower()
        citation_words = set(re.findall(r'\b\w+\b', citation_lower))
        citation_matches = len(query_words & citation_words)
        citation_score = (citation_matches / len(query_words)) * 2.0
        
        # Normalize to 0-1 range
        total_score = (title_score + excerpt_score + citation_score) / 6.0
        return min(total_score, 1.0)
    
    async def _calculate_semantic_score(
        self,
        query: str,
        citation: CitationInfo
    ) -> float:
        """
        Calculate semantic similarity score.
        
        Uses simple word embedding similarity.
        For production, could use sentence-transformers or similar.
        """
        # Simple semantic similarity based on word overlap
        # and common legal concepts
        
        import re
        
        query_lower = query.lower()
        
        # Legal concept keywords with weights
        legal_concepts = {
            "pidana": ["pidana", "kriminal", "kejahatan", "hukuman"],
            "perdata": ["perdata", "kontrak", "perjanjian", "ganti rugi"],
            "keluarga": ["nikah", "kawin", "cerai", "talak", "anak"],
            "bisnis": ["bisnis", "perusahaan", "perseroan", "dagang"],
            "properti": ["tanah", "rumah", "properti", "sertifikat"],
            "ketenagakerjaan": ["kerja", "pekerja", "buruh", "gaji", "PHK"]
        }
        
        # Find relevant legal domain
        query_domain = None
        for domain, keywords in legal_concepts.items():
            if any(kw in query_lower for kw in keywords):
                query_domain = domain
                break
        
        if not query_domain:
            return 0.5  # Neutral score if no clear domain
        
        # Check if citation is relevant to domain
        citation_text = (
            citation.title.lower() + " " +
            citation.citation_text.lower() + " " +
            (citation.excerpt or "").lower()
        )
        
        domain_keywords = legal_concepts[query_domain]
        matches = sum(1 for kw in domain_keywords if kw in citation_text)
        
        # Normalize to 0-1
        score = min(matches / len(domain_keywords), 1.0)
        
        return score
    
    def _calculate_authority_score(self, citation: CitationInfo) -> float:
        """
        Calculate document authority score.
        
        Based on document type hierarchy:
        - Laws (UU): Highest authority
        - Regulations (PP, Perpres): High authority
        - Court cases: Medium authority
        - Articles/Commentary: Lower authority
        """
        doc_type = citation.document_type.lower()
        return self.AUTHORITY_SCORES.get(doc_type, 0.3)
    
    def _calculate_recency_score(self, citation: CitationInfo) -> float:
        """
        Calculate recency score.
        
        Newer documents get higher scores.
        Score decays over time but never goes to zero.
        """
        # For now, use simple heuristic based on document ID or title
        # In production, would use actual issued_date from database
        
        # Extract year from citation text if possible
        import re
        year_match = re.search(r'Tahun\s+(\d{4})', citation.citation_text)
        
        if year_match:
            year = int(year_match.group(1))
            current_year = datetime.now().year
            age = current_year - year
            
            # Score: 1.0 for current year, decays to 0.3 for 10+ years old
            if age <= 0:
                return 1.0
            elif age <= 5:
                return 1.0 - (age * 0.1)
            elif age <= 10:
                return 0.5 - ((age - 5) * 0.04)
            else:
                return 0.3
        
        return 0.5  # Default if year not found
    
    def _calculate_usage_score(self, citation: CitationInfo) -> float:
        """
        Calculate usage popularity score.
        
        Based on how often document is cited/accessed.
        Requires usage statistics from database.
        """
        # Placeholder: Would use actual usage stats from database
        # For now, return neutral score
        return 0.5
    
    def get_ranking_explanation(self, ranked_result: RankedResult) -> str:
        """
        Generate human-readable explanation of ranking.
        
        Args:
            ranked_result: Ranked result to explain
        
        Returns:
            Explanation string
        """
        lines = [
            f"Total Score: {ranked_result.total_score:.2f}",
            "",
            "Score Breakdown:",
            f"  • Keyword Match: {ranked_result.keyword_score:.2f} (weight: {self.WEIGHTS['keyword']})",
            f"  • Semantic: {ranked_result.semantic_score:.2f} (weight: {self.WEIGHTS['semantic']})",
            f"  • Authority: {ranked_result.authority_score:.2f} (weight: {self.WEIGHTS['authority']})",
            f"  • Recency: {ranked_result.recency_score:.2f} (weight: {self.WEIGHTS['recency']})",
            f"  • Usage: {ranked_result.usage_score:.2f} (weight: {self.WEIGHTS['usage']})",
        ]
        
        return "\n".join(lines)
    
    def filter_by_score(
        self,
        results: List[RankedResult],
        min_score: float = 0.3
    ) -> List[RankedResult]:
        """
        Filter results by minimum score threshold.
        
        Args:
            results: Ranked results
            min_score: Minimum total score (0-1)
        
        Returns:
            Filtered results
        """
        filtered = [r for r in results if r.total_score >= min_score]
        logger.info(f"Filtered {len(results)} to {len(filtered)} results (min_score: {min_score})")
        return filtered
    
    def diversify_results(
        self,
        results: List[RankedResult],
        max_per_type: int = 3
    ) -> List[RankedResult]:
        """
        Diversify results by document type.
        
        Ensures variety in search results by limiting
        number of documents of the same type.
        
        Args:
            results: Ranked results
            max_per_type: Maximum results per document type
        
        Returns:
            Diversified results
        """
        type_counts = {}
        diversified = []
        
        for result in results:
            doc_type = result.citation.document_type
            
            if doc_type not in type_counts:
                type_counts[doc_type] = 0
            
            if type_counts[doc_type] < max_per_type:
                diversified.append(result)
                type_counts[doc_type] += 1
        
        logger.info(f"Diversified {len(results)} to {len(diversified)} results")
        return diversified


# Singleton instance
_relevance_ranker_instance: Optional[RelevanceRanker] = None


def get_relevance_ranker() -> RelevanceRanker:
    """
    Get or create singleton relevance ranker.
    
    Returns:
        RelevanceRanker instance
    """
    global _relevance_ranker_instance
    
    if _relevance_ranker_instance is None:
        _relevance_ranker_instance = RelevanceRanker()
    
    return _relevance_ranker_instance
