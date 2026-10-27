import { apiFetch } from "./api";

import type {
    EntrevistadorLista,
    EntrevistadorCreate,
    EntrevistadorUpdate,
    EntrevistadorNome,
} from '../types/entrevistador';

//PÚBLICO
export function listarEntrevistadores(): Promise<EntrevistadorLista[]> {
    return (apiFetch<EntrevistadorLista[]>('/entrevistadores'));
}


//ADMIN
export function criarEntrevistador (dados : EntrevistadorCreate): Promise<EntrevistadorNome> {

    return apiFetch<EntrevistadorNome>('/admin/entrevistadores', {
        method: 'POST', 
        headers: {
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify(dados)
    });
}

export function atualizarEntrevistador(id: number, dados: EntrevistadorUpdate): Promise<EntrevistadorLista> {

    return apiFetch<EntrevistadorLista>(`/admin/entrevistadores/${id}`, {
        method: 'PATCH', 
        headers: {
            "Contente-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
} 

export function excluirEntrevistador(id: number): Promise<EntrevistadorNome> {

    return apiFetch(`/admin/entrevistadores/${id}`, {
        method: 'DELETE', 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(id)
    })
}