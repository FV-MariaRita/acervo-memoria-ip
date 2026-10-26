from fastapi import File, Form, UploadFile
from sqlmodel import Session, select
from pathlib import Path

from app.models.entrevistado import Entrevistado
from app.models.entrevista import Entrevista

from app.schemas.entrevistado import EntrevistadoComEntrevistaCreate
from app.schemas.entrevista import EntrevistaCreate, Fotos_entrevistaCreate

from app.validators.arquivos import validar_foto, validar_audio, validar_pdf
from app.repositories.entrevistado import criar_entrevistado
from app.services.entrevista import criar_entrevista_completa, mostrar_entrevista_completa

from app.storage.b2 import upload_file
'''from dataclass import dataclass
@dataclass
class FotoValidada:
    numero: int
    categoria: str
    conteudo: bytes
    extensao: str
    content_type: str'''

def criar_entrevistado_com_entrevista (
    dados: EntrevistadoComEntrevistaCreate,
    foto_entrevistado: UploadFile,
    fotos_entrevista: list[UploadFile],
    fotos_marcantes: list[UploadFile],
    audio: UploadFile,
    trasncricao: UploadFile,
    session: Session 
    ):

    try:

        # validar os arquivos
        fotos_entrevista_validadas = []
        fotos_marcantes_validadas = []
        foto_entrevistado = validar_foto(foto_entrevistado, "entrevistado")
        for foto in fotos_entrevista:
            fotos_entrevista_validadas.append(validar_foto(foto, "entrevista"))
        for foto in fotos_marcantes:
            fotos_marcantes_validadas.append(validar_foto(foto, "entrevista"))
        validar_audio(audio)
        transcricao = validar_pdf(transcricao)

        entrevistado = Entrevistado(
                **dados.entrevistado.model_dump()
            )

        entrevistado = criar_entrevistado(
            entrevistado = entrevistado,
            session = session
        )

        if not entrevistado:
            raise ValueError("Erro ao criar o(a) entrevistado(a).")

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
            raise ValueError("Erro ao criar a entrevista.")

        session.add(entrevista)

        # upload dos arquivos no b2
        path_foto_entrevistado = f"entrevistados/{entrevistado.id}/perfil/{entrevistado.id}{foto_entrevistado.extensao}"

        upload_file(
            bytes = foto_entrevistado.conteudo,
            b2_path = path_foto_entrevistado,
            content_type = foto_entrevistado.content_type
        )

        path_fotos_entrevista = []
        for foto in fotos_entrevista_validadas and numero in dados.fotos:
            if dados.fotos.categoria == "entrevista":
                path = f"""entrevistados/{entrevistado.id}/entrevistas/{entrevista.id}/fotos/entrevista/{numero}{foto.extensao}"""
                #upload_file(
                #    bytes = )

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