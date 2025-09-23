#!/usr/bin/env python3
"""
Direct test untuk login functionality
"""
import sys
import os
import requests
import json

# Test configuration
BACKEND_URL = "http://localhost:8001"
TEST_EMAIL = "test@pasalku.ai"
TEST_PASSWORD = "test123"

def test_register_user():
    """Test registering a new user"""
    print("🔧 Testing user registration...")
    
    url = f"{BACKEND_URL}/api/auth/register"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        print(f"Registration Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            return True
        elif response.status_code == 400:
            print("⚠️  User already exists (this is OK for testing)")
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

def test_login_user():
    """Test logging in with the user"""
    print("\n🔐 Testing user login...")
    
    url = f"{BACKEND_URL}/api/auth/login"
    
    # Use form data as expected by OAuth2PasswordRequestForm
    data = {
        "username": TEST_EMAIL,  # OAuth2 uses 'username' field
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(
            url, 
            data=data,  # Use form data, not JSON
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10
        )
        
        print(f"Login Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login successful!")
            print(f"Token: {result.get('access_token', 'N/A')[:20]}...")
            print(f"User: {result.get('user', {})}")
            return True
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

def test_backend_health():
    """Test if backend is running"""
    print("🏥 Testing backend health...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend not reachable: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Pasalku.ai Login Debug Test")
    print("=" * 40)
    
    # Test sequence
    health_ok = test_backend_health()
    if not health_ok:
        print("\n💥 Backend is not running! Start it first:")
        print("cd backend && python app.py")
        sys.exit(1)
    
    register_ok = test_register_user()
    login_ok = test_login_user()
    
    print("\n" + "=" * 40)
    print("📋 Test Results:")
    print(f"Backend Health: {'✅' if health_ok else '❌'}")
    print(f"Registration: {'✅' if register_ok else '❌'}")
    print(f"Login: {'✅' if login_ok else '❌'}")
    
    if login_ok:
        print("\n🎉 All tests passed! Login is working!")
        print(f"Use these credentials to test: {TEST_EMAIL} / {TEST_PASSWORD}")
    else:
        print("\n💥 Login test failed! Check the error messages above.")
        print("\n💡 Common fixes:")
        print("1. Check if SECRET_KEY is set in .env")
        print("2. Verify password hashing is working")
        print("3. Check database connection")
        print("4. Verify user exists in database")