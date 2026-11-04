from pydantic import BaseModel, Field
from typing import Literal 
from datetime import datetime

from app.schemas.solicitante import SolicitanteCreate

class SolicitacaoTermoCreate(BaseModel): 
    entrevista_id: int
    solicitante: SolicitanteCreate
    mensagem: str | None = Field(default=None, max_length=1000)

class SolicitacaoStatusUpdate(BaseModel):
    status: Literal["aprovada", "recusada"]

class SolicitacaoResponse(BaseModel): 
    id: int
    data: datetime
    entrevista_id: int
    solicitante_id: int
    mensagem: str | None 
    status: str