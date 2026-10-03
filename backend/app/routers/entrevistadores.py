from fastapi import APIRouter

router = APIRouter()

@router.get("/entrevistadores")
async def list_entrevistadores():
    return 1