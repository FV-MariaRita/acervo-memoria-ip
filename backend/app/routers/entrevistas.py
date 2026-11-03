from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from app.database.connection import get_session
from sqlmodel import Session
from app.schemas.entrevista import EntrevistaResponse
from app.services.entrevistado import mostrar_entrevistas_do_entrevistado

router = APIRouter(
    prefix="",
    tags=["Entrevistas"]
)

@router.get(
    "/entrevistas/{entrevistado_id}/",
    response_model = list[EntrevistaResponse]
)
def mostrar_entrevistas (
    entrevistado_id: int,
    session: Annotated[Session, Depends(get_session)]
):
    
    entrevistas = mostrar_entrevistas_do_entrevistado(
        entrevistado_id = entrevistado_id,
        session = session
    )

    if not entrevistas:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistas não encontradas"
        )

    return entrevistas