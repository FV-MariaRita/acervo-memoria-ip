from fastapi import UploadFile, File, Form, Depends
from typing import Annotated
from sqlmodel import Session, select
from app.database.connection import get_session

from app.models.entrevistador import Entrevistador
from app.schemas.entrevistador import EntrevistadorListaResponse
from app.repositories.entrevistador import criar_entrevistador, listar_entrevistadores, deletar_entrevistador, atualizar_entrevistador
from app.validators.arquivos import validar_foto
from app.storage.b2 import upload_file, gerar_url, delete_file

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

def service_atualizar_entrevistador(
    entrevistador_id: int,
    session: Session,
    dados: EntrevistadorUpdate,
    foto: UploadFile | None = None,
    ) -> Entrevistador | None:
    # add try except, verificar ordem de delete no try except
    try:
        if foto is not None:
            foto_validada = validar_foto(
                arquivo = foto,
                tipo_foto = "entrevistador"
            )

        entrevistador = atualizar_entrevistador(
            id = entrevistador_id,
            dados = dados,
            session = session
        )

        if foto is not None:
            path_foto_antiga = session.exec(
                select(Entrevistador.path_foto)
                .where(Entrevistador.id == entrevistador_id)
            ).one_or_none()

            delete_file(
                b2_path = path_foto_antiga
            )

            path_foto_atualizada = (
                f"entrevistador/{entrevistador.id}/{entrevistador.id}{foto_validada.extensao}"
            )

            upload_file(
                file_bytes = foto_validada.conteudo,
                b2_path = path_foto_atualizada,
                content_type = foto_validada.content_type
            )

        session.commit()
        session.refresh(entrevistador)
            
        return entrevistador

    except Exception:
        session.rollback()
        raise 

def service_excluir_entrevistador(
    entrevistador_id: int, 
    session: Annotated[Session, Depends(get_session)]
) -> Entrevistador | None:
    # add try except
    entrevistador = session.get(Entrevistador, entrevistador_id)

    if not entrevistador:
        raise ValueError("Entrevistador não encontrado.")

    entrevistador_excluido = deletar_entrevistador(
        id = entrevistador_id,
        session = session
    )

    if not entrevistador:
        raise ValueError("Não foi possível excluir o entrevistador.")

    delete_file(
        b2_path = entrevistador.path_foto
    )

    session.commit()
    return entrevistador_excluido

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