from fastapi import APIRouter


router = APIRouter()

@router.get("/entrevistados")
async def list_entrevistados():
    return 1
@router.get("/{entrevistado_id}")
async def read_entrevistado (entrevistado_id: int):
    entrevistado_id -= 100

