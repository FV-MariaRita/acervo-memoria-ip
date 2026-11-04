
//import type { EntrevistadoNome } from "./entrevistado";

//TIPOS DE GET -> RECEBE DADOS DA API
// TIPOS DE GET

export interface SolicitacaoLista {
    id: number,
    nome: string,
    entrevistado: string,
    data: string, //formatar depois 
    path_termo: string,
    status: string
}