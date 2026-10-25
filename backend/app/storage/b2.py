import os

from b2sdk.v2 import B2Api, InMemoryAccountInfo


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

def upload_file(
    file_path: str,
    b2_path: str,
    content_type: str
):
    b2_api = get_b2_api()

    bucket_name = os.getenv("B2_BUCKET")

    if not bucket_name:
        raise RuntimeError("B2_BUCKET não configurado")

    bucket = b2_api.get_bucket_by_name(bucket_name)

    uploaded_file = bucket.upload_local_file(
        local_file = file_path,
        file_name = b2_path,
        content_type = content_type
    )

    return uploaded_file