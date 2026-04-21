// src/view/screens/RecuperarSenhaScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';

export default function RecuperarSenhaScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRecuperarSenha = async () => {
        if (!email.trim()) {
            Alert.alert("Atenção", "Por favor, insira seu endereço de e-mail.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.forgotPassword(email);
            Alert.alert("E-mail Enviado", response.message, [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert("Erro", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header Superior */}
                <View style={styles.topHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonTop}>
                        <Ionicons name="arrow-back" size={20} color={colors.primary} />
                        <Text style={styles.headerText}>Login</Text>
                    </TouchableOpacity>
                </View>

                {/* Logo e Títulos */}
                <View style={styles.header}>
                    <View>
                        <Image
                            source={require('../../../assets/logo_fae.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Card de Formulário */}
                <View style={styles.card}>
                    <Text style={styles.label}>Recuperar Senha</Text>
                    <CustomInput
                        iconName="mail"
                        placeholder="seu@email.com"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    ) : (
                        <PrimaryButton title="Enviar Código de Recuperação" onPress={handleRecuperarSenha} />
                    )}

                    <Text style={styles.subtitle}>
                        Insira seu e-mail para receber um código de 8 dígitos para redefinir sua conta.
                    </Text>
                </View>

                {/* Caixa de Informação */}
                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={24} color={colors.primaryDark} style={styles.infoIcon} />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>Informação Importante</Text>
                        <Text style={styles.infoText}>
                            Por motivos de segurança, o código de recuperação expira em 15 minutos. Verifique sua caixa de spam caso não receba o e-mail em instantes.
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerCopyright}>© 2024 UNIFAE CARE.</Text>
                    <View style={styles.footerLinks}>
                        <Text style={styles.footerText}>PRIVACIDADE</Text>
                        <Text style={styles.footerText}>TERMOS</Text>
                        <Text style={styles.footerText}>ACESSIBILIDADE</Text>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        justifyContent: 'space-between',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButtonTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoSquare: {
        width: 80,
        height: 80,
        backgroundColor: '#ffffffff', // Cor de fundo escura do protótipo
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoImage: {
        width: 360,
        height: 120,
        marginTop: -20
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    loadingContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    backToLoginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    backToLoginText: {
        color: colors.primaryDark,
        fontWeight: 'bold',
        fontSize: 14,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#F0F4F1', // Verde bem clarinho
        borderLeftWidth: 4,
        borderLeftColor: colors.primaryDark,
        padding: 16,
        borderRadius: 8,
        marginBottom: 30,
    },
    infoIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    footerText: {
        fontSize: 10,
        color: colors.textSecondary,
        marginHorizontal: 10,
        letterSpacing: 0.5,
    },
    footerCopyright: {
        fontSize: 10,
        color: colors.textSecondary,
    },
});