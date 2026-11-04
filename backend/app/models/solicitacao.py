from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text, CHAR
from datetime import datetime, timezone

class Solicitante (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    nome: str
    cpf: str = Field(sa_column=Column(CHAR(11), nullable=False, unique=True))
    telefone: str
    email: str
    rua: str
    cep: str = Field(sa_column=Column(CHAR(8), nullable=False))
    cidade: str
    uf: str = Field(sa_column=Column(CHAR(2), nullable=False))
    pais: str

class Solicitacao (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    data: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    entrevista_id: int = Field(foreign_key="entrevista.id")
    solicitante_id: int = Field(foreign_key="solicitante.id")
    mensagem: str | None = Field(default=None, sa_column=Column(Text, nullable=True))
    path_termo: str | None = Field(sa_column=Column(Text, nullable=False))
    status: str = Field(default="aguardando_assinatura")