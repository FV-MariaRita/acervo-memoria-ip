//TIPOS DE GET
export interface Entrevista {
    local: string; 
    data: string;
    path_audio: string; 
    path_transcricao: string; 

    sumario: Sumario[]; 
    entrevistadores: Entrevistador_entrevista[]; 

    path_fotos_entrevista: string[]; 
    path_fotos_marcantes: string[];
}

export interface EntrevistaData {
    date: Date;
}

export interface Sumario {
    tempo_segundos: number;
    assunto: string; 
}

export interface Entrevistador_entrevista {
    id: number; 
    nome: string;
}

export interface EntrevistaAlert {
    entrevistado_id: number,
    entrevistado_nome: string, 
    entrevista_data: Date
}


// ENVIO DE DADOS 
export interface EntrevistaCreate {
    local: string; 
    data: Date | null; 

    sumario: SumarioCreate[]; 
    entrevistadores: number[]; 
    fotos: Fotos_entrevistaCreate[]; 
}

export interface EntrevistaUpdate {
    local?: string;
    data?: Date; 
    
    sumario?: SumarioUpdate[]; 
    entrevistadores?: Entrevistador_entrevistaUpdate[]; 
    fotos?: Fotos_entrevistaUpdate[];
}

export interface Entrevistador_entrevistaCreate {
    entrevistador_id: number;
}

export interface Entrevistador_entrevistaUpdate {
    adicionar: number[]; 
    remover: number[];
}

export interface SumarioCreate {
    tempo_segundos: number;
    assunto: string;
}

export interface SumarioUpdate {
    id?: number; 
    tempo_segundos?: number; 
    assunto?: string; 
    excluir: boolean; 
}

export interface Fotos_entrevistaCreate {
    categoria: string;
    numero: number;
    arquivo_id: string;
}

export interface Fotos_entrevistaUpdate {
    id?: number; 
    categoria?: string; 
    numero?: number;
    excluir: boolean;
}

