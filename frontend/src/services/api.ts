const API_URL = "http://localhost:8000";

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {

    if (options) {
        const response = await fetch(`${API_URL}${endpoint}`, options);        
        if (!response.ok) {
            const mensagem = await response.text();

            throw new Error(
                mensagem || `Erro na requisição: ${response.status}`
            );
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return response.json() as Promise<T>;
    }
    
    else {
        const response = await fetch(`${API_URL}${endpoint}`);        
        if (!response.ok) {
            const mensagem = await response.text();

            throw new Error(
                mensagem || `Erro na requisição: ${response.status}`
            );
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return response.json() as Promise<T>;
    }  

}
