from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.database.connection import get_session

# entrevistado
from app.schemas.entrevistado import EntrevistadoCreate, EntrevistadoUpdate, EntrevistadoNomeResponse, EntrevistadoEntrevistaResponse
from app.repositories.entrevistado import criar_entrevistado, atualizar_entrevistado, deletar_entrevistado
from app.models.entrevistado import Entrevistado
#from app.services.auth import require_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    #dependencies=[Depends(require_admin)]
) #garante que dominio/admin/qualquer coisa vai precisar estar com admin autenticado
#fast api users

# entrevistado
@router.post(
    "/entrevistado",
    response_model = EntrevistadoNomeResponse
    )
def cadastrar_entrevistado (
    dados: EntrevistadoCreate, 
    session: Session = Depends(get_session)
    ):

    entrevistado = Entrevistado(**dados.model_dump())

    return criar_entrevistado(entrevistado = entrevistado, session = session)


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
