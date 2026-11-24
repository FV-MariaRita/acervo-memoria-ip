from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import ValidationError
from pydantic.json_schema import SkipJsonSchema
from sqlmodel import Session

from app.database.connection import get_session
from app.models.entrevistado import Entrevistado

# complemento da entrevista
from app.schemas.entrevista import EntrevistaAlertResponse

# entrevistado
from app.schemas.entrevistado import (
    EntrevistadoComEntrevistaCreate,
    EntrevistadoEntrevistaResponse,
    EntrevistadoNomeResponse,
    EntrevistadoUpdate,
)
from app.services.entrevistado import (
    service_atualizar_entrevistado,
    service_criar_entrevistado_com_entrevista,
    service_excluir_entrevistado,
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
    "/entrevistado",
    response_model = EntrevistaAlertResponse #colocar dados de entrevista + entrevistado
    )
def cadastrar_entrevistado_com_entrevista (
    dados: Annotated[str, Form()],
    audio: Annotated[UploadFile, File()],
    transcricao: Annotated[UploadFile, File()], 
    foto_entrevistado: Annotated[UploadFile, File()],
    session: Annotated[Session, Depends(get_session)],
    fotos_entrevista: Annotated[list[UploadFile] | None, File()] = None,
    fotos_marcantes: Annotated[list[UploadFile] | None, File()] = None
    ):

    try:
        dados = EntrevistadoComEntrevistaCreate.model_validate_json(
            dados
        )

    except ValidationError as e:
        raise HTTPException(
            status_code=422,
            detail=e.errors()
        )

    entrevistado, entrevista = service_criar_entrevistado_com_entrevista(
        dados_entrevista=dados.entrevista,
        dados_entrevistado=dados.entrevistado,
        foto_entrevistado=foto_entrevistado,
        audio=audio,
        transcricao=transcricao,
        fotos_entrevista=fotos_entrevista,
        fotos_marcantes=fotos_marcantes,
        session=session
    )

    response = EntrevistaAlertResponse(
        entrevistado_id = entrevistado.id,
        entrevistado_nome = entrevistado.nome,
        entrevista_data = entrevista.data
    )
    return response


# update
@router.patch(
    "/entrevistados/{id}",
    response_model = EntrevistadoEntrevistaResponse
)
def editar_entrevistado (
    id: int,
    session: Annotated[Session, Depends(get_session)],
    dados: Annotated[str, Form()] | None = None,
    foto_entrevistado: Annotated[UploadFile, File()] | None = None
    ) -> Entrevistado:

    entrevistado = service_atualizar_entrevistado(
        id = id,
        session = session,
        dados = dados,
        foto_entrevistado = foto_entrevistado
        )
    
    if not entrevistado:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistado não encontrado"
        )

    return entrevistado


# delete
@router.delete(
    "/entrevistados/{id}",
    response_model = EntrevistadoNomeResponse
    )
def excluir_entrevistado (
    id: int,
    session: Annotated[Session, Depends(get_session)]
    ):

    entrevistado_excluido = service_excluir_entrevistado(
        id = id, 
        session = session
    )

    if not entrevistado_excluido:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistado não encontrado"
        )

    return entrevistado_excluido