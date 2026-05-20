import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/BottomNav';
import { colors } from '../../theme/colors';
import { exerciseService } from '../../services/exerciseService';

export default function RelatosScreen() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await exerciseService.getHistory();
                console.log("=== API DE HISTORICO ===", JSON.stringify(data, null, 2));
                const items = data?.items || data?.content || (Array.isArray(data) ? data : []);
                setHistory(items);
            } catch (e) { console.error("Erro ao buscar histórico:", e); }
            finally { setLoading(false); }
        };
        fetchHistory();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.historyCard}>
            <View style={styles.timelineContainer}>
                <View style={styles.dot} />
                <View style={styles.line} />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.dateText}>{new Date(item.performedAt).toLocaleDateString('pt-BR')}</Text>
                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>Borg: {item.score || 'N/A'}</Text>
                    </View>
                </View>
                <Text style={styles.exerciseName}>{item.exerciseTitle || "Exercício Concluído"}</Text>
                {item.notes && <Text style={styles.notesText}>"{item.notes}"</Text>}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meu Histórico</Text>
                <Text style={styles.headerSubtitle}>Relatos das suas sessões anteriores.</Text>
            </View>

            <View style={{ flex: 1 }}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 50 }} color={colors.primary} />
                ) : (
                    <FlatList
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={item => item.executionId ? item.executionId.toString() : Math.random().toString()}
                        contentContainerStyle={{ padding: 20 }}
                        ListEmptyComponent={<Text style={styles.empty}>Nenhum relato encontrado.</Text>}
                    />
                )}
            </View>
            <BottomNav activeMenu="Relatos" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 25, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    headerSubtitle: { fontSize: 14, color: '#666' },
    historyCard: { flexDirection: 'row', marginBottom: 10 },
    timelineContainer: { alignItems: 'center', width: 20, marginRight: 15 },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, zIndex: 1 },
    line: { flex: 1, width: 2, backgroundColor: '#E0E0E0' },
    cardContent: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    dateText: { fontSize: 12, color: '#999', fontWeight: 'bold' },
    scoreBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    scoreText: { fontSize: 10, color: colors.primary, fontWeight: 'bold' },
    exerciseName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    notesText: { fontSize: 13, color: '#666', fontStyle: 'italic', marginTop: 8 },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});