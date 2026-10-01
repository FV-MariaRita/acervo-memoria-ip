from fastapi import APIRouter, Depends
#from app.services.auth import require_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    #dependencies=[Depends(require_admin)]
) #garante que dominio/admin/qualquer coisa vai precisar estar com admin autenticado
#fast api users
