"""
Test suite untuk autentikasi
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import json

from backend.database import get_db
from backend.main import app
from backend import crud, models, schemas
from backend.core.security_updated import get_password_hash

client = TestClient(app)

def test_register_user():
    """Test user registration."""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }

    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201

    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
    assert "id" in data

def test_login_success():
    """Test successful login."""
    # First register a user
    user_data = {
        "email": "login_test@example.com",
        "password": "testpassword123",
        "full_name": "Login Test User"
    }
    client.post("/api/auth/register", json=user_data)

    # Then login
    login_data = {
        "username": "login_test@example.com",
        "password": "testpassword123"
    }

    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials():
    """Test login with invalid credentials."""
    login_data = {
        "username": "nonexistent@example.com",
        "password": "wrongpassword"
    }

    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_refresh_token():
    """Test token refresh."""
    # First login to get tokens
    user_data = {
        "email": "refresh_test@example.com",
        "password": "testpassword123",
        "full_name": "Refresh Test User"
    }
    client.post("/api/auth/register", json=user_data)

    login_data = {
        "username": "refresh_test@example.com",
        "password": "testpassword123"
    }
    login_response = client.post("/api/auth/login", data=login_data)
    refresh_token = login_response.json()["refresh_token"]

    # Then refresh token
    refresh_data = {"refresh_token": refresh_token}
    response = client.post("/api/auth/refresh-token", json=refresh_data)
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_logout():
    """Test logout endpoint."""
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert "Successfully logged out" in response.json()["message"]

def test_get_current_user():
    """Test getting current user info."""
    # Register and login first
    user_data = {
        "email": "me_test@example.com",
        "password": "testpassword123",
        "full_name": "Me Test User"
    }
    client.post("/api/auth/register", json=user_data)

    login_data = {
        "username": "me_test@example.com",
        "password": "testpassword123"
    }
    login_response = client.post("/api/auth/login", data=login_data)
    access_token = login_response.json()["access_token"]

    # Get current user
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
