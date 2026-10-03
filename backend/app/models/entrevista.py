from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text, UniqueConstraint
from datetime import date

class Entrevista (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    local: str
    data: date
    path_audio: str = Field(sa_column=Column(Text, nullable=False))
    path_transcricao: str = Field(sa_column=Column(Text, nullable=False))

class Entrevistador_entrevista (SQLModel, table=True):
    entrevista_id: int | None = Field(foreign_key="entrevista.id", primary_key=True, ondelete="CASCADE")
    entrevistador_id: int = Field(foreign_key="entrevistador.id", primary_key=True, ondelete="CASCADE")

class Sumario (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    entrevista_id: int = Field (foreign_key="entrevista.id", ondelete="CASCADE")
    tempo_segundos: int
    assunto: str

class Fotos_entrevista (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    entrevista_id: int = Field(foreign_key="entrevista.id", ondelete="CASCADE")
    categoria: str
    numero: int
    __table_args__ = (
        UniqueConstraint(
            "entrevista_id",
            "categoria",
            "numero"
        ),
    )
