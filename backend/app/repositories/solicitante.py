from sqlmodel import Session, select 

from app.models.solicitacao import Solicitante 
from app.schemas.solicitante import SolicitanteCreate

def buscar_solicitante_por_cpf (cpf: str, session: Session) -> Solicitante | None:

    statement = select(Solicitante).where(Solicitante.cpf == cpf)

    return session.exec(statement).first()

def criar_solicitante(dados: SolicitanteCreate, session: Session) -> Solicitante:

    solicitante = Solicitante(**dados.model_dump())

    session.add(solicitante)
    session.flush()
    session.refresh(solicitante)

    return solicitante