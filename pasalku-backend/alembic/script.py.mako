<|vq_14666|>from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'your_revision_id'
down_revision = 'your_down_revision_id'
branch_labels = None
depends_on = None

def upgrade():
    # Create User table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(length=50), nullable=False, unique=True),
        sa.Column('email', sa.String(length=100), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(length=128), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now())
    )

    # Create Consultation table
    op.create_table(
        'consultations',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('problem_description', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.now(), onupdate=sa.func.now())
    )

    # Create Chat table
    op.create_table(
        'chats',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('consultation_id', sa.Integer, sa.ForeignKey('consultations.id'), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('sender', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.now())
    )

def downgrade():
    op.drop_table('chats')
    op.drop_table('consultations')
    op.drop_table('users')