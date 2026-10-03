from sqlmodel import Session, select

def select_entrevistadores (session: Session):
    return select.exec(
        select(Entrevistador)
    ).all()