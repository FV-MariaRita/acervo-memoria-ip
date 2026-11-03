from fastapi import File, Form, UploadFile
from sqlmodel import Session, select
from pathlib import Path

from app.storage.b2 import gerar_url

from app.models.entrevistado import Entrevistado
from app.models.entrevista import Entrevista

from app.schemas.entrevista import  EntrevistaResponse
from app.schemas.entrevistado import EntrevistadoListaResponse, EntrevistadoEntrevistaResponse

from app.repositories.entrevistado import buscar_entrevistado, listar_entrevistados

from app.services.entrevista import mostrar_entrevista_completa
'''from dataclass import dataclass
@dataclass
class FotoValidada:
    numero: int
    categoria: str
    conteudo: bytes
    extensao: str
    content_type: str'''

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

def service_mostrar_entrevistado(
    entrevistado_id: int,
    session: Session
) -> EntrevistadoEntrevistaResponse | None:

    entrevistado = buscar_entrevistado(
        id = entrevistad_id,
        session = session
    )

    if not entrevistado:
        raise

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