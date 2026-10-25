from sqlmodel import Session, select
from app.models.entrevista import Fotos_entrevista
from app.schemas.entrevista import Fotos_entrevistaCreate, Fotos_entrevistaUpdate

def buscar_fotos_entrevista (
    entrevista_id: int,
    session: session
) -> list[Fotos_entrevista] | None:

    fotos = session.exec(
        select(
            Fotos_entrevista
        ).where(
            Fotos_entrevista.entrevista_id == entrevista_id
        )
    ).all()

    if not fotos:
        return None

    return fotos

    
def criar_foto_entrevista ( 
    foto: Fotos_entrevistaCreate,
    session: Session
    ) -> Fotos_entrevista:

    session.add(foto)

    return foto

def atualizar_foto_entrevista (
    id: int,
    posicao: int,
    session: Session
    ) -> Fotos_entrevista | None:

    foto = session.get(Fotos_entrevista, id)

    if not foto:
        return None

    foto.numero = posicao

    session.add(foto)

    return foto

def deletar_foto_entrevista (
    id: int,
    session: Session
    ) -> Fotos_entrevista | None:

    foto = session.get(Fotos_entrevista, id)

    if not foto:
        return None

    session.delete(foto)

    return foto