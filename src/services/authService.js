// src/services/authService.js
import { AuthDTO } from '../model/AuthDTO';

export const authService = {
    login: async (email, password) => {
        // Usamos o DTO para formatar o envio antes de (simular) mandar para a API
        const requestData = AuthDTO.formatLoginRequest(email, password);

        console.log("Enviando para API:", requestData);

        // Simulando o tempo de requisição na internet (1.5 segundos)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validação: Só deixa passar se for o mock igual ao do Insomnia
                if (requestData.email === 'paciente1@unifae.local' && requestData.password === 'Admin@123') {

                    // Dados idênticos ao do seu ambiente de testes no Insomnia[cite: 1]
                    const mockApiResponse = {
                        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoicGFjaWVudGUxQHVuaWZhZS5sb2NhbCIsInJvbGUiOiJQQVRJRU5UIiwiYXBwSWQiOjEsImNvdXJzZUlkIjoxLCJpYXQiOjE3NzU4NjU3ODIsImV4cCI6MTc3NTg2NjY4Mn0.yTA0l9w_xEDEKaMKOwPGY_JO-_UE2OZTZcez9OpAd18",
                        user: {
                            id: 5,
                            name: "Maria Aparecida Souza",
                            email: "paciente1@unifae.local",
                            role: "PATIENT",
                            appId: 1,
                            courseId: 1,
                            nextVisitDate: "2026-05-15T13:00:00.000Z"
                        },
                        consentRequired: null
                    };

                    // Usamos o DTO para formatar a resposta limpa antes de devolver para a tela
                    resolve(AuthDTO.formatLoginResponse(mockApiResponse));
                } else {
                    // Simulando um erro 401 do backend
                    reject(new Error("Credenciais inválidas. Tente novamente."));
                }
            }, 1500);
        });
    },

    forgotPassword: async (email) => {
        const requestData = AuthDTO.formatForgotPasswordRequest(email);
        console.log("Enviando para API (Forgot Password):", requestData);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (requestData.email) {
                    // Mock idêntico ao retorno do Insomnia
                    const mockApiResponse = {
                        message: "Enviamos um código de 8 caracteres para o e-mail informado. Use-o junto com a nova senha para concluir."
                    };
                    resolve(AuthDTO.formatForgotPasswordResponse(mockApiResponse));
                } else {
                    reject(new Error("Por favor, forneça um e-mail válido."));
                }
            }, 1500); // Simulando delay de rede
        });
    },

    verifyCode: async (email, code) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (code === '12345678') {
                resolve({ message: "Código válido." });
            } else {
                reject(new Error("Código inválido ou expirado."));
            }
        }, 1500);
    });
},
};