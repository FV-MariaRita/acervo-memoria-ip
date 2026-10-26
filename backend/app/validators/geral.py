from typing import Annotated
from datetime import date
from pydantic import AfterValidator

def validar_data_nao_futura(valor: date) -> date:
        if valor > date.today():
            raise ValueError("A data não pode ser futura.")
        return valor

DataNaoFutura = Annotated[
    date,
    AfterValidator(validar_data_nao_futura)
]