from sqlalchemy.orm import Session
import models
import schemas
from core.security import get_password_hash, verify_password
from typing import List, Optional
from datetime import datetime

def get_user_by_email(db: Session, email: str):
    """Fetch a single user by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    """Fetch a single user by their ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Fetch multiple users with pagination."""
    return db.query(models.User).offset(skip).limit(limit).all()

def authenticate_user(db: Session, email: str, password: str):
    """Authenticate a user by email and password."""
    try:
        logger.info(f"Authenticating user: {email}")
        
        # Get user by email
        user = get_user_by_email(db, email)
        if not user:
            logger.warning(f"User not found during authentication: {email}")
            return False
        
        logger.info(f"User found: {user.email}")
        
        # Verify password
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Password verification failed for: {email}")
            return False
        
        logger.info(f"Authentication successful for: {email}")
        return user
        
    except Exception as e:
        logger.error(f"Error during authentication: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return False

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_in: schemas.UserUpdate):
    """Update user information."""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    update_data = user_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "password" and value:
            value = get_password_hash(value)
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """Delete a user from the database."""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def create_admin_user(db: Session, email: str, password: str):
    """Create an admin user in the database."""
    hashed_password = get_password_hash(password)
    db_user = models.User(
        email=email,
        hashed_password=hashed_password,
        role="admin"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Chat history functions
def create_chat_history(db: Session, user_id: int, query: str, response: str):
    """Create a new chat history entry."""
    db_chat = models.ChatHistory(
        user_id=user_id,
        query=query,
        response=response,
        timestamp=datetime.utcnow()
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def get_chat_histories(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    """Get chat histories for a specific user."""
    return db.query(models.ChatHistory).filter(
        models.ChatHistory.user_id == user_id
    ).order_by(models.ChatHistory.timestamp.desc()).offset(skip).limit(limit).all()
