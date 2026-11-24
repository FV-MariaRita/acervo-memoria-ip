import logging
import os
from functools import lru_cache
from pathlib import Path
from uuid import uuid4

from b2sdk.v2 import B2Api, InMemoryAccountInfo

logger = logging.getLogger(__name__)


class ErroArmazenamento(Exception):
    """Erro ao interagir com o armazenamento B2."""

class FileNotFound(Exception):
    """Arquivo não encontrado."""

class ErroUpload(Exception):
    """Erro"""

@lru_cache(maxsize=1)
def get_b2_api():
    key_id = os.getenv("B2_KEY_ID")
    application_key = os.getenv("B2_APPLICATION_KEY")

    if not key_id or not application_key:
        raise RuntimeError("Credenciais do B2 não configuradas")

    info = InMemoryAccountInfo()
    b2_api = B2Api(info)

    b2_api.authorize_account(
        "production",
        key_id,
        application_key
    )

    return b2_api

@lru_cache(maxsize=1)
def get_bucket():
    b2_api = get_b2_api()

    bucket_name = os.getenv("B2_BUCKET")

    if not bucket_name:
        raise RuntimeError("B2_BUCKET não configurado")

    return b2_api.get_bucket_by_name(bucket_name) # retorna bucket

def upload_file(
    file_bytes: bytes,
    b2_path: str,
    content_type: str
):
    try:
        return get_bucket().upload_bytes(
            data_bytes=file_bytes,
            file_name=b2_path,
            content_type=content_type,
        )
    except ErroArmazenamento:
        raise
    except Exception as exc:
        logger.exception(
            "Falha no upload para o B2: %s",
            b2_path,
        )
        raise ErroArmazenamento(
            "Não foi possível enviar o arquivo."
        ) from exc

def delete_file (b2_path: str) -> None:
    try:
        for arquivo in get_bucket().list_file_versions(
            file_name=b2_path,
            fetch_count=100
        ):
            if arquivo.file_name == b2_path:
                get_bucket().delete_file_version(
                    file_id=arquivo.id_,
                    file_name=arquivo.file_name
                )
                return

        raise FileNotFoundError(
            f"Arquivo não encontrado no B2: {b2_path}"
        )

    except FileNotFoundError:
        raise
    except Exception as e:
        raise #ErroUpload("Falha ao excluir arquivo do B2") from e

def gerar_url(b2_path: str) -> str:
    try:
        autorizacao = get_bucket().get_download_authorization(
            file_name_prefix=b2_path,
            valid_duration_in_seconds=3600
        )

        url_base = get_bucket().get_download_url(b2_path)

        return f"{url_base}?Authorization={autorizacao}"

    except Exception as exc:
        logger.exception("Erro ao gerar URL de acesso à foto no B2")
        raise ErroArmazenamento(
            "Não foi possível gerar a URL da foto."
        ) from exc

def update_file(
    file_bytes: bytes,
    content_type: str,
    path_antigo: str,
    extensao: str,
    numero: int | None = None
) -> str:

    diretorio = str(Path(path_antigo).parent)
    if not numero:
        novo_nome = f"{uuid4()}{extensao}"
    else:
        novo_nome = f"{numero}{extensao}"
    path_novo = f"{diretorio}/{novo_nome}"

    upload_file(
        file_bytes=file_bytes,
        b2_path=path_novo,
        content_type=content_type,
    )

    return path_novo

def gerar_url_path(prefixo: str) -> str:
    bucket = get_bucket()

    arquivos = list(
        bucket.ls(
            folder_to_list=prefixo,
            latest_only=True,
            recursive=False
        )
    )

    arquivos = [
        file_version
        for file_version, folder_name in arquivos
        if folder_name is None
    ]

    if not arquivos:
        raise FileNotFoundError(
            f"Nenhum arquivo encontrado em {prefixo}"
        )

    if len(arquivos) > 1:
        raise ValueError(
            f"Mais de um arquivo encontrado em {prefixo}"
        )

    b2_path = arquivos[0].file_name
    url_base = bucket.get_download_url(b2_path)
    autorizacao = get_bucket().get_download_authorization(
        file_name_prefix=b2_path,
        valid_duration_in_seconds=3600
    )

    return f"{url_base}?Authorization={autorizacao}"

def mover_arquivo(
    path_origem: str,
    path_destino: str
) -> str:
    bucket = get_bucket()

    arquivos = [
        arquivo
        for arquivo, pasta in bucket.ls(
            folder_to_list=path_origem,
            latest_only=True,
            recursive=False
        )
        if pasta is None
    ]

    if not arquivos:
        raise FileNotFoundError(
            f"Nenhum arquivo encontrado em {path_origem}"
        )

    arquivo = min(
        arquivos,
        key=lambda arquivo: arquivo.upload_timestamp
    )

    nome_arquivo = arquivo.file_name.rsplit("/", 1)[-1]

    caminho_novo = (
        f"{path_destino.rstrip('/')}/{nome_arquivo}"
    )

    novo_arquivo = bucket.copy_file(
        file_id=arquivo.id_,
        new_file_name=caminho_novo
    )

    bucket.delete_file_version(
        file_id=arquivo.id_,
        file_name=arquivo.file_name
    )

    return novo_arquivo.file_name

def excluir_arquivos_path(prefixo: str) -> int:
    bucket = get_bucket()

    arquivos = [
        arquivo
        for arquivo, pasta in bucket.ls(
            folder_to_list=prefixo,
            latest_only=True,
            recursive=True
        )
        if pasta is None
    ]

    for arquivo in arquivos:
        bucket.delete_file_version(
            file_id=arquivo.id_,
            file_name=arquivo.file_name
        )

    return len(arquivos)