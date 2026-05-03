import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import BottomNav from '../../components/BottomNav';
import PrimaryButton from '../../components/PrimaryButton';

export default function HomeScreen() {
    const [homeData, setHomeData] = useState({
        userName: "Ana",
        dailyPlan: {
            totalExercises: 1,
            nextExercise: {
                title: "Mobilidade de Ombro",
                tags: "Pós-cirúrgico • Câncer de mama",
                timeDuration: "12 min"
            }
        },
        progress: {
            percentage: 78 // Altere este valor para testar as mensagens!
        }
    });

    const getProgressFeedback = (percent) => {
        if (percent <= 30) {
            return { message: "Você precisa se exercitar!", subMessage: "Vamos começar?", color: '#E53935' }; // Vermelho
        } else if (percent < 85) {
            return { message: "Você está indo muito bem!", subMessage: "Continue assim 💚", color: colors.primaryDark }; // Verde Fisio
        } else {
            return { message: "Parabéns pelo resultado da semana!", subMessage: "Meta alcançada 🏆", color: colors.primary }; // Verde UNIFAE
        }
    };

    const feedback = getProgressFeedback(homeData.progress.percentage);
    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    {/* Imagem flutuando no fundo */}
                    <Image
                        source={require('../../../assets/header_ilustra.jpeg')}
                        style={styles.headerIllustration}
                    />

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.greetingTitle}>Olá, {homeData.userName}!</Text>
                        <Text style={styles.greetingSubtitle}>
                            Seu cuidado diário faz toda a diferença na sua recuperação.
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color={colors.primaryDark} />
                    </TouchableOpacity>
                </View>

                {/* CARD: PLANO DE HOJE */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Seu plano de hoje</Text>
                        <Text style={styles.cardHighlight}>{homeData.dailyPlan.totalExercises} exercício</Text>
                    </View>

                    <View style={styles.exerciseInfoBox}>
                        <Text style={styles.exerciseTitle}>{homeData.dailyPlan.nextExercise.title}</Text>
                        <Text style={styles.exerciseTags}>{homeData.dailyPlan.nextExercise.tags}</Text>

                        <View style={styles.timeContainer}>
                            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                            <Text style={styles.timeText}>{homeData.dailyPlan.nextExercise.timeDuration}</Text>
                        </View>
                    </View>

                    <PrimaryButton
                        title="Iniciar exercício"
                        onPress={() => console.log('Iniciar exercício')}
                        style={styles.startButton}
                    />
                </View>

                {/* CARD: PROGRESSO */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Seu progresso</Text>

                    <View style={styles.progressRow}>
                        {/* Simulação visual do círculo de progresso */}
                        <View style={[styles.progressCircle, { borderColor: feedback.color }]}>
                            <Text style={styles.progressPercentage}>{homeData.progress.percentage}%</Text>
                        </View>

                        <View style={styles.progressTextContainer}>
                            <Text style={styles.progressMessage}>{feedback.message}</Text>
                            <Text style={styles.progressSubMessage}>{feedback.subMessage}</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            <BottomNav activeMenu="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 80,
        marginBottom: 30,
        position: 'relative',
    },
    headerIllustration: {
        position: 'absolute',
        right: 20,
        top: -10,
        width: 150,
        height: 150,
        opacity: 0.25,
        resizeMode: 'contain',
        zIndex: -1,
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 20,
    },
    greetingTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    greetingSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    notificationButton: {
        padding: 5,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    cardHighlight: {
        fontSize: 14,
        color: colors.primaryDark,
        fontWeight: '600',
    },
    exerciseInfoBox: {
        backgroundColor: colors.inputBackground,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    exerciseTags: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 12,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 6,
    },
    startButton: {
        marginTop: 0,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    progressCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    progressPercentage: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    progressTextContainer: {
        flex: 1,
    },
    progressMessage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    progressSubMessage: {
        fontSize: 14,
        color: colors.textSecondary,
    }
});