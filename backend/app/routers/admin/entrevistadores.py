from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.database.connection import get_session

# entrevistador
from app.schemas.entrevistador import EntrevistadorCreate, EntrevistadorUpdate, EntrevistadorNomeResponse, EntrevistadorListaResponse
from app.repositories.entrevistador import criar_entrevistador, atualizar_entrevistador, deletar_entrevistador
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
    dados: EntrevistadorCreate, 
    session: Session = Depends(get_session)
    ):

    entrevistador = Entrevistador(**dados.model_dump())

    return criar_entrevistador(entrevistador = entrevistador, session = session)


# update
@router.patch(
    "/entrevistadores/{id}",
    response_model = EntrevistadorListaResponse
)
def editar_entrevistador (
    id: int,
    dados: EntrevistadorUpdate,
    session: Session = Depends(get_session)
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
    session: Session = Depends(get_session)
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