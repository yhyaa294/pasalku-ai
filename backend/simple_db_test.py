#!/usr/bin/env python3
"""
Simple database connection test script
"""
import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from core.config import get_settings
    print("✅ Config import successful")
except ImportError as e:
    print(f"❌ Config import failed: {e}")
    sys.exit(1)

try:
    settings = get_settings()
    print("✅ Settings loaded successfully")
except Exception as e:
    print(f"❌ Settings loading failed: {e}")
    sys.exit(1)

# Test database connections
print("\n📊 Testing Database Connections:")
print("=" * 50)

# Test PostgreSQL (Neon)
if hasattr(settings, 'DATABASE_URL') and settings.DATABASE_URL:
    try:
        import psycopg2
        conn = psycopg2.connect(settings.DATABASE_URL)
        print("✅ PostgreSQL (Neon): Connection successful")
        conn.close()
    except Exception as e:
        print(f"❌ PostgreSQL (Neon): {e}")
else:
    print("⚠️ PostgreSQL (Neon): Not configured")

# Test MongoDB
if hasattr(settings, 'MONGODB_URI') and settings.MONGODB_URI:
    try:
        from pymongo import MongoClient
        client = MongoClient(settings.MONGODB_URI)
        client.admin.command('ping')
        print("✅ MongoDB: Connection successful")
        client.close()
    except Exception as e:
        print(f"❌ MongoDB: {e}")
else:
    print("⚠️ MongoDB: Not configured")

# Test Supabase
if hasattr(settings, 'SUPABASE_URL') and settings.SUPABASE_URL:
    try:
        from supabase import create_client
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        print("✅ Supabase: Client created successfully")
    except Exception as e:
        print(f"❌ Supabase: {e}")
else:
    print("⚠️ Supabase: Not configured")

# Test Turso
if hasattr(settings, 'TURSO_DATABASE_URL') and settings.TURSO_DATABASE_URL:
    try:
        import libsql_experimental as libsql
        conn = libsql.connect(settings.TURSO_DATABASE_URL)
        print("✅ Turso: Connection successful")
        conn.close()
    except Exception as e:
        print(f"❌ Turso: {e}")
else:
    print("⚠️ Turso: Not configured")

# Test EdgeDB
if hasattr(settings, 'EDGEDB_DSN') and settings.EDGEDB_DSN:
    try:
        import edgedb
        client = edgedb.create_client(settings.EDGEDB_DSN)
        print("✅ EdgeDB: Client created successfully")
    except Exception as e:
        print(f"❌ EdgeDB: {e}")
else:
    print("⚠️ EdgeDB: Not configured")

print("\n🎯 Database Test Complete!")
