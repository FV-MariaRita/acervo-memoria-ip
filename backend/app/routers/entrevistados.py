from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.database.connection import get_session
from app.schemas.entrevistado import EntrevistadoEntrevistaResponse, EntrevistadoListaResponse
from app.repositories.entrevistado import listar_entrevistados, buscar_entrevistado

router = APIRouter()

@router.get(
    "/entrevistados",
    response_model = list[EntrevistadoListaResponse]
    )
def mostrar_entrevistados (
    session: Session = Depends(get_session)
    ):

    return listar_entrevistados(session = session)

@router.get(
    "/entrevistados/{id}",
    response_model = EntrevistadoEntrevistaResponse
    )
def mostrar_entrevistado (
    id: int,
    session: Session = Depends(get_session)
    ):

    entrevistado = buscar_entrevistado(id = id, session = session)

    if not entrevistado:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistado não encontrado."
        )

    return entrevistado