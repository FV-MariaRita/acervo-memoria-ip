const API_URL = "http://localhost:8000"; // URL base da API

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(
            mensagem || "Erro ao acessar o backend."
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
