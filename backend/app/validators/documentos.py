import re

def validar_cpf(cpf: str) -> str:
   
    cpf = re.sub(r"\D", "", cpf)

    if len(cpf) != 11:
        raise ValueError("CPF deve ter 11 dígitos")

    
    if cpf == cpf[0] * 11:
        raise ValueError("CPF inválido")

    
    verificador1 = 0
    for i in range(9): 
        verificador1 += int(cpf[i]) * (10 - i)

    resto = verificador1 % 11
    digito1 = 0 if resto < 2 else 11 - resto

    if digito1 != int(cpf[9]):
        raise ValueError("CPF inválido")

    verificador2 = 0
    for i in range(9): 
        verificador2 += int(cpf[i]) * (11 - i)
    
    verificador2 += digito1 * 2

    resto = verificador2 % 11
    digito2 = 0 if resto < 2 else 11 - resto

    if digito2 != int(cpf[10]):
        raise ValueError("CPF inválido")

    return cpf


def validar_termo_assinado(arquivo: bytes) -> bool:

    if not arquivo:
        raise ValueError("O arquivo enviado está vazio.")

    if not arquivo.startswith(b"%PDF-"):
        raise ValueError("O arquivo enviado não é um PDF válido.")

    return True
