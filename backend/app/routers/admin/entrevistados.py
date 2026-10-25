from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.database.connection import get_session

# entrevistado
from app.schemas.entrevistado import EntrevistadoComEntrevistaCreate, EntrevistadoUpdate, EntrevistadoNomeResponse, EntrevistadoEntrevistaResponse
from app.repositories.entrevistado import atualizar_entrevistado, deletar_entrevistado
from app.services.entrevistados import criar_entrevistado_com_entrevista
from app.models.entrevistado import Entrevistado
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
    response_model = EntrevistadoNomeResponse #colocar dados de entrevista + entrevistado
    )
def cadastrar_entrevistado_com_entrevista (
    dados: EntrevistadoComEntrevistaCreate, 
    session: Session = Depends(get_session)
    ):

    entrevistado = criar_entrevistado_com_entrevista (
        dados = dados,
        session = session
    )

    if not entrevistado:
        raise HTTPException(
            status_code = 1,
            detail = ""
        )

    return entrevistado


# update
@router.patch(
    "/entrevistados/{id}",
    response_model = EntrevistadoEntrevistaResponse
)
def editar_entrevistado (
    id: int,
    dados: EntrevistadoUpdate,
    session: Session = Depends(get_session)
    ):

    entrevistado = atualizar_entrevistado(
        id = id, 
        dados = dados, 
        session = session
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
    session: Session = Depends(get_session)
    ):

    entrevistado_excluido = deletar_entrevistado(
        id = id, 
        session = session)

    if not entrevistado_excluido:
        raise HTTPException(
            status_code = 404,
            detail = "Entrevistado não encontrado"
        )

    return entrevistado_excluido