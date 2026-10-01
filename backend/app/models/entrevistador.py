from sqlmodel import SQLModel, Field

class Entrevistador (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    nome: str
    bio: str
    path_foto: str