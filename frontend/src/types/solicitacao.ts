//os dados a seguir são somente para efeito de teste, de modo que servirão somente para apresentar o site na reuniao de (04/11)

export type StatusSolicitacao =
    | "aguardando_assinatura"
    | "pendente"
    | "aprovada"
    | "recusada";

export interface Solicitante {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    rua: string;
    cep: string;
    cidade: string;
    uf: string;
    pais: string;
}

export type SolicitanteCreate = Omit<Solicitante, "id">;

export interface Solicitacao {
    id: number;
    data: string;
    entrevista_id: number;
    solicitante: Solicitante;
    mensagem?: string;
    path_termo?: string;
    status: StatusSolicitacao;
}

export interface SolicitacaoCreate {
    solicitante: SolicitanteCreate;
    mensagem?: string;
}


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