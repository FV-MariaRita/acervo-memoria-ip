//TIPOS DE GET - RECEBE DADOS DA API

export interface EntrevistadorLista {
    nome: string;
    bio: string; 
    path_foto: string;
}

export interface EntrevistadorNome {
    nome: string;
}

//TIPOS DE POST - ENVIA DADOS PRA API

export interface EntrevistadorCreate {
    nome: string; 
    bio: string; 
    path_foto: string;
}

export interface EntrevistadorUpdate {
    nome?: string; 
    bio?: string; 
    path_foto?: string;
}