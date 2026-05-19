import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isConsentModalVisible, setConsentModalVisible] = useState(false);
    const [consentData, setConsentData] = useState(null);
    const [userToken, setUserToken] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await authService.login(email, password);

            if (response.token) {
                await storageService.saveToken(response.token);
                setUserToken(response.token); // Salva no estado para usar no Modal
            }

            if (response.requiresConsent) {
                // Guarda os dados do termo (versão, conteúdo, id) e ABRE o pop-up!
                setConsentData(response.requiresConsent);
                setConsentModalVisible(true);
            } else {
                navigation.replace('Home');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const clearError = () => setErrorMessage('');

    const handleAcceptTerms = async () => {
        try {
            // Chama a nova rota da API passando o ID do termo e o Token do usuário
            await authService.acceptConsent(consentData.consentTermId, userToken);

            // Fecha o pop-up
            setConsentModalVisible(false);

            // Agora sim, manda para a Home!
            navigation.replace('Home');
        } catch (error) {
            Alert.alert("Erro", error.message);
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

            {/* NOSSO POP-UP DE TERMOS DE USO */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isConsentModalVisible}
                onRequestClose={() => setConsentModalVisible(false)} // Para Android (botão voltar)
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Termos de Uso</Text>
                        <Text style={styles.modalSubtitle}>Versão {consentData?.version}</Text>

                        <ScrollView style={styles.modalContent}>
                            {/* Dica de Professor: O seu backend manda o conteúdo em HTML ("<p>...</p>"). 
                                Numa versão futura, usaremos a lib 'react-native-render-html' aqui. 
                                Por enquanto, vamos exibir como texto puro para não travar o estudo. */}
                            <Text style={styles.modalText}>{consentData?.content}</Text>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonRefuse]}
                                onPress={() => setConsentModalVisible(false)}
                            >
                                <Text style={styles.buttonRefuseText}>Recusar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonAccept]}
                                onPress={handleAcceptTerms}
                            >
                                <Text style={styles.buttonAcceptText}>Aceitar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // O '0.5' cria a transparência de 50%
        justifyContent: 'center', // Alinha a caixa branca no centro vertical da tela
        alignItems: 'center', // Alinha a caixa branca no centro horizontal da tela
    },
    modalContainer: {
        width: '85%', // Não deixa a caixa encostar nas bordas do celular
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 25,
        // As propriedades abaixo criam aquela sombra bonita de profundidade
        elevation: 5, // Sombra nativa do Android
        shadowColor: '#000', // Configuração de sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalContent: {
        maxHeight: 250, // CRÍTICO: Limita a altura máxima para obrigar o ScrollView a funcionar se o texto for gigante
        marginBottom: 25,
        backgroundColor: '#F9F9F9', // Fundo levemente cinza para destacar a área de leitura
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    modalText: {
        fontSize: 14,
        color: '#444444',
        lineHeight: 22, // Facilita a leitura de textos longos
    },
    modalFooter: {
        flexDirection: 'row', // Coloca os dois botões lado a lado
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1, // Faz com que os botões dividam o espaço igualmente, ficando do mesmo tamanho
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5, // Um pequeno respiro entre o botão Aceitar e Recusar
    },
    buttonRefuse: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#DDDDDD',
    },
    buttonAccept: {
        backgroundColor: '#4CAF50', // Troque pelo seu colors.primaryDark se preferir o verde da Fisio!
    },
    buttonRefuseText: {
        color: '#666666',
        fontWeight: 'bold',
        fontSize: 14,
    },
    buttonAcceptText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    }
});