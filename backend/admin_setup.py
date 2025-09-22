"""
Script to create admin user for the application
"""
from sqlalchemy.orm import Session
from database import SessionLocal
import crud
import models

def create_admin_user():
    """Create an admin user if it doesn't exist"""
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_email = "admin@pasalku.ai"
        existing_admin = crud.get_user_by_email(db, admin_email)

        if existing_admin:
            print(f"Admin user with email {admin_email} already exists")
            return existing_admin

        # Create admin user
        admin_user = crud.create_admin_user(db, admin_email, "admin123")
        print(f"Admin user created successfully: {admin_user.email}")
        print("Email: admin@pasalku.ai")
        print("Password: admin123")
        return admin_user

    except Exception as e:
        print(f"Error creating admin user: {e}")
        return None
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
