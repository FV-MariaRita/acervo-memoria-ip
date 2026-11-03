from fastapi import APIRouter, Depends, HTTPException, UploadFile, File,Form
from typing import Annotated
from sqlmodel import Session
from app.database.connection import get_session
from pydantic import ValidationError

# entrevistador
from app.schemas.entrevistador import EntrevistadorCreate, EntrevistadorUpdate, EntrevistadorNomeResponse, EntrevistadorListaResponse
from app.repositories.entrevistador import atualizar_entrevistador, deletar_entrevistador
from app.services.entrevistador import service_criar_entrevistador
from app.models.entrevistador import Entrevistador
#from app.services.auth import require_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    #dependencies=[Depends(require_admin)]
) #garante que dominio/admin/qualquer coisa vai precisar estar com admin autenticado
#fast api users

# create
@router.post(
    "/entrevistadores",
    response_model = EntrevistadorNomeResponse
    )
def cadastrar_entrevistador (
    dados: Annotated[str, Form()],
    foto: Annotated[UploadFile, File()],
    session: Annotated[Session, Depends(get_session)]
    ):

    try:
        dados_entrevistador = EntrevistadorCreate.model_validate_json(
            dados
        )

    except ValidationError as e:
        raise HTTPException(
            status_code=422,
            detail=e.errors(
                include_input=False,
                include_context=False
            )
        )

    return service_criar_entrevistador(dados = dados_entrevistador, foto = foto, session = session)


# update
@router.patch(
    "/entrevistadores/{id}",
    response_model = EntrevistadorListaResponse
)
def editar_entrevistador (
    id: int,
    dados: EntrevistadorUpdate,
    session: Annotated[Session, Depends(get_session)]
    ):

    entrevistador = atualizar_entrevistador(
        id = id, 
        dados = dados, 
        session = session
        )
    
    if not entrevistador:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistador não encontrado"
        )

    return entrevistador


# delete
@router.delete(
    "/entrevistadores/{id}",
    response_model = EntrevistadorNomeResponse
    )
def excluir_entrevistador (
    id: int,
    session: Annotated[Session, Depends(get_session)]
    ):

    entrevistador_excluido = deletar_entrevistador(
        id = id, 
        session = session)

    if not entrevistador_excluido:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistador não encontrado"
        )

    return entrevistador_excluido