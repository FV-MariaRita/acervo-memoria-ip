from sqlmodel import SQLModel, Field

class Solicitacao (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    data: str
    entrevista_id: int
    solicitante_id: int
    path_termo: str
    status: str

class Solicitante (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    nome: str
    cpf: str
    email: str
    rua: str
    cep: strcidade: str
    uf: str
    pais: str