import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Platform, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import TripStackNavigator from './TripStackNavigator';
import TrackingScreen from '../features/tracking/screens/TrackingScreen';
import AlertsScreen from '../features/alerts/screens/AlertsScreen';
import ChecklistsScreen from '../features/checklists/screens/ChecklistsScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import { colors, spacing, borderRadius, shadows } from '@fleet/ui-mobile';

// Tab bar height - use this in screens for contentContainerStyle paddingBottom
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

export type MainTabParamList = {
  Trips: undefined;
  Tracking: undefined;
  Alerts: undefined;
  Checklists: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabBarIconProps {
  focused: boolean;
  route: keyof MainTabParamList;
}

function TabBarIcon({ focused, route }: TabBarIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.15 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [focused, scaleAnim]);

  let iconName: keyof typeof Ionicons.glyphMap;

  switch (route) {
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

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        focused && styles.iconContainerActive,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {focused && (
        <View style={styles.activeBackground}>
          <LinearGradient
            colors={[colors.accent.DEFAULT, colors.accent.dark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
      <Ionicons
        name={iconName}
        size={24}
        color={focused ? '#ffffff' : colors.text.tertiary}
      />
    </Animated.View>
  );
}

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={30} tint="dark" style={styles.tabBarBlur}>
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabButton}
                activeOpacity={0.7}
              >
                <TabBarIcon focused={isFocused} route={route.name} />
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Trips" component={TripStackNavigator} />
      <Tab.Screen name="Tracking" component={TrackingScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Checklists" component={ChecklistsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#000000',
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: '#1f1f1f',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabBarBlur: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 56,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    position: 'relative',
  },
  iconContainerActive: {
    ...shadows.glowSm,
  },
  activeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});
