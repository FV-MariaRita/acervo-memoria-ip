from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.entrevista import Entrevista, Entrevistador_entrevista, Fotos_entrevista, Sumario
from app.schemas.entrevista import EntrevistaCreate, EntrevistaUpdate, SumarioResponse, Entrevistador_entrevistaResponse, EntrevistaResponse
from app.repositories.entrevistador_entrevista import buscar_entrevistadores_entrevista, associar_entrevistador_entrevista, excluir_entrevistador_entrevista
from app.repositories.sumario import buscar_sumario, criar_sumario, deletar_sumario, atualizar_sumario
from app.repositories.foto_entrevista import buscar_fotos_entrevista, criar_foto_entrevista, deletar_foto_entrevista, atualizar_foto_entrevista

def criar_entrevista_completa (
    entrevistado_id: int,
    dados: EntrevistaCreate,
    session: Session
) -> Entrevista | None:

    try:

        entrevista = Entrevista (
            local = dados.local,
            data = dados.data,
            entrevistado_id = entrevistado_id,
            path_audio = dados.path_audio,
            path_transcricao = dados.path_transcricao
        )

        if not entrevista:
            raise ValueError("Erro ao criar entrevista")

        session.add(entrevista)
        session.flush()

        #for entrevistador_id in dados.entrevistadores: add buscar_entrevistador pra validar

        for entrevistador_id in dados.entrevistadores:
            associacao = associar_entrevistador_entrevista (
                    entrevista_id = entrevista.id,
                    entrevistador_id = entrevistador_id,
                    session = session
                )
            if not associacao:
                raise ValueError("Erro ao associar entrevistador a entrevista")
        
        for sumario in dados.sumario:
            linha_sumario = criar_sumario (
                    sumario = Sumario(
                        entrevista_id = entrevista.id,
                        tempo_segundos = sumario.tempo_segundos,
                        assunto = sumario.assunto
                    ),
                    session = session
                )
            if not linha_sumario:
                raise ValueError("Erro ao criar sumário da entrevista")

        for foto in dados.fotos:
            nova_foto = criar_foto_entrevista (
                    foto = Fotos_entrevista(
                        entrevista_id = entrevista.id,
                        categoria = foto.categoria,
                        numero = foto.numero
                    ),
                    session = session
                )
            if not nova_foto:
                raise ValueError("Erro ao adicionar foto à entrevista")

        session.commit()
        session.refresh(entrevista)

        return entrevista

    except Exception:
        session.rollback()
        raise

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
        (
            f"entrevistados/{entrevistado_id}/{entrevista_id}/fotos/"
            f"fotos marcantes/"
            f"foto_{foto.numero}.jpg"
        )
        for foto in fotos_marcantes
    ]
    path_fotos_entrevista = [
        (
            f"entrevistados/{entrevistado_id}/{entrevista_id}/fotos/"
            f"fotos da entrevista/"
            f"foto_{foto.numero}.jpg"
        )
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
        path_audio = entrevista.path_audio,
        path_transcricao = entrevista.path_transcricao,

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
