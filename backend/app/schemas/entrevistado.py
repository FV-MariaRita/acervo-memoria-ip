from sqlmodel import SQLModel

class EntrevistadoCreate (SQLModel):
    nome: str
    bio: str
    funcao: str
    path_foto: str

class EntrevistadoUpdate (SQLModel):
    nome: str | None = None
    bio: str | None = None
    funcao: str | None = None
    path_foto: str | None = None

class EntrevistadoListaResponse (SQLModel):
    nome: str
    funcao: str
    path_foto: str

class EntrevistadoEntrevistaResponse (SQLModel):
    nome: str
    bio: str
    path_foto: str

class EntrevistadoNomeResponse (SQLModel):
    nome: str