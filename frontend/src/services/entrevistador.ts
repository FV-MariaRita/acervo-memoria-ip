import { apiFetch } from "./api";

import type {
    EntrevistadorLista,
    EntrevistadorCreate,
    EntrevistadorUpdate,
    EntrevistadorNome,
} from '../types/entrevistador';

//PÚBLICO
export function listarEntrevistadores(): Promise<EntrevistadorLista[]> {
    return (apiFetch<EntrevistadorLista[]>('/entrevistadores'));
}


//ADMIN
export function criarEntrevistador (dados : EntrevistadorCreate): Promise<EntrevistadorNome> {

    return apiFetch<EntrevistadorNome>('/admin/entrevistadores', {
        method: 'POST', 
        headers: {
            "Content-Type" : "application/json"
        }, 
        body: JSON.stringify(dados)
    });
}

export const atualizarEntrevistador = (id: number, dados: EntrevistadorUpdate, foto: File | null) => {
  const formData = new FormData();

  formData.append("dados", JSON.stringify(dados));

  if (foto) {
    formData.append("foto", foto);
  }

  return apiFetch(`/admin/entrevistadores/${id}`, {
    method: "PATCH",
    body: formData,
  });
};


export function excluirEntrevistador(id: number): Promise<EntrevistadorNome> {

    return apiFetch(`/admin/entrevistadores/${id}`, {
        method: 'DELETE', 
    })
}