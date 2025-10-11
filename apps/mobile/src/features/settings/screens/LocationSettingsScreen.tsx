import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function LocationSettingsScreen() {
  const [foregroundPermission, setForegroundPermission] = useState<string>('unknown');
  const [backgroundPermission, setBackgroundPermission] = useState<string>('unknown');
  const [accuracy, setAccuracy] = useState<'high' | 'balanced' | 'low'>('high');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status: foreground } = await Location.getForegroundPermissionsAsync();
    setForegroundPermission(foreground);

    const { status: background } = await Location.getBackgroundPermissionsAsync();
    setBackgroundPermission(background);
  };

  const requestForegroundPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setForegroundPermission(status);
    if (status === 'granted') {
      Alert.alert('Success', 'Foreground location permission granted');
    } else {
      Alert.alert('Permission Denied', 'Location permission is required for tracking trips');
    }
  };

  const requestBackgroundPermission = async () => {
    if (foregroundPermission !== 'granted') {
      Alert.alert('Required', 'Please grant foreground permission first');
      return;
    }

    const { status } = await Location.requestBackgroundPermissionsAsync();
    setBackgroundPermission(status);
    if (status === 'granted') {
      Alert.alert('Success', 'Background location permission granted');
    } else {
      Alert.alert('Permission Denied', 'Background location is required for trip tracking');
    }
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const getPermissionStatus = (status: string) => {
    switch (status) {
      case 'granted':
        return { text: 'Granted', color: '#10b981', icon: 'checkmark-circle' };
      case 'denied':
        return { text: 'Denied', color: '#ef4444', icon: 'close-circle' };
      default:
        return { text: 'Not Set', color: '#6b7280', icon: 'help-circle' };
    }
  };

  const foregroundStatus = getPermissionStatus(foregroundPermission);
  const backgroundStatus = getPermissionStatus(backgroundPermission);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Permissions</Text>
          <View style={styles.card}>
            <View style={styles.permissionRow}>
              <View style={styles.permissionInfo}>
                <Ionicons name="navigate-outline" size={24} color="#6b7280" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Foreground Location</Text>
                  <Text style={styles.permissionDescription}>
                    Required for trip tracking when app is open
                  </Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <Ionicons name={foregroundStatus.icon as any} size={20} color={foregroundStatus.color} />
                <Text style={[styles.statusText, { color: foregroundStatus.color }]}>
                  {foregroundStatus.text}
                </Text>
              </View>
            </View>
            {foregroundPermission !== 'granted' && (
              <TouchableOpacity style={styles.actionButton} onPress={requestForegroundPermission}>
                <Text style={styles.actionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider} />

            <View style={styles.permissionRow}>
              <View style={styles.permissionInfo}>
                <Ionicons name="location-outline" size={24} color="#6b7280" />
                <View style={styles.permissionText}>
                  <Text style={styles.permissionLabel}>Background Location</Text>
                  <Text style={styles.permissionDescription}>
                    Required for tracking trips in the background
                  </Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <Ionicons name={backgroundStatus.icon as any} size={20} color={backgroundStatus.color} />
                <Text style={[styles.statusText, { color: backgroundStatus.color }]}>
                  {backgroundStatus.text}
                </Text>
              </View>
            </View>
            {backgroundPermission !== 'granted' && (
              <TouchableOpacity style={styles.actionButton} onPress={requestBackgroundPermission}>
                <Text style={styles.actionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Accuracy</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.accuracyRow}
              onPress={() => setAccuracy('high')}
            >
              <View style={styles.accuracyInfo}>
                <Ionicons name="speedometer" size={24} color={accuracy === 'high' ? '#3b82f6' : '#6b7280'} />
                <View style={styles.accuracyText}>
                  <Text style={[styles.accuracyLabel, accuracy === 'high' && styles.accuracyLabelActive]}>
                    High Accuracy
                  </Text>
                  <Text style={styles.accuracyDescription}>Best for tracking, uses more battery</Text>
                </View>
              </View>
              {accuracy === 'high' && (
                <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.accuracyRow}
              onPress={() => setAccuracy('balanced')}
            >
              <View style={styles.accuracyInfo}>
                <Ionicons name="speedometer-outline" size={24} color={accuracy === 'balanced' ? '#3b82f6' : '#6b7280'} />
                <View style={styles.accuracyText}>
                  <Text style={[styles.accuracyLabel, accuracy === 'balanced' && styles.accuracyLabelActive]}>
                    Balanced
                  </Text>
                  <Text style={styles.accuracyDescription}>Good accuracy, moderate battery use</Text>
                </View>
              </View>
              {accuracy === 'balanced' && (
                <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.accuracyRow}
              onPress={() => setAccuracy('low')}
            >
              <View style={styles.accuracyInfo}>
                <Ionicons name="battery-charging-outline" size={24} color={accuracy === 'low' ? '#3b82f6' : '#6b7280'} />
                <View style={styles.accuracyText}>
                  <Text style={[styles.accuracyLabel, accuracy === 'low' && styles.accuracyLabelActive]}>
                    Battery Saver
                  </Text>
                  <Text style={styles.accuracyDescription}>Lower accuracy, saves battery</Text>
                </View>
              </View>
              {accuracy === 'low' && (
                <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.settingsButton} onPress={openAppSettings}>
            <Ionicons name="settings-outline" size={20} color="#3b82f6" />
            <Text style={styles.settingsButtonText}>Open Device Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionRow: {
    marginBottom: 12,
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  permissionText: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  accuracyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accuracyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  accuracyText: {
    flex: 1,
  },
  accuracyLabel: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 2,
  },
  accuracyLabelActive: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  accuracyDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  settingsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
