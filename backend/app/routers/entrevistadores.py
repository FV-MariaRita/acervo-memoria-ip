from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.database.connection import get_session
from app.schemas.entrevistador import EntrevistadorNomeResponse, EntrevistadorListaResponse
from app.repositories.entrevistador import listar_entrevistadores, buscar_entrevistadores

router = APIRouter(
    prefix="",
    tags=["Entrevistadores"]
)

@router.get(
    "/entrevistadores",
    response_model = list[EntrevistadorListaResponse]
    )
def mostrar_entrevistadores (
    session: Session = Depends(get_session)
    ):

    return listar_entrevistadores(session = session)