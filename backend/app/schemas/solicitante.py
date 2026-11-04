from pydantic import BaseModel, EmailStr, field_validator
from app.validators.documentos import validar_cpf

class SolicitanteCreate(BaseModel): 
    nome: str
    cpf: str
    email: EmailStr
    telefone: str
    rua: str
    cep: str
    cidade: str
    uf: str
    pais: str

    @field_validator("cpf")
    @classmethod
    def validar_documento(cls, valor: str): 
        return validar_cpf(valor)


