import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TripHistoryScreen from '../features/trips/screens/TripHistoryScreen';
import TripTrackingScreen from '../features/trips/screens/TripTrackingScreen';
import TripDetailsScreen from '../features/trips/screens/TripDetailsScreen';

export type TripStackParamList = {
  TripHistory: undefined;
  TripTracking: undefined;
  TripDetails: { tripId: string };
};

const Stack = createNativeStackNavigator<TripStackParamList>();

export default function TripStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TripHistory"
        component={TripHistoryScreen}
        options={{ title: 'Trip History' }}
      />
      <Stack.Screen
        name="TripTracking"
        component={TripTrackingScreen}
        options={{ title: 'Trip Tracking' }}
      />
      <Stack.Screen
        name="TripDetails"
        component={TripDetailsScreen}
        options={{ title: 'Trip Details' }}
      />
    </Stack.Navigator>
  );
}
