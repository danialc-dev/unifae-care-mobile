import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'UNIFAE_CARE_USER_TOKEN';
const HISTORY_KEY = 'UNIFAE_CARE_LOCAL_HISTORY';
let tempToken = null; // <-- Variável global de resgate

export const storageService = {
    saveToken: async (token) => {
        try {
            tempToken = token; // <-- Guarda na memória
            if (Platform.OS === 'web') {
                localStorage.setItem(TOKEN_KEY, token);
            } else {
                await SecureStore.setItemAsync(TOKEN_KEY, token);
            }
        } catch (error) { console.error(error); }
    },

    getToken: async () => {
        try {
            if (tempToken) return tempToken; // <-- Se tiver na memória, usa ele direto!

            if (Platform.OS === 'web') {
                return localStorage.getItem(TOKEN_KEY);
            } else {
                return await SecureStore.getItemAsync(TOKEN_KEY);
            }
        } catch (error) { return null; }
    },

    deleteToken: async () => {
        try {
            tempToken = null; // Limpa a memória
            if (Platform.OS === 'web') {
                localStorage.removeItem(TOKEN_KEY);
            } else {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            }
        } catch (error) { console.error(error); }
    },

    addLocalExecution: async (item) => {
        try {
            let current = [];
            if (Platform.OS === 'web') {
                const str = localStorage.getItem(HISTORY_KEY);
                if (str) current = JSON.parse(str);
            } else {
                const str = await SecureStore.getItemAsync(HISTORY_KEY);
                if (str) current = JSON.parse(str);
            }
            current.unshift(item); // Adiciona no começo
            const newVal = JSON.stringify(current);
            if (Platform.OS === 'web') {
                localStorage.setItem(HISTORY_KEY, newVal);
            } else {
                await SecureStore.setItemAsync(HISTORY_KEY, newVal);
            }
        } catch(e) { console.error("Erro ao salvar histórico local", e); }
    },

    getLocalHistory: async () => {
        try {
            if (Platform.OS === 'web') {
                const str = localStorage.getItem(HISTORY_KEY);
                return str ? JSON.parse(str) : [];
            } else {
                const str = await SecureStore.getItemAsync(HISTORY_KEY);
                return str ? JSON.parse(str) : [];
            }
        } catch(e) { return []; }
    }
};