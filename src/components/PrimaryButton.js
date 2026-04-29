import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Adicionamos a prop 'textStyle' aqui
export default function PrimaryButton({ title, onPress, style, textStyle }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            {/* Mesclamos o estilo padrão com o estilo recebido via prop */}
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});