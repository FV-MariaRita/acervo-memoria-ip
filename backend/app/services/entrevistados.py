from sqlmodel import Session, select
from app.models.entrevistado import Entrevistado
from app.models.entrevista import Entrevista
from app.schemas.entrevistado import EntrevistadoComEntrevistaCreate
from app.schemas.entrevista import EntrevistaCreate
from app.repositories.entrevistado import criar_entrevistado
from app.services.entrevista import criar_entrevista_completa, mostrar_entrevista_completa

def criar_entrevistado_com_entrevista (
    dados: EntrevistadoComEntrevistaCreate,
    session: Session 
    ):

    try:

        entrevistado = Entrevistado(
                **dados.entrevistado.model_dump()
            )

        entrevistado = criar_entrevistado(
            entrevistado = entrevistado,
            session = session
        )

        if not entrevistado:
            raise ValueError("")

        session.add(entrevistado)
        session.flush()

        entrevista_dados = EntrevistaCreate(
            **dados.entrevista.model_dump() 
        )

        entrevista = criar_entrevista_completa(
            entrevistado_id=entrevistado.id,
            dados = entrevista_dados,
            session = session
        )

        if not entrevista:
            raise ValueError("")

        session.add(entrevista)

        session.commit()
        session.refresh(entrevistado)

        return entrevistado

    except Exception:
        session.rollback()
        raise

def mostrar_entrevistas_do_entrevistado (
    entrevistado_id: int,
    session: Session
) -> list[EntrevistaResponse] | None:

    entrevistas = session.exec(
        select(
            Entrevista
        ).where(
            Entrevista.entrevistado_id == entrevistado_id
        )
    ).all()

    if not entrevistas:
        return None

    todas = []
    for entrevista in entrevistas:
        entrevistaResponse = mostrar_entrevista_completa (
            entrevista_id = entrevista.id,
            session = session
        )
        if not entrevistaResponse:
            return None

        todas.append(entrevistaResponse)

    return todas