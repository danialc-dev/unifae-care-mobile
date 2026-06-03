import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

import RelatosScreen from './src/view/screens/RelatosScreen';
import ProgressoScreen from './src/view/screens/ProgressoScreen';
import NotificacoesScreen from './src/view/screens/NotificacoesScreen'; // Nova tela de notificações

// Mocks provisórios apenas para as abas que ainda não fizemos
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
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Transição suave entre telas
          }}
        >
        {/* FLUXO AUTH */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaEmailScreen} />
        <Stack.Screen name="VerificarCodigo" component={VerificarCodigoScreen} />
        <Stack.Screen name="NovaSenha" component={NovaSenhaScreen} />
        <Stack.Screen name="TermosDeUso" component={TermosDeUsoScreen} />

        {/* FLUXO PRINCIPAL (Telas Reais) */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Exercicios" component={ExerciciosScreen} />
        <Stack.Screen name="ExercicioDetalhe" component={ExercicioScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />

        <Stack.Screen name="Perfil" component={PerfilScreen} />

        {/* TELAS REAIS DE ABA */}
        <Stack.Screen name="Relatos" component={RelatosScreen} />
        <Stack.Screen name="Progresso" component={ProgressoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  mock: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});