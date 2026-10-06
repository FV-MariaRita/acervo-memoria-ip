const API_URL = "http://localhost:8000"; //url geral da API

export async function apiFetch( //função geralzona de conexão com a API
    endpoint: string, //url específica que indica a ação que deve ter
    options?: RequestInit //pode ser um body json em requisições post
) {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
        throw new Error("Erro ao acessar o backend.");
    }

    return response.json();
}