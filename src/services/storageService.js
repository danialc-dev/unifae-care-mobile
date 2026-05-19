import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'UNIFAE_CARE_USER_TOKEN';
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
    }
};