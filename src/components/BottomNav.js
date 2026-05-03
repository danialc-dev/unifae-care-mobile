// src/components/BottomNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // <-- Importamos o Hook de navegação
import { colors } from '../theme/colors';

export default function BottomNav({ activeMenu }) {
    const navigation = useNavigation(); // <-- Instanciamos a navegação

    const handleNavigation = (menuName) => {
        // Como ainda não temos todas as telas, vamos navegar apenas para as que existem
        if (menuName === 'Home' || menuName === 'Perfil') {
            // Dica: usamos 'navigate' em vez de 'replace' aqui para o usuário poder ir e voltar
            navigation.navigate(menuName);
        } else {
            console.log(`Tela de ${menuName} em construção...`);
        }
    };

    const renderNavItem = (menuName, iconName, label) => {
        const isActive = activeMenu === menuName;

        return (
            <TouchableOpacity
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => handleNavigation(menuName)} // <-- Chamamos a nova função
            >
                <Ionicons
                    name={isActive ? iconName : `${iconName}-outline`}
                    size={24}
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
        paddingBottom: 25,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    navItemActive: {
        backgroundColor: '#E8F5E9',
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