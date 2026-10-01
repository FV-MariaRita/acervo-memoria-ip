from fastapi import FastAPI
from app.routers import entrevistas
from app.routers import entrevistados
from app.routers import entrevistadores
from app.routers import admin

app = FastAPI(title="Acervo de História Oral do IP")

app.include_router(entrevistas.router)
app.include_router(entrevistados.router)
app.include_router(entrevistadores.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"status": "API funcionando"}