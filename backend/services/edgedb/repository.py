"""
EdgeDB Repository - CRUD Operations for Knowledge Graph

This module provides repository pattern for interacting with EdgeDB entities.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from .connection import get_edgedb_manager
import logging

logger = logging.getLogger(__name__)


class LegalDocumentRepository:
    """
    Repository for LegalDocument operations.
    """
    
    def __init__(self):
        self.manager = get_edgedb_manager()
    
    async def create(
        self,
        title: str,
        doc_type: str,
        number: Optional[str] = None,
        year: Optional[int] = None,
        summary: Optional[str] = None,
        content: Optional[str] = None,
        domain: Optional[str] = None,
        source_url: Optional[str] = None,
        status: str = "Active"
    ) -> Any:
        """
        Create a new legal document.
        """
        query = """
            INSERT LegalDocument {
                title := <str>$title,
                type := <DocumentType>$doc_type,
                number := <optional str>$number,
                year := <optional int32>$year,
                summary := <optional str>$summary,
                content := <optional str>$content,
                domain := <optional LegalDomain>$domain,
                source_url := <optional str>$source_url,
                status := <DocumentStatus>$status
            }
        """
        
        try:
            result = await self.manager.query_single(
                query,
                title=title,
                doc_type=doc_type,
                number=number,
                year=year,
                summary=summary,
                content=content,
                domain=domain,
                source_url=source_url,
                status=status
            )
            logger.info(f"✅ Created legal document: {title}")
            return result
        except Exception as e:
            logger.error(f"❌ Error creating legal document: {e}")
            raise
    
    async def get_by_id(self, doc_id: str) -> Optional[Any]:
        """
        Get legal document by ID.
        """
        query = """
            SELECT LegalDocument {
                id,
                title,
                type,
                number,
                year,
                summary,
                content,
                status,
                domain,
                source_url,
                created_at,
                updated_at,
                view_count,
                citation_count
            }
            FILTER .id = <uuid>$doc_id
        """
        
        try:
            result = await self.manager.query_single(query, doc_id=doc_id)
            return result
        except Exception as e:
            logger.error(f"Error getting document by ID: {e}")
            return None
    
    async def search(
        self,
        keyword: str,
        doc_type: Optional[str] = None,
        domain: Optional[str] = None,
        limit: int = 10
    ) -> List[Any]:
        """
        Search legal documents by keyword.
        """
        query = """
            WITH
                filtered := (
                    SELECT LegalDocument
                    FILTER
                        contains(.search_vector, <str>$keyword)
                        AND (.type = <optional DocumentType>$doc_type IF EXISTS $doc_type ELSE True)
                        AND (.domain = <optional LegalDomain>$domain IF EXISTS $domain ELSE True)
                )
            SELECT filtered {
                id,
                title,
                type,
                number,
                year,
                summary,
                domain,
                status,
                citation_count
            }
            ORDER BY .citation_count DESC
            LIMIT <int64>$limit
        """
        
        try:
            results = await self.manager.query(
                query,
                keyword=keyword,
                doc_type=doc_type,
                domain=domain,
                limit=limit
            )
            return results
        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            return []
    
    async def get_recent(self, limit: int = 20) -> List[Any]:
        """
        Get recent legal documents.
        """
        query = """
            SELECT LegalDocument {
                id,
                title,
                type,
                number,
                year,
                summary,
                domain,
                created_at
            }
            ORDER BY .created_at DESC
            LIMIT <int64>$limit
        """
        
        try:
            results = await self.manager.query(query, limit=limit)
            return results
        except Exception as e:
            logger.error(f"Error getting recent documents: {e}")
            return []


class ArticleRepository:
    """
    Repository for Article operations.
    """
    
    def __init__(self):
        self.manager = get_edgedb_manager()
    
    async def create(
        self,
        number: str,
        content: str,
        document_id: str,
        interpretation: Optional[str] = None,
        section: Optional[str] = None,
        subsection: Optional[str] = None
    ) -> Any:
        """
        Create a new article.
        """
        query = """
            INSERT Article {
                number := <str>$number,
                content := <str>$content,
                document := (SELECT LegalDocument FILTER .id = <uuid>$document_id),
                interpretation := <optional str>$interpretation,
                section := <optional str>$section,
                subsection := <optional str>$subsection
            }
        """
        
        try:
            result = await self.manager.query_single(
                query,
                number=number,
                content=content,
                document_id=document_id,
                interpretation=interpretation,
                section=section,
                subsection=subsection
            )
            logger.info(f"✅ Created article: {number}")
            return result
        except Exception as e:
            logger.error(f"❌ Error creating article: {e}")
            raise
    
    async def search_by_number(
        self,
        article_number: str,
        document_id: Optional[str] = None
    ) -> List[Any]:
        """
        Search articles by number.
        """
        query = """
            SELECT Article {
                id,
                number,
                content,
                interpretation,
                section,
                document: {
                    id,
                    title,
                    number,
                    type
                },
                citation_count
            }
            FILTER
                contains(.number, <str>$article_number)
                AND (.document.id = <optional uuid>$document_id IF EXISTS $document_id ELSE True)
        """
        
        try:
            results = await self.manager.query(
                query,
                article_number=article_number,
                document_id=document_id
            )
            return results
        except Exception as e:
            logger.error(f"Error searching articles: {e}")
            return []


class CourtCaseRepository:
    """
    Repository for CourtCase operations.
    """
    
    def __init__(self):
        self.manager = get_edgedb_manager()
    
    async def create(
        self,
        case_number: str,
        title: str,
        court_level: str,
        summary: Optional[str] = None,
        decision: Optional[str] = None,
        decision_date: Optional[datetime] = None,
        court_name: Optional[str] = None,
        domain: Optional[str] = None,
        is_landmark: bool = False
    ) -> Any:
        """
        Create a new court case.
        """
        query = """
            INSERT CourtCase {
                case_number := <str>$case_number,
                title := <str>$title,
                court_level := <CourtLevel>$court_level,
                summary := <optional str>$summary,
                decision := <optional str>$decision,
                decision_date := <optional datetime>$decision_date,
                court_name := <optional str>$court_name,
                domain := <optional LegalDomain>$domain,
                is_landmark := <bool>$is_landmark
            }
        """
        
        try:
            result = await self.manager.query_single(
                query,
                case_number=case_number,
                title=title,
                court_level=court_level,
                summary=summary,
                decision=decision,
                decision_date=decision_date,
                court_name=court_name,
                domain=domain,
                is_landmark=is_landmark
            )
            logger.info(f"✅ Created court case: {case_number}")
            return result
        except Exception as e:
            logger.error(f"❌ Error creating court case: {e}")
            raise
    
    async def search(
        self,
        keyword: str,
        court_level: Optional[str] = None,
        domain: Optional[str] = None,
        landmark_only: bool = False,
        limit: int = 10
    ) -> List[Any]:
        """
        Search court cases.
        """
        query = """
            SELECT CourtCase {
                id,
                case_number,
                title,
                summary,
                decision,
                decision_date,
                court_level,
                court_name,
                domain,
                is_landmark,
                citation_count
            }
            FILTER
                contains(.search_vector, <str>$keyword)
                AND (.court_level = <optional CourtLevel>$court_level IF EXISTS $court_level ELSE True)
                AND (.domain = <optional LegalDomain>$domain IF EXISTS $domain ELSE True)
                AND (.is_landmark = <bool>$landmark_only IF $landmark_only ELSE True)
            ORDER BY .citation_count DESC
            LIMIT <int64>$limit
        """
        
        try:
            results = await self.manager.query(
                query,
                keyword=keyword,
                court_level=court_level,
                domain=domain,
                landmark_only=landmark_only,
                limit=limit
            )
            return results
        except Exception as e:
            logger.error(f"Error searching court cases: {e}")
            return []


class LegalTopicRepository:
    """
    Repository for LegalTopic operations.
    """
    
    def __init__(self):
        self.manager = get_edgedb_manager()
    
    async def create(
        self,
        name: str,
        description: Optional[str] = None,
        domain: Optional[str] = None,
        parent_topic_id: Optional[str] = None
    ) -> Any:
        """
        Create a new legal topic.
        """
        query = """
            INSERT LegalTopic {
                name := <str>$name,
                description := <optional str>$description,
                domain := <optional LegalDomain>$domain,
                parent_topic := (
                    SELECT LegalTopic 
                    FILTER .id = <optional uuid>$parent_topic_id
                    IF EXISTS $parent_topic_id ELSE <LegalTopic>{}
                )
            }
        """
        
        try:
            result = await self.manager.query_single(
                query,
                name=name,
                description=description,
                domain=domain,
                parent_topic_id=parent_topic_id
            )
            logger.info(f"✅ Created legal topic: {name}")
            return result
        except Exception as e:
            logger.error(f"❌ Error creating legal topic: {e}")
            raise
    
    async def get_all(self) -> List[Any]:
        """
        Get all legal topics with hierarchy.
        """
        query = """
            SELECT LegalTopic {
                id,
                name,
                description,
                domain,
                document_count,
                parent_topic: {
                    id,
                    name
                },
                child_topics: {
                    id,
                    name
                }
            }
            ORDER BY .name
        """
        
        try:
            results = await self.manager.query(query)
            return results
        except Exception as e:
            logger.error(f"Error getting topics: {e}")
            return []
