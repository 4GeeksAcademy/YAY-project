"""empty message

Revision ID: 4d77815ae474
Revises: 915431cd5f31
Create Date: 2024-09-28 17:47:30.742403

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '4d77815ae474'
down_revision = '915431cd5f31'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('eventos', schema=None) as batch_op:
        batch_op.alter_column('fecha',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.Date(),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('eventos', schema=None) as batch_op:
        batch_op.alter_column('fecha',
               existing_type=sa.Date(),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)

    # ### end Alembic commands ###
