"""
Add conversation_state and flow_context columns to consultation_sessions

Revision ID: 20251020_add_conversation_state_flow_context
Revises: 002_chat_sessions_schema
Create Date: 2025-10-20 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20251020_add_conversation_state_flow_context'
down_revision = '002_chat_sessions_schema'
branch_labels = None
depends_on = None


def upgrade():
	op.add_column('consultation_sessions', sa.Column('conversation_state', sa.String(length=64), nullable=False, server_default='AWAITING_INITIAL_PROBLEM'))
	op.add_column('consultation_sessions', sa.Column('flow_context', postgresql.JSON(astext_type=sa.Text()), nullable=True))
	op.create_index(op.f('ix_consultation_sessions_conversation_state'), 'consultation_sessions', ['conversation_state'], unique=False)


def downgrade():
	op.drop_index(op.f('ix_consultation_sessions_conversation_state'), table_name='consultation_sessions')
	op.drop_column('consultation_sessions', 'flow_context')
	op.drop_column('consultation_sessions', 'conversation_state')

