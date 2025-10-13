#!/usr/bin/env python3
"""
Script to extract database metadata in JSON format, adapted for SQLite.
"""

import json
import os
import sqlite3
from sqlalchemy import create_engine, text, inspect

def get_metadata():
    # Get database URL from environment or default to SQLite
    database_url = os.getenv('DATABASE_URL', 'sqlite:///sql_app.db')

    # Create engine
    engine = create_engine(database_url)

    # Use SQLAlchemy inspector for SQLite
    inspector = inspect(engine)

    metadata = {
        "fk_info": [],
        "pk_info": [],
        "columns": [],
        "indexes": [],
        "tables": [],
        "views": [],
        "database_name": "main",  # SQLite default
        "version": "SQLite"
    }

    try:
        # Get all tables
        tables = inspector.get_table_names()

        for table_name in tables:
            # Get columns
            columns = inspector.get_columns(table_name)
            for col in columns:
                metadata["columns"].append({
                    "schema": "main",
                    "table": table_name,
                    "name": col['name'],
                    "type": str(col['type']).lower(),
                    "character_maximum_length": None,
                    "precision": None,
                    "ordinal_position": col.get('ordinal_position', 0),
                    "nullable": col['nullable'],
                    "default": str(col.get('default', '')),
                    "collation": "",
                    "is_identity": False
                })

            # Get primary keys
            pk_columns = inspector.get_pk_constraint(table_name)
            if pk_columns and pk_columns['constrained_columns']:
                for col in pk_columns['constrained_columns']:
                    metadata["pk_info"].append({
                        "schema": "main",
                        "table": table_name,
                        "column": col,
                        "pk_def": f"PRIMARY KEY ({', '.join(pk_columns['constrained_columns'])})"
                    })

            # Get foreign keys
            fks = inspector.get_foreign_keys(table_name)
            for fk in fks:
                for i, col in enumerate(fk['constrained_columns']):
                    metadata["fk_info"].append({
                        "schema": "main",
                        "table": table_name,
                        "column": col,
                        "foreign_key_name": fk['name'] or f"fk_{table_name}_{col}",
                        "reference_schema": "main",
                        "reference_table": fk['referred_table'],
                        "reference_column": fk['referred_columns'][i],
                        "fk_def": f"FOREIGN KEY ({col}) REFERENCES {fk['referred_table']}({fk['referred_columns'][i]})"
                    })

            # Get indexes
            indexes = inspector.get_indexes(table_name)
            for idx in indexes:
                for col in idx['column_names']:
                    metadata["indexes"].append({
                        "schema": "main",
                        "table": table_name,
                        "name": idx['name'],
                        "size": -1,
                        "column": col,
                        "index_type": "btree",
                        "cardinality": 0,
                        "direction": "asc",
                        "column_position": 0,
                        "unique": idx['unique']
                    })

            # Add table info
            metadata["tables"].append({
                "schema": "main",
                "table": table_name,
                "rows": 0,  # Hard to get exact count
                "type": "BASE TABLE",
                "engine": "sqlite",
                "collation": ""
            })

        # Get views (SQLite specific)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='view'"))
            for row in result:
                metadata["views"].append({
                    "schema": "main",
                    "view_name": row[0],
                    "view_definition": ""
                })

        return json.dumps(metadata)

    except Exception as e:
        print(f"Error extracting metadata: {e}")
        return None

if __name__ == "__main__":
    metadata = get_metadata()
    if metadata:
        print(metadata)
    else:
        print("No metadata retrieved")
