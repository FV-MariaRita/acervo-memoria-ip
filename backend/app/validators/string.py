from typing import Annotated

from pydantic import AfterValidator, Field


def validar_non_blank (valor: str) -> str:
    valor = valor.strip()

    if not valor:
        raise ValueError(
            "O campo está vazio. Insira um valor válido."
        )

    return valor

NonBlankString = Annotated[
    str,
    AfterValidator(validar_non_blank),
]