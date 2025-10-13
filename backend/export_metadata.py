#!/usr/bin/env python3
"""
Standalone script untuk export database metadata ke JSON.
Menggunakan konfigurasi dari database.py untuk koneksi PostgreSQL.
"""

import logging
import sys
import json
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from database import get_db_connections, init_db
from services.metadata_service import MetadataService

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Main function untuk export metadata."""
    try:
        # Initialize database connections
        logger.info("Initializing database connections...")
        db_connections = get_db_connections()

        # Verify connections
        if not db_connections.verify_connections():
            logger.error("Failed to connect to databases. Aborting.")
            sys.exit(1)

        logger.info("Database connections verified successfully")

        # Create metadata service
        metadata_service = MetadataService(db_connections.pg_engine)

        # Extract metadata
        logger.info("Extracting metadata...")
        metadata = metadata_service.extract_all_metadata()

        # Export to JSON
        output_file = "database_metadata.json"
        success = metadata_service.export_to_json_file(output_file)

        if success:
            logger.info(f"✅ Metadata berhasil diexport ke file: {output_file}")

            # Print summary
            print("=" * 60)
            print("📊 DATABASE METADATA SUMMARY")
            print("=" * 60)
            print(f"Database: {metadata['database_name']}")
            print(f"Version: {metadata['version']}")
            print(f"Jumlah Tabel: {len(metadata['tables'])}")
            print(f"Jumlah Kolom: {len(metadata['columns'])}")
            print(f"Jumlah Foreign Keys: {len(metadata['fk_info'])}")
            print(f"Jumlah Primary Keys: {len(metadata['pk_info'])}")
            print(f"Jumlah Indexes: {len(metadata['indexes'])}")
            print(f"Jumlah Views: {len(metadata['views'])}")
            print(f"Output File: {output_file}")
            print("=" * 60)

            return True
        else:
            logger.error("❌ Gagal export metadata ke file")
            return False

    except Exception as e:
        logger.error(f"❌ Error during metadata extraction: {str(e)}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)