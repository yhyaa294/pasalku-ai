from sqlalchemy.orm import Session
from backend import models
from backend import schemas
from backend.core.security_updated import get_password_hash, verify_password
from typing import List, Optional
from datetime import datetime
from uuid import UUID
import logging
import json
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import base64
import os

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
    """Create a new chat message with encrypted content."""
    citations_json = json.dumps(citations) if citations else None

    # Encrypt the message content
    encrypted_content = encrypt_text(content)

    db_message = models.ChatMessage(
        session_id=session_id,
        role=role,
        content=encrypted_content,  # Store encrypted content
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
    """Get messages for a chat session with decrypted content."""
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.session_id == session_id
    ).order_by(models.ChatMessage.created_at.asc()).offset(skip).limit(limit).all()

    # Decrypt content and parse citations JSON
    for message in messages:
        # Decrypt the content
        try:
            message.content = decrypt_text(message.content)
        except Exception as e:
            logger.error(f"Failed to decrypt message {message.id}: {str(e)}")
            message.content = "[Encrypted content unavailable]"

        # Parse citations JSON
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

# PIN and Encryption utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pin(pin: str) -> str:
    """Hash a PIN for storage."""
    return pwd_context.hash(pin)

def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    """Verify a PIN against its hash."""
    return pwd_context.verify(plain_pin, hashed_pin)

def get_encryption_key() -> bytes:
    """Get or generate encryption key. In production, use a secure key management system."""
    key = os.getenv("ENCRYPTION_KEY")
    if not key:
        # Generate a key (in production, store this securely)
        key = base64.urlsafe_b64encode(os.urandom(32)).decode()
        logger.warning("Using generated encryption key. Set ENCRYPTION_KEY environment variable in production.")
    return base64.urlsafe_b64decode(key)

def encrypt_text(text: str) -> str:
    """Encrypt text using Fernet."""
    f = Fernet(get_encryption_key())
    return f.encrypt(text.encode()).decode()

def decrypt_text(encrypted_text: str) -> str:
    """Decrypt text using Fernet."""
    f = Fernet(get_encryption_key())
    return f.decrypt(encrypted_text.encode()).decode()

# Enhanced Chat Session operations
def update_chat_session_enhanced(db: Session, session_id: UUID, update_data: schemas.ChatSessionUpdate):
    """Update chat session with enhanced fields."""
    db_session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not db_session:
        return None

    update_dict = update_data.dict(exclude_unset=True)

    # Handle PIN hashing
    if "pin" in update_dict and update_dict["pin"]:
        db_session.pin_hash = hash_pin(update_dict["pin"])
        del update_dict["pin"]

    # Handle consultation_data JSON
    if "consultation_data" in update_dict and update_dict["consultation_data"]:
        db_session.consultation_data = json.dumps(update_dict["consultation_data"].dict())
        del update_dict["consultation_data"]

    # Update other fields
    for field, value in update_dict.items():
        setattr(db_session, field, value)

    db.commit()
    db.refresh(db_session)
    return db_session

def verify_session_pin(db: Session, session_id: UUID, pin: str) -> bool:
    """Verify PIN for session access."""
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not session or not session.pin_hash:
        return False
    return verify_pin(pin, session.pin_hash)

def get_session_with_access(db: Session, session_id: UUID, user_id: UUID, pin: Optional[str] = None):
    """Get session with PIN verification if required."""
    session = get_chat_session(db, session_id, user_id)
    if not session:
        return None

    # If PIN is set, require verification
    if session.pin_hash and not verify_pin(pin or "", session.pin_hash):
        return None

    messages = get_chat_messages(db, session_id)

    # Parse consultation_data
    consultation_data = None
    if session.consultation_data:
        try:
            consultation_data = schemas.ConsultationData(**json.loads(session.consultation_data))
        except:
            consultation_data = None

    return {
        "session": session,
        "messages": messages,
        "consultation_data": consultation_data
    }

def get_user_sessions_with_pin_status(db: Session, user_id: UUID, skip: int = 0, limit: int = 10):
    """Get user sessions with PIN status indicator."""
    sessions = get_user_chat_sessions(db, user_id, skip, limit)
    for session in sessions:
        session.has_pin = bool(session.pin_hash)
    return sessions

def save_session_feedback(db: Session, session_id: UUID, rating: int, feedback: Optional[str] = None):
    """Save feedback for a session."""
    db_session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if not db_session:
        return False

    db_session.rating = rating
    db_session.feedback = feedback
    db.commit()
    return True
