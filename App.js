// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/view/screens/LoginScreen';
import RecuperarSenhaEmailScreen from './src/view/screens/RecuperarSenhaScreen';
import VerificarCodigoScreen from './src/view/screens/VerificarCodigoScreen';
import NovaSenhaScreen from './src/view/screens/NovaSenhaScreen';
import PerfilScreen from './src/view/screens/PerfilScreen';
import HomeScreen from './src/view/screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperarSenha"
          component={RecuperarSenhaEmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerificarCodigo"
          component={VerificarCodigoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NovaSenha"
          component={NovaSenhaScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}