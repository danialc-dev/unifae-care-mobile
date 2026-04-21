import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha e-mail e senha.");
            return;
        }

        try {
            console.log("Tentando logar com:", email);

            const responseData = await authService.login(email, password);

            console.log("Login com sucesso! Dados formatados:", responseData);
            Alert.alert("Sucesso", `Bem-vindo, ${responseData.userName}`);

        } catch (error) {
            console.error("Falha no login:", error.message);
            Alert.alert("Acesso Negado", error.message);
        }
    };

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
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Senha</Text>
                    <CustomInput
                        placeholder="*******"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => {
                        console.log("Ir para Recuperar Senha");
                    }}>
                        <Text style={styles.forgotPasswordText}>RECUPERAR SENHA</Text>
                    </TouchableOpacity>
                </View>

                <View>

                    <PrimaryButton title="Entrar" onPress={handleLogin} />

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Não possui uma conta? </Text>
                        <TouchableOpacity onPress={() => console.log("Ir para Cadastro")}>
                            <Text style={styles.signupLink}>Cadastre-se agora</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* RODAPÉ MANTIDO */}
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
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: 80,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    logoImage: {
        width: 360,
        height: 120,
        marginTop: -20
    },
    welcomeText: {
        fontSize: 20,
        color: colors.textPrimary,
        letterSpacing: 1,
        marginTop: 50,
        marginBottom: -20
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: colors.textPrimary,
        marginBottom: 4,
        marginTop: 12,
        fontWeight: '500',
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: 16
    },
    forgotPasswordText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1.2,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    signupText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    signupLink: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    footerText: {
        fontSize: 10,
        color: colors.textSecondary,
        marginHorizontal: 8,
    },
    footerLinks: {
        flexDirection: 'row',
        marginTop: 8,
    },
});