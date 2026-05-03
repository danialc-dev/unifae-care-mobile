import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage('Por favor, preencha e-mail e senha.');
            return;
        }

        setIsLoading(true);
        try {
            const responseData = await authService.login(email, password);
            console.log("Login com sucesso! Dados formatados:", responseData);
            navigation.replace('Home');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setErrorMessage('');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={styles.logoRow}>
                        <Image
                            source={require('../../../assets/logo_fae.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>E-mail</Text>
                    <CustomInput
                        placeholder="nome@exemplo.com.br"
                        value={email}
                        onChangeText={(text) => { setEmail(text); clearError(); }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Senha</Text>
                    <CustomInput
                        placeholder="*******"
                        value={password}
                        onChangeText={(text) => { setPassword(text); clearError(); }}
                        secureTextEntry={true}
                    />

                    {errorMessage ? (
                        <View style={styles.feedbackBox}>
                            <Ionicons name="alert-circle" size={16} color="#D32F2F" />
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('RecuperarSenha')}>
                        <Text style={styles.forgotPasswordText}>RECUPERAR SENHA</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 10 }} />
                    ) : (
                        <PrimaryButton title="Entrar" onPress={handleLogin} />
                    )}

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Não possui uma conta? </Text>
                        <TouchableOpacity onPress={() => console.log("Ir para Cadastro")}>
                            <Text style={styles.signupLink}>Cadastre-se agora</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 UNIFAE CARE.</Text>
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
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
    header: { alignItems: 'center', marginTop: 80 },
    logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    logoImage: { width: 360, height: 120, marginTop: -20 },
    form: { width: '100%' },
    label: { fontSize: 14, color: colors.textPrimary, marginBottom: 4, marginTop: 12, fontWeight: '500' },
    feedbackBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
    errorText: { fontSize: 12, color: '#D32F2F', flexShrink: 1 },
    forgotPassword: { alignSelf: 'center', marginTop: 16 },
    forgotPasswordText: { color: colors.primary, fontWeight: 'bold', fontSize: 12, letterSpacing: 1.2 },
    signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
    signupText: { color: colors.textSecondary, fontSize: 14 },
    signupLink: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },
    footer: { alignItems: 'center', marginBottom: 24 },
    footerText: { fontSize: 10, color: colors.textSecondary, marginHorizontal: 8 },
    footerLinks: { flexDirection: 'row', marginTop: 8 },
});