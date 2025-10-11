import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import * as NetInfo from '@react-native-community/netinfo';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'syncing'>('synced');
  const [offlineMode, setOfflineMode] = useState(false);

  // Mock driver stats
  const stats = {
    tripsCompleted: 248,
    totalMiles: 12450,
    onTimeDeliveries: 96,
    safetyScore: 4.8,
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    // TODO: Implement actual sync logic
    setTimeout(() => {
      setSyncStatus('synced');
      Alert.alert('Success', 'Data synced successfully');
    }, 2000);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'syncing':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced':
        return 'All data synced';
      case 'pending':
        return 'Pending sync';
      case 'syncing':
        return 'Syncing...';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.driverName}>{user?.name || 'Driver Name'}</Text>
          <Text style={styles.driverEmail}>{user?.email || 'driver@example.com'}</Text>
          <View style={styles.driverId}>
            <Ionicons name="card-outline" size={16} color="#6b7280" />
            <Text style={styles.driverIdText}>ID: DRV-{user?.id || '001'}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="car-sport" size={32} color="#3b82f6" />
              <Text style={styles.statValue}>{stats.tripsCompleted}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="speedometer" size={32} color="#10b981" />
              <Text style={styles.statValue}>{stats.totalMiles.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Miles</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={32} color="#f59e0b" />
              <Text style={styles.statValue}>{stats.onTimeDeliveries}%</Text>
              <Text style={styles.statLabel}>On Time</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="shield-checkmark" size={32} color="#6366f1" />
              <Text style={styles.statValue}>{stats.safetyScore}</Text>
              <Text style={styles.statLabel}>Safety</Text>
            </View>
          </View>
        </View>

        {/* Sync Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync & Offline</Text>
          <View style={styles.card}>
            <View style={styles.syncRow}>
              <View style={styles.syncInfo}>
                <View style={styles.syncHeader}>
                  <Ionicons
                    name={syncStatus === 'synced' ? 'checkmark-circle' : syncStatus === 'syncing' ? 'sync' : 'cloud-upload'}
                    size={24}
                    color={getSyncStatusColor()}
                  />
                  <Text style={styles.syncText}>{getSyncStatusText()}</Text>
                </View>
                <Text style={styles.syncSubtext}>
                  {syncStatus === 'pending' ? '3 items pending upload' : 'Last synced: Just now'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.syncButton}
                onPress={handleSync}
                disabled={syncStatus === 'syncing'}
              >
                <Ionicons name="refresh" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.offlineRow}>
              <View style={styles.offlineInfo}>
                <View style={styles.offlineHeader}>
                  <Ionicons
                    name={offlineMode ? 'cloud-offline' : 'wifi'}
                    size={24}
                    color={offlineMode ? '#6b7280' : '#10b981'}
                  />
                  <Text style={styles.offlineText}>
                    {offlineMode ? 'Offline Mode' : 'Online Mode'}
                  </Text>
                </View>
                <Text style={styles.offlineSubtext}>
                  {offlineMode
                    ? 'Data will sync when online'
                    : 'Real-time sync enabled'}
                </Text>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={offlineMode ? '#3b82f6' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation.navigate('NotificationsSettings')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={24} color="#6b7280" />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation.navigate('LocationSettings')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="location-outline" size={24} color="#6b7280" />
                <Text style={styles.settingText}>Location Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation.navigate('LanguageSettings')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="language-outline" size={24} color="#6b7280" />
                <Text style={styles.settingText}>Language</Text>
              </View>
              <View style={styles.settingValue}>
                <Text style={styles.settingValueText}>English</Text>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation.navigate('HelpSupport')}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  driverEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  driverId: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  driverIdText: {
    fontSize: 12,
    fontWeight: '600',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncInfo: {
    flex: 1,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  syncText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  syncSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 36,
  },
  syncButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  offlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlineInfo: {
    flex: 1,
  },
  offlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  offlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  offlineSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 36,
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
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueText: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
