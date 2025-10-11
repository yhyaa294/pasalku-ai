"""
Database configuration and connection management for multiple databases
"""
import os
import logging
from contextlib import contextmanager
from typing import Generator, Optional
from pathlib import Path
from functools import lru_cache

import motor.motor_asyncio
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import SQLAlchemyError
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

try:
    import libsql_experimental as libsql
except ImportError:
    libsql = None

try:
    import edgedb
except ImportError:
    edgedb = None

# Setup logging
logger = logging.getLogger(__name__)

# Load environment variables from project root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class DatabaseConnections:
    """Manage all database connections."""
    
    def __init__(self):
        """Initialize database connections."""
        # PostgreSQL (Main Application Database)
        self.pg_url = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
        
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
        
        # MongoDB (Analytics Database)
        self.mongodb_url = os.getenv("MONGODB_URI")
        self.mongodb_name = os.getenv("MONGO_DB_NAME", "pasalku_ai")
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

        # Supabase (Realtime & Edge Functions) - adjusted for real-time
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
        self.supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        self.supabase_engine = None
        if self.supabase_url:
            try:
                # Treat Supabase as Postgres for simplicity, but note it's for real-time/public data
                supabase_db_url = f"postgresql://postgres:{self.supabase_anon_key}@{self.supabase_url.replace('https://', '')}:5432/postgres?sslmode=require"
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

        # Turso (Edge SQL / SQLite)
        self.turso_auth_token = os.getenv("TURSO_AUTH_TOKEN")
        self.turso_db_url = os.getenv("TURSO_DATABASE_URL")
        self.turso_client = None
        if self.turso_db_url and libsql:
            try:
                self.turso_client = libsql.connect(database=self.turso_db_url, auth_token=self.turso_auth_token)
                logger.info("Turso connection established successfully")
            except Exception as e:
                logger.warning(f"Failed to connect to Turso: {str(e)}")
                self.turso_client = None

        # EdgeDB (Graph-like Data)
        self.edgedb_instance = os.getenv("EDGEDB_INSTANCE")
        self.edgedb_secret_key = os.getenv("EDGEDB_SECRET_KEY")
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
