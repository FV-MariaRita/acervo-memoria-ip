from sqlmodel import Session, select
from app.models.entrevista import Entrevista
from app.schemas.entrevista import *

def listar_entrevistas (
    session: Session
    ) -> list[Entrevista]:

    return session.exec(
        select(Entrevista)
    ).all()

def buscar_entrevista (
    id: int,
    session: Session
    ) -> Entrevista | None:

    return session.get(Entrevista, id)


'''def criar_entrevista ( 
    entrevista: Entrevista,
    session: Session
    ) -> Entrevista:

    session.add(entrevista)

    return entrevista'''

def atualizar_entrevista (
    id: int,
    dados: EntrevistaUpdate,
    session: Session
    ) -> Entrevista | None:

    entrevista = session.get(Entrevista, id)

    if not entrevista:
        return None

    dados = dados.model_dump(exclude_unset=True)

    for atributo, valor in dados.items():
        setattr(entrevista, atributo, valor)

    session.add(entrevista)

    return entrevista

def deletar_entrevista (
    id: int,
    session: Session
    ) -> Entrevista | None:

    entrevista = session.get(Entrevista, id)

    if not entrevista:
        return None

    session.delete(entrevista)
    session.commit()

    return entrevista