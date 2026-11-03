from io import BytesIO

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel

class ArquivoValidado(BaseModel):
    extensao: str
    content_type: str
    conteudo: bytes

# foto

MAX_TAMANHO_FOTO = 10 * 1024 * 1024  # 10 MB
FORMATOS_PERMITIDOS = {"JPEG", "PNG", "WEBP"}

FORMATOS_FOTO = {
    "JPEG": (".jpg", "image/jpeg"),
    "PNG": (".png", "image/png"),
    "WEBP": (".webp", "image/webp"),
}

MAX_LARGURA = 6000
MAX_ALTURA = 6000

PROPORCOES_FOTO = {
    "entrevistado": (1, 1),
    "entrevistador": (3, 4),
    "entrevista": (5, 4),
}


def validar_tamanho_foto(conteudo: bytes) -> None:
    if not conteudo:
        raise HTTPException(
            status_code=400,
            detail="A foto não pode estar vazia."
        )

    if len(conteudo) > MAX_TAMANHO_FOTO:
        raise HTTPException(
            status_code=413,
            detail="A foto excede o limite de 10 MB."
        )


def validar_formato_foto(conteudo: bytes) -> str:
    try:
        with Image.open(BytesIO(conteudo)) as imagem:
            if imagem.format not in FORMATOS_PERMITIDOS:
                raise HTTPException(
                    status_code=415,
                    detail="Formato de foto não permitido."
                )
            return imagem.format

    except HTTPException: #raise a http exception que houve
        raise
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="O arquivo não é uma imagem válida."
        )


def validar_integridade_foto(conteudo: bytes) -> None:
    try:
        with Image.open(BytesIO(conteudo)) as imagem:
            imagem.verify()

    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="A imagem está corrompida ou é inválida."
        )


def validar_proporcao_foto(
    largura: int,
    altura: int,
    proporcao_largura: int,
    proporcao_altura: int,
) -> None:
    if largura * proporcao_altura != altura * proporcao_largura:
        raise HTTPException(
            status_code=400,
            detail="A proporção da foto não é válida."
        )


def validar_dimensoes_foto(
    conteudo: bytes,
    tipo_foto: str,
) -> None:
    # valida as dimensões e a proporção conforme o tipo de foto

    try:
        with Image.open(BytesIO(conteudo)) as imagem:
            largura, altura = imagem.size

            if (
                largura <= 0
                or altura <= 0
                or largura > MAX_LARGURA
                or altura > MAX_ALTURA
            ):
                raise HTTPException(
                    status_code=400,
                    detail="As dimensões da foto não são permitidas."
                )

            proporcao_largura, proporcao_altura = (
                PROPORCOES_FOTO[tipo_foto]
            )

            validar_proporcao_foto(
                largura,
                altura,
                proporcao_largura,
                proporcao_altura,
            )

    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Não foi possível verificar as dimensões da foto."
        )

def validar_foto(
    arquivo: UploadFile,
    tipo_foto: str,
) -> bytes:
    # "service" de validar foto
    if tipo_foto not in PROPORCOES_FOTO:
        raise ValueError(f"Tipo de foto desconhecido: {tipo_foto}")

    conteudo = arquivo.file.read(MAX_TAMANHO_FOTO + 1)

    validar_tamanho_foto(conteudo)
    formato = validar_formato_foto(conteudo)
    validar_integridade_foto(conteudo)
    validar_dimensoes_foto(conteudo, tipo_foto)

    extensao, content_type = FORMATOS_FOTO[formato]

    arquivo.file.seek(0)

    return ArquivoValidado(
        extensao=extensao,
        content_type=content_type,
        conteudo=conteudo,
    )

