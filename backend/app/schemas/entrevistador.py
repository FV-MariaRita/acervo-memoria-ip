from sqlmodel import SQLModel, Field

from app.validators.string import NonBlankString

class EntrevistadorCreate (SQLModel):
    nome: NonBlankString = Field(
        min_length=1,
        max_length=100
    )
    bio: NonBlankString = Field(
        min_length=1,
        max_length=300
    )
    # path_foto incluido pelo backend

class EntrevistadorUpdate (SQLModel):
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
    # path_foto incluido pelo backend

class EntrevistadorListaResponse (SQLModel):
    nome: str
    bio: str
    path_foto: str

class EntrevistadorNomeResponse (SQLModel):
    nome: str