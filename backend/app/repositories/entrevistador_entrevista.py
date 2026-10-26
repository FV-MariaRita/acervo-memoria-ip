from sqlmodel import Session, select
from app.models.entrevista import Entrevistador_entrevista
from app.models.entrevistador import Entrevistador
from app.schemas.entrevista import Entrevistador_entrevistaCreate

def buscar_entrevistadores_entrevista (
    entrevista_id: int,
    session: Session
) -> list[Entrevistador] | None:

    entrevistadores = session.exec(
        select(
            Entrevistador
            ).join(
                Entrevistador_entrevista,
                Entrevistador.id == Entrevistador_entrevista.entrevistador_id
            ).where(
                Entrevistador_entrevista.entrevista_id == entrevista_id
            )
    ).all()

    if not entrevistadores:
        return None

    return entrevistadores


def associar_entrevistador_entrevista ( 
    entrevista_id: int,
    entrevistador_id: int,
    session: Session
    ) -> Entrevistador_entrevista | None:

    entrevistador = session.get(Entrevistador, entrevistador_id)

    if entrevistador is None:
        raise ValueError(
            f"Entrevistador {entrevistador_id} não encontrado."
        )
    
    associacao = Entrevistador_entrevista(
        entrevista_id = entrevista_id,
        entrevistador_id = entrevistador_id
    )

    session.add(associacao)

    return associacao


def excluir_entrevistador_entrevista (
    entrevista_id: int,
    entrevistador_id: int,
    session: Session
    ) -> Entrevistador_entrevista | None:

    associacao = session.get(Entrevistador_entrevista, (entrevista_id, entrevistador_id))

    if not associacao:
        return None

    session.delete(associacao)

    return associacao