import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';

const MOCK_NOTIFICACOES = [
    { id: '1', title: 'Lembrete de Exercício', message: 'Você tem exercícios pendentes para hoje.', time: '1h atrás', isRead: false },
    { id: '2', title: 'Feedback Recebido', message: 'Seu fisioterapeuta deixou um novo feedback sobre seu relato.', time: '3h atrás', isRead: true },
    { id: '3', title: 'Meta Semanal', message: 'Parabéns! Você alcançou sua meta da semana.', time: '1 dia atrás', isRead: true },
];

export default function NotificacoesScreen() {
    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <View style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
            <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={24} color={!item.isRead ? colors.primary : '#999'} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notificações</Text>
                    <View style={{ width: 28 }} />
                </View>

                <FlatList
                    data={MOCK_NOTIFICACOES}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Você não tem novas notificações.</Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    listContainer: {
        padding: 20,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    unreadCard: {
        backgroundColor: '#E8F5E9',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    iconContainer: {
        marginRight: 15,
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    unreadText: {
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#888',
        fontSize: 16,
    }
});
