import { apiFetch } from "./api";

import type { 
    EntrevistadoCreate,
    EntrevistadoEntrevista,
    EntrevistadoLista, 
    EntrevistadoUpdate
} from "../types/entrevistado";

export function listarEntrevistados(): Promise<EntrevistadoLista[]> {

    return apiFetch<EntrevistadoLista[]>("/entrevistados");
}

export function buscarEntrevistados (id:number): Promise<EntrevistadoLista> {

    return apiFetch<EntrevistadoLista>(`/entrevistados/${id}`);
}

export function criarEntrevistado (dados: EntrevistadoCreate): Promise <void> {

    return apiFetch<void>("/entrevistados", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify(dados)
    });
}

export function alterarEntrevistado (id: number, dados: EntrevistadoUpdate): Promise<EntrevistadoEntrevista> {

    return apiFetch<EntrevistadoEntrevista>(`/entrevistados/${id}`, {

        method: "PATCH", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
}

export function excluirEntrevistado (id: number): Promise<void> {
    
    return apiFetch<void>(`/entrevistados/${id}`, {
        method: "DELETE"
    });
}
