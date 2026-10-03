from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text

class Entrevistador (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    nome: str
    bio: str
    path_foto: str = Field(sa_column=Column(Text, nullable=False))