#!/usr/bin/env python3
"""
Script untuk test koneksi semua database
"""
import os
import sys

# Add current directory and parent to sys.path for imports
current_dir = os.path.dirname(__file__)
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, current_dir)
sys.path.insert(0, parent_dir)

try:
    from core.config import get_settings
    from database import get_db_connections

    print("TESTING DATABASE CONNECTIONS - PASALKU.AI")
    print("=" * 55)

    settings = get_settings()
    db_conns = get_db_connections()

    print("Testing database connections...\n")

    # Test each connection individually
    tests = []

    # Test PostgreSQL (Neon)
    try:
        print("PostgreSQL (Neon): ", end="")
        from database import get_db
        next(get_db())  # Try to get a connection
        print("[SUCCESS]")
        tests.append("PostgreSQL (Neon): [SUCCESS]")
    except Exception as e:
        print(f"[FAILED] - {str(e)}")
        tests.append(f"PostgreSQL (Neon): [FAILED] {str(e)}")

    # Test MongoDB
    try:
        print("MongoDB: ", end="")
        mongo_db = db_conns.get_mongodb()
        if mongo_db:
            mongo_db.command('ping')
            print("[SUCCESS]")
            tests.append("MongoDB: [SUCCESS]")
        else:
            print("[NO CONFIG]")
            tests.append("MongoDB: [NO CONFIG]")
    except Exception as e:
        print(f"[FAILED] - {str(e)}")
        tests.append(f"MongoDB: [FAILED] {str(e)}")

    # Test Supabase
    try:
        print("Supabase: ", end="")
        from database import get_supabase_db
        next(get_supabase_db())
        print("[SUCCESS]")
        tests.append("Supabase: [SUCCESS]")
    except Exception as e:
        print(f"[FAILED] - {str(e)}")
        tests.append(f"Supabase: [FAILED] {str(e)}")

    # Test Turso
    try:
        print("Turso: ", end="")
        turso_db = db_conns.get_turso_db()
        if turso_db:
            print("[SUCCESS]")
            tests.append("Turso: [SUCCESS]")
        else:
            print("[NO CONFIG]")
            tests.append("Turso: [NO CONFIG]")
    except Exception as e:
        print(f"[FAILED] - {str(e)}")
        tests.append(f"Turso: [FAILED] {str(e)}")

    # Test EdgeDB
    try:
        print("EdgeDB: ", end="")
        edgedb_client = db_conns.get_edgedb_client()
        if edgedb_client:
            print("[SUCCESS]")
            tests.append("EdgeDB: [SUCCESS]")
        else:
            print("[NO CONFIG]")
            tests.append("EdgeDB: [NO CONFIG]")
    except Exception as e:
        print(f"[FAILED] - {str(e)}")
        tests.append(f"EdgeDB: [FAILED] {str(e)}")

    print("\n" + "=" * 55)
    print("RESULTS RINGKASAN TEST KONEKSI DATABASE:")
    print("=" * 55)

    for test in tests:
        print(f"• {test}")

    # Overall status
    failed_tests = [t for t in tests if "[FAILED]" in t]
    configured_count = len([t for t in tests if not ("[NO CONFIG]" in t)])

    if failed_tests:
        print(f"\n[ERROR] {len(failed_tests)} dari {configured_count} koneksi database GAGAL")
        print("\nSOLUTION:")
        print("1. Periksa credentials dan URL di file .env")
        print("2. Pastikan services database aktif (Neon, MongoDB Atlas, Supabase)")
        print("3. Verifikasi koneksi internet tidak ada firewall blocking")
        print("4. Cek uptime status di dashboard masing-masing provider")
    else:
        success_count = len([t for t in tests if "[SUCCESS]" in t])
        print(f"\n[SUCCESS] {success_count} dari {configured_count} koneksi database BERHASIL!")
        print("Infrastructure enterprise Pasalku.ai SIAP DIGUNAKAN!")

    print("\n" + "=" * 55)

except ImportError as e:
    print(f"[IMPORT ERROR]: {e}")
    print("\nSOLUTION:")
    print("1. Jalankan dari folder backend: python test_db_connections.py")
    print("2. Install semua dependencies: pip install -r requirements.txt")
    print("3. Pastikan struktur folder benar")
except Exception as e:
    print(f"[UNEXPECTED ERROR]: {str(e)}")
    print("Cek traceback lengkap untuk detail debugging")