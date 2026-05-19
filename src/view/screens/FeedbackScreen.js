import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { exerciseService } from '../../services/exerciseService';

export default function FeedbackScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // Recebemos o executionId da tela de exercício
    const executionId = route.params?.executionId;

    // Estados do Formulário
    const [selectedEffort, setSelectedEffort] = useState(null); // Vai guardar o número (0, 2, 5, 8, 10)
    const [observation, setObservation] = useState('');
    const [saving, setSaving] = useState(false);

    // Opções baseadas na Escala de Borg Adaptada do seu Mockup
    const effortOptions = [
        { level: 0, title: "Sem Dor/Esforço", desc: "Absolutamente confortável", emoji: "😋" },
        { level: 2, title: "Leve", desc: "Atividade tranquila e sustentável", emoji: "🙂" },
        { level: 5, title: "Moderado", desc: "Senti o esforço, mas sem dor", emoji: "😐" },
        { level: 8, title: "Intenso", desc: "Exigiu bastante concentração", emoji: "😫" },
        { level: 10, title: "Exaustão", desc: "Limite físico atingido", emoji: "😵" }, // Troquei o emoji para não ficar igual ao 8
    ];

    const handleSalvarFeedback = async () => {
        if (selectedEffort === null) {
            Alert.alert("Atenção", "Por favor, selecione como você se sentiu antes de continuar.");
            return;
        }

        try {
            setSaving(true);

            // Chama a API para salvar o feedback usando o ID da execução
            if (executionId) {
                await exerciseService.sendFeedback(executionId, selectedEffort, observation);
            } else {
                console.warn("Nenhum executionId fornecido. Simulando sucesso localmente.");
            }

            // Sucesso! Volta para a aba de Exercícios (onde o card aparecerá com o check verde)
            Alert.alert("Sucesso!", "Seu feedback foi registrado. Bom descanso!");
            navigation.navigate('Exercicios');

        } catch (error) {
            Alert.alert("Erro ao salvar", error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* O KeyboardAvoidingView empurra a tela pra cima quando o teclado abre */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                {/* CABEÇALHO */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>

                    {/* TÍTULOS */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.subtitle}>SESSÃO FINALIZADA</Text>
                        <Text style={styles.title}>Como você se sente?</Text>
                        <Text style={styles.description}>
                            Avalie seu nível de dor e esforço após o exercício para que possamos ajustar seu plano.
                        </Text>
                    </View>

                    {/* OPÇÕES DE ESFORÇO (ESCALA DE BORG) */}
                    <View style={styles.optionsContainer}>
                        {effortOptions.map((option) => {
                            const isSelected = selectedEffort === option.level;

                            return (
                                <TouchableOpacity
                                    key={option.level}
                                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                                    onPress={() => setSelectedEffort(option.level)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.emojiContainer}>
                                        <Text style={styles.emoji}>{option.emoji}</Text>
                                    </View>

                                    <View style={styles.optionTextContainer}>
                                        <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                                            {option.title}
                                        </Text>
                                        <Text style={styles.optionDesc}>{option.desc}</Text>
                                    </View>

                                    <Text style={[styles.optionLevel, isSelected && styles.optionLevelSelected]}>
                                        {option.level}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* CAMPO DE OBSERVAÇÕES */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Observações Adicionais (Opcional)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Descreva qualquer desconforto específico..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            value={observation}
                            onChangeText={setObservation}
                            textAlignVertical="top" // Para o Android começar no topo
                        />
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>

                {/* BOTÃO SALVAR FIXO NO RODAPÉ */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        style={[styles.submitButton, saving && { opacity: 0.7 }]}
                        onPress={handleSalvarFeedback}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Salvar Feedback</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
        alignItems: 'flex-start',
    },
    closeButton: {
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2E7D32', // Verde Primário
        letterSpacing: 1.2,
        marginBottom: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#EFEFEF',
        borderRadius: 16,
        marginBottom: 12,
    },
    optionCardSelected: {
        borderColor: '#2E7D32', // Borda fica Verde Primária
        backgroundColor: '#F1F8E9', // Fundo fica Verde clarinho
    },
    emojiContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    emoji: {
        fontSize: 24,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 2,
    },
    optionTitleSelected: {
        color: '#2E7D32',
    },
    optionDesc: {
        fontSize: 12,
        color: '#777777',
    },
    optionLevel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#CCCCCC',
        marginLeft: 10,
    },
    optionLevelSelected: {
        color: '#2E7D32', // Número fica verdão
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 12,
        padding: 15,
        fontSize: 14,
        color: '#333333',
        minHeight: 100, // Altura inicial da caixa de texto
    },
    footerContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    submitButton: {
        backgroundColor: '#2E7D32',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});