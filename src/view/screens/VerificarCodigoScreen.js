import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';


const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const visible = user.slice(0, 3);
    const masked = '*'.repeat(Math.max(user.length - 3, 3));
    return `${visible}${masked}@${domain}`;
};

export default function VerificarCodigoScreen({ route, navigation }) {
    const email = route?.params?.email || '';
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleVerifyCode = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (!code.trim() || code.length < 8) {
            setErrorMessage('Insira o código completo de 8 dígitos.');
            return;
        }

        setIsLoading(true);
        try {
            await authService.verifyCode(email, code);
            setSuccessMessage('Código validado! Redirecionando...');
            setTimeout(() => {
                navigation.navigate('NovaSenha', { email, code });
            }, 1000);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>

                    <View style={styles.topHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonTop}>
                            <Ionicons name="arrow-back" size={20} color={colors.primary} />
                            <Text style={styles.headerText}>Voltar ao E-mail</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.header}>
                        <Image source={require('../../../assets/logo_fae.png')} style={styles.logoImage} resizeMode="contain" />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.label}>Código de Verificação</Text>

                        {/* Confirmação do envio com email mascarado */}
                        <View style={styles.sentBox}>
                            <Ionicons name="checkmark-circle" size={16} color={colors.primaryDark} />
                            <Text style={styles.sentText}>
                                Enviamos um código para:{' '}
                                <Text style={styles.sentEmail}>{maskEmail(email)}</Text>
                            </Text>
                        </View>

                        <CustomInput
                            iconName="keypad"
                            placeholder="00000000"
                            value={code}
                            onChangeText={(text) => {
                                setCode(text);
                                setErrorMessage('');
                                setSuccessMessage('');
                            }}
                            keyboardType="number-pad"
                            maxLength={8}
                        />

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
                            <View style={{ marginTop: 10 }}>
                                <PrimaryButton title="Validar Código" onPress={handleVerifyCode} />
                            </View>
                        )}
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={24} color={colors.primaryDark} style={styles.infoIcon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoTitle}>Informação Importante</Text>
                            <Text style={styles.infoText}>O código de recuperação expira em 15 minutos. Verifique sua caixa de spam caso não receba.</Text>
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
    label: { fontSize: 12, color: colors.textSecondary, fontWeight: 'bold', marginBottom: 12, letterSpacing: 0.5 },
    sentBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: '#F0F4F1', padding: 12, borderRadius: 8, marginBottom: 16 },
    sentText: { fontSize: 12, color: colors.textSecondary, flexShrink: 1, lineHeight: 18 },
    sentEmail: { fontWeight: 'bold', color: colors.primaryDark },
    feedbackBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 4 },
    errorText: { fontSize: 12, color: '#D32F2F', flexShrink: 1 },
    successText: { fontSize: 12, color: colors.primaryDark, flexShrink: 1 },
    infoBox: { flexDirection: 'row', backgroundColor: '#F0F4F1', borderLeftWidth: 4, borderLeftColor: colors.primaryDark, padding: 16, borderRadius: 8, marginBottom: 30 },
    infoIcon: { marginRight: 12, marginTop: 2 },
    infoTextContainer: { flex: 1 },
    infoTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
    infoText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});