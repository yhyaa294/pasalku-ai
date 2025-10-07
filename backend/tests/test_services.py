"""
Test backend services and endpoints.
Untuk menjalankan: pytest test_services.py -v
"""

import pytest
from httpx import AsyncClient
import asyncio
from backend.server import app
from backend.services.ai_service import create_ai_service
from backend.core.config import settings

# --- AI Service Tests ---

@pytest.mark.asyncio
async def test_create_ai_service():
    """Test pembuatan AI service."""
    service = create_ai_service("byteplus")
    assert service is not None
    assert await service.test_connection() is True

@pytest.mark.asyncio
async def test_ai_service_legal_response():
    """Test mendapatkan respons hukum dari AI service."""
    service = create_ai_service("byteplus")
    response = await service.get_legal_response(
        query="Apa syarat mendirikan PT di Indonesia?"
    )
    assert isinstance(response, dict)
    assert "answer" in response
    assert "citations" in response
    assert "disclaimer" in response
    assert len(response["answer"]) > 0
    assert len(response["citations"]) > 0

# --- API Endpoint Tests ---

@pytest.mark.asyncio
async def test_health_endpoint():
    """Test health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "ai_service_available" in data
        assert data["ai_service_available"] is True

@pytest.mark.asyncio
async def test_consult_endpoint():
    """Test public consultation endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Test tanpa query (should fail)
        response = await client.post("/api/consult", json={})
        assert response.status_code == 400
        
        # Test dengan query valid
        response = await client.post("/api/consult", json={
            "query": "Apa syarat mendirikan PT di Indonesia?"
        })
        assert response.status_code == 200
        data = response.json()
        assert "session_id" in data
        assert "response" in data
        assert "citations" in data
        assert len(data["response"]) > 0
        assert len(data["citations"]) > 0

@pytest.mark.asyncio
async def test_consult_endpoint_with_context():
    """Test consultation with additional context."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/consult", json={
            "query": "Apakah bisa mendirikan PT sendiri?",
            "context": "Saya berusia 25 tahun dan sudah memiliki KTP."
        })
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert len(data["response"]) > 0

if __name__ == "__main__":
    pytest.main(["-v", __file__])