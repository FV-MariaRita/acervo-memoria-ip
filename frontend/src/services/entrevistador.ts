import { apiFetch } from "./api";

import type {
    EntrevistadorLista,
    EntrevistadorCreate,
    EntrevistadorUpdate,
} from '../types/entrevistador';


export function listarEntrevistadores(): Promise<EntrevistadorLista[]> {
    return (apiFetch<EntrevistadorLista[]>('/entrevistadores'));
}

export function criarEntrevistador (dados : EntrevistadorCreate): Promise<void> {

    return apiFetch<void>('/entrevistadores', {
        method: 'POST', 
        headers: {
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify(dados)
    });
}

export function alterarEntrevistador(id: number, dados: EntrevistadorUpdate): Promise<void> {

    return apiFetch<void>(`entrevistadores/${id}`, {
        method: 'POST', 
        headers: {
            "Contente-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
} 

export function excluirEntrevistador(id: number): Promise<void> {

    return apiFetch(`entrevistadores/${id}`, {
        method: 'DELETE', 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(id)
    })
}