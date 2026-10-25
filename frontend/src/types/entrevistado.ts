import type { EntrevistaCreate } from "./entrevista";

//TIPOS DE GET -> RECEBE DADOS DA API
export interface EntrevistadoLista {
    nome: string;
    funcao: string; 
    path_foto: string;
}

export interface EntrevistadoEntrevista  {
    nome: string; 
    bio: string; 
    path_foto: string; 

}

export interface EntrevistadoNome {
    nome: string;
}

//TIPOS DE ENVIO -> ENVIO DE DADOS PARA A API
export interface EntrevistadoCreate {
    nome: string;
    bio: string;
    funcao: string; 
    path_foto: string;
}

export interface EntrevistadoComEntrevistaCreate {
    entrevistado: EntrevistadoCreate;
    entrevista: EntrevistaCreate;
}

export interface EntrevistadoUpdate {
    nome?: string;
    bio?: string; 
    funcao?: string; 
    path_foto?: string;
}