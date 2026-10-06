from fastapi import FastAPI
from app.routers import entrevistas
from app.routers import entrevistados
from app.routers import entrevistadores
from app.routers.admin import (
    entrevistas as admin_entrevistas,
    entrevistadores as admin_entrevistadores,
    entrevistados as admin_entrevistados
)

app = FastAPI(title="Acervo de História Oral do IP")

app.include_router(entrevistas.router)
app.include_router(entrevistados.router)
app.include_router(entrevistadores.router)

app.include_router(admin_entrevistas.router)
app.include_router(admin_entrevistados.router)
app.include_router(admin_entrevistadores.router)

@app.get("/")
async def root():
    return {"status": "API funcionando"}