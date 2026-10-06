from sqlmodel import Session, select
from app.models.entrevista import Sumario
from app.schemas.entrevista import SumarioCreate, SumarioUpdate

def buscar_sumario (
    entrevista_id: int,
    session: Session
) -> list[Sumario] | None:

    sumario_completo = session.exec(
        select(
            Sumario
        ).where(
            Sumario.entrevista_id == entrevista_id
        )
    ).all()

    if not sumario_completo:
        return None

    return sumario_completo


def criar_sumario (
    sumario: sumarioCreate,
    session: Session
    ) -> Sumario:

    session.add(sumario)

    return sumario

def atualizar_sumario (
    id: int,
    dados: sumarioUpdate,
    session: Session
    ) -> Sumario | None:

    sumario = session.get(Sumario, id)
    
    if not sumario:
        return None
        
    dados = dados.model_dump(exclude_unset=True, exclude={"id", "excluir"})

    for atributo, valor in dados.items():
        setattr(sumario, atributo, valor)

    session.add(sumario)

    return sumario

def deletar_sumario (
    id: int,
    session: Session
    ) -> Sumario | None:

    sumario = session.get(Sumario, id)

    if not sumario:
        return None

    session.delete(sumario)

    return sumario