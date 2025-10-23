#!/usr/bin/env python3
"""
Test script to debug authentication issues in Pasalku.ai backend
"""
import sys
import os
sys.path.append('backend')

from sqlalchemy.orm import Session
from backend.database import get_db_connections, init_db
from backend.crud import create_user, get_user_by_email, authenticate_user
from backend.core.security_updated import get_password_hash, verify_password
from backend.schemas import UserCreate

def test_database_connection():
    """Test database connection and initialization"""
    print("🔍 Testing database connection...")

    try:
        # Initialize database
        init_db()
        print("✅ Database initialization successful")

        # Test connection
        db_connections = get_db_connections()
        with db_connections.get_db() as db:
            db.execute("SELECT 1")
        print("✅ Database connection successful")

        return True
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False

def test_user_creation():
    """Test user creation and password hashing"""
    print("\n🔍 Testing user creation...")

    try:
        db_connections = get_db_connections()
        with db_connections.get_db() as db:
            # Create a test user
            user_data = UserCreate(
                email="test@example.com",
                password="testpassword123",
                full_name="Test User"
            )

            # Hash the password
            hashed_password = get_password_hash(user_data.password)
            print(f"✅ Password hashed successfully: {hashed_password[:20]}...")

            # Verify password hashing works
            is_valid = verify_password(user_data.password, hashed_password)
            print(f"✅ Password verification: {is_valid}")

            # Create user in database
            user = create_user(db, user_data)
            print(f"✅ User created successfully: {user.email}")

            # Test user retrieval
            retrieved_user = get_user_by_email(db, user_data.email)
            if retrieved_user:
                print(f"✅ User retrieval successful: {retrieved_user.email}")

                # Test authentication
                auth_result = authenticate_user(db, user_data.email, user_data.password)
                if auth_result:
                    print("✅ Authentication successful")
                    return True
                else:
                    print("❌ Authentication failed")
                    return False
            else:
                print("❌ User retrieval failed")
                return False

    except Exception as e:
        print(f"❌ User creation test failed: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_authentication_flow():
    """Test the complete authentication flow"""
    print("\n🔍 Testing authentication flow...")

    try:
        db_connections = get_db_connections()
        with db_connections.get_db() as db:
            # Test with existing user
            user = get_user_by_email(db, "test@example.com")
            if user:
                print(f"✅ Found test user: {user.email}")

                # Test password verification
                is_valid = verify_password("testpassword123", user.hashed_password)
                print(f"✅ Password verification result: {is_valid}")

                # Test authentication
                auth_user = authenticate_user(db, "test@example.com", "testpassword123")
                if auth_user:
                    print("✅ Complete authentication flow successful")
                    return True
                else:
                    print("❌ Authentication flow failed")
                    return False
            else:
                print("❌ Test user not found")
                return False

    except Exception as e:
        print(f"❌ Authentication flow test failed: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Pasalku.ai Authentication Debug Tests")
    print("=" * 50)

    # Test database connection
    if not test_database_connection():
        print("❌ Database tests failed. Stopping.")
        return

    # Test user creation
    if not test_user_creation():
        print("❌ User creation tests failed. Stopping.")
        return

    # Test authentication flow
    if not test_authentication_flow():
        print("❌ Authentication flow tests failed. Stopping.")
        return

    print("\n🎉 All tests passed! Authentication system is working correctly.")
    print("\nIf login is still failing in the frontend, the issue might be:")
    print("1. Frontend not sending correct data format")
    print("2. CORS issues")
    print("3. Environment variable issues")
    print("4. Frontend API URL configuration")

if __name__ == "__main__":
    main()
