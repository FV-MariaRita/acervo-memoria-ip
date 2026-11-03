from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel import Session
from app.database.connection import get_session
from app.schemas.entrevistado import EntrevistadoEntrevistaResponse, EntrevistadoListaResponse
from app.services.entrevistado import service_mostrar_entrevistados, service_mostrar_entrevistado

router = APIRouter(
    prefix="",
    tags=["Entrevistados"]
)

@router.get(
    "/entrevistados",
    response_model = list[EntrevistadoListaResponse]
    )
def mostrar_entrevistados (
    session: Annotated[Session, Depends(get_session)]
    ):

    return service_mostrar_entrevistados(session = session)

@router.get(
    "/entrevistados/{id}",
    response_model = EntrevistadoEntrevistaResponse
    )
def mostrar_entrevistado (
    id: int,
    session: Annotated[Session, Depends(get_session)]
    ):

    entrevistado = service_mostrar_entrevistado(entrevistado_id = id, session = session)

    if not entrevistado:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistado não encontrado."
        )

    return entrevistado