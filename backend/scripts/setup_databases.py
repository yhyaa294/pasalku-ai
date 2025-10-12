"""
Script untuk setup semua databases (Neon, MongoDB, Turso, EdgeDB)
"""
import os
import sys
import logging
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from database import get_db_connections
from schemas.mongodb_schemas import setup_mongodb_indexes, COLLECTIONS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def setup_postgresql():
    """Setup PostgreSQL (Neon) tables using Alembic"""
    logger.info("Setting up PostgreSQL tables...")
    
    try:
        # Run Alembic migrations
        import subprocess
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent.parent
        )
        
        if result.returncode == 0:
            logger.info("✓ PostgreSQL tables created successfully")
            logger.info(result.stdout)
        else:
            logger.error("✗ PostgreSQL setup failed")
            logger.error(result.stderr)
            return False
            
    except Exception as e:
        logger.error(f"✗ PostgreSQL setup error: {str(e)}")
        return False
    
    return True


def setup_mongodb():
    """Setup MongoDB collections and indexes"""
    logger.info("Setting up MongoDB collections and indexes...")
    
    try:
        db_connections = get_db_connections()
        mongodb = db_connections.get_mongodb()
        
        if not mongodb:
            logger.warning("MongoDB not configured, skipping...")
            return True
        
        # Create collections
        existing_collections = mongodb.list_collection_names()
        
        for collection_name in COLLECTIONS.values():
            if collection_name not in existing_collections:
                mongodb.create_collection(collection_name)
                logger.info(f"  Created collection: {collection_name}")
            else:
                logger.info(f"  Collection already exists: {collection_name}")
        
        # Setup indexes
        setup_mongodb_indexes(mongodb)
        logger.info("✓ MongoDB setup completed successfully")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ MongoDB setup error: {str(e)}")
        return False


def setup_turso():
    """Setup Turso (Edge SQLite) tables"""
    logger.info("Setting up Turso tables...")
    
    try:
        db_connections = get_db_connections()
        turso_client = db_connections.get_turso_db()
        
        if not turso_client:
            logger.warning("Turso not configured, skipping...")
            return True
        
        cursor = turso_client.cursor()
        
        # Create cache tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ai_response_cache (
                id TEXT PRIMARY KEY,
                query_hash TEXT NOT NULL,
                query TEXT NOT NULL,
                response TEXT NOT NULL,
                model TEXT NOT NULL,
                confidence_score REAL,
                hit_count INTEGER DEFAULT 0,
                category TEXT,
                created_at TEXT NOT NULL,
                last_accessed TEXT NOT NULL,
                expires_at TEXT
            )
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_ai_response_cache_query_hash 
            ON ai_response_cache(query_hash)
        """)
        
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_ai_response_cache_category 
            ON ai_response_cache(category)
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feature_flags (
                flag_name TEXT PRIMARY KEY,
                enabled INTEGER NOT NULL,
                value TEXT,
                user_segments TEXT,
                last_synced TEXT NOT NULL,
                expires_at TEXT NOT NULL
            )
        """)
        
        turso_client.commit()
        logger.info("✓ Turso tables created successfully")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ Turso setup error: {str(e)}")
        return False


def setup_edgedb():
    """Setup EdgeDB schema"""
    logger.info("Setting up EdgeDB schema...")
    
    try:
        db_connections = get_db_connections()
        edgedb_client = db_connections.get_edgedb_client()
        
        if not edgedb_client:
            logger.warning("EdgeDB not configured, skipping...")
            return True
        
        # EdgeDB schema will be defined in .esdl files
        # For now, just verify connection
        result = edgedb_client.query("SELECT 1")
        
        logger.info("✓ EdgeDB connection verified")
        logger.info("  Note: EdgeDB schema should be applied using 'edgedb migration apply'")
        
        return True
        
    except Exception as e:
        logger.error(f"✗ EdgeDB setup error: {str(e)}")
        return False


def verify_all_connections():
    """Verify all database connections"""
    logger.info("\nVerifying all database connections...")
    
    try:
        db_connections = get_db_connections()
        
        # PostgreSQL
        try:
            with db_connections.get_db() as db:
                from sqlalchemy import text
                db.execute(text("SELECT 1"))
            logger.info("✓ PostgreSQL (Neon) connected")
        except Exception as e:
            logger.error(f"✗ PostgreSQL connection failed: {str(e)}")
        
        # MongoDB
        try:
            if db_connections.mongodb_client:
                db_connections.mongodb_client.admin.command('ping')
                logger.info("✓ MongoDB connected")
            else:
                logger.warning("⚠ MongoDB not configured")
        except Exception as e:
            logger.error(f"✗ MongoDB connection failed: {str(e)}")
        
        # Turso
        try:
            if db_connections.turso_client:
                cursor = db_connections.turso_client.cursor()
                cursor.execute("SELECT 1")
                logger.info("✓ Turso connected")
            else:
                logger.warning("⚠ Turso not configured")
        except Exception as e:
            logger.error(f"✗ Turso connection failed: {str(e)}")
        
        # EdgeDB
        try:
            if db_connections.edgedb_client:
                db_connections.edgedb_client.query("SELECT 1")
                logger.info("✓ EdgeDB connected")
            else:
                logger.warning("⚠ EdgeDB not configured")
        except Exception as e:
            logger.error(f"✗ EdgeDB connection failed: {str(e)}")
        
        # Supabase
        try:
            if db_connections.supabase_engine:
                with db_connections.get_supabase_db() as db:
                    from sqlalchemy import text
                    db.execute(text("SELECT 1"))
                logger.info("✓ Supabase connected")
            else:
                logger.warning("⚠ Supabase not configured")
        except Exception as e:
            logger.error(f"✗ Supabase connection failed: {str(e)}")
        
    except Exception as e:
        logger.error(f"Connection verification error: {str(e)}")


def main():
    """Main setup function"""
    logger.info("=" * 60)
    logger.info("Pasalku.ai Database Setup")
    logger.info("=" * 60)
    
    success = True
    
    # Setup PostgreSQL
    if not setup_postgresql():
        success = False
    
    # Setup MongoDB
    if not setup_mongodb():
        success = False
    
    # Setup Turso
    if not setup_turso():
        success = False
    
    # Setup EdgeDB
    if not setup_edgedb():
        success = False
    
    # Verify connections
    verify_all_connections()
    
    logger.info("\n" + "=" * 60)
    if success:
        logger.info("✓ Database setup completed successfully!")
    else:
        logger.error("✗ Database setup completed with errors")
    logger.info("=" * 60)
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
