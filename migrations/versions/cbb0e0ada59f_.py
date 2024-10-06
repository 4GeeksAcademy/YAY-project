"""empty message

Revision ID: cbb0e0ada59f
Revises: 6d7ed3910df9
Create Date: 2024-10-06 14:43:40.822972

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cbb0e0ada59f'
down_revision = '6d7ed3910df9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.alter_column('foto',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
        batch_op.alter_column('foto_perfil',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.alter_column('foto_perfil',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('foto',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)

    # ### end Alembic commands ###