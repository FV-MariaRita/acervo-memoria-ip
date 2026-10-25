
const API_BASE_URL = "http://localhost:8000"; 

export const API_ROUTES = {

    
    GET_ENTREVISTADOS: `${API_BASE_URL}/entrevistados`, 
    GET_ENTREVISTADO: (id: number) => `${API_BASE_URL}/entrevistados/${id}`,    
    CREATE_ENTREVISTADO: `${API_BASE_URL}/entrevistados`, 
    UPDATE_ENTREVISTADO: (id: number) => `${API_BASE_URL}/entrevistados/${id}`,
    DELETE_ENTREVISTADO: (id: number) => `${API_BASE_URL}/entrevistados/${id}`

}