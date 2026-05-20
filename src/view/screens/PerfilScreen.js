import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import BottomNav from '../../components/BottomNav';

export default function PerfilScreen() {
    const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/women/44.jpg');
    const [userData, setUserData] = useState({
        profile: {
            id: 5,
            name: "Maria Aparecida Souza",
            role: "PATIENT",
        },
        responsibleStudent: {
            name: "Aluno André Lucas",
        },
        coordinator: {
            name: "Coord. Vanessa",
        },
        weeklyProgress: {
            percentCompleted: 0,
        }
    });

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para mudar a foto de perfil!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            // TODO: Chamar o backend para enviar a foto (ex: multipart/form-data)
            // const formData = new FormData();
            // formData.append('file', { uri: result.assets[0].uri, name: 'profile.jpg', type: 'image/jpeg' });
            // await exerciseService.uploadProfilePicture(formData);
        }
    };

    // Função auxiliar atualizada para renderizar ícones à esquerda e à direita
    const renderMenuItem = (title, leftIcon, rightIcon = 'chevron-forward') => (
        <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
                <Ionicons name={leftIcon} size={22} color={colors.primary} style={styles.leftIcon} />
                <Text style={styles.menuItemText}>{title}</Text>
            </View>
            <Ionicons name={rightIcon} size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container} bounces={false}>
                {/* CABEÇALHO */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.avatar}
                        />
                        <View style={styles.editIconContainer}>
                            <Ionicons name="camera" size={16} color={colors.white} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.userName}>{userData.profile.name}</Text>
                    <Text style={styles.userId}>ID: #{userData.profile.id}-REHAB</Text>
                </View>

                {/* INFORMAÇÕES MÉDICAS */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>FISIOTERAPEUTA RESPONSÁVEL</Text>
                    <Text style={styles.infoValue}>{userData.responsibleStudent.name}</Text>

                    <Text style={styles.infoLabel}>COORDENADOR RESPONSÁVEL</Text>
                    <Text style={styles.infoValue}>{userData.coordinator.name}</Text>
                </View>

                {/* META SEMANAL */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>META SEMANAL</Text>
                    <Text style={styles.infoValue}>{userData.weeklyProgress.percentCompleted}% Concluído</Text>
                </View>

                {/* MENUS DE CONFIGURAÇÃO */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>CONFIGURAÇÕES E SUPORTE</Text>

                    {/* Adicionando os ícones correspondentes aos menus */}
                    {renderMenuItem('Lembretes', 'alarm-outline')}
                    {renderMenuItem('Notificações', 'notifications-outline')}
                    {renderMenuItem('Privacidade e Dados', 'shield-checkmark-outline')}

                    <PrimaryButton
                        title="Sair"
                        onPress={() => console.log('Sair pressionado')}
                        style={styles.logoutButton}
                        textStyle={styles.logoutButtonText}
                    />
                    <Text style={styles.versionText}>V2.4.0</Text>
                </View>
            </ScrollView>
            <BottomNav activeMenu="Perfil" />
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
    },
    header: {
        alignItems: 'center',
        padding: 25,
        paddingTop: 60, // Substituiu o marginTop para a cor preencher até o topo
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.white,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
    },
    userId: {
        fontSize: 14,
        color: colors.inputBackground,
    },
    infoSection: {
        padding: 20,
        backgroundColor: colors.white,
        margin: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
        marginTop: 10,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    menuSection: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBackground,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftIcon: {
        marginRight: 15,
    },
    menuItemText: {
        fontSize: 16,
        color: colors.textPrimary,
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: '#E53935',
        elevation: 0,
        shadowOpacity: 0,
    },
    logoutButtonText: {
        color: '#E53935',
    },
    versionText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: 20,
        fontSize: 12,
    },
    /* ESTILOS DA BARRA DE NAVEGAÇÃO (MOCK) */
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderColor: '#EFEFEF',
        paddingBottom: 25, // Espaço extra para evitar o risco inferior do iPhone (SafeArea)
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    navItemActive: {
        backgroundColor: '#E8F5E9', // Fundo verdinho claro para o item ativo (baseado na sua imagem)
        borderRadius: 20,
    },
    navText: {
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 4,
        fontWeight: 'bold',
    },
    navTextActive: {
        fontSize: 10,
        color: colors.primaryDark,
        marginTop: 4,
        fontWeight: 'bold',
    }
});