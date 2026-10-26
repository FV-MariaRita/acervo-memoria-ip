from sqlmodel import SQLModel, Field
from app.schemas.entrevista import EntrevistaCreate

from pydantic import PositiveInt
from app.validators.string import NonBlankString

class EntrevistadoCreate (SQLModel):
    nome: NonBlankString = Field(
        min_length=1,
        max_length=100
    )
    bio: NonBlankString = Field(
        min_length=1,
        max_length=300
    )
    funcao: NonBlankString = Field(
        min_length=1,
        max_length=30
    )
    # path_foto sera incluido pelo backend

class EntrevistadoComEntrevistaCreate (SQLModel):
    entrevistado: EntrevistadoCreate
    entrevista: EntrevistaCreate

class EntrevistadoUpdate (SQLModel):
    nome: NonBlankString | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )
    bio: NonBlankString | None = Field(
        default=None,
        min_length=1,
        max_length=300
    )
    funcao: NonBlankString | None = Field(
        default=None,
        min_length=1,
        max_length=30
    )
    # path_foto sera incluido pelo backend

class EntrevistadoListaResponse (SQLModel):
    id: PositiveInt
    nome: str
    funcao: str
    path_foto: str

class EntrevistadoEntrevistaResponse (SQLModel):
    nome: str
    bio: str
    path_foto: str

class EntrevistadoNomeResponse (SQLModel):
    nome: str