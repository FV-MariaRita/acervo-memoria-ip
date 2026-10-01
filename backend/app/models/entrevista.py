from sqlmodel import SQLModel, Field

class Entrevista (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    local: str
    data: str
    path_audio: str
    path_transcricao: str

class Sumario (SQLModel, table=True):
    entrevista_id: int | None
    entrevistador_id: int

class Sumario (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    entrevista_id: int
    tempo_segundos: int
    assunto: str

class Fotos_entrevista (SQLModel, table=True):
    id: int | None = Field(default = None, primary_key = True)
    entrevista_id: int
    categoria: str
    numero: int
