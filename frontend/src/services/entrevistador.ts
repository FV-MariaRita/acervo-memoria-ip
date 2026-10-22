import { apiFetch } from "./api";

import type {
    EntrevistadorLista,
    EntrevistadorCreate,
    EntrevistadorUpdate,
} from '../types/entrevistador';


export function listarEntrevistadores(): Promise<EntrevistadorLista[]> {
    return (apiFetch('/entrevistadores'));
}

export function criarEntrevistador (dados : EntrevistadorCreate): Promise<void> {

    return apiFetch('/entrevistadores', {
        method: 'POST', 
        headers: {
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify(dados)
    });
}

export function alterarEntrevistador(dados: EntrevistadorUpdate): Promise<void> {

    return apiFetch('/entrevistadores', {
        method: 'POST', 
        headers: {
            "Contente-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
} 

export function excluirEntrevistador(id: number): Promise<void> {

    return apiFetch('/entrevistadores', {
        method: 'DELETE', 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(id)
    })
}