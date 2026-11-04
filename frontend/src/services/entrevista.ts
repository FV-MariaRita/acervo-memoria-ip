import { apiFetch } from "./api";
import type { Entrevista } from "../types/entrevista";


//PÚBLICO 
export function mostrarEntrevista (entrevistado_id: number): Promise<Entrevista[]> {
    
    return (
        apiFetch<Entrevista[]>(`/entrevistas/${entrevistado_id}`)
    );
}

//ADMIN
