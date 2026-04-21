import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';

export default function NovaSenhaScreen({ route, navigation }) {
    const { email, code } = route.params;
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRedefinirSenha = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (!novaSenha.trim() || !confirmarSenha.trim()) {
            setErrorMessage('Preencha todos os campos.');
            return;
        }
        if (novaSenha.length < 6) {
            setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(email, code, novaSenha);
            setSuccessMessage('Senha redefinida com sucesso! Redirecionando...');
            setTimeout(() => {
                navigation.navigate('Login');
            }, 1500);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>

                    <View style={styles.topHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonTop}>
                            <Ionicons name="arrow-back" size={20} color={colors.primary} />
                            <Text style={styles.headerText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.header}>
                        <Image
                            source={require('../../../assets/logo_fae.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.label}>Nova Senha</Text>
                        <Text style={styles.emailLabel}>Conta: {email}</Text>

                        <CustomInput
                            iconName="lock-closed"
                            placeholder="Nova senha"
                            value={novaSenha}
                            onChangeText={(text) => { setNovaSenha(text); clearMessages(); }}
                            secureTextEntry
                        />

                        <View style={{ marginTop: 12 }}>
                            <CustomInput
                                iconName="lock-closed"
                                placeholder="Confirmar nova senha"
                                value={confirmarSenha}
                                onChangeText={(text) => { setConfirmarSenha(text); clearMessages(); }}
                                secureTextEntry
                            />
                        </View>

                        {errorMessage ? (
                            <View style={styles.feedbackBox}>
                                <Ionicons name="alert-circle" size={16} color="#D32F2F" />
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        ) : null}

                        {successMessage ? (
                            <View style={styles.feedbackBox}>
                                <Ionicons name="checkmark-circle" size={16} color={colors.primaryDark} />
                                <Text style={styles.successText}>{successMessage}</Text>
                            </View>
                        ) : null}

                        {isLoading ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 10 }} />
                        ) : (
                            <View style={{ marginTop: 12 }}>
                                <PrimaryButton title="Redefinir Senha" onPress={handleRedefinirSenha} />
                            </View>
                        )}
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={24} color={colors.primaryDark} style={styles.infoIcon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoTitle}>Requisitos de Senha</Text>
                            <Text style={styles.infoText}>
                                Sua nova senha deve ter pelo menos 6 caracteres. Escolha uma senha forte que não utilize em outros serviços.
                            </Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 10, justifyContent: 'flex-start' },
    topHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backButtonTop: { flexDirection: 'row', alignItems: 'center' },
    headerText: { fontSize: 16, color: colors.primary, fontWeight: 'bold', marginLeft: 8 },
    header: { alignItems: 'center', marginBottom: 20 },
    logoImage: { width: 360, height: 120, marginTop: -20 },
    card: { backgroundColor: colors.white, padding: 20, borderRadius: 12, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    label: { fontSize: 12, color: colors.textSecondary, fontWeight: 'bold', marginBottom: 8, letterSpacing: 0.5 },
    emailLabel: { fontSize: 12, color: colors.primaryDark, marginBottom: 15 },
    feedbackBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 4 },
    errorText: { fontSize: 12, color: '#D32F2F', flexShrink: 1 },
    successText: { fontSize: 12, color: colors.primaryDark, flexShrink: 1 },
    infoBox: { flexDirection: 'row', backgroundColor: '#F0F4F1', borderLeftWidth: 4, borderLeftColor: colors.primaryDark, padding: 16, borderRadius: 8, marginBottom: 30 },
    infoIcon: { marginRight: 12, marginTop: 2 },
    infoTextContainer: { flex: 1 },
    infoTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
    infoText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});