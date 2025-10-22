import os
import logging
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from backend.models import user, consultation, chat
from backend.core.config import get_settings

logger = logging.getLogger("pasalku-backend")

settings = get_settings()

# Database connection setup
DATABASE_URL = settings.DATABASE_URL  # Adjust this according to your environment
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()

def init_db():
    """Initialize the database and create tables."""
    logger.info("Initializing the database...")
    try:
        # Create all tables
        metadata.create_all(bind=engine)
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing the database: {str(e)}")
        raise

def get_db():
    """Get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()