import os
import logging
from functools import lru_cache
from b2sdk.v2 import B2Api, InMemoryAccountInfo

logger = logging.getLogger(__name__)


class ErroArmazenamento(Exception):
    """Erro ao interagir com o armazenamento B2."""

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