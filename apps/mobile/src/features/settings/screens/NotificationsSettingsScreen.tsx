import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import {
  Card,
  CustomSwitch,
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '@fleet/ui-mobile';

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
        <ActivityIndicator size="large" color={colors.accent.DEFAULT} />
        <Text style={styles.loadingText}>Loading preferences...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notification Channels Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>

          <Card variant="elevated" padding="lg" style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconCircle}>
                  <Ionicons name="phone-portrait" size={20} color={colors.accent.DEFAULT} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive notifications on this device
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={pushEnabled}
                onValueChange={() => handleToggle(setPushEnabled, pushEnabled, 'pushEnabled')}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconCircle}>
                  <Ionicons name="mail" size={20} color={colors.accent.DEFAULT} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive notifications via email
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={emailEnabled}
                onValueChange={() => handleToggle(setEmailEnabled, emailEnabled, 'emailEnabled')}
                disabled={isSaving}
              />
            </View>
          </Card>
        </View>

        {/* Notification Types Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>

          <Card variant="elevated" padding="lg" style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconCircle}>
                  <Ionicons name="car" size={20} color={colors.accent.DEFAULT} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Trip Updates</Text>
                  <Text style={styles.settingDescription}>
                    New trips, changes, and completions
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={tripUpdates}
                onValueChange={() => handleToggle(setTripUpdates, tripUpdates, 'tripUpdates')}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconCircle}>
                  <Ionicons name="alert-circle" size={20} color={colors.accent.DEFAULT} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Alerts & Warnings</Text>
                  <Text style={styles.settingDescription}>
                    Important alerts and safety warnings
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={alerts}
                onValueChange={() => handleToggle(setAlerts, alerts, 'alerts')}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconCircle}>
                  <Ionicons name="chatbubble" size={20} color={colors.accent.DEFAULT} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Messages</Text>
                  <Text style={styles.settingDescription}>
                    Messages from dispatchers
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={messages}
                onValueChange={() => handleToggle(setMessages, messages, 'messages')}
                disabled={isSaving}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconCircle}>
                  <Ionicons name="information-circle" size={20} color={colors.accent.DEFAULT} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>System Updates</Text>
                  <Text style={styles.settingDescription}>
                    App updates and announcements
                  </Text>
                </View>
              </View>
              <CustomSwitch
                value={systemUpdates}
                onValueChange={() => handleToggle(setSystemUpdates, systemUpdates, 'systemUpdates')}
                disabled={isSaving}
              />
            </View>
          </Card>
        </View>

        {isSaving && (
          <View style={styles.savingIndicator}>
            <View style={styles.savingBadge}>
              <ActivityIndicator size="small" color={colors.accent.DEFAULT} />
              <Text style={styles.savingText}>Saving preferences...</Text>
            </View>
          </View>
        )}

        <View style={{ height: spacing['2xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  card: {
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.lg,
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.DEFAULT,
    marginVertical: spacing.lg,
  },
  savingIndicator: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  savingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  savingText: {
    fontSize: typography.fontSize.sm,
    color: colors.accent.DEFAULT,
    fontWeight: typography.fontWeight.medium,
  },
});
