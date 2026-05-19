// src/components/BottomNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function BottomNav({ activeMenu }) {
    const navigation = useNavigation();

    const handleNavigation = (menuName) => {
        // Evita recarregar a tela se o usuário já estiver nela
        if (activeMenu === menuName) return;

        // Navega para a rota correspondente cadastrada no Stack/Tab Navigator
        navigation.navigate(menuName);
    };

    const renderNavItem = (menuName, iconName, label) => {
        const isActive = activeMenu === menuName;

        return (
            <TouchableOpacity
                key={menuName}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => handleNavigation(menuName)}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={isActive ? iconName : `${iconName}-outline`}
                    size={24}
                    // Utilizamos a cor primária padronizada para o ícone ativo
                    color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text style={isActive ? styles.navTextActive : styles.navText}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.bottomNav}>
            {/* Certifique-se de que os nomes ('Home', 'Exercicios', etc.) sejam exatamente 
                os nomes das rotas (name="...") configuradas no seu App.js */}
            {renderNavItem('Home', 'home', 'INÍCIO')}
            {renderNavItem('Exercicios', 'barbell', 'EXERCÍCIOS')}
            {renderNavItem('Relatos', 'document-text', 'RELATOS')}
            {renderNavItem('Progresso', 'stats-chart', 'PROGRESSO')}
            {renderNavItem('Perfil', 'person', 'PERFIL')}
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderColor: '#EFEFEF',
        paddingBottom: 25, // Respiro inferior para a SafeArea do iPhone
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 20,
        minWidth: 65, // Garante uma área de toque uniforme para todas as abas
    },
    navItemActive: {
        backgroundColor: '#E8F5E9', // Fundo de destaque suave
    },
    navText: {
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 4,
        fontWeight: 'bold',
    },
    navTextActive: {
        fontSize: 10,
        color: colors.primary,
        marginTop: 4,
        fontWeight: 'bold',
    }
});