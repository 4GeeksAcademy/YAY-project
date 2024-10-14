"""empty message

Revision ID: f0498eac90b4
Revises: a567df0090b1
Create Date: 2024-10-12 19:32:24.276035

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f0498eac90b4'
down_revision = 'a567df0090b1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.add_column(sa.Column('telefono', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('genero', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.drop_column('genero')
        batch_op.drop_column('telefono')

    # ### end Alembic commands ###
