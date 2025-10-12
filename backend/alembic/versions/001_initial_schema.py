"""Initial schema for Pasalku.ai

Revision ID: 001_initial_schema
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create enum types
    op.execute("CREATE TYPE userrole AS ENUM ('masyarakat_umum', 'profesional_hukum', 'admin')")
    op.execute("CREATE TYPE verificationstatus AS ENUM ('pending', 'approved', 'rejected', 'not_requested')")
    op.execute("CREATE TYPE subscriptiontier AS ENUM ('free', 'premium', 'enterprise')")
    
    # Users table (Neon Instance 1)
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('phone_number', sa.String(), nullable=True),
        sa.Column('role', postgresql.ENUM('masyarakat_umum', 'profesional_hukum', 'admin', name='userrole'), nullable=False),
        sa.Column('subscription_tier', postgresql.ENUM('free', 'premium', 'enterprise', name='subscriptiontier'), nullable=False),
        sa.Column('stripe_customer_id', sa.String(), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(), nullable=True),
        sa.Column('subscription_status', sa.String(), nullable=True),
        sa.Column('subscription_expires_at', sa.DateTime(), nullable=True),
        sa.Column('verification_status', postgresql.ENUM('pending', 'approved', 'rejected', 'not_requested', name='verificationstatus'), nullable=False),
        sa.Column('verification_requested_at', sa.DateTime(), nullable=True),
        sa.Column('verification_documents', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('verification_notes', sa.Text(), nullable=True),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('verified_by', sa.String(), nullable=True),
        sa.Column('professional_license_number', sa.String(), nullable=True),
        sa.Column('professional_organization', sa.String(), nullable=True),
        sa.Column('professional_specialization', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('professional_bio', sa.Text(), nullable=True),
        sa.Column('ai_queries_count', sa.Integer(), nullable=True),
        sa.Column('ai_queries_this_month', sa.Integer(), nullable=True),
        sa.Column('documents_uploaded_count', sa.Integer(), nullable=True),
        sa.Column('last_query_at', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_email_verified', sa.Boolean(), nullable=True),
        sa.Column('is_phone_verified', sa.Boolean(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('preferences', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('last_login_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_stripe_customer_id'), 'users', ['stripe_customer_id'], unique=True)
    op.create_index(op.f('ix_users_role'), 'users', ['role'], unique=False)
    
    # Verification Requests table
    op.create_table(
        'verification_requests',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('request_type', sa.String(), nullable=False),
        sa.Column('status', postgresql.ENUM('pending', 'approved', 'rejected', 'not_requested', name='verificationstatus'), nullable=False),
        sa.Column('documents', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('license_number', sa.String(), nullable=True),
        sa.Column('organization', sa.String(), nullable=True),
        sa.Column('specialization', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('reviewed_by', sa.String(), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('review_notes', sa.Text(), nullable=True),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_verification_requests_id'), 'verification_requests', ['id'], unique=False)
    op.create_index(op.f('ix_verification_requests_user_id'), 'verification_requests', ['user_id'], unique=False)
    
    # Subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('stripe_subscription_id', sa.String(), nullable=True),
        sa.Column('stripe_customer_id', sa.String(), nullable=True),
        sa.Column('stripe_price_id', sa.String(), nullable=True),
        sa.Column('tier', postgresql.ENUM('free', 'premium', 'enterprise', name='subscriptiontier'), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('amount', sa.Integer(), nullable=True),
        sa.Column('currency', sa.String(), nullable=False),
        sa.Column('billing_cycle', sa.String(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('current_period_start', sa.DateTime(), nullable=True),
        sa.Column('current_period_end', sa.DateTime(), nullable=True),
        sa.Column('canceled_at', sa.DateTime(), nullable=True),
        sa.Column('ended_at', sa.DateTime(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subscriptions_id'), 'subscriptions', ['id'], unique=False)
    op.create_index(op.f('ix_subscriptions_user_id'), 'subscriptions', ['user_id'], unique=False)
    op.create_index(op.f('ix_subscriptions_stripe_subscription_id'), 'subscriptions', ['stripe_subscription_id'], unique=True)
    
    # Audit Logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('user_email', sa.String(), nullable=True),
        sa.Column('user_role', sa.String(), nullable=True),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('resource_type', sa.String(), nullable=True),
        sa.Column('resource_id', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.Column('user_agent', sa.String(), nullable=True),
        sa.Column('request_id', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_id'), 'audit_logs', ['id'], unique=False)
    op.create_index(op.f('ix_audit_logs_user_id'), 'audit_logs', ['user_id'], unique=False)
    op.create_index(op.f('ix_audit_logs_action'), 'audit_logs', ['action'], unique=False)
    op.create_index(op.f('ix_audit_logs_created_at'), 'audit_logs', ['created_at'], unique=False)


def downgrade():
    # Drop tables
    op.drop_index(op.f('ix_audit_logs_created_at'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_action'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_user_id'), table_name='audit_logs')
    op.drop_index(op.f('ix_audit_logs_id'), table_name='audit_logs')
    op.drop_table('audit_logs')
    
    op.drop_index(op.f('ix_subscriptions_stripe_subscription_id'), table_name='subscriptions')
    op.drop_index(op.f('ix_subscriptions_user_id'), table_name='subscriptions')
    op.drop_index(op.f('ix_subscriptions_id'), table_name='subscriptions')
    op.drop_table('subscriptions')
    
    op.drop_index(op.f('ix_verification_requests_user_id'), table_name='verification_requests')
    op.drop_index(op.f('ix_verification_requests_id'), table_name='verification_requests')
    op.drop_table('verification_requests')
    
    op.drop_index(op.f('ix_users_role'), table_name='users')
    op.drop_index(op.f('ix_users_stripe_customer_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    
    # Drop enum types
    op.execute("DROP TYPE subscriptiontier")
    op.execute("DROP TYPE verificationstatus")
    op.execute("DROP TYPE userrole")
