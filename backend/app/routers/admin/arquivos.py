from fastapi import APIRouter, UploadFile, File Depends, HTTPException
import tempfile

router = APIRouter(
    prefix="/admin/arquivos",
    tags=["Admin"],
    #dependencies=[Depends(require_admin)]
) #garante que dominio/admin/qualquer coisa vai precisar estar com admin autenticado
#fast api users

@router.post(
    "",
    #response_model = Foto
)
def upload_arquivo (
    arquivo: UploadFile = File
):
    b2_path = criar_b2_path (

    )
    with tempfile.NamedTemporaryFile(delete=False) as temp:
    uploaded_file = upload_file(
        file_path = temp,
        b2_path = ,
        content_type = arquivos.content_type
    )