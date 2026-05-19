import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../../components/BottomNav';
import { colors } from '../../theme/colors';

// Importamos o nosso serviço que fala com a API
import { exerciseService } from '../../services/exerciseService';

export default function ExerciciosScreen() {
    const navigation = useNavigation();

    // Estados reais do componente
    const [exercicios, setExercicios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const data = await exerciseService.getExercisesList();

                // 🚨 O NOSSO RAIO-X:
                console.log("============= RESPOSTA DA API =============");
                console.log(JSON.stringify(data, null, 2));
                console.log("===========================================");

                // A linha abaixo é a que vamos consertar depois de ver o log
                const listaReal = data.items || [];
                setExercicios(listaReal);

            } catch (error) {
                Alert.alert("Erro de Conexão", error.message);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            fetchExercises();
        });

        return unsubscribe;
    }, [navigation]);

    const handleAbrirExercicio = (id) => {
        // Agora sim! Passamos o ID real que veio do banco de dados
        navigation.navigate('ExercicioDetalhe', { prescriptionItemId: id });
    };

    const renderExercicioCard = ({ item }) => {
        const id = item.prescriptionItemId;
        const titulo = item.title;
        const concluido = item.completedToday;

        const tags = [];
        if (item.taxonomy) {
            if (item.taxonomy.axis) tags.push(item.taxonomy.axis.toUpperCase());
            if (item.taxonomy.objective) tags.push(item.taxonomy.objective.toUpperCase());
        }

        const series = item.series || 3;
        const volume = item.volume || "15 Repetições";

        return (
            <TouchableOpacity
                style={[styles.card, concluido && styles.cardConcluido]}
                activeOpacity={0.8}
                onPress={() => handleAbrirExercicio(id)}
            >
                <View style={styles.cardContent}>
                    {/* Tags */}
                    {tags.length > 0 && (
                        <View style={styles.tagsRow}>
                            {tags.map((tag, index) => {
                                const nomeTag = typeof tag === 'string' ? tag : tag.name;
                                return <Text key={index} style={styles.tagText}>{nomeTag}</Text>
                            })}
                        </View>
                    )}

                    {/* Título */}
                    <Text style={[styles.cardTitle, concluido && styles.textConcluido]}>
                        {titulo}
                    </Text>

                    {/* Métricas */}
                    <Text style={styles.cardMetrics}>
                        {series} Séries • {volume} Repetições
                    </Text>
                </View>

                {/* Ícone de Status (Play ou Check verde) */}
                <View style={styles.iconContainer}>
                    {concluido ? (
                        <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                    ) : (
                        <Ionicons name="play-circle" size={36} color={colors.primary || '#2E7D32'} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus exercícios</Text>
                <Text style={styles.headerSubtitle}>Acompanhe suas atividades diárias.</Text>
            </View>

            <View style={{ flex: 1 }}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Carregando exercícios...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={exercicios}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={renderExercicioCard}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        // Mensagem caso o paciente não tenha treino hoje
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Você não tem exercícios prescritos para hoje. Parabéns pelo descanso!</Text>
                        }
                    />
                )}
            </View>

            <BottomNav activeMenu="Exercicios" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333333' },
    headerSubtitle: { fontSize: 14, color: '#666666', marginTop: 5 },
    listContainer: { padding: 20, paddingBottom: 40 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    cardConcluido: { backgroundColor: '#F1F8E9', borderWidth: 1, borderColor: '#C8E6C9' },
    cardContent: { flex: 1, paddingRight: 15 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
    tagText: { fontSize: 10, fontWeight: 'bold', color: '#2E7D32', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 6, marginBottom: 4 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginBottom: 6 },
    textConcluido: { color: '#2E7D32' },
    cardMetrics: { fontSize: 13, color: '#777777', fontWeight: '500' },
    iconContainer: { justifyContent: 'center', alignItems: 'center' },

    // NOVOS ESTILOS PARA CARREGAMENTO E LISTA VAZIA:
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#666666' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 50, fontSize: 16, fontStyle: 'italic', paddingHorizontal: 20 }
});