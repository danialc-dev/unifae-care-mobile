// src/views/components/CustomInput.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function CustomInput({ iconName, placeholder, value, onChangeText, secureTextEntry, style, ...props }) {
    return (
        <View style={[styles.container, style]}>
            {iconName && (
                <Ionicons name={iconName} size={20} color={colors.textSecondary} style={styles.icon} />
            )}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginVertical: 8,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
    },
});