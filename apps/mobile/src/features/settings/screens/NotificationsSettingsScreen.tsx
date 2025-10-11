import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [tripUpdates, setTripUpdates] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [messages, setMessages] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

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
                onValueChange={setPushEnabled}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={pushEnabled ? '#3b82f6' : '#f3f4f6'}
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
                onValueChange={setEmailEnabled}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={emailEnabled ? '#3b82f6' : '#f3f4f6'}
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
                onValueChange={setTripUpdates}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={tripUpdates ? '#3b82f6' : '#f3f4f6'}
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
                onValueChange={setAlerts}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={alerts ? '#3b82f6' : '#f3f4f6'}
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
                onValueChange={setMessages}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={messages ? '#3b82f6' : '#f3f4f6'}
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
                onValueChange={setSystemUpdates}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={systemUpdates ? '#3b82f6' : '#f3f4f6'}
              />
            </View>
          </View>
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
});
