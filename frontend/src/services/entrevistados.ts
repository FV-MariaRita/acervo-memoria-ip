import type { EntrevistaAlert } from "../types/entrevista";
import type {
    EntrevistadoComEntrevistaCreate,
    EntrevistadoEntrevista,
    EntrevistadoLista,
    EntrevistadoNome,
    EntrevistadoUpdate
} from "../types/entrevistado";

import { apiFetch } from "./api";

interface FotoComId {
    arquivo: File;
    arquivo_id: string;
}

export interface CriarEntrevistadoComEntrevistaParams {
    dados: EntrevistadoComEntrevistaCreate;
    fotoEntrevistado: File;
    audio: File;
    transcricao: File;
    fotosEntrevista?: FotoComId[];
    fotosMarcantes?: FotoComId[];
}

const formatarDataISO = (data: Date | string | null): string | null => {
    if (!data) return null;
    if (typeof data === "string") return data.substring(0, 10);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
};

// PÚBLICO
export function listarEntrevistados(): Promise<EntrevistadoLista[]> {
    return apiFetch<EntrevistadoLista[]>("/entrevistados");
}

export function listarEntrevistadoId(id: number): Promise<EntrevistadoEntrevista> {
    return apiFetch<EntrevistadoEntrevista>(`/entrevistados/${id}`);
}

// ADMIN
export function criarEntrevistadoComEntrevista({
    dados,
    fotoEntrevistado,
    audio,
    transcricao,
    fotosEntrevista = [],
    fotosMarcantes = []
}: CriarEntrevistadoComEntrevistaParams): Promise<EntrevistaAlert> {

    const dadosNormalizados = {
        entrevistado: dados.entrevistado,
        entrevista: {
            ...dados.entrevista,
            data: formatarDataISO(dados.entrevista.data),
        },
    };

    const formData = new FormData();

    formData.append("dados", JSON.stringify(dadosNormalizados));
    formData.append("foto_entrevistado", fotoEntrevistado);
    formData.append("audio", audio);
    formData.append("transcricao", transcricao);

    fotosEntrevista.forEach(({ arquivo, arquivo_id }) => {
        formData.append("fotos_entrevista", arquivo, arquivo_id);
    });

    fotosMarcantes.forEach(({ arquivo, arquivo_id }) => {
        formData.append("fotos_marcantes", arquivo, arquivo_id);
    });

    console.log("Foto entrevistado:", fotoEntrevistado.name, fotoEntrevistado.type, fotoEntrevistado.size);

        console.log("Fotos entrevista:", fotosEntrevista.map(({ arquivo }) => ({
            nome: arquivo.name,
            tipo: arquivo.type,
            tamanho: arquivo.size
        })));

        console.log("Fotos marcantes:", fotosMarcantes.map(({ arquivo }) => ({
            nome: arquivo.name,
            tipo: arquivo.type,
            tamanho: arquivo.size
        })));

    return apiFetch<EntrevistaAlert>("/admin/entrevistado", {
        method: "POST",
        body: formData
    });
}

export function atualizarEntrevistado(
    id: number,
    dados: EntrevistadoUpdate
): Promise<EntrevistadoUpdate> {

    return apiFetch<EntrevistadoUpdate>(`/admin/entrevistado/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
}

export function excluirEntrevistado(id: number): Promise<EntrevistadoNome> {
    return apiFetch<EntrevistadoNome>(`/admin/entrevistados/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
}
