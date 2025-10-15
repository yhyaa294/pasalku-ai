"""
EdgeDB Knowledge Graph Module for Pasalku.ai

This module provides database operations for the legal knowledge graph.
"""

from .connection import (
    EdgeDBManager,
    get_edgedb_manager,
    init_edgedb,
    close_edgedb,
    test_connection,
    get_database_info
)

from .repository import (
    LegalDocumentRepository,
    ArticleRepository,
    CourtCaseRepository,
    LegalTopicRepository
)

__all__ = [
    # Connection
    "EdgeDBManager",
    "get_edgedb_manager",
    "init_edgedb",
    "close_edgedb",
    "test_connection",
    "get_database_info",
    
    # Repositories
    "LegalDocumentRepository",
    "ArticleRepository",
    "CourtCaseRepository",
    "LegalTopicRepository",
]

__version__ = "1.0.0"
