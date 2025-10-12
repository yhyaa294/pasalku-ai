"""Chat sessions schema for Neon Instance 2

Revision ID: 002_chat_sessions_schema
Revises: 001_initial_schema
Create Date: 2024-01-01 00:00:01.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002_chat_sessions_schema'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade():
    # Chat Sessions table (Neon Instance 2)
    op.create_table(
        'chat_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('pin_hash', sa.String(), nullable=True),
        sa.Column('pin_salt', sa.String(), nullable=True),
        sa.Column('is_pin_protected', sa.Boolean(), nullable=True),
        sa.Column('ai_model', sa.String(), nullable=True),
        sa.Column('ai_persona', sa.String(), nullable=True),
        sa.Column('message_count', sa.Integer(), nullable=True),
        sa.Column('total_tokens_used', sa.Integer(), nullable=True),
        sa.Column('ai_confidence_avg', sa.Float(), nullable=True),
        sa.Column('mongodb_transcript_id', sa.String(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('case_number', sa.String(), nullable=True),
        sa.Column('case_status', sa.String(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('last_message_at', sa.DateTime(), nullable=True),
        sa.Column('archived_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chat_sessions_id'), 'chat_sessions', ['id'], unique=False)
    op.create_index(op.f('ix_chat_sessions_user_id'), 'chat_sessions', ['user_id'], unique=False)
    op.create_index(op.f('ix_chat_sessions_category'), 'chat_sessions', ['category'], unique=False)
    op.create_index(op.f('ix_chat_sessions_status'), 'chat_sessions', ['status'], unique=False)
    op.create_index(op.f('ix_chat_sessions_mongodb_transcript_id'), 'chat_sessions', ['mongodb_transcript_id'], unique=False)
    op.create_index(op.f('ix_chat_sessions_created_at'), 'chat_sessions', ['created_at'], unique=False)
    
    # Document Metadata table (Neon Instance 2)
    op.create_table(
        'document_metadata',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('filename', sa.String(), nullable=False),
        sa.Column('original_filename', sa.String(), nullable=False),
        sa.Column('file_type', sa.String(), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('mime_type', sa.String(), nullable=False),
        sa.Column('mongodb_document_id', sa.String(), nullable=False),
        sa.Column('processing_status', sa.String(), nullable=True),
        sa.Column('ocr_status', sa.String(), nullable=True),
        sa.Column('analysis_status', sa.String(), nullable=True),
        sa.Column('document_type', sa.String(), nullable=True),
        sa.Column('detected_language', sa.String(), nullable=True),
        sa.Column('page_count', sa.Integer(), nullable=True),
        sa.Column('word_count', sa.Integer(), nullable=True),
        sa.Column('ai_summary', sa.Text(), nullable=True),
        sa.Column('key_points', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('legal_issues', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('uploaded_at', sa.DateTime(), nullable=False),
        sa.Column('processed_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_metadata_id'), 'document_metadata', ['id'], unique=False)
    op.create_index(op.f('ix_document_metadata_user_id'), 'document_metadata', ['user_id'], unique=False)
    op.create_index(op.f('ix_document_metadata_session_id'), 'document_metadata', ['session_id'], unique=False)
    op.create_index(op.f('ix_document_metadata_mongodb_document_id'), 'document_metadata', ['mongodb_document_id'], unique=False)
    op.create_index(op.f('ix_document_metadata_processing_status'), 'document_metadata', ['processing_status'], unique=False)
    op.create_index(op.f('ix_document_metadata_uploaded_at'), 'document_metadata', ['uploaded_at'], unique=False)
    
    # AI Query Logs table (Neon Instance 2)
    op.create_table(
        'ai_query_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('query_type', sa.String(), nullable=False),
        sa.Column('ai_provider', sa.String(), nullable=False),
        sa.Column('model', sa.String(), nullable=False),
        sa.Column('prompt_tokens', sa.Integer(), nullable=False),
        sa.Column('completion_tokens', sa.Integer(), nullable=False),
        sa.Column('total_tokens', sa.Integer(), nullable=False),
        sa.Column('response_time_ms', sa.Integer(), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('user_rating', sa.Integer(), nullable=True),
        sa.Column('estimated_cost', sa.Float(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ai_query_logs_id'), 'ai_query_logs', ['id'], unique=False)
    op.create_index(op.f('ix_ai_query_logs_user_id'), 'ai_query_logs', ['user_id'], unique=False)
    op.create_index(op.f('ix_ai_query_logs_session_id'), 'ai_query_logs', ['session_id'], unique=False)
    op.create_index(op.f('ix_ai_query_logs_query_type'), 'ai_query_logs', ['query_type'], unique=False)
    op.create_index(op.f('ix_ai_query_logs_created_at'), 'ai_query_logs', ['created_at'], unique=False)
    
    # Session Analytics table (Neon Instance 2)
    op.create_table(
        'session_analytics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('total_messages', sa.Integer(), nullable=True),
        sa.Column('user_messages', sa.Integer(), nullable=True),
        sa.Column('ai_messages', sa.Integer(), nullable=True),
        sa.Column('total_tokens', sa.Integer(), nullable=True),
        sa.Column('total_prompt_tokens', sa.Integer(), nullable=True),
        sa.Column('total_completion_tokens', sa.Integer(), nullable=True),
        sa.Column('total_duration_seconds', sa.Integer(), nullable=True),
        sa.Column('avg_response_time_ms', sa.Float(), nullable=True),
        sa.Column('avg_confidence_score', sa.Float(), nullable=True),
        sa.Column('user_satisfaction_score', sa.Float(), nullable=True),
        sa.Column('legal_categories', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('key_legal_issues', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_session_analytics_id'), 'session_analytics', ['id'], unique=False)
    op.create_index(op.f('ix_session_analytics_session_id'), 'session_analytics', ['session_id'], unique=True)
    op.create_index(op.f('ix_session_analytics_user_id'), 'session_analytics', ['user_id'], unique=False)


def downgrade():
    # Drop tables
    op.drop_index(op.f('ix_session_analytics_user_id'), table_name='session_analytics')
    op.drop_index(op.f('ix_session_analytics_session_id'), table_name='session_analytics')
    op.drop_index(op.f('ix_session_analytics_id'), table_name='session_analytics')
    op.drop_table('session_analytics')
    
    op.drop_index(op.f('ix_ai_query_logs_created_at'), table_name='ai_query_logs')
    op.drop_index(op.f('ix_ai_query_logs_query_type'), table_name='ai_query_logs')
    op.drop_index(op.f('ix_ai_query_logs_session_id'), table_name='ai_query_logs')
    op.drop_index(op.f('ix_ai_query_logs_user_id'), table_name='ai_query_logs')
    op.drop_index(op.f('ix_ai_query_logs_id'), table_name='ai_query_logs')
    op.drop_table('ai_query_logs')
    
    op.drop_index(op.f('ix_document_metadata_uploaded_at'), table_name='document_metadata')
    op.drop_index(op.f('ix_document_metadata_processing_status'), table_name='document_metadata')
    op.drop_index(op.f('ix_document_metadata_mongodb_document_id'), table_name='document_metadata')
    op.drop_index(op.f('ix_document_metadata_session_id'), table_name='document_metadata')
    op.drop_index(op.f('ix_document_metadata_user_id'), table_name='document_metadata')
    op.drop_index(op.f('ix_document_metadata_id'), table_name='document_metadata')
    op.drop_table('document_metadata')
    
    op.drop_index(op.f('ix_chat_sessions_created_at'), table_name='chat_sessions')
    op.drop_index(op.f('ix_chat_sessions_mongodb_transcript_id'), table_name='chat_sessions')
    op.drop_index(op.f('ix_chat_sessions_status'), table_name='chat_sessions')
    op.drop_index(op.f('ix_chat_sessions_category'), table_name='chat_sessions')
    op.drop_index(op.f('ix_chat_sessions_user_id'), table_name='chat_sessions')
    op.drop_index(op.f('ix_chat_sessions_id'), table_name='chat_sessions')
    op.drop_table('chat_sessions')
