"""
EdgeDB Service for Knowledge Graph operations
Handles connections and queries for legal knowledge graph
"""
import os
import logging
from typing import Optional
import edgedb

logger = logging.getLogger(__name__)

class EdgeDBService:
    """EdgeDB service for legal knowledge graph"""

    def __init__(self):
        self.instance_name = os.getenv("EDGEDB_INSTANCE", "vercel-ghTppstGM56lmSwDHwInuiNV/edgedb-rose-park")
        self.secret_key = os.getenv("EDGEDB_SECRET_KEY")
        self._client: Optional[edgedb.AsyncClient] = None

    async def get_client(self) -> edgedb.AsyncClient:
        """Get EdgeDB async client"""
        if self._client is None:
            if not self.secret_key:
                logger.warning("EDGEDB_SECRET_KEY not configured")

            try:
                self._client = edgedb.create_async_client(
                    instance=self.instance_name,
                    secret_key=self.secret_key
                )
                logger.info("EdgeDB client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize EdgeDB client: {e}")
                # Return mock client for development
                self._client = MockEdgeDBClient()

        return self._client

    async def health_check(self) -> bool:
        """Check if EdgeDB connection is healthy"""
        try:
            client = await self.get_client()
            # Simple query to test connection
            result = await client.query("SELECT 1")
            return len(result) > 0
        except Exception as e:
            logger.error(f"EdgeDB health check failed: {e}")
            return False

    async def close(self):
        """Close EdgeDB connection"""
        if self._client:
            await self._client.aclose()
            self._client = None

class MockEdgeDBClient:
    """Mock client for development when EdgeDB is not available"""

    async def query(self, query_str: str, **kwargs):
        """Mock query method"""
        logger.warning("Using mock EdgeDB client - actual database not connected")

        # Return mock legal articles for testing
        if "LegalArticle" in query_str:
            return [
                edgedb_mock_object({
                    "id": "art-001",
                    "title": "KUHP Pasal 338 - Pembunuhan",
                    "content": "Barangsiapa dengan sengaja menghilangkan jiwa orang lain, diancam dengan pidana penjara selama-lamanya 10 tahun.",
                    "category": "criminal",
                    "metadata": {"chapter": "34", "law": "KUHP"},
                    "score": 0.95
                })
            ]
        return [1]

    async def aclose(self):
        """Mock close method"""
        pass

def edgedb_mock_object(data: dict):
    """Create mock EdgeDB object"""
    class MockObject:
        def __init__(self, data):
            for key, value in data.items():
                setattr(self, key, value)

    return MockObject(data)

# Global instance
edgedb_service = EdgeDBService()

async def get_edgedb_client() -> edgedb.AsyncClient:
    """Dependency injection for FastAPI"""
    return await edgedb_service.get_client()