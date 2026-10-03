from fastapi import APIRouter

router = APIRouter()

@router.get("/entrevistados/{entrevistado_id}/{entrevistado_nome}") #ou id

async def list_entrevistas():
    return 1