from sqlmodel import Session, select
from app.models.entrevistado import Entrevistado

def listar_entrevistados (
    session: Session
    ) -> list[Entrevistado]:

    return session.exec(
        select(Entrevistado)
    ).all()

def buscar_entrevistado (
    id: int,
    session: Session
    ) -> Entrevistado | None:

    return session.get(Entrevistado, id)


def criar_entrevistado ( 
    entrevistado: Entrevistado,
    session: Session
    ) -> Entrevistado:

    session.add(entrevistado)
    session.commit()
    session.refresh(entrevistado)

    return entrevistado

def atualizar_entrevistado (
    id: int,
    dados: EntrevistadoUpdate,
    session: Session
    ) -> Entrevistado | None:

    entrevistado = session.get(Entrevistado, id)

    if not entrevistado:
        return None;

    dados = dados.model_dump(exclude_unset=True)

    for atributo, valor in dados.items():
        setattr(entrevistado, atributo, valor)

    session.add(entrevistado)
    session.commit()
    session.refresh(entrevistado)

    return entrevistado

def deletar_entrevistado (
    id: int,
    session: Session
    ) -> Entrevistado | None:
    entrevistado = session.get(Entrevistado, id)

    if not entrevistado:
        return None

    session.delete(entrevistado)
    session.commit()

    return entrevistado