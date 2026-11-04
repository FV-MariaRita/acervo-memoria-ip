from sqlmodel import Session, select 

from app.models.solicitacao import Solicitacao 
from app.schemas.solicitacao import SolicitacaoStatusUpdate

def criar_solicitacao(entrevista_id: int, solicitante_id: int, mensagem: str | None, session: Session) -> Solicitacao: 

    solicitacao = Solicitacao(entrevista_id=entrevista_id, solicitante_id=solicitante_id, mensagem=mensagem)

    session.add(solicitacao)
    session.flush()
    session.refresh(solicitacao)

    return solicitacao 

def buscar_solicitacao(id: int, session: Session) -> Solicitacao | None: 

    return session.get(Solicitacao, id)

def listar_solicitacoes(session: Session) -> list[Solicitacao]: 

    statement = select(Solicitacao)

    return session.exec(statement).all()

def atualizar_solicitacao(
    id: int,
    dados: SolicitacaoStatusUpdate,
    session: Session
) -> Solicitacao | None:

    solicitacao = session.get(Solicitacao, id)

    if not solicitacao:
        return None

    dados_dict = dados.model_dump(exclude_unset=True)

    for atributo, valor in dados_dict.items():
        setattr(solicitacao, atributo, valor)

    session.add(solicitacao)
    session.flush()
    session.refresh(solicitacao)

    return solicitacao


def atualizar_path_termo(
    id: int,
    path_termo: str,
    session: Session
) -> Solicitacao | None:

    solicitacao = session.get(Solicitacao, id)

    if not solicitacao:
        return None

    solicitacao.path_termo = path_termo
    solicitacao.status = "pendente"

    session.add(solicitacao)
    session.flush()
    session.refresh(solicitacao)

    return solicitacao