"""ajusta campos da solicitacao

Revision ID: 3b93c2e6e74f
Revises: c1d889d51b32
Create Date: 2026-11-04 13:54:40.705120

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3b93c2e6e74f'
down_revision: Union[str, Sequence[str], None] = 'c1d889d51b32'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
