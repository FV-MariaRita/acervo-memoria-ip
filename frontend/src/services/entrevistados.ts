import type { 
    EntrevistadoComEntrevistaCreate, 
    EntrevistadoEntrevista, 
    EntrevistadoLista, 
    EntrevistadoNome,
    EntrevistadoUpdate
} from "../types/entrevistado";

import { apiFetch } from "./api";

//PÚBLICO
export function listarEntrevistados(): Promise<EntrevistadoLista[]> {
    return (
        apiFetch<EntrevistadoLista[]>('/entrevistados')
    );
}

export function listarEntrevistadoId(id: number): Promise<EntrevistadoEntrevista> {
    return (
        apiFetch<EntrevistadoEntrevista>(`/entrevistados/${id}`)
    );
}

//ADMIN
export function criarEntrevistadoComEntrevista (dados: EntrevistadoComEntrevistaCreate): Promise<EntrevistadoNome> {
    return (
        apiFetch<EntrevistadoNome>('/admin/entrevistado', {
            
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(dados)
        })
    );
}

export function atualizarEntrevistado (id: number, dados: EntrevistadoUpdate): Promise<EntrevistadoUpdate> {
    return (
        apiFetch<EntrevistadoUpdate>(`/admin/entrevistado/${id}`, {

            method: 'PATCH', 
            headers: {
                "Content-Type": "application/json"
            },  
            body: JSON.stringify(dados)
        })
    );
}


export function excluirEntrevistado (id: number): Promise<EntrevistadoNome> {
   
    return (
        apiFetch<EntrevistadoNome>(`/admin/entrevistados/${id}`, {

            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })
    );
}
