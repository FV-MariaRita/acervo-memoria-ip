from sqlmodel import SQLModel, Field
from datetime import date
from pydantic import PositiveInt

from app.validators.string import NonBlankString
from app.validators.geral import DataNaoFutura
'''class PrimeiraEntrevistaCreate (SQLModel):
    local: str
    data: date
    path_audio: str
    path_transcricao: str

    sumario: list[SumarioCreate]
    entrevistadores: list[int]
    fotos: list[Fotos_entrevistaCreate]'''

class EntrevistaCreate (SQLModel):
    local: NonBlankString = Field(
        min_length=1,
        max_length=50
    )
    data: DataNaoFutura
    # path de transcricao e audio sao incluidos apos upload

    sumario: list[SumarioCreate]
    entrevistadores: list[PositiveInt]
    fotos: list[Fotos_entrevistaCreate]

class EntrevistaUpdate (SQLModel):
    local: NonBlankString | None = Field(
        default=None,
        min_length=1,
        max_length=50
    )
    data: DataNaoFutura | None = None
    # path de transcricao e audio sao incluidos apos upload

    sumario: list[SumarioUpdate] | None = []
    entrevistadores: Entrevistador_entrevistaUpdate | None = None
    fotos: list[Fotos_entrevistaUpdate] | None = []

class Entrevistador_entrevistaCreate (SQLModel):
    entrevistador_id: PositiveInt

class Entrevistador_entrevistaUpdate (SQLModel):
    # lista de ids dos entrevistadores
    adicionar: list[PositiveInt]
    remover: list[PositiveInt]

class SumarioCreate (SQLModel):
    tempo_segundos: PositiveInt
    assunto: NonBlankString = Field(
        min_length=1, 
        max_length=100
    )
    
class SumarioUpdate (SQLModel):
    id: PositiveInt | None = None
    tempo_segundos: PositiveInt | None = None
    assunto: NonBlankString | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )
    excluir: bool = False

class Fotos_entrevistaCreate (SQLModel):
    categoria: NonBlankString = Field(
        min_length=1,
        max_length=20
    )
    numero: PositiveInt

class Fotos_entrevistaUpdate (SQLModel):
    id: int | None = None
    categoria: NonBlankString | None = Field(
        default=None,
        min_length=1,
        max_length=20
    )
    numero: PositiveInt | None = None
    excluir: bool = False

class Entrevistador_entrevistaResponse (SQLModel):
    id: PositiveInt
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