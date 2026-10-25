from sqlmodel import SQLModel
from datetime import date

'''class PrimeiraEntrevistaCreate (SQLModel):
    local: str
    data: date
    path_audio: str
    path_transcricao: str

    sumario: list[SumarioCreate]
    entrevistadores: list[int]
    fotos: list[Fotos_entrevistaCreate]'''

class EntrevistaCreate (SQLModel):
    local: str
    data: date
    path_audio: str
    path_transcricao: str

    sumario: list[SumarioCreate]
    entrevistadores: list[int]
    fotos: list[Fotos_entrevistaCreate]

class EntrevistaUpdate (SQLModel):
    local: str | None = None
    data: date | None = None
    path_audio: str | None = None
    path_transcricao: str | None = None

    sumario: list[SumarioUpdate] | None = []
    entrevistadores: Entrevistador_entrevistaUpdate | None = None
    fotos: list[Fotos_entrevistaUpdate] | None = []

class Entrevistador_entrevistaCreate (SQLModel):
    entrevistador_id: int

class Entrevistador_entrevistaUpdate (SQLModel):
    adicionar: list[int]
    remover: list[int]

class SumarioCreate (SQLModel):
    tempo_segundos: int
    assunto: str
    
class SumarioUpdate (SQLModel):
    id: int | None = None
    tempo_segundos: int | None = None
    assunto: str | None = None
    excluir: bool = False

class Fotos_entrevistaCreate (SQLModel):
    categoria: str
    numero: int

class Fotos_entrevistaUpdate (SQLModel):
    id: int | None = None
    categoria: str | None = None
    numero: int | None = None
    excluir: bool = False

class Entrevistador_entrevistaResponse (SQLModel):
    id: int
    nome: str

class SumarioResponse (SQLModel):
    tempo_segundos: int
    assunto: str

class EntrevistaResponse (SQLModel):
    local: str
    data: date
    path_audio: str
    path_transcricao: str

    sumario: list[SumarioResponse]
    entrevistadores: list[Entrevistador_entrevistaResponse]

    path_fotos_entrevista: list[str]
    path_fotos_marcantes: list[str]

class EntrevistaDataResponse (SQLModel):
    data: date