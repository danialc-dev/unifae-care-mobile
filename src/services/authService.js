// src/services/authService.js
import axios from 'axios';
import { AuthDTO } from '../model/AuthDTO';

const API_URL = 'http://185.217.125.219:3000/api/v1';

export const authService = {
    login: async (email, password) => {
        const requestData = AuthDTO.formatLoginRequest(email, password);
        const payload = {
            ...requestData,
            accessMode: 'APP',
            appId: 1
        };

        try {
            const response = await axios.post(`${API_URL}/auth/login`, payload);
            return AuthDTO.formatLoginResponse(response.data);
        } catch (error) {

            const backendMessage = error.response?.data?.message || error.response?.data?.error;
            throw new Error(backendMessage || "Credenciais inválidas. Tente novamente.");
        }
    },

    acceptConsent: async (consentTermId, token) => {
        try {
            // Note que estamos enviando o Header de Autorização exigido pela sua API
            const response = await axios.post(`${API_URL}/auth/consent/accept`,
                { consentTermId: consentTermId }, // Body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                } // Headers
            );

            // O Insomnia mostra que o backend retorna { "message": "Consentimento registrado..." }
            return response.data;
        } catch (error) {
            const backendMessage = error.response?.data?.message || error.response?.data?.error;
            throw new Error(backendMessage || "Erro ao aceitar os termos de uso.");
        }
    },

    forgotPassword: async (email) => {
        const requestData = AuthDTO.formatForgotPasswordRequest(email);

        try {

            const response = await axios.post(`${API_URL}/auth/forgot-password`, requestData);


            return AuthDTO.formatForgotPasswordResponse(response.data);
        } catch (error) {
            const backendMessage = error.response?.data?.message || error.response?.data?.error;
            throw new Error(backendMessage || "Erro ao solicitar recuperação de senha. Verifique o e-mail.");
        }
    },

    resetPassword: async (email, code, password, confirmPassword) => {
        try {

            const payload = {
                email: email,
                code: code,
                password: password,
                confirmPassword: confirmPassword
            };

            const response = await axios.post(`${API_URL}/auth/reset-password`, payload);

            return response.data;
        } catch (error) {
            const backendMessage = error.response?.data?.message || error.response?.data?.error;
            throw new Error(backendMessage || "Erro ao redefinir a senha. Verifique o código inserido.");
        }
    },
};