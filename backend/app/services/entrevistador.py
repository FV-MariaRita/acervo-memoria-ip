from fastapi import UploadFile, File, Form, Depends
from typing import Annotated
from sqlmodel import Session
from app.database.connection import get_session

from app.models.entrevistador import Entrevistador
from app.schemas.entrevistador import EntrevistadorListaResponse
from app.repositories.entrevistador import criar_entrevistador, listar_entrevistadores
from app.validators.arquivos import validar_foto
from app.storage.b2 import upload_file, gerar_url

def service_criar_entrevistador (
    dados: EntrevistadoCreate,
    foto: Annotated[UploadFile, File()],
    session: Session
) -> Entrevistador | None:

    try:
        foto_entrevistador = validar_foto(
            foto,
            "entrevistador"
        )

        entrevistador = Entrevistador(
            **dados.model_dump()
        )

        entrevistador.path_foto ="provisorio"

        entrevistador = criar_entrevistador(
            entrevistador=entrevistador,
            session=session
        )

        if not entrevistador:
            raise ValueError("Erro ao criar o(a) entrevistado(a).")

        session.flush()

        # upload da foto de perfil
        path = (
            f"entrevistador/{entrevistador.id}/{entrevistador.id}{foto_entrevistador.extensao}"
        )

        upload_file(
            file_bytes=foto_entrevistador.conteudo,
            b2_path=path,
            content_type=foto_entrevistador.content_type
        )

        entrevistador.path_foto = path

        session.commit()
        session.refresh(entrevistador)

        return entrevistador

    except Exception:
        session.rollback()
        raise

def service_mostrar_entrevistadores(
    session: Session
) -> list[EntrevistadorListaResponse]:

    entrevistadores = listar_entrevistadores(session)

    resultado = []

    for entrevistador in entrevistadores:
        resultado.append({
            "nome": entrevistador.nome,
            "bio": entrevistador.bio,
            "path_foto": (
                gerar_url(entrevistador.path_foto)
                if entrevistador.path_foto
                else None
            )
        })

    return resultado