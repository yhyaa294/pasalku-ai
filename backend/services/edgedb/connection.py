"""
EdgeDB Connection Manager for Pasalku.ai Knowledge Graph

This module provides connection and query utilities for the EdgeDB Knowledge Graph.
"""

import os
import asyncio
from typing import Optional, Any, List, Dict
import edgedb
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class EdgeDBManager:
    """
    Manages EdgeDB connections and provides query utilities.
    """
    
    def __init__(self):
        self.client: Optional[edgedb.AsyncIOClient] = None
        self.dsn = os.getenv("EDGEDB_DSN", "edgedb://edgedb@localhost:5656/pasalku_knowledge_graph")
        
    async def connect(self) -> edgedb.AsyncIOClient:
        """
        Establish connection to EdgeDB.
        """
        try:
            if self.client is None:
                self.client = edgedb.create_async_client(dsn=self.dsn)
                logger.info("✅ EdgeDB connection established")
            return self.client
        except Exception as e:
            logger.error(f"❌ Failed to connect to EdgeDB: {e}")
            raise
    
    async def disconnect(self):
        """
        Close EdgeDB connection.
        """
        if self.client:
            await self.client.aclose()
            self.client = None
            logger.info("EdgeDB connection closed")
    
    async def query(self, query: str, **kwargs) -> Any:
        """
        Execute a read query.
        
        Args:
            query: EdgeQL query string
            **kwargs: Query parameters
        
        Returns:
            Query results
        """
        if not self.client:
            await self.connect()
        
        try:
            result = await self.client.query(query, **kwargs)
            return result
        except Exception as e:
            logger.error(f"Query error: {e}")
            raise
    
    async def query_single(self, query: str, **kwargs) -> Any:
        """
        Execute a query expecting a single result.
        """
        if not self.client:
            await self.connect()
        
        try:
            result = await self.client.query_single(query, **kwargs)
            return result
        except Exception as e:
            logger.error(f"Query single error: {e}")
            raise
    
    async def query_json(self, query: str, **kwargs) -> str:
        """
        Execute query and return results as JSON.
        """
        if not self.client:
            await self.connect()
        
        try:
            result = await self.client.query_json(query, **kwargs)
            return result
        except Exception as e:
            logger.error(f"Query JSON error: {e}")
            raise
    
    async def execute(self, query: str, **kwargs) -> None:
        """
        Execute a write query (insert, update, delete).
        """
        if not self.client:
            await self.connect()
        
        try:
            await self.client.execute(query, **kwargs)
            logger.debug(f"Executed query successfully")
        except Exception as e:
            logger.error(f"Execute error: {e}")
            raise


# Singleton instance
_edgedb_manager: Optional[EdgeDBManager] = None


def get_edgedb_manager() -> EdgeDBManager:
    """
    Get the singleton EdgeDB manager instance.
    """
    global _edgedb_manager
    if _edgedb_manager is None:
        _edgedb_manager = EdgeDBManager()
    return _edgedb_manager


async def init_edgedb():
    """
    Initialize EdgeDB connection on application startup.
    """
    manager = get_edgedb_manager()
    await manager.connect()
    logger.info("🗄️ EdgeDB Knowledge Graph initialized")


async def close_edgedb():
    """
    Close EdgeDB connection on application shutdown.
    """
    manager = get_edgedb_manager()
    await manager.disconnect()
    logger.info("EdgeDB connection closed")


# ===========================
# HELPER FUNCTIONS
# ===========================

async def test_connection() -> bool:
    """
    Test EdgeDB connection.
    
    Returns:
        True if connection successful, False otherwise
    """
    try:
        manager = get_edgedb_manager()
        await manager.connect()
        
        # Simple test query
        result = await manager.query_single("SELECT 1")
        
        if result == 1:
            logger.info("✅ EdgeDB connection test passed")
            return True
        else:
            logger.error("❌ EdgeDB connection test failed")
            return False
    except Exception as e:
        logger.error(f"❌ EdgeDB connection test error: {e}")
        return False


async def get_database_info() -> Dict[str, Any]:
    """
    Get database information and statistics.
    
    Returns:
        Dictionary with database info
    """
    try:
        manager = get_edgedb_manager()
        
        # Count documents
        doc_count = await manager.query_single("""
            SELECT count(LegalDocument)
        """)
        
        # Count articles
        article_count = await manager.query_single("""
            SELECT count(Article)
        """)
        
        # Count court cases
        case_count = await manager.query_single("""
            SELECT count(CourtCase)
        """)
        
        # Count topics
        topic_count = await manager.query_single("""
            SELECT count(LegalTopic)
        """)
        
        return {
            "legal_documents": doc_count,
            "articles": article_count,
            "court_cases": case_count,
            "legal_topics": topic_count,
            "total_items": doc_count + article_count + case_count + topic_count,
            "status": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting database info: {e}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }


if __name__ == "__main__":
    # Test the connection
    async def main():
        print("Testing EdgeDB connection...")
        success = await test_connection()
        
        if success:
            print("\nGetting database info...")
            info = await get_database_info()
            print("\n📊 Database Statistics:")
            for key, value in info.items():
                print(f"  {key}: {value}")
        
        await close_edgedb()
    
    asyncio.run(main())
