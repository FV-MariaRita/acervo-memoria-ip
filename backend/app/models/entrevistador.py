from sqlalchemy import Column, Text
from sqlmodel import Field, SQLModel


class Entrevistador (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    nome: str
    bio: str
    path_foto: str = Field(sa_column=Column(Text, nullable=False))