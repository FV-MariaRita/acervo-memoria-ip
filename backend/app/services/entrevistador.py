from typing import Annotated

from app.database.connection import get_session
from app.models.entrevistador import Entrevistador
from app.repositories.entrevistador import (
    atualizar_entrevistador,
    criar_entrevistador,
    deletar_entrevistador,
    listar_entrevistadores,
)
from app.schemas.entrevistador import (
    EntrevistadorCreate,
    EntrevistadorListaResponse,
    EntrevistadorUpdate,
)
from app.storage.b2 import (
    delete_file,
    excluir_arquivos_path,
    gerar_url,
    update_file,
    upload_file,
)
from app.validators.arquivos import validar_foto
from fastapi import Depends, File, Form, UploadFile
from sqlmodel import Session, select


def service_criar_entrevistador (
    dados: EntrevistadorCreate,
    foto: Annotated[UploadFile, File()],
    session: Session
) -> Entrevistador | None:

    path = None
    upload_realizado = False

    try:
        foto_entrevistador = validar_foto(
            foto,
            "entrevistador"
        )

        entrevistador = Entrevistador(
            **dados.model_dump()
        )

        entrevistador.path_foto ="pendente"

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

        upload_realizado = True

        entrevistador.path_foto = path

        session.commit()
        session.refresh(entrevistador)

        return entrevistador

    except Exception:
        session.rollback()

        if upload_realizado and path:
            try:
                delete_file(
                    b2_path = path
                )
            except Exception:
                raise ValueError("Erro ao excluir foto no rollback.")
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
            foto_validada = validar_foto(
                arquivo = foto,
                tipo_foto = "entrevistador"
            )

            path_foto_antiga = session.exec(
                select(Entrevistador.path_foto)
                .where(Entrevistador.id == entrevistador_id)
            ).one_or_none()

            entrevistador.path_foto = update_file(
                file_bytes = foto_validada.conteudo,
                content_type = foto_validada.content_type,
                path_antigo = path_foto_antiga,
                extensao = foto_validada.extensao
            )

        session.commit()
        session.refresh(entrevistador)

    except Exception:
        session.rollback()
        raise

    try:
        delete_file(
            b2_path=path_foto_antiga
        )
    except:
        raise

    return entrevistador

def service_excluir_entrevistador(
    entrevistador_id: int, 
    session: Annotated[Session, Depends(get_session)]
) -> Entrevistador | None:
    try:
        entrevistador = session.get(Entrevistador, entrevistador_id)

        if not entrevistador:
            raise ValueError("Entrevistador não encontrado.")

        entrevistador_excluido = deletar_entrevistador(
            id = entrevistador_id,
            session = session
        )

        if not entrevistador_excluido:
            raise ValueError("Não foi possível excluir o entrevistador.")

        session.commit()
    except:
        session.rollback()
        raise

    try:
        delete_file(
            b2_path=entrevistador.path_foto
        )

    except:
        raise

    return entrevistador_excluido

def service_mostrar_entrevistadores(
    session: Session
) -> list[EntrevistadorListaResponse]:

    entrevistadores = listar_entrevistadores(session)

    resultado = []

    for entrevistador in entrevistadores:
        resultado.append({
            "id": entrevistador.id,
            "nome": entrevistador.nome,
            "bio": entrevistador.bio,
            "path_foto": (
                gerar_url(entrevistador.path_foto)
                if entrevistador.path_foto
                else None
            )
        })

    return resultado