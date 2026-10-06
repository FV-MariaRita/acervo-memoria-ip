from sqlmodel import SQLModel

class EntrevistadorCreate (SQLModel):
    nome: str
    bio: str
    path_foto: str

class EntrevistadorUpdate (SQLModel):
    nome: str | None = None
    bio: str | None = None
    path_foto: str | None = None

class EntrevistadorListaResponse (SQLModel):
    nome: str
    bio: str
    path_foto: str

class EntrevistadorNomeResponse (SQLModel):
    nome: str