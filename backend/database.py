"""
Database configuration and connection management for multiple databases
"""
import logging
from contextlib import contextmanager
from typing import Generator, Optional
from functools import lru_cache

import motor.motor_asyncio
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import SQLAlchemyError
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

try:
    import libsql_experimental as libsql
except ImportError:
    libsql = None

try:
    import edgedb
except ImportError:
    edgedb = None

# Import settings
from core.config import get_settings

# Setup logging
logger = logging.getLogger(__name__)

class DatabaseConnections:
    """Manage all database connections."""

    def __init__(self):
        """Initialize database connections."""
        settings = get_settings()

        # PostgreSQL (Main Application Database) - Neon Instance
        self.pg_url = settings.DATABASE_URL

        # Handle SQLite specific configuration
        connect_args = {"check_same_thread": False} if self.pg_url.startswith("sqlite") else {}

        # Create PostgreSQL engine
        self.pg_engine = create_engine(
            self.pg_url,
            pool_pre_ping=True,
            pool_recycle=300,
            connect_args=connect_args
        )

        # Create PostgreSQL session maker
        self.PostgresSession = scoped_session(
            sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self.pg_engine
            )
        )

        # MongoDB (Analytics Database) - Unstructured Data Block
        self.mongodb_url = settings.MONGODB_URI
        self.mongodb_name = settings.MONGO_DB_NAME
        self.mongodb_client = None
        self.mongodb_db = None

        if self.mongodb_url:
            try:
                # Async MongoDB client for background tasks
                self.mongodb_async_client = motor.motor_asyncio.AsyncIOMotorClient(self.mongodb_url)
                self.mongodb_async_db = self.mongodb_async_client[self.mongodb_name]

                # Sync MongoDB client for regular operations
                self.mongodb_client = MongoClient(self.mongodb_url)
                self.mongodb_db = self.mongodb_client[self.mongodb_name]

                logger.info("MongoDB connection established successfully")
            except Exception as e:
                logger.warning(f"Failed to connect to MongoDB: {str(e)}")
                self.mongodb_client = None
                self.mongodb_db = None

        # Supabase (Realtime & Edge Functions) - Edge Computing Block
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_anon_key = settings.SUPABASE_ANON_KEY
        self.supabase_service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.supabase_jwt_secret = settings.SUPABASE_JWT_SECRET
        self.supabase_engine = None
        if self.supabase_url:
            try:
                # Use direct Supabase Postgres URL if available, otherwise construct from components
                supabase_db_url = settings.PASALKU_AI_POSTGRES_URL or f"postgresql://postgres:{self.supabase_anon_key}@{self.supabase_url.replace('https://', '')}:5432/postgres?sslmode=require"
                # Fix dialect for SQLAlchemy 2.0 - use postgresql+psycopg2://
                if supabase_db_url and supabase_db_url.startswith("postgresql://"):
                    supabase_db_url = supabase_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
                self.supabase_engine = create_engine(
                    supabase_db_url,
                    pool_pre_ping=True,
                    pool_recycle=300,
                    connect_args={}
                )
                supabase_session = sessionmaker(bind=self.supabase_engine)
                self.supabase_session = scoped_session(supabase_session)
                logger.info("Supabase connection established successfully")
            except Exception as e:
                logger.warning(f"Failed to connect to Supabase: {str(e)}")
                self.supabase_engine = None

        # Turso (Edge SQL / SQLite) - Ephemeral Cache Block
        self.turso_auth_token = settings.TURSO_AUTH_TOKEN
        self.turso_db_url = settings.TURSO_DATABASE_URL
        self.turso_client = None
        if self.turso_db_url and libsql:
            try:
                self.turso_client = libsql.connect(database=self.turso_db_url, auth_token=self.turso_auth_token)
                logger.info("Turso connection established successfully")
            except Exception as e:
                logger.warning(f"Failed to connect to Turso: {str(e)}")
                self.turso_client = None

        # EdgeDB (Graph-like Data) - Semantic Knowledge Graph Block
        self.edgedb_instance = settings.EDGEDB_INSTANCE
        self.edgedb_secret_key = settings.EDGEDB_SECRET_KEY
        self.edgedb_client = None
        if self.edgedb_instance and edgedb:
            try:
                self.edgedb_client = edgedb.create_client(
                    dsn=f"edgedb://{self.edgedb_instance}?secret_key={self.edgedb_secret_key}"
                )
                logger.info("EdgeDB connection established successfully")
            except Exception as e:
                logger.warning(f"Failed to connect to EdgeDB: {str(e)}")
                self.edgedb_client = None

    @contextmanager
    def get_db(self) -> Generator:
        """Get PostgreSQL database session."""
        db = self.PostgresSession()
        try:
            yield db
        except SQLAlchemyError as e:
            db.rollback()
            raise e
        finally:
            db.close()
    
    def get_mongodb(self) -> Optional[MongoClient]:
        """Get MongoDB database instance."""
        return self.mongodb_db
    
    def get_mongodb_async(self) -> Optional[motor.motor_asyncio.AsyncIOMotorDatabase]:
        """Get async MongoDB database instance."""
        return self.mongodb_async_db

    @contextmanager
    def get_supabase_db(self) -> Generator:
        """Get Supabase Postgres database session."""
        if self.supabase_session:
            db = self.supabase_session()
            try:
                yield db
            except SQLAlchemyError as e:
                db.rollback()
                raise e
            finally:
                db.close()
        else:
            raise ValueError("Supabase not connected")

    def get_turso_db(self) -> Optional[any]:
        """Get Turso database instance."""
        return self.turso_client

    def get_edgedb_client(self) -> Optional[any]:
        """Get EdgeDB client instance."""
        return self.edgedb_client
    
    def verify_connections(self) -> bool:
        """Verify all database connections are working."""
        try:
            # Check PostgreSQL
            with self.get_db() as db:
                db.execute("SELECT 1")

            # Check MongoDB if configured
            if self.mongodb_client:
                self.mongodb_client.admin.command('ping')

            # Check Supabase if configured
            if self.supabase_engine:
                with self.get_supabase_db() as db:
                    db.execute("SELECT 1")

            # Check Turso if configured
            if self.turso_client:
                cursor = self.turso_client.cursor()
                cursor.execute("SELECT 1")
                cursor.fetchone()

            # Check EdgeDB if configured
            if self.edgedb_client:
                # Simple query to test
                result = self.edgedb_client.query("SELECT 1")
                result.fetchall()

            return True
        except Exception as e:
            logger.error(f"Database connection verification failed: {str(e)}")
            return False

# SQLAlchemy Base
Base = declarative_base()

# Global database connections instance
@lru_cache()
def get_db_connections() -> DatabaseConnections:
    """Get cached database connections instance."""
    return DatabaseConnections()

# Dependency for FastAPI
def get_db():
    """Dependency to get PostgreSQL database session."""
    with get_db_connections().get_db() as db:
        yield db

def get_supabase_db():
    """Dependency to get Supabase database session."""
    with get_db_connections().get_supabase_db() as db:
        yield db

def get_mongodb():
    """Dependency to get MongoDB database instance."""
    return get_db_connections().get_mongodb()

def get_mongo_client():
    """Get MongoDB client for direct operations (sync).
    
    Returns:
        MongoClient instance or None if MongoDB not available
    """
    db_connections = get_db_connections()
    return db_connections.mongodb_client

def get_turso_db():
    """Dependency to get Turso database instance."""
    return get_db_connections().get_turso_db()

def get_edgedb_client():
    """Dependency to get EdgeDB client instance."""
    return get_db_connections().get_edgedb_client()

def init_db():
    """
    Initialize the database by creating all tables.
    This should be called during application startup.
    """
    try:
        # Get database engine from connections instance
        db_connections = get_db_connections()
        Base.metadata.create_all(bind=db_connections.pg_engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

# Initialize SessionLocal on module import for backward compatibility
SessionLocal = get_db_connections().PostgresSession
