import { apiFetch } from "./api";
import type { Entrevista } from "../types/entrevista";


//PÚBLICO 
export function mostrarEntrevista (entrevistador_id: number): Promise<Entrevista[]> {
    
    return (
        apiFetch<Entrevista[]>(`/entrevistas/${entrevistador_id}`)
    );
}

//ADMIN
