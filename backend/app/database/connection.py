from sqlmodel import SQLModel, Session, create_engine
import os


database_url = os.getenv('POSTGRES_URL')
'''database_url = (
    f"postgresql+psycopg://"
    f"{os.getenv('POSTGRES_USER')}:"
    f"{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:"
    f"{os.getenv('POSTGRES_PORT')}/"
    f"{os.getenv('POSTGRES_DB')}"
)'''
if not database_url:
    raise  RuntimeError("POSTGRES_URL não configurada")
engine = create_engine(database_url)

SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
    