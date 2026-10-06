from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.database.connection import get_session

# entrevistas
from app.schemas.entrevista import EntrevistaCreate, EntrevistaUpdate, EntrevistaDataResponse, EntrevistaResponse
from app.schemas.entrevistado import EntrevistadoEntrevistaResponse
from app.repositories.entrevista import deletar_entrevista
from app.services.entrevista import criar_entrevista_completa, atualizar_entrevista_completa
from app.models.entrevista import Entrevista
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
    response_model = EntrevistaDataResponse
    )
def cadastrar_entrevista (
    entrevistado_id: int,
    dados: EntrevistaCreate, 
    session: Session = Depends(get_session)
    ):

    entrevista = criar_entrevista_completa(
        entrevistado_id = entrevistado_id,
        dados = dados,
        session = session
        )

    if not entrevista:
        raise HTTPException(
            status_code = 404,
            detail = "Erro ao cadastrar entrevista"
        )

    return entrevista


# update
@router.patch(
    "/entrevistas/{entrevista_id}",
    response_model = EntrevistaResponse
)
def editar_entrevista (
    entrevista_id: int,
    dados: EntrevistaUpdate,
    session: Session = Depends(get_session)
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
    response_model = EntrevistaDataResponse
    )
def excluir_entrevista (
    entrevista_id: int,
    session: Session = Depends(get_session)
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