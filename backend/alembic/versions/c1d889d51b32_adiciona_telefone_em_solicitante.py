"""adiciona telefone em solicitante

Revision ID: c1d889d51b32
Revises: e0619a9595ed
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'c1d889d51b32'
down_revision: Union[str, Sequence[str], None] = 'e0619a9595ed'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'solicitante',
        sa.Column('telefone', sa.String(), nullable=False)
    )

    op.alter_column(
        'solicitante',
        'cpf',
        existing_type=sa.CHAR(length=11),
        nullable=False
    )

    op.create_unique_constraint(
        'uq_solicitante_cpf',
        'solicitante',
        ['cpf']
    )


def downgrade() -> None:
    op.drop_constraint(
        'uq_solicitante_cpf',
        'solicitante',
        type_='unique'
    )

    op.alter_column(
        'solicitante',
        'cpf',
        existing_type=sa.CHAR(length=11),
        nullable=True
    )

    op.drop_column('solicitante', 'telefone')
