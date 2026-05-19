import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { storageService } from './src/services/storageService';
import { colors } from './src/theme/colors';

// Importação das Telas Reais de Autenticação
import LoginScreen from './src/view/screens/LoginScreen';
import RecuperarSenhaEmailScreen from './src/view/screens/RecuperarSenhaScreen';
import VerificarCodigoScreen from './src/view/screens/VerificarCodigoScreen';
import NovaSenhaScreen from './src/view/screens/NovaSenhaScreen';
import PerfilScreen from './src/view/screens/PerfilScreen';

// Importação das Telas Reais do Fluxo Principal
import HomeScreen from './src/view/screens/HomeScreen';
import ExerciciosScreen from './src/view/screens/ExerciciosScreen'; // Tela da Lista (Aba)
import ExercicioScreen from './src/view/screens/ExercicioScreen'; // Tela do Detalhe (Vídeo)
import FeedbackScreen from './src/view/screens/FeedbackScreen'; // Tela da Escala de Borg

// Mocks provisórios apenas para as abas que ainda não fizemos
function RelatosScreen() { return (<SafeAreaView style={styles.mock}><Text>Relatos em breve</Text></SafeAreaView>); }
function ProgressoScreen() { return (<SafeAreaView style={styles.mock}><Text>Progresso em breve</Text></SafeAreaView>); }
function TermosDeUsoScreen() { return (<SafeAreaView style={styles.mock}><Text>Termos LGPD</Text></SafeAreaView>); }

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkUserSession = async () => {
      try {

        const token = await storageService.getToken();
        if (token) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        setInitialRoute('Login');
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        {/* FLUXO AUTH */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerificarCodigo" component={VerificarCodigoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NovaSenha" component={NovaSenhaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TermosDeUso" component={TermosDeUsoScreen} options={{ headerShown: false }} />

        {/* FLUXO PRINCIPAL (Telas Reais) */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Exercicios" component={ExerciciosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ExercicioDetalhe" component={ExercicioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />

        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: false }} />

        {/* MOCKS RESTANTES */}
        <Stack.Screen name="Relatos" component={RelatosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Progresso" component={ProgressoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  mock: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});