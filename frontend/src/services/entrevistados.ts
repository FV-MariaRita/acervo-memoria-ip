import { apiFetch } from "./api";

import type { 
    EntrevistadoCreate,
    EntrevistadoDetalhe,
    EntrevistadoLista, 
    EntrevistadoUpdate  
} from "../types/entrevistado";


export function listarEntrevistados(): Promise<EntrevistadoLista[]> {
    return apiFetch('/entrevistados'); //API_ROUTES.GET_ENTREVISTADOS
}

export function detalhesEntrevistado( id: number ) : Promise<EntrevistadoDetalhe[]> {
    return apiFetch(`/entrevistados/${id}`);
}

export function criarEntrevistado (dados: EntrevistadoCreate): Promise<EntrevistadoDetalhe[]> {

    return apiFetch ( "/entrevistados", {
        method: "POST", 

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(dados)
    }

    )
}

export function alterarEntrevistado (dados: EntrevistadoUpdate): Promise<EntrevistadoDetalhe[]> {

    return apiFetch( "/entrevistados", {
        method: "POST", 

        headers: {
            "Content-Type": "application/json"
        }, 

        body: JSON.stringify(dados)
    })
}

export function excluirEntrevistado (id: number): Promise<void>{

    return apiFetch( "/entrevistados", {

        method: "DELETE", 

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(id)
    })
}