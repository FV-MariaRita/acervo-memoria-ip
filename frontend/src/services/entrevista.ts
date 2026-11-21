import { apiFetch } from "./api";
import type { Entrevista, EntrevistaAlert, EntrevistaCreate, EntrevistaUpdate } from "../types/entrevista";


//PÚBLICO 
export function mostrarEntrevista (entrevistado_id: number): Promise<Entrevista[]> {
    
    return (
        apiFetch<Entrevista[]>(`/entrevistas/${entrevistado_id}/`)
    );
}

//ADMIN
interface FotoComId {
  arquivo: File;
  arquivo_id: string;
}

interface CadastrarEntrevistaParams {
  entrevistado_id: number;
  dados: EntrevistaCreate;
  audio: File;
  transcricao: File;
  fotosEntrevista?: FotoComId[];
  fotosMarcantes?: FotoComId[];
}

const formatarData = (data: Date | string | null | undefined): string | null | undefined => {

    if (data === undefined)
        return undefined;
    if (data === null) 
        return null; 

    if (typeof data === "string")
        return data.substring(0, 10);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0"); 

    return `${ano}-${mes}-${dia}`; 
}

export function cadastrarEntrevista ({

    entrevistado_id, dados, audio, transcricao, fotosEntrevista, fotosMarcantes

}: CadastrarEntrevistaParams): Promise<EntrevistaAlert> {

    const dadosFormatados = {
        ...dados, 
        data: formatarData(dados.data)
    };

    const formData = new FormData();
    formData.append("dados", JSON.stringify(dadosFormatados)); 
    formData.append("audio", audio);
    formData.append("transcricao", transcricao); 

    fotosEntrevista?.forEach(({ arquivo, arquivo_id }) => {
        formData.append("fotos_entrevista", arquivo, arquivo_id);
    });

    fotosMarcantes?.forEach(({ arquivo, arquivo_id }) => {
        formData.append("fotos_marcantes", arquivo, arquivo_id);
    });

    return apiFetch<EntrevistaAlert>(`/admin/entrevistas/${entrevistado_id}`, {
        method: "POST", 
        body: formData
    });
}


export function editarEntrevista (entrevistaId: number, dados: EntrevistaUpdate): Promise<Entrevista> {

    const dadosFormatados = {
        ...dados, 
        ...(dados.data !== undefined && {data: formatarData(dados.data)}),
    };

    return apiFetch<Entrevista>(`/entrevistas/${entrevistaId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosFormatados)
    });
}

export function excluirEntrevista (entrevistaId: number): Promise<EntrevistaAlert> {

    return apiFetch<EntrevistaAlert>(`/entrevistas/${entrevistaId}`, {
        method: "DELETE"
    });
}