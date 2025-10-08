from sqlalchemy.orm import Session
from backend import models
from backend import schemas
from backend.core.security import get_password_hash, verify_password
from typing import List, Optional
from datetime import datetime
from uuid import UUID
import logging
import json

logger = logging.getLogger(__name__)

# User CRUD operations
def get_user_by_email(db: Session, email: str):
    """Fetch a single user by their email address."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: UUID):
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
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: UUID, user_in: schemas.UserUpdate):
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

def delete_user(db: Session, user_id: UUID):
    """Delete a user from the database."""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def create_admin_user(db: Session, email: str, password: str, full_name: str = "Admin"):
    """Create an admin user in the database."""
    hashed_password = get_password_hash(password)
    db_user = models.User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name,
        role=models.UserRole.ADMIN
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Chat Session CRUD operations
def create_chat_session(db: Session, user_id: UUID, title: Optional[str] = None):
    """Create a new chat session."""
    db_session = models.ChatSession(
        user_id=user_id,
        title=title
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_chat_session(db: Session, session_id: UUID, user_id: UUID):
    """Get a specific chat session for a user."""
    return db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == user_id
    ).first()

def get_user_chat_sessions(db: Session, user_id: UUID, skip: int = 0, limit: int = 10):
    """Get all chat sessions for a user."""
    return db.query(models.ChatSession).filter(
        models.ChatSession.user_id == user_id
    ).order_by(models.ChatSession.updated_at.desc()).offset(skip).limit(limit).all()

def update_chat_session(db: Session, session_id: UUID, title: Optional[str] = None, status: Optional[str] = None):
    """Update a chat session."""
    db_session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not db_session:
        return None

    if title is not None:
        db_session.title = title
    if status is not None:
        db_session.status = status

    db.commit()
    db.refresh(db_session)
    return db_session

def delete_chat_session(db: Session, session_id: UUID, user_id: UUID):
    """Delete a chat session."""
    db_session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == user_id
    ).first()
    if db_session:
        db.delete(db_session)
        db.commit()
        return True
    return False

# Chat Message CRUD operations
def create_chat_message(db: Session, session_id: UUID, role: str, content: str, citations: Optional[List[str]] = None):
    """Create a new chat message."""
    citations_json = json.dumps(citations) if citations else None
    db_message = models.ChatMessage(
        session_id=session_id,
        role=role,
        content=content,
        citations=citations_json
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    # Update session's updated_at
    db.query(models.ChatSession).filter(models.ChatSession.id == session_id).update({
        "updated_at": datetime.utcnow()
    })
    db.commit()

    return db_message

def get_chat_messages(db: Session, session_id: UUID, skip: int = 0, limit: int = 50):
    """Get messages for a chat session."""
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.session_id == session_id
    ).order_by(models.ChatMessage.created_at.asc()).offset(skip).limit(limit).all()

    # Parse citations JSON
    for message in messages:
        if message.citations:
            try:
                message.citations = json.loads(message.citations)
            except:
                message.citations = []

    return messages

def get_chat_history(db: Session, session_id: UUID, user_id: UUID):
    """Get complete chat history for a session."""
    session = get_chat_session(db, session_id, user_id)
    if not session:
        return None

    messages = get_chat_messages(db, session_id)
    return {
        "session_id": session_id,
        "messages": messages,
        "session": session
    }
