from sqlmodel import Session, select
from app.models.entrevistador import Entrevistador
from app.schemas.entrevistador import EntrevistadorUpdate, EntrevistadorCreate

def listar_entrevistadores (
    session: Session
    ) -> list[Entrevistador]:

    return session.exec(
        select(Entrevistador)
    ).all()

def buscar_entrevistadores (
    entrevista_id: int,
    session: Session
    ) -> list[Entrevistador] | None:

    return session.get(Entrevistador, entrevista_id)


def criar_entrevistador ( 
    entrevistador: EntrevistadorCreate,
    session: Session
    ) -> Entrevistador:

    session.add(entrevistador)
    session.commit()
    session.refresh(entrevistador)

    return entrevistador

def atualizar_entrevistador (
    id: int,
    dados: EntrevistadorUpdate,
    session: Session
    ) -> Entrevistador | None:

    entrevistador = session.get(Entrevistador, id)

    if not entrevistador:
        return None

    dados = dados.model_dump(exclude_unset=True)

    for atributo, valor in dados.items():
        setattr(entrevistador, atributo, valor)

    session.add(entrevistador)
    session.commit()
    session.refresh(entrevistador)

    return entrevistador

def deletar_entrevistador (
    id: int,
    session: Session
    ) -> Entrevistador | None:

    entrevistador = session.get(Entrevistador, id)

    if not entrevistador:
        return None

    session.delete(entrevistador)
    session.commit()

    return entrevistador