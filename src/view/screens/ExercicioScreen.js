import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { exerciseService } from '../../services/exerciseService';

export default function ExercicioScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const prescriptionItemId = route.params?.prescriptionItemId;

    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!prescriptionItemId) {
                Alert.alert("Erro", "Nenhum exercício selecionado.");
                navigation.goBack();
                return;
            }

            try {
                setLoading(true);
                const data = await exerciseService.getExerciseDetails(prescriptionItemId);
                setExercise(data);
            } catch (error) {
                Alert.alert("Erro", error.message);
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [prescriptionItemId]);

    const handleConcluir = async () => {
        try {
            setCompleting(true);
            const response = await exerciseService.completeExercise(prescriptionItemId);

            // Pega o ID da execução para o feedback (pode vir como executionId ou id)
            const executionId = response.executionId || response.id;

            navigation.navigate('Feedback', { 
                executionId: executionId,
                exerciseTitle: exercise.title // Passando para o Feedback
            });
        } catch (error) {
            Alert.alert("Ops!", error.message);
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.mainContainer, styles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando exercício...</Text>
            </SafeAreaView>
        );
    }

    if (!exercise) return null;

    // Mapeamento das Tags a partir da Taxonomy do seu JSON
    const tags = [];
    if (exercise.taxonomy) {
        if (exercise.taxonomy.axis) tags.push(exercise.taxonomy.axis.toUpperCase());
        if (exercise.taxonomy.objective) tags.push(exercise.taxonomy.objective.toUpperCase());
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* CABEÇALHO */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Image source={require('../../../assets/logo_fae.png')} style={styles.logo} resizeMode="contain" />
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* TAGS */}
                <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                        <View key={index} style={styles.tagBadge}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* TÍTULO */}
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>

                {/* PLAYER DE VÍDEO (Placeholder) */}
                <View style={styles.videoContainer}>
                    <View style={styles.videoPlaceholder}>
                        <Ionicons name="play-circle" size={64} color={colors.primary} />
                        <Text style={{ marginTop: 10, color: '#999', fontSize: 12 }}>Vídeo do Exercício</Text>
                    </View>
                </View>

                {/* MÉTRICAS (SÉRIES E VOLUME) */}
                <View style={styles.metricsContainer}>
                    <View style={styles.metricCard}>
                        <View style={styles.metricIcon}>
                            <Ionicons name="sync" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.metricTextContainer}>
                            <Text style={styles.metricLabel}>SÉRIES</Text>
                            <Text style={styles.metricValue}>{exercise.metrics?.series || "0"} Séries</Text>
                        </View>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={styles.metricIcon}>
                            <Ionicons name="barbell" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.metricTextContainer}>
                            <Text style={styles.metricLabel}>VOLUME</Text>
                            <Text style={styles.metricValue}>{exercise.metrics?.volume || "0"} Repetições</Text>
                        </View>
                    </View>
                </View>

                {/* PASSO A PASSO (TEXTO) */}
                <Text style={styles.sectionTitle}>Passo a Passo</Text>
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsText}>{exercise.instructions || "Nenhuma instrução fornecida."}</Text>
                </View>

                {/* DICAS DA FISIO */}
                {exercise.physiotherapistNotes && (
                    <View style={styles.tipsCard}>
                        <View style={styles.tipsHeader}>
                            <Ionicons name="information-circle" size={22} color={colors.primary} />
                            <Text style={styles.tipsTitle}>Dicas da Fisioterapeuta</Text>
                        </View>
                        <Text style={styles.tipsText}>"{exercise.physiotherapistNotes}"</Text>
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* BOTÃO CONCLUIR - AGORA EM VERDE PRIMÁRIO */}
            <View style={styles.footerContainer}>
                <TouchableOpacity
                    style={[styles.submitButton, completing && { opacity: 0.7 }]}
                    onPress={handleConcluir}
                    disabled={completing}
                >
                    {completing ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Concluir Atividade</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    centerContent: { justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#666' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backButton: { padding: 5 },
    logo: { height: 30, width: 120 },
    contentContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
    tagsContainer: { flexDirection: 'row', marginBottom: 12 },
    tagBadge: { backgroundColor: '#E8F5E9', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginRight: 8 },
    tagText: { fontSize: 10, fontWeight: 'bold', color: '#2E7D32' },
    exerciseTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    videoContainer: { height: 200, borderRadius: 16, backgroundColor: '#F0F0F0', marginBottom: 20, overflow: 'hidden' },
    videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    metricsContainer: { marginBottom: 25 },
    metricCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EFEFEF' },
    metricIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    metricTextContainer: { flex: 1 },
    metricLabel: { fontSize: 11, color: '#888', fontWeight: 'bold' },
    metricValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    instructionsContainer: { padding: 15, backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#E0E0E0' },
    instructionsText: { fontSize: 15, color: '#555', lineHeight: 22 },
    tipsCard: { backgroundColor: '#F1F8E9', padding: 15, borderRadius: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#2E7D32' },
    tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    tipsTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginLeft: 8 },
    tipsText: { fontSize: 13, color: '#555', fontStyle: 'italic' },
    footerContainer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    submitButton: { backgroundColor: '#2E7D32', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }, // Verde Primário
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});