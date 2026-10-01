from sqlmodel import SQLModel, Field

class Entrevistado(SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    nome: str
    bio: str
    funcao: str
    path_foto: str