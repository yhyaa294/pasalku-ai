from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from backend.core.config import get_settings

settings = get_settings()

# Database connection strings
DATABASES = {
    "postgresql": settings.POSTGRESQL_URI,
    "mongodb": settings.MONGODB_URI,
    "supabase": settings.SUPABASE_URI,
    "turso": settings.TURSO_URI,
    "edgedb": settings.EDGEDB_URI,
}

# SQLAlchemy setup
Base = declarative_base()
engine = create_engine(DATABASES["postgresql"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # Import all models to ensure they are registered with SQLAlchemy
    from backend.models import user, consultation, chat
    Base.metadata.create_all(bind=engine)