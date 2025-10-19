import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

export default function NotificationsSettingsScreen() {
  const { user, isLoaded } = useUser();

  // Notification states - will be loaded from Clerk metadata
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [tripUpdates, setTripUpdates] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [messages, setMessages] = useState(false);
  const [systemUpdates, setSystemUpdates] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const savePreferences = async (preferences: any) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notificationPreferences: preferences,
        },
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  // Load preferences from Clerk metadata on mount and when user data changes
  useEffect(() => {
    if (user && !isInitialized) {
      const metadata = user.unsafeMetadata?.notificationPreferences as any;

      // If metadata exists, use it. Otherwise, use defaults for new users
      if (metadata) {
        setPushEnabled(metadata.pushEnabled ?? false);
        setEmailEnabled(metadata.emailEnabled ?? false);
        setTripUpdates(metadata.tripUpdates ?? false);
        setAlerts(metadata.alerts ?? false);
        setMessages(metadata.messages ?? false);
        setSystemUpdates(metadata.systemUpdates ?? false);
      } else {
        // First time user - set sensible defaults for mobile drivers
        setPushEnabled(true);
        setEmailEnabled(false);
        setTripUpdates(true);
        setAlerts(true);
        setMessages(true);
        setSystemUpdates(false);

        // Save these defaults to metadata
        savePreferences({
          pushEnabled: true,
          emailEnabled: false,
          tripUpdates: true,
          alerts: true,
          messages: true,
          systemUpdates: false,
        });
      }

      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized]);

  const handleToggle = async (
    setter: (value: boolean) => void,
    currentValue: boolean,
    key: string
  ) => {
    const newValue = !currentValue;
    setter(newValue);

    // Save to Clerk metadata
    const newPreferences = {
      pushEnabled,
      emailEnabled,
      tripUpdates,
      alerts,
      messages,
      systemUpdates,
      [key]: newValue,
    };

    await savePreferences(newPreferences);
  };

  // Show loading state while user data is loading
  if (!isLoaded || !user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="phone-portrait-outline" size={24} color="#6b7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive notifications on this device</Text>
                </View>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={() => handleToggle(setPushEnabled, pushEnabled, 'pushEnabled')}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={pushEnabled ? '#3b82f6' : '#f3f4f6'}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="mail-outline" size={24} color="#6b7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>Receive notifications via email</Text>
                </View>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={() => handleToggle(setEmailEnabled, emailEnabled, 'emailEnabled')}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={emailEnabled ? '#3b82f6' : '#f3f4f6'}
                disabled={isSaving}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="car-outline" size={24} color="#6b7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Trip Updates</Text>
                  <Text style={styles.settingDescription}>New trips, changes, and completions</Text>
                </View>
              </View>
              <Switch
                value={tripUpdates}
                onValueChange={() => handleToggle(setTripUpdates, tripUpdates, 'tripUpdates')}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={tripUpdates ? '#3b82f6' : '#f3f4f6'}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="alert-circle-outline" size={24} color="#6b7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Alerts & Warnings</Text>
                  <Text style={styles.settingDescription}>Important alerts and safety warnings</Text>
                </View>
              </View>
              <Switch
                value={alerts}
                onValueChange={() => handleToggle(setAlerts, alerts, 'alerts')}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={alerts ? '#3b82f6' : '#f3f4f6'}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="chatbubble-outline" size={24} color="#6b7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Messages</Text>
                  <Text style={styles.settingDescription}>Messages from dispatchers</Text>
                </View>
              </View>
              <Switch
                value={messages}
                onValueChange={() => handleToggle(setMessages, messages, 'messages')}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={messages ? '#3b82f6' : '#f3f4f6'}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>System Updates</Text>
                  <Text style={styles.settingDescription}>App updates and announcements</Text>
                </View>
              </View>
              <Switch
                value={systemUpdates}
                onValueChange={() => handleToggle(setSystemUpdates, systemUpdates, 'systemUpdates')}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={systemUpdates ? '#3b82f6' : '#f3f4f6'}
                disabled={isSaving}
              />
            </View>
          </View>
        </View>

        {isSaving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.savingText}>Saving preferences...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  savingText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
