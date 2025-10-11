import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TripStackNavigator from './TripStackNavigator';
import TrackingScreen from '../features/tracking/screens/TrackingScreen';
import AlertsScreen from '../features/alerts/screens/AlertsScreen';
import ChecklistsScreen from '../features/checklists/screens/ChecklistsScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

export type MainTabParamList = {
  Trips: undefined;
  Tracking: undefined;
  Alerts: undefined;
  Checklists: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Trips':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Tracking':
              iconName = focused ? 'navigate' : 'navigate-outline';
              break;
            case 'Alerts':
              iconName = focused ? 'alert-circle' : 'alert-circle-outline';
              break;
            case 'Checklists':
              iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Trips" component={TripStackNavigator} />
      <Tab.Screen name="Tracking" component={TrackingScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Checklists" component={ChecklistsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
