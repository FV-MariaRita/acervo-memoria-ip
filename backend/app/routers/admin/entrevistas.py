from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import ValidationError
from sqlmodel import Session

from app.database.connection import get_session
from app.models.entrevista import Entrevista
from app.repositories.entrevista import deletar_entrevista

# entrevistas
from app.schemas.entrevista import (
    EntrevistaAlertResponse,
    EntrevistaCreate,
    EntrevistaResponse,
    EntrevistaUpdate,
)
from app.services.entrevista import (
    atualizar_entrevista_completa,
    service_cadastrar_entrevista,
)

#from app.services.auth import require_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    #dependencies=[Depends(require_admin)]
) #garante que dominio/admin/qualquer coisa vai precisar estar com admin autenticado
#fast api users

# create
@router.post(
    "/entrevistas/{entrevistado_id}",
    response_model = EntrevistaAlertResponse
    )
def cadastrar_entrevista (
    entrevistado_id: int,
    dados: Annotated[str, Form()],
    audio: Annotated[UploadFile, File()],
    transcricao: Annotated[UploadFile, File()], 
    session: Annotated[Session, Depends(get_session)],
    fotos_entrevista: Annotated[list[UploadFile] | None, File()] = None,
    fotos_marcantes: Annotated[list[UploadFile] | None, File()] = None
    ):

    try:
        dados_entrevista = EntrevistaCreate.model_validate_json(
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

    entrevistado, entrevista = service_cadastrar_entrevista(
        entrevistado_id=entrevistado_id,
        dados_entrevista=dados_entrevista,
        audio=audio,
        transcricao=transcricao,
        fotos_entrevista=fotos_entrevista,
        fotos_marcantes=fotos_marcantes,
        session=session
    )

    response = EntrevistaAlertResponse(
        id_entrevistado = entrevistado.id,
        data = entrevista.data
    )
    # add try except

    return response


# update
@router.patch(
    "/entrevistas/{entrevista_id}",
    response_model = EntrevistaResponse
)
def editar_entrevista (
    entrevista_id: int,
    dados: EntrevistaUpdate,
    session: Annotated[Session, Depends(get_session)]
    ):

    entrevista = atualizar_entrevista_completa(
        entrevista_id = entrevista_id, 
        dados = dados, 
        session = session
        )
    
    '''if not entrevista:
        raise HTTPException(
            status_code = 404,
            detail = "Erro ao atualizar entrevista"
        )'''

    return entrevista


# delete
@router.delete(
    "/entrevistas/{entrevista_id}",
    response_model = EntrevistaAlertResponse
    )
def excluir_entrevista (
    entrevista_id: int,
    session: Annotated[Session, Depends(get_session)]
    ):

    entrevista_excluida = deletar_entrevista(
        id = entrevista_id, 
        session = session
    )

    if not entrevista_excluida:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistado não encontrado"
        )

    return entrevista_excluida