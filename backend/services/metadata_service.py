"""
Metadata extraction service untuk PostgreSQL database.
Equivalent to MySQL INFORMATION_SCHEMA query tapi untuk PostgreSQL.
"""

import json
import logging
from typing import Dict, List, Any, Optional
from sqlalchemy import text, inspect
from sqlalchemy.engine import Engine

logger = logging.getLogger(__name__)


class MetadataService:
    """Service untuk ekstraksi metadata database PostgreSQL."""

    def __init__(self, engine: Engine):
        """Initialize dengan PostgreSQL engine."""
        self.engine = engine

    def extract_foreign_keys(self) -> List[Dict[str, Any]]:
        """Ekstraksi foreign key information dari database."""
        fk_info = []

        try:
            # Query untuk foreign keys menggunakan pg_constraint dan pg_class
            fk_query = text("""
                SELECT
                    tc.table_schema,
                    tc.table_name,
                    kcu.column_name as fk_column,
                    ccu.table_schema as reference_schema,
                    ccu.table_name as reference_table,
                    ccu.column_name as reference_column,
                    tc.constraint_name as foreign_key_name,
                    CASE tc.delete_rule
                        WHEN 'CASCADE' THEN 'CASCADE'
                        WHEN 'RESTRICT' THEN 'RESTRICT'
                        WHEN 'SET NULL' THEN 'SET NULL'
                        WHEN 'NO ACTION' THEN 'NO ACTION'
                        ELSE 'NO ACTION'
                    END as on_delete,
                    CASE tc.update_rule
                        WHEN 'CASCADE' THEN 'CASCADE'
                        WHEN 'RESTRICT' THEN 'RESTRICT'
                        WHEN 'SET NULL' THEN 'SET NULL'
                        WHEN 'NO ACTION' THEN 'NO ACTION'
                        ELSE 'NO ACTION'
                    END as on_update,
                    'FOREIGN KEY (' || string_agg(quote_ident(kcu.column_name), ', ') || ') REFERENCES ' ||
                    quote_ident(ccu.table_schema) || '.' || quote_ident(ccu.table_name) || '(' ||
                    string_agg(quote_ident(ccu.column_name), ', ') || ') ' ||
                    'ON UPDATE ' || CASE tc.update_rule
                        WHEN 'CASCADE' THEN 'CASCADE'
                        WHEN 'RESTRICT' THEN 'RESTRICT'
                        WHEN 'SET NULL' THEN 'SET NULL'
                        WHEN 'NO ACTION' THEN 'NO ACTION'
                        ELSE 'NO ACTION'
                    END ||
                    ' ON DELETE ' || CASE tc.delete_rule
                        WHEN 'CASCADE' THEN 'CASCADE'
                        WHEN 'RESTRICT' THEN 'RESTRICT'
                        WHEN 'SET NULL' THEN 'SET NULL'
                        WHEN 'NO ACTION' THEN 'NO ACTION'
                        ELSE 'NO ACTION'
                    END as fk_def
                FROM
                    information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                      AND tc.table_schema = kcu.table_schema
                    JOIN information_schema.constraint_column_usage AS ccu
                      ON ccu.constraint_name = tc.constraint_name
                      AND ccu.table_schema = tc.table_schema
                WHERE
                    tc.constraint_type = 'FOREIGN KEY'
                    AND tc.table_schema NOT IN ('information_schema', 'pg_catalog')
                GROUP BY
                    tc.table_schema, tc.table_name, tc.constraint_name,
                    kcu.column_name, ccu.table_schema, ccu.table_name, ccu.column_name,
                    tc.delete_rule, tc.update_rule
                ORDER BY
                    tc.table_schema, tc.table_name, tc.constraint_name
            """)

            with self.engine.connect() as conn:
                result = conn.execute(fk_query)
                for row in result:
                    fk_info.append({
                        "schema": row.table_schema,
                        "table": row.table_name,
                        "column": row.fk_column or "",
                        "foreign_key_name": row.foreign_key_name or "",
                        "reference_schema": row.reference_schema or "",
                        "reference_table": row.reference_table or "",
                        "reference_column": row.reference_column or "",
                        "on_delete": row.on_delete,
                        "on_update": row.on_update,
                        "fk_def": row.fk_def or ""
                    })

        except Exception as e:
            logger.error(f"Error extracting foreign keys: {str(e)}")

        return fk_info

    def extract_primary_keys(self) -> List[Dict[str, Any]]:
        """Ekstraksi primary key information dari database."""
        pk_info = []

        try:
            pk_query = text("""
                SELECT
                    tc.table_schema,
                    tc.table_name as pk_table,
                    kcu.column_name as pk_column,
                    'PRIMARY KEY (' || string_agg(quote_ident(kcu.column_name), ', ' ORDER BY kcu.ordinal_position) || ')' as pk_def
                FROM
                    information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu
                      ON tc.constraint_name = kcu.constraint_name
                      AND tc.table_schema = kcu.table_schema
                WHERE
                    tc.constraint_type = 'PRIMARY KEY'
                    AND tc.table_schema NOT IN ('information_schema', 'pg_catalog')
                GROUP BY
                    tc.table_schema, tc.table_name, tc.constraint_name
                ORDER BY
                    tc.table_schema, tc.table_name
            """)

            with self.engine.connect() as conn:
                result = conn.execute(pk_query)
                for row in result:
                    pk_info.append({
                        "schema": row.table_schema,
                        "table": row.pk_table,
                        "column": row.pk_column,
                        "pk_def": row.pk_def or ""
                    })

        except Exception as e:
            logger.error(f"Error extracting primary keys: {str(e)}")

        return pk_info

    def extract_columns(self) -> List[Dict[str, Any]]:
        """Ekstraksi column information dari database."""
        columns_info = []

        try:
            columns_query = text("""
                SELECT
                    c.table_schema,
                    c.table_name,
                    c.column_name as name,
                    lower(c.data_type) as type,
                    c.character_maximum_length,
                    CASE
                        WHEN c.data_type IN ('numeric', 'decimal')
                        THEN json_build_object(
                            'precision', COALESCE(c.numeric_precision::text, 'null'),
                            'scale', COALESCE(c.numeric_scale::text, 'null')
                        )
                        ELSE 'null'
                    END as numeric_info,
                    c.ordinal_position,
                    CASE WHEN c.is_nullable = 'YES' THEN true ELSE false END as nullable,
                    '' as default,
                    COALESCE(c.collation_name, '') as collation,
                    CASE WHEN c.column_default LIKE 'nextval%' THEN true ELSE false END as is_identity
                FROM
                    information_schema.columns c
                WHERE
                    c.table_schema NOT IN ('information_schema', 'pg_catalog')
                    AND c.table_schema = 'public'
                ORDER BY
                    c.table_schema, c.table_name, c.ordinal_position
            """)

            with self.engine.connect() as conn:
                result = conn.execute(columns_query)
                for row in result:
                    # Parse numeric info if exists
                    numeric_info = row.numeric_info
                    if numeric_info != 'null' and numeric_info:
                        try:
                            numeric_parsed = json.loads(numeric_info)
                        except:
                            numeric_parsed = None
                    else:
                        numeric_parsed = None

                    columns_info.append({
                        "schema": row.table_schema,
                        "table": row.table_name,
                        "name": row.name,
                        "type": row.type,
                        "character_maximum_length": row.character_maximum_length or None,
                        "precision": numeric_parsed,
                        "ordinal_position": row.ordinal_position,
                        "nullable": row.nullable,
                        "default": row.default or "",
                        "collation": row.collation or "",
                        "is_identity": row.is_identity
                    })

        except Exception as e:
            logger.error(f"Error extracting columns: {str(e)}")

        return columns_info

    def extract_indexes(self) -> List[Dict[str, Any]]:
        """Ekstraksi index information dari database."""
        indexes_info = []

        try:
            # Menggunakan pg_indexes untuk informasi index
            indexes_query = text("""
                SELECT
                    schemaname as schema,
                    tablename as table,
                    indexname as name,
                    CASE
                        WHEN indexdef LIKE '%UNIQUE%' THEN false
                        ELSE true
                    END as unique,
                    'btree' as index_type,
                    'asc' as direction,
                    1 as column_position,
                    indexname as column,
                    pg_relation_size(indexrelid) as size,
                    -1 as cardinality
                FROM
                    pg_indexes pi
                    JOIN pg_class c ON pi.indexrelid = c.oid
                WHERE
                    schemaname = 'public'
                    AND NOT (indexname LIKE '%_pkey' OR indexname LIKE '%_idx')
                ORDER BY
                    schemaname, tablename, indexname
            """)

            with self.engine.connect() as conn:
                result = conn.execute(indexes_query)
                for row in result:
                    indexes_info.append({
                        "schema": row.schema,
                        "table": row.table,
                        "name": row.name,
                        "size": row.size if row.size is not None else -1,
                        "column": row.column or "",
                        "index_type": row.index_type or "",
                        "cardinality": row.cardinality if row.cardinality is not None else -1,
                        "direction": row.direction or "",
                        "column_position": row.column_position if row.column_position is not None else 1,
                        "unique": row.unique
                    })

        except Exception as e:
            logger.error(f"Error extracting indexes: {str(e)}")

        return indexes_info

    def extract_tables(self) -> List[Dict[str, Any]]:
        """Ekstraksi table information dari database."""
        tables_info = []

        try:
            tables_query = text("""
                SELECT
                    schemaname as schema,
                    tablename as table,
                    'BASE TABLE' as type,
                    pg_total_relation_size(schemaname || '.' || tablename) as table_size_bytes,
                    pg_total_relation_size(schemaname || '.' || tablename) as data_length,
                    n_live_tup as rows,
                    'InnoDB' as engine,
                    '' as collation
                FROM
                    pg_tables pt
                    JOIN pg_class c ON pt.tablename = c.relname AND pt.schemaname = c.relnamespace::regnamespace::text
                    LEFT JOIN pg_stat_user_tables st ON pt.tablename = st.relname AND pt.schemaname = st.schemaname
                WHERE
                    schemaname = 'public'
                    AND NOT tablename LIKE 'pg_%'
                    AND NOT tablename LIKE 'sql_%'
                ORDER BY
                    schemaname, tablename
            """)

            with self.engine.connect() as conn:
                result = conn.execute(tables_query)
                for row in result:
                    tables_info.append({
                        "schema": row.schema,
                        "table": row.table,
                        "rows": row.rows if row.rows is not None else 0,
                        "type": row.type,
                        "engine": row.engine,
                        "collation": row.collation or "",
                        "table_size_bytes": row.table_size_bytes if row.table_size_bytes is not None else 0
                    })

        except Exception as e:
            logger.error(f"Error extracting tables: {str(e)}")

        return tables_info

    def extract_views(self) -> List[Dict[str, Any]]:
        """Ekstraksi view information dari database."""
        views_info = []

        try:
            views_query = text("""
                SELECT
                    v.schemaname as schema,
                    v.viewname as view_name,
                    '' as view_definition
                FROM
                    pg_views v
                WHERE
                    v.schemaname = 'public'
                    AND NOT v.viewname LIKE 'pg_%'
                ORDER BY
                    v.schemaname, v.viewname
            """)

            with self.engine.connect() as conn:
                result = conn.execute(views_query)
                for row in result:
                    views_info.append({
                        "schema": row.schema,
                        "view_name": row.view_name,
                        "view_definition": row.view_definition or ""
                    })

        except Exception as e:
            logger.error(f"Error extracting views: {str(e)}")

        return views_info

    def get_database_version(self) -> str:
        """Get database version."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text("SELECT version()"))
                return result.fetchone()[0]
        except Exception as e:
            logger.error(f"Error getting database version: {str(e)}")
            return "Unknown"

    def get_database_name(self) -> str:
        """Get current database name."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text("SELECT current_database()"))
                return result.fetchone()[0]
        except Exception as e:
            logger.error(f"Error getting database name: {str(e)}")
            return "Unknown"

    def extract_all_metadata(self) -> Dict[str, Any]:
        """Ekstraksi semua metadata dalam format JSON yang serupa dengan query MySQL."""
        logger.info("Extracting database metadata...")

        metadata = {
            "fk_info": self.extract_foreign_keys(),
            "pk_info": self.extract_primary_keys(),
            "columns": self.extract_columns(),
            "indexes": self.extract_indexes(),
            "tables": self.extract_tables(),
            "views": self.extract_views(),
            "database_name": self.get_database_name(),
            "version": self.get_database_version()
        }

        logger.info(f"Metadata extraction completed. Found {len(metadata['tables'])} tables, "
                   f"{len(metadata['columns'])} columns, {len(metadata['fk_info'])} foreign keys, "
                   f"{len(metadata['pk_info'])} primary keys, {len(metadata['indexes'])} indexes")

        return metadata

    def export_to_json_file(self, file_path: str) -> bool:
        """Export metadata ke file JSON."""
        try:
            metadata = self.extract_all_metadata()
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False)
            logger.info(f"Metadata exported to {file_path}")
            return True
        except Exception as e:
            logger.error(f"Error exporting metadata to file: {str(e)}")
            return False