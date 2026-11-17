from uuid import uuid4

from app.models.entrevista import (
    Entrevista,
    Entrevistador_entrevista,
    Fotos_entrevista,
    Sumario,
)
from app.models.entrevistado import Entrevistado
from app.repositories.entrevistado import buscar_entrevistado, criar_entrevistado
from app.repositories.entrevistador_entrevista import (
    associar_entrevistador_entrevista,
    buscar_entrevistadores_entrevista,
    excluir_entrevistador_entrevista,
)
from app.repositories.foto_entrevista import (
    atualizar_foto_entrevista,
    buscar_fotos_entrevista,
    criar_foto_entrevista,
    deletar_foto_entrevista,
)
from app.repositories.sumario import (
    atualizar_sumario,
    buscar_sumario,
    criar_sumario,
    deletar_sumario,
)
from app.schemas.entrevista import (
    EntrevistaCreate,
    Entrevistador_entrevistaResponse,
    EntrevistaResponse,
    EntrevistaUpdate,
    SumarioResponse,
)
from app.storage.b2 import delete_file, gerar_url, upload_file
from app.validators.arquivos import (
    associar_arquivos_fotos,
    validar_audio,
    validar_foto,
    validar_metadados_fotos,
    validar_pdf,
)
from fastapi import HTTPException, UploadFile
from sqlmodel import Session, select


def service_cadastrar_entrevista(
    dados: EntrevistaCreate,
    entrevistado_id: int,
    audio: UploadFile,
    transcricao: UploadFile,
    session: Session,
    fotos_entrevista: list[UploadFile] | None = None,
    fotos_marcantes: list[UploadFile] | None = None,
    paths_b2_criados: list[str] | None = None
):

    try:

        if entrevistado_id is None:
            raise ValueError(
                "Informe o entrevistado dessa entrevista."
            )

        if not paths_b2_criados:
            paths_b2_criados: list[str] = []

        fotos_entrevista = fotos_entrevista or []
        fotos_marcantes = fotos_marcantes or []

        # validar metadados e associar arquivos

        if fotos_entrevista is not None or fotos_marcantes is not None:
            metadados_entrevista, metadados_marcantes = (
                validar_metadados_fotos(dados.fotos)
            )

        if fotos_entrevista is not None:
            arquivos_entrevista = associar_arquivos_fotos(
                fotos_entrevista,
                metadados_entrevista,
                "entrevista"
            )

        if fotos_marcantes is not None:
            arquivos_marcantes = associar_arquivos_fotos(
                fotos_marcantes,
                metadados_marcantes,
                "marcantes"
            )

        # validar áudio e transcrição
        audio_validado = validar_audio(audio)
        transcricao_validada = validar_pdf(transcricao)

        # verificar se o entrvistado existe
        entrevistado = buscar_entrevistado(
                entrevistado_id=entrevistado_id,
                session=session
            )

        if not entrevistado:
            raise ValueError("Entrevistado não encontrado.")

        # Criar entrevista e seus arquivos

        #caminhos temporários para ter ID nos campos NOT NULL.
        token = uuid4().hex
        entrevista = Entrevista(
            local=dados.local,
            data=dados.data,
            entrevistado_id=entrevistado_id,
            path_audio=f"pendente/{token}.audio",
            path_transcricao=f"pendente/{token}.pdf"
        )
        
        session.add(entrevista)
        session.flush()
        
        # caminhos definitivos
        path_base = (
            f"entrevistados/{entrevistado_id}/entrevistas/{entrevista.id}"
        )
        
        entrevista.path_audio = (
            f"{path_base}/audio{audio.extensao}"
        )
        
        entrevista.path_transcricao = (
            f"{path_base}/transcricao.pdf"
        )
        
        session.flush() # tabela entrevista pronta
        
        # associar entrevistadores
        for entrevistador_id in dados.entrevistadores:
            associacao = associar_entrevistador_entrevista(
                entrevista_id=entrevista.id,
                entrevistador_id=entrevistador_id,
                session=session
            )
        
            if not associacao:
                raise ValueError(
                    "Erro ao associar entrevistador à entrevista."
                )
        
        # criar sumário
        for sumario in dados.sumario:
            linha_sumario = criar_sumario(
                sumario=Sumario(
                    entrevista_id=entrevista.id,
                    tempo_segundos=sumario.tempo_segundos,
                    assunto=sumario.assunto
                ),
                session=session
            )
        
            if not linha_sumario:
                raise ValueError(
                    "Erro ao criar sumário da entrevista."
                )
        
        # criar registros das fotos no bd
        for foto in dados.fotos:
            nova_foto = criar_foto_entrevista(
                foto=Fotos_entrevista(
                    entrevista_id=entrevista.id,
                    categoria=foto.categoria,
                    numero=foto.numero
                ),
                session=session
            )
    
            if not nova_foto:
                raise ValueError(
                    "Erro ao adicionar foto à entrevista."
                )
        
        session.flush()
        
    
        # upload do áudio
        upload_file(
            file_bytes=audio_validado.conteudo,
            b2_path=entrevista.path_audio,
            content_type=audio_validado.content_type
        )
    
        paths_b2_criados.append(entrevista.path_audio)
    
        #upload da transcrição
        upload_file(
            file_bytes=transcricao_validada.conteudo,
            b2_path=entrevista.path_transcricao,
            content_type=transcricao_validada.content_type
        )
        
        paths_b2_criados.append(entrevista.path_transcricao)
        
        # upload das fotos
        for metadado in sorted(
            dados.fotos,
            key=lambda foto: (foto.categoria, foto.numero)
        ):
    
            if metadado.categoria == "entrevista":
                foto = arquivos_entrevista[metadado.arquivo_id]

            elif metadado.categoria == "marcantes":
                foto = arquivos_marcantes[metadado.arquivo_id]
        
            else:
                raise ValueError(
                    f"Categoria de foto inválida: {metadado.categoria}"
                )
        
            path = (
                f"{path_base}/fotos/{metadado.categoria}/{metadado.numero}{foto.extensao}"
            )
        
            upload_file(
                file_bytes=foto.conteudo,
                b2_path=path,
                content_type=foto.content_type
            )
    
            paths_b2_criados.append(path)

        # confirmar operação completa
        session.commit()

        session.refresh(entrevistado)
        session.refresh(entrevista)

        return entrevistado, entrevista

    except Exception:
        session.rollback()

        # desfazer os uploads realizados em caso de erro
        for path in reversed(paths_b2_criados):
            try:
                delete_file(b2_path=path)
            except:
                raise
    except:
        raise

'''
def criar_entrevista_completa(
    entrevistado_id: int,
    dados: EntrevistaCreate,
    audio: Annotated[UploadFile, File()],
    transcricao: Annotated[UploadFile, File()],
    fotos_entrevista: dict,
    fotos_marcantes: dict,
    paths_b2_criados: list[str],
    session: Session
) -> Entrevista:

    #caminhos temporários para ter ID nos campos NOT NULL.
    token = uuid4().hex

    entrevista = Entrevista(
        local=dados.local,
        data=dados.data,
        entrevistado_id=entrevistado_id,
        path_audio=f"pendente/{token}.audio",
        path_transcricao=f"pendente/{token}.pdf"
    )

    session.add(entrevista)
    session.flush()

    # caminhos definitivos
    path_base = (
        f"entrevistados/{entrevistado_id}/entrevistas/{entrevista.id}"
    )

    entrevista.path_audio = (
        f"{path_base}/audio{audio.extensao}"
    )

    entrevista.path_transcricao = (
        f"{path_base}/transcricao.pdf"
    )

    session.flush()

    # associar entrevistadores
    for entrevistador_id in dados.entrevistadores:
        associacao = associar_entrevistador_entrevista(
            entrevista_id=entrevista.id,
            entrevistador_id=entrevistador_id,
            session=session
        )

        if not associacao:
            raise ValueError(
                "Erro ao associar entrevistador à entrevista."
            )

    # criar sumário
    for sumario in dados.sumario:
        linha_sumario = criar_sumario(
            sumario=Sumario(
                entrevista_id=entrevista.id,
                tempo_segundos=sumario.tempo_segundos,
                assunto=sumario.assunto
            ),
            session=session
        )

        if not linha_sumario:
            raise ValueError(
                "Erro ao criar sumário da entrevista."
            )

    # criar registros das fotos no bd
    for foto in dados.fotos:
        nova_foto = criar_foto_entrevista(
            foto=Fotos_entrevista(
                entrevista_id=entrevista.id,
                categoria=foto.categoria,
                numero=foto.numero
            ),
            session=session
        )

        if not nova_foto:
            raise ValueError(
                "Erro ao adicionar foto à entrevista."
            )

    session.flush()


    # upload do áudio
    upload_file(
        file_bytes=audio_validado.conteudo,
        b2_path=entrevista.path_audio,
        content_type=audio_validado.content_type
    )

    paths_b2_criados.append(entrevista.path_audio)

    #upload da transcrição
    upload_file(
        file_bytes=transcricao_validada.conteudo,
        b2_path=entrevista.path_transcricao,
        content_type=transcricao_validada.content_type
    )

    paths_b2_criados.append(entrevista.path_transcricao)

    # upload das fotos
    for metadado in sorted(
        dados.fotos,
        key=lambda foto: (foto.categoria, foto.numero)
    ):

        if metadado.categoria == "entrevista":
            foto = arquivos_entrevista[metadado.arquivo_id]

        elif metadado.categoria == "marcantes":
            foto = arquivos_marcantes[metadado.arquivo_id]

        else:
            raise ValueError(
                f"Categoria de foto inválida: {metadado.categoria}"
            )

        path = (
            f"{path_base}/fotos/{metadado.categoria}/{metadado.numero}{foto.extensao}"
        )

        upload_file(
            file_bytes=foto.conteudo,
            b2_path=path,
            content_type=foto.content_type
        )

        paths_b2_criados.append(path)

    return entrevista
'''
def atualizar_entrevista_completa (
    entrevista_id: int,
    dados: EntrevistaUpdate,
    session: Session
) -> Entrevista | None:

    try:

        entrevista = session.get(Entrevista, entrevista_id)

        if not entrevista:
            raise HTTPException(
                status_code = 404,
                detail = "Entrevista não encontrada"
            )

        if dados.local is not None:
            entrevista.local = dados.local

        if dados.data is not None:
            entrevista.data = dados.data

        if dados.path_audio is not None:
            entrevista.path_audio = dados.path_audio

        if dados.path_transcricao is not None:
            entrevista.path_transcricao = dados.path_transcricao

        # atualizar entrevistadores
        if dados.entrevistadores is not None:

            for entrevistador_id in dados.entrevistadores.remover:
                associacao_excluida = excluir_entrevistador_entrevista (
                    entrevista_id = entrevista.id,
                    entrevistador_id = entrevistador_id,
                    session = session
                )
                if not associacao_excluida:
                    raise HTTPException(
                        status_code = 404,
                        detail = "Erro ao excluir entrevistador dessa entrevista"
                    )

            for entrevistador_id in dados.entrevistadores.adicionar:
                associacao_criada = associar_entrevistador_entrevista (
                    entrevista_id = entrevista.id,
                    entrevistador_id = entrevistador_id,
                    session = session
                )
                if not associacao_criada:
                    raise HTTPException(
                        status_code = 404,
                        detail = "Erro ao incluir entrevistador nessa entrevista"
                    )

        # atualizar sumario
        if dados.sumario is not None:
            for linha_sumario in dados.sumario:

                if linha_sumario.excluir:
                    sumario_excluido = deletar_sumario(
                        id = linha_sumario.id,
                        session = session
                    )
                    if not sumario_excluido:
                        raise HTTPException(
                            status_code = 404,
                            detail = "Erro ao excluir linha do sumário"
                            )
                
                elif not linha_sumario.id:
                    sumario_criado = criar_sumario(
                        sumario = Sumario(
                            **linha_sumario.model_dump(exclude={"id", "excluir"}),
                            entrevista_id = entrevista.id
                        ),
                        session = session
                    )
                    if not sumario_criado:
                        raise HTTPException(
                            status_code = 404,
                            detail = "Erro ao adicionar linha do sumário"
                            )
                
                else:
                    sumario_atualizado = atualizar_sumario(
                        id = linha_sumario.id,
                        dados = linha_sumario,
                        session = session
                    )
                    if not sumario_atualizado:
                        raise HTTPException(
                            status_code = 404,
                            detail = "Erro ao atualizar linha do sumario"
                            )

        # atualizar a posicao das fotos
        if dados.fotos is not None:
            for foto in dados.fotos:

                if foto.excluir:
                    foto_excluida = deletar_foto_entrevista(
                        id = foto.id,
                        session = session
                    )
                    if not foto_excluida:
                        raise HTTPException(
                            status_code = 404,
                            detail = "Erro ao excluir foto"
                        )
                
                elif not foto.id:
                    foto_adicionada = criar_foto_entrevista(
                        foto = Fotos_entrevista(
                            **foto.model_dump(exclude={"id", "excluir"}),
                            entrevista_id = entrevista.id
                        ),
                        session = session
                    )
                    if not foto_adicionada:
                        raise HTTPException(
                            status_code = 404,
                            detail = "Erro ao adicionar foto"
                        )
                
                else:
                    posicao_atualizada = atualizar_foto_entrevista(
                        id = foto.id,
                        posicao = foto.numero,
                        session = session
                    )
                    if not posicao_atualizada:
                        raise HTTPException(
                            status_code = 404,
                            detail = "Erro ao atualizar posição da foto"
                        )

        session.commit()
        session.refresh(entrevista)
        
        return mostrar_entrevista_completa(
            entrevista_id = entrevista.id,
            session = session
        )
        
    except Exception:
        session.rollback()
        raise

def mostrar_entrevista_completa (
    entrevista_id: int,
    session: Session
) -> EntrevistaResponse | None:

    entrevista = session.get(Entrevista, entrevista_id)

    entrevistado_id = session.exec(
        select(Entrevista.entrevistado_id).where(Entrevista.id == entrevista_id)
    ).first()

    if not entrevista:
        raise ValueError("")

    # list[Entrevistador]
    entrevistadores = buscar_entrevistadores_entrevista(
        entrevista_id = entrevista_id,
        session = session
    )

    if not entrevistadores:
        raise ValueError("")
    
    # duas listas com os paths de cada categoria
    fotos = buscar_fotos_entrevista(
        entrevista_id = entrevista_id,
        session = session
    )

    if not fotos:
        raise ValueError("")

    fotos_marcantes = sorted(
        [foto for foto in fotos if foto.categoria == "marcantes"],
        key=lambda foto: foto.numero
    )

    fotos_entrevista = sorted(
        [foto for foto in fotos if foto.categoria == "entrevista"],
        key=lambda foto: foto.numero
    )

    path_fotos_marcantes = [
        gerar_url((
            f"entrevistados/{entrevistado_id}/{entrevista_id}/fotos/"
            f"marcantes/"
            f"{foto.numero}.jpg"
        ))
        for foto in fotos_marcantes
    ]
    path_fotos_entrevista = [
        gerar_url((
            f"entrevistados/{entrevistado_id}/{entrevista_id}/fotos/"
            f"entrevista/"
            f"{foto.numero}.jpg"
        ))
        for foto in fotos_entrevista
    ]

    # list[Sumario]. objeto Sumario = linha do sumario
    sumario = buscar_sumario(
        entrevista_id = entrevista_id,
        session = session
    )

    return EntrevistaResponse(
        local = entrevista.local,
        data = entrevista.data,
        path_audio = gerar_url(entrevista.path_audio),
        path_transcricao = gerar_url(entrevista.path_transcricao),

        entrevistadores = [
            Entrevistador_entrevistaResponse (
                id = entrevistador.id,
                nome = entrevistador.nome
            ) for entrevistador in entrevistadores
        ],

        sumario = [
            SumarioResponse(
                tempo_segundos = linha.tempo_segundos,
                assunto = linha.assunto
            ) for linha in sumario
        ],

        path_fotos_entrevista = path_fotos_entrevista,
        path_fotos_marcantes = path_fotos_marcantes
    )