# lista de fotos da entrevista
def validar_metadados_fotos(fotos):
    metadados_entrevista = [
        foto for foto in fotos
        if foto.categoria == "entrevista"
    ]

    metadados_marcantes = [
        foto for foto in fotos
        if foto.categoria == "marcantes"
    ]

    if len(metadados_entrevista) > 6:
        raise HTTPException(
            status_code=422,
            detail="O limite é de 6 fotos da entrevista."
        )

    if len(metadados_marcantes) > 6:
        raise HTTPException(
            status_code=422,
            detail="O limite é de 6 fotos marcantes."
        )

    categorias_permitidas = {"entrevista", "marcantes"}

    if any(foto.categoria not in categorias_permitidas for foto in fotos):
        raise HTTPException(
            status_code=422,
            detail="Categoria de foto inválida."
        )

    combinacoes = [
        (foto.categoria, foto.numero)
        for foto in fotos
    ]

    if len(combinacoes) != len(set(combinacoes)):
        raise HTTPException(
            status_code=422,
            detail="Existem fotos com categoria e número duplicados."
        )

    ids = [foto.arquivo_id for foto in fotos]

    if len(ids) != len(set(ids)):
        raise HTTPException(
            status_code=422,
            detail="Existem identificadores duplicados nos metadados das fotos."
        )

    return metadados_entrevista, metadados_marcantes

def associar_arquivos_fotos(arquivos, metadados, categoria):
    arquivos_associados = {}

    for arquivo in arquivos:
        try:
            arquivo_id = UUID(arquivo.filename)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=422,
                detail=f"Identificador inválido em uma foto da categoria {categoria}."
            )

        if arquivo_id in arquivos_associados:
            raise HTTPException(
                status_code=422,
                detail=f"Identificador duplicado nas fotos da categoria {categoria}."
            )

        arquivos_associados[arquivo_id] = validar_foto(
            arquivo, "entrevista"
        )

    ids_metadados = {foto.arquivo_id for foto in metadados}

    if ids_metadados != set(arquivos_associados):
        raise HTTPException(
            status_code=422,
            detail=f"Os metadados e os arquivos das fotos da categoria {categoria} não correspondem."
        )

    return arquivos_associados
# audio

import json
import subprocess
import tempfile
from pathlib import Path

MAX_TAMANHO_AUDIO = 4 * 1024 * 1024 * 1024  # 4 GB
TAMANHO_BLOCO = 1024 * 1024  # 1 MB

TIMEOUT_FFPROBE = 120
TIMEOUT_FFmpeg = 4 * 3600

def validar_tamanho_audio(tamanho: int) -> None:
    if tamanho == 0:
        raise HTTPException(
            status_code=400,
            detail="O arquivo de áudio não pode estar vazio.",
        )

    if tamanho > MAX_TAMANHO_AUDIO:
        raise HTTPException(
            status_code=413,
            detail="O áudio excede o limite de 2 GB.",
        )

def validar_formato_audio(dados: dict) -> None:
    formato = dados.get("format", {}).get("format_name", "")
    formatos = set(formato.split(","))

    if "wav" not in formatos and "mp3" not in formatos:
        raise HTTPException(
            status_code=415,
            detail="Formato não permitido. Envie um arquivo WAV ou MP4.",
        )

def validar_faixas_audio(dados: dict) -> None:
    faixas = dados.get("streams", [])

    faixas_audio = [
        faixa for faixa in faixas
        if faixa.get("codec_type") == "audio"
    ]

    faixas_video = [
        faixa for faixa in faixas
        if faixa.get("codec_type") == "video"
    ]

    if faixas_video:
        raise HTTPException(
            status_code=415,
            detail="O arquivo não pode conter faixas de vídeo."
        )

    if len(faixas_audio) != 1:
        raise HTTPException(
            status_code=400,
            detail="O arquivo deve conter exatamente uma faixa de áudio."
        )

    faixa = faixas_audio[0]

    if (
        not faixa.get("codec_name")
        or not faixa.get("sample_rate")
        or int(faixa["sample_rate"]) <= 0
        or not faixa.get("channels")
        or int(faixa["channels"]) <= 0
    ):
        raise HTTPException(
            status_code=400,
            detail="A faixa de áudio possui metadados inválidos."
        )


def validar_duracao_audio(dados: dict) -> None:
    duracao = dados.get("format", {}).get("duration")

    try:
        duracao = float(duracao)
    except (TypeError, ValueError):
        duracao = 0

    if duracao <= 0:
        raise HTTPException(
            status_code=400,
            detail="Não foi possível determinar uma duração válida para o áudio.",
        )


def analisar_audio(caminho: str) -> dict:
    try:
        resultado = subprocess.run(
            [
                "ffprobe",
                "-v", "error",
                "-show_entries",
                "format=format_name,duration:stream=codec_type,codec_name,sample_rate,channels",
                "-of", "json",
                caminho,
            ],
            capture_output=True,
            text=True,
            timeout=TIMEOUT_FFPROBE,
            check=False,
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=422,
            detail="A análise do arquivo excedeu o tempo permitido.",
        ) from None
    except OSError:
        raise RuntimeError(
            "FFprobe não está disponível no ambiente do backend."
        ) from None

    if resultado.returncode != 0:
        raise HTTPException(
            status_code=400,
            detail="O arquivo de áudio é inválido ou não pôde ser analisado.",
        )

    try:
        return json.loads(resultado.stdout)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Não foi possível interpretar os dados do arquivo.",
        ) from None


def validar_integridade_audio(caminho: str) -> None:
    try:
        resultado = subprocess.run(
            [
                "ffmpeg",
                "-nostdin",
                "-v", "error",
                "-xerror",
                "-i", caminho,
                "-map", "0:a",
                "-f", "null",
                "-",
            ],
            capture_output=True,
            text=True,
            timeout=TIMEOUT_FFmpeg,
            check=False,
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=422,
            detail="A verificação do áudio excedeu o tempo permitido.",
        ) from None
    except OSError:
        raise RuntimeError(
            "FFmpeg não está disponível no ambiente do backend."
        ) from None

    if resultado.returncode != 0:
        raise HTTPException(
            status_code=400,
            detail="O áudio contém erros de decodificação ou está corrompido.",
        )


def validar_audio(arquivo: UploadFile) -> None:
    # valida sem colocar o audio todo na memoria
    tamanho = 0
    caminho_temporario = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            suffix=".media",
            delete=False,
        ) as temporario:
            caminho_temporario = temporario.name

            while True:
                bloco = arquivo.file.read(TAMANHO_BLOCO)

                if not bloco:
                    break

                tamanho += len(bloco)
                validar_tamanho_audio(tamanho)
                temporario.write(bloco)

        validar_tamanho_audio(tamanho)

        dados = analisar_audio(caminho_temporario)

        validar_formato_audio(dados)
        validar_faixas_audio(dados)
        validar_duracao_audio(dados)
        validar_integridade_audio(caminho_temporario)

        return ArquivoValidado(
            extensao=extensao,
            content_type=content_type,
            conteudo=conteudo
        )
        
    finally:
        arquivo.file.seek(0)

        if caminho_temporario:
            Path(caminho_temporario).unlink(missing_ok=True)

# documentos em pdf

from pypdf import PdfReader
from pypdf.errors import PdfReadError


MAX_TAMANHO_PDF = 50 * 1024 * 1024  # 50 MB


def validar_tamanho_pdf(conteudo: bytes) -> None:
    if not conteudo:
        raise HTTPException(
            status_code=400,
            detail="O arquivo PDF não pode estar vazio."
        )

    if len(conteudo) > MAX_TAMANHO_PDF:
        raise HTTPException(
            status_code=413,
            detail="O PDF excede o limite de 50 MB."
        )


def validar_formato_pdf(conteudo: bytes) -> None:
    if not conteudo.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=415,
            detail="O arquivo enviado não possui um cabeçalho PDF válido."
        )


def validar_integridade_pdf(conteudo: bytes) -> None:
    try:
        leitor = PdfReader(BytesIO(conteudo), strict=True)

        if leitor.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="O PDF está protegido por senha."
            )

        # verifica se as paginas sao acessiveis
        for pagina in leitor.pages:
            _ = pagina.mediabox

    except HTTPException:
        raise
    except (PdfReadError, OSError, ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=400,
            detail="O PDF está corrompido ou possui uma estrutura inválida."
        )


def validar_pdf(arquivo: UploadFile) -> bytes:
    conteudo = arquivo.file.read(MAX_TAMANHO_PDF + 1)

    try:
        validar_tamanho_pdf(conteudo)
        validar_formato_pdf(conteudo)
        validar_integridade_pdf(conteudo)

        return ArquivoValidado(
            extensao=".pdf",
            content_type="application/pdf",
            conteudo=conteudo,
        )
    finally:
        arquivo.file.seek(0)