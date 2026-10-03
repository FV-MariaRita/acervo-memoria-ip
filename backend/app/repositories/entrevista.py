from sqlmodel import Session, select, where

def read_entrevistas (session: Session, id:int):
    return session.exec(
        select(Entrevista).where(entrevistado_id==id)
    ).all()

