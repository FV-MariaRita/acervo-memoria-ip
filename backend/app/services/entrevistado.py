from pathlib import Path

from app.models.entrevista import Entrevista
from app.models.entrevistado import Entrevistado
from app.repositories.entrevistado import (
    atualizar_entrevistado,
    buscar_entrevistado,
    criar_entrevistado,
    listar_entrevistados,
)
from app.schemas.entrevista import (
    EntrevistaCreate,
    EntrevistaResponse,
)
from app.schemas.entrevistado import (
    EntrevistadoCreate,
    EntrevistadoEntrevistaResponse,
    EntrevistadoListaResponse,
    EntrevistadoUpdate,
)
from app.services.entrevista import (
    mostrar_entrevista_completa,
    service_cadastrar_entrevista,
)
from app.storage.b2 import (
    delete_file,
    gerar_url,
    update_file,
    upload_file,
)
from app.validators.arquivos import validar_foto
from fastapi import File, Form, UploadFile
from sqlmodel import Session, select

'''from dataclass import dataclass
@dataclass
class FotoValidada:
    numero: int
    categoria: str
    conteudo: bytes
    extensao: str
    content_type: str'''

def service_criar_entrevistado_com_entrevista (
    dados_entrevistado: EntrevistadoCreate,
    dados_entrevista: EntrevistaCreate,
    foto_entrevistado: UploadFile,
    audio: UploadFile,
    transcricao: UploadFile,
    session: Session,
    fotos_entrevista: list[UploadFile] | None = None,
    fotos_marcantes: list[UploadFile] | None = None,
):

    path_perfil_enviado = False
    path_perfil = None

    try:
        foto_perfil_validada = validar_foto(
            foto_entrevistado,
            "entrevistado"
        )

        entrevistado = Entrevistado(
            **dados_entrevistado.model_dump()
        )

        entrevistado.path_foto = "pendente"

        entrevistado = criar_entrevistado(
            entrevistado=entrevistado,
            session=session
        )

        if not entrevistado:
            raise ValueError("Erro ao criar o(a) entrevistado(a).")

        session.flush()

        # upload da foto de perfil
        path_perfil = (
            f"entrevistados/{entrevistado.id}/perfil/{entrevistado.id}{foto_perfil_validada.extensao}"
        )

        upload_file(
            file_bytes=foto_perfil_validada.conteudo,
            b2_path=path_perfil,
            content_type=foto_perfil_validada.content_type
        )

        path_perfil_enviado = True
        entrevistado.path_foto = path_perfil

        paths_b2_criados = []
        paths_b2_criados.append(path_perfil)

        entrevista, paths_b2_criados = service_cadastrar_entrevista(
            dados = dados_entrevista,
            entrevistado_id = entrevistado.id,
            audio = audio,
            transcricao = transcricao,
            session = session,
            fotos_entrevista = fotos_entrevista,
            fotos_marcantes = fotos_marcantes,
            paths_b2_criados = paths_b2_criados
        )

        if not entrevista:
            raise ValueError("Erro ao criar a entrevista.")

        session.commit()

        session.refresh(entrevistado)
        session.refresh(entrevista)

        return entrevistado, entrevista
        
    except Exception:

        session.rollback()

        if path_perfil_enviado and path_perfil: 

            try:
                delete_file(b2_path=path_perfil)

            except Exception as error:
                print(f"Erro ao remover foto de perfil {path_perfil}: {error}")
        raise
    

def service_mostrar_entrevistados(
    session: Session
) -> list[EntrevistadoListaResponse]:

    entrevistados = listar_entrevistados(session)

    resultado = []

    for entrevistado in entrevistados:
        resultado.append({
            "id": entrevistado.id,
            "nome": entrevistado.nome,
            "funcao": entrevistado.funcao,
            "path_foto": (
                gerar_url(entrevistado.path_foto)
                if entrevistado.path_foto
                else None
            )
        })

    return resultado

def service_atualizar_entrevistado (
    entrevistado_id: int,
    session: Session,
    dados: EntrevistadoUpdate | None = None,
    foto_entrevistado: UploadFile | None = None,
) -> Entrevistado | None:

    try:
        if dados is None and foto_entrevistado is None:
            raise ValueError(
                "É necessário informar os dados ou uma foto para atualização."
           )

        entrevistado = buscar_entrevistado(
            id = entrevistado_id,
            session = session
        )

        if not entrevistado:
            raise ValueError(
                "Entrevistado não encontrado."
            )

        if dados:
            entrevistado = atualizar_entrevistado(
                id = entrevistado_id,
                dados = dados,
                session = session
            )

        session.flush()
        
        if foto_entrevistado:
            foto_perfil_validada = validar_foto(
                foto_entrevistado,
                "entrevistado"
            )

            path_novo = update_file(
                file_bytes = foto_perfil_validada.conteudo,
                path_antigo = entrevistado.path_foto,
                content_type = foto_perfil_validada.content_type,
                extensao = foto_perfil_validada.extensao
            )

            entrevistado.path_foto = path_novo
        
        session.flush()
        session.commit()
        session.refresh(entrevistado)

        return entrevistado

    except:
        session.rollback()

        if path_novo:
            try:
                delete_file(b2_path=path_novo)
            except Exception:
                logger.exception("Falha ao excluir novo arquivo do B2.")

        raise


def service_mostrar_entrevistado(
    entrevistado_id: int,
    session: Session
) -> EntrevistadoEntrevistaResponse | None:

    entrevistado = buscar_entrevistado(
        id = entrevistado_id,
        session = session
    )

    if not entrevistado:
        raise ValueError("Entrevistado não encontrado")

    return EntrevistadoEntrevistaResponse(
            nome = entrevistado.nome,
            bio = entrevistado.bio,
            path_foto = gerar_url(entrevistado.path_foto)
        )

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