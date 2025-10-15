"""
Knowledge Graph Service Module

Provides semantic search, citation extraction, and relevance ranking
for legal documents stored in EdgeDB.
"""

from .search_engine import (
    KnowledgeGraphSearchEngine,
    SearchResult,
    CitationInfo,
    get_search_engine
)

from .citation_extractor import (
    CitationExtractor,
    ExtractedCitation,
    get_citation_extractor
)

from .relevance_ranker import (
    RelevanceRanker,
    RankedResult,
    get_relevance_ranker
)

__all__ = [
    "KnowledgeGraphSearchEngine",
    "SearchResult",
    "CitationInfo",
    "get_search_engine",
    "CitationExtractor",
    "ExtractedCitation",
    "get_citation_extractor",
    "RelevanceRanker",
    "RankedResult",
    "get_relevance_ranker",
]

__version__ = "1.0.0"
