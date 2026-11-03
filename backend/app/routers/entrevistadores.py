from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel import Session
from app.database.connection import get_session
from app.schemas.entrevistador import EntrevistadorNomeResponse, EntrevistadorListaResponse
from app.services.entrevistador import service_mostrar_entrevistadores

router = APIRouter(
    prefix="",
    tags=["Entrevistadores"]
)

@router.get(
    "/entrevistadores",
    response_model = list[EntrevistadorListaResponse]
    )
def mostrar_entrevistadores (
    session: Annotated[Session, Depends(get_session)]
    ):

    return service_mostrar_entrevistadores(session = session)