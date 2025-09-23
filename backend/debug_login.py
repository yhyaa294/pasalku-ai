#!/usr/bin/env python3
"""
Debug script untuk menguji login functionality
"""
import sys
import os
import asyncio
from sqlalchemy.orm import Session

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, init_db
from core.security import verify_password, get_password_hash
import crud
import models

async def debug_login_flow():
    """Debug complete login flow"""
    print("🔍 Starting Login Debug Session...")
    print("=" * 50)

    # Initialize database
    try:
        init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

    db = SessionLocal()
    
    try:
        # Test 1: Check if users exist
        print("\n📊 Test 1: Checking existing users...")
        users = db.query(models.User).all()
        print(f"Found {len(users)} users in database:")
        
        for user in users:
            print(f"  - Email: {user.email}, Role: {user.role}")

        if not users:
            print("⚠️  No users found! Creating test user...")
            # Create test user
            test_email = "test@pasalku.ai"
            test_password = "test123"
            hashed_password = get_password_hash(test_password)
            
            test_user = models.User(
                email=test_email,
                hashed_password=hashed_password,
                role=models.UserRole.PUBLIC
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✅ Created test user: {test_email} / {test_password}")

        # Test 2: Test password verification
        print("\n🔐 Test 2: Testing password verification...")
        test_user = db.query(models.User).first()
        
        if test_user:
            print(f"Testing user: {test_user.email}")
            
            # Test with correct password (if we know it)
            test_passwords = ["test123", "admin123", "password", "123456"]
            
            for test_pass in test_passwords:
                is_valid = verify_password(test_pass, test_user.hashed_password)
                print(f"  Password '{test_pass}': {'✅ VALID' if is_valid else '❌ Invalid'}")
                
                if is_valid:
                    print(f"🎉 Found working password for {test_user.email}: {test_pass}")
                    break

        # Test 3: Test authentication function
        print("\n🔍 Test 3: Testing authentication function...")
        if test_user:
            # Test authenticate_user function
            auth_result = crud.authenticate_user(db, test_user.email, "test123")
            print(f"Authentication result: {'✅ SUCCESS' if auth_result else '❌ FAILED'}")

        # Test 4: Check database schema
        print("\n📋 Test 4: Checking database schema...")
        try:
            # Check if all required columns exist
            user_columns = [column.name for column in models.User.__table__.columns]
            print(f"User table columns: {user_columns}")
            
            required_columns = ['id', 'email', 'hashed_password', 'role']
            missing_columns = [col for col in required_columns if col not in user_columns]
            
            if missing_columns:
                print(f"❌ Missing columns: {missing_columns}")
            else:
                print("✅ All required columns present")
                
        except Exception as e:
            print(f"❌ Schema check failed: {e}")

        return True

    except Exception as e:
        print(f"❌ Debug session failed: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = asyncio.run(debug_login_flow())
    
    if success:
        print("\n🎯 Debug session completed!")
        print("Check the results above to identify the issue.")
    else:
        print("\n💥 Debug session failed!")
    
    print("\n💡 Next steps:")
    print("1. Run this script: python backend/debug_login.py")
    print("2. Check the output for any failed tests")
    print("3. Use the working credentials shown above to test login")