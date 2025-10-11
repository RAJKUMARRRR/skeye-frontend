import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../features/auth/screens/LoginScreen';
import SignaturePadScreen from '../features/checklists/screens/SignaturePadScreen';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  SignaturePad: {
    onSignatureCapture: (signature: string) => void;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={{
        prefixes: ['fleet-driver://'],
        config: {
          screens: {
            Login: 'login',
            Main: {
              screens: {
                Trips: 'trips',
                Tracking: 'tracking',
                Alerts: 'alerts',
                Checklists: 'checklists',
                Profile: 'profile',
              },
            },
          },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="SignaturePad"
              component={SignaturePadScreen}
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
