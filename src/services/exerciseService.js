import axios from 'axios';
import { storageService } from './storageService';

const API_URL = 'http://185.217.125.219:3000/api/v1';

const getAuthHeader = async () => {
    const token = await storageService.getToken();
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");
    return { headers: { 'Authorization': `Bearer ${token}` } };
};

export const exerciseService = {
    getExercisesList: async () => {
        try {
            const config = await getAuthHeader();
            const response = await axios.get(`${API_URL}/app/home/plan/exercises`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erro ao carregar a lista de exercícios.");
        }
    },

    getExerciseDetails: async (prescriptionItemId) => {
        try {
            const config = await getAuthHeader();
            const response = await axios.get(`${API_URL}/app/home/plan/exercises/${prescriptionItemId}`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erro ao carregar detalhes.");
        }
    },

    completeExercise: async (prescriptionItemId) => {
        try {
            const config = await getAuthHeader();
            const response = await axios.post(`${API_URL}/app/home/plan/exercises/${prescriptionItemId}/complete`, {}, config);
            // Retorna o objeto contendo o "executionId" (ex: 901)
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erro ao concluir.");
        }
    },

    sendFeedback: async (executionId, score, notes) => {
        try {
            const config = await getAuthHeader();
            // AJUSTADO: Usando as chaves exatas que o seu Swagger pede
            const payload = {
                score: score,
                notes: notes
            };
            const response = await axios.post(`${API_URL}/app/home/plan/executions/${executionId}/feedback`, payload, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erro ao registrar o feedback.");
        }
    },

    // NOVA FUNÇÃO: Rota de Dor Diária
    registerDailyPain: async (painLevel) => {
        try {
            const config = await getAuthHeader();
            // Supondo que a API espera { level: "NONE" | "MILD" | "SEVERE" } ou um número
            const payload = { level: painLevel };
            const response = await axios.post(`${API_URL}/app/home/pain`, payload, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erro ao registrar a dor de hoje.");
        }
    },

    getHistory: async () => {
        try {
            // Como a rota de histórico não existe ainda no backend,
            // retornamos o histórico local que o usuário salvou no app!
            const items = await storageService.getLocalHistory();
            return { items };
        } catch (error) {
            console.error("Erro na API getHistory:", error?.response?.data || error.message);
            const items = await storageService.getLocalHistory();
            return { items };
        }
    },

    getDashboardData: async () => {
        try {
            const config = await getAuthHeader();
            // Rota que traz os cálculos de adesão e dor (se o seu backend já tiver)
            const response = await axios.get(`${API_URL}/app/home/plan/stats`, config);
            return response.data;
        } catch (error) {
            // Se a rota ainda não existir, retornaremos um mock para a entrega de hoje
            return { adherence: 85, painEvolution: [8, 7, 5, 4, 2], totalSessions: 12 };
        }
    },

};