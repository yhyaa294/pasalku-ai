"""
Test suite untuk fitur chat
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from uuid import UUID

from backend.database import get_db
from backend.main import app
from backend import crud, models, schemas

client = TestClient(app)

def test_create_chat_session_and_message():
    """Test creating chat session and messages."""
    # Register and login user
    user_data = {
        "email": "chat_test@example.com",
        "password": "testpassword123",
        "full_name": "Chat Test User"
    }
    client.post("/api/auth/register", json=user_data)

    login_data = {
        "username": "chat_test@example.com",
        "password": "testpassword123"
    }
    login_response = client.post("/api/auth/login", data=login_data)
    access_token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    # Create chat session
    response = client.post("/api/chat/consult", json={"query": "Apa itu hukum pidana?"}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "message" in data

    session_id = data["session_id"]

    # Get chat history
    response = client.get(f"/api/chat/session/{session_id}", headers=headers)
    assert response.status_code == 200
    history = response.json()
    assert history["session_id"] == session_id
    assert isinstance(history["messages"], list)

def test_get_chat_history_list():
    """Test getting list of chat sessions."""
    # Register and login user
    user_data = {
        "email": "chat_list_test@example.com",
        "password": "testpassword123",
        "full_name": "Chat List Test User"
    }
    client.post("/api/auth/register", json=user_data)

    login_data = {
        "username": "chat_list_test@example.com",
        "password": "testpassword123"
    }
    login_response = client.post("/api/auth/login", data=login_data)
    access_token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    response = client.get("/api/chat/history", headers=headers)
    assert response.status_code == 200
    sessions = response.json()
    assert isinstance(sessions, list)

def test_delete_chat_session():
    """Test deleting a chat session."""
    # Register and login user
    user_data = {
        "email": "chat_delete_test@example.com",
        "password": "testpassword123",
        "full_name": "Chat Delete Test User"
    }
    client.post("/api/auth/register", json=user_data)

    login_data = {
        "username": "chat_delete_test@example.com",
        "password": "testpassword123"
    }
    login_response = client.post("/api/auth/login", data=login_data)
    access_token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    # Create chat session
    response = client.post("/api/chat/consult", json={"query": "Apa itu hukum pidana?"}, headers=headers)
    session_id = response.json()["session_id"]

    # Delete session
    response = client.delete(f"/api/chat/session/{session_id}", headers=headers)
    assert response.status_code == 200
    assert "Session berhasil dihapus" in response.json()["message"]
