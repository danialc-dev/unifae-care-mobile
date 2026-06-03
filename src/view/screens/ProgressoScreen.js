import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';
import { colors } from '../../theme/colors';
import { exerciseService } from '../../services/exerciseService';

export default function ProgressoScreen() {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                // Busca as estatísticas (Adesão, etc) e o Histórico para os gráficos
                const [statsData, historyData] = await Promise.all([
                    exerciseService.getDashboardData(),
                    exerciseService.getHistory()
                ]);
                
                setStats(statsData);
                
                // Trata o payload de histórico
                const historyItems = historyData?.items || historyData?.content || (Array.isArray(historyData) ? historyData : []);
                
                // Filtramos apenas as execuções que têm score (Borg) registrado para base do gráfico
                const feedbackResults = historyItems.filter(item => item.score !== null && item.score !== undefined);
                setHistory(feedbackResults);
            } catch (error) {
                console.error("Erro ao carregar progresso:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 10, color: '#666' }}>Carregando seu progresso...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.header}>
                <Text style={styles.headerTitle}>Meu Progresso</Text>
                <Text style={styles.headerSubtitle}>Veja como está sua evolução.</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                {/* CARD DE ADESÃO */}
                <View style={styles.statCard}>
                    <View style={styles.statInfo}>
                        <Text style={styles.statLabel}>Adesão ao Plano</Text>
                        <Text style={styles.statValue}>{stats?.adherence || 0}%</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${stats?.adherence || 0}%` }]} />
                    </View>
                    <Text style={styles.statHint}>Com base nas sessões concluídas.</Text>
                </View>

                {/* GRID DE MÉTRICAS */}
                <View style={styles.row}>
                    <View style={[styles.miniCard, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="fitness" size={24} color="#1E88E5" />
                        <Text style={styles.miniValue}>{stats?.totalSessions || 0}</Text>
                        <Text style={styles.miniLabel}>Sessões</Text>
                    </View>
                    <View style={[styles.miniCard, { backgroundColor: '#FFF3E0' }]}>
                        <Ionicons name="trending-down" size={24} color="#FB8C00" />
                        <Text style={styles.miniValue}>-40%</Text>
                        <Text style={styles.miniLabel}>Nível de Dor</Text>
                    </View>
                </View>

                {/* BASE PARA OS GRÁFICOS (RESULTADOS DOS FEEDBACKS) */}
                <View style={styles.chartBaseContainer}>
                    <Text style={styles.sectionTitle}>Resultados dos Feedbacks (Base para Gráfico)</Text>
                    {history.length > 0 ? (
                        history.map((item, index) => (
                            <View key={item.executionId || index} style={styles.feedbackItem}>
                                <Text style={styles.exerciseName} numberOfLines={1}>{item.exerciseTitle || "Exercício"}</Text>
                                <View style={styles.scorePill}>
                                    <Text style={styles.scoreText}>Borg: {item.score}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>Nenhum feedback com escala de Borg registrado ainda.</Text>
                    )}
                </View>

                {/* CARD DE FEEDBACK DO FISIO */}
                <View style={styles.physioCard}>
                    <View style={styles.physioHeader}>
                        <Ionicons name="ribbon" size={20} color={colors.primary} />
                        <Text style={styles.physioTitle}>Nota do Fisioterapeuta</Text>
                    </View>
                    <Text style={styles.physioText}>
                        "Daniel, sua evolução no alongamento de posterior está excelente. Na próxima semana vamos aumentar a intensidade das repetições."
                    </Text>
                </View>
            </ScrollView>

                <BottomNav activeMenu="Progresso" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 25, paddingTop: 10, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 14, color: '#666' },
    statCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, elevation: 3, marginBottom: 20 },
    statInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    statLabel: { fontSize: 16, color: '#666', fontWeight: '500' },
    statValue: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
    progressContainer: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginBottom: 10 },
    progressBar: { height: 10, backgroundColor: colors.primary, borderRadius: 5 },
    statHint: { fontSize: 12, color: '#999' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    miniCard: { width: '48%', padding: 20, borderRadius: 16, alignItems: 'center' },
    miniValue: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 5 },
    miniLabel: { fontSize: 12, color: '#666' },
    physioCard: { backgroundColor: '#F1F8E9', padding: 20, borderRadius: 16, borderLeftWidth: 5, borderLeftColor: colors.primary, marginBottom: 30 },
    physioHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    physioTitle: { fontSize: 14, fontWeight: 'bold', color: colors.primary, marginLeft: 8 },
    physioText: { fontSize: 14, color: '#555', fontStyle: 'italic', lineHeight: 20 },
    
    // Novos Estilos para a base do gráfico
    chartBaseContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, elevation: 3, marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    feedbackItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    exerciseName: { flex: 1, fontSize: 14, color: '#444', paddingRight: 10 },
    scorePill: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    scoreText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
    emptyText: { fontSize: 14, color: '#999', fontStyle: 'italic', textAlign: 'center', marginVertical: 10 }
});