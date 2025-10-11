import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'critical' | 'maintenance';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  requiresAcknowledgment: boolean;
  isAcknowledged: boolean;
}

// Mock data
const MOCK_ALERTS: AlertItem[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Vehicle Maintenance Required',
    message: 'Your vehicle VEH-123 requires immediate maintenance. Oil change is overdue.',
    timestamp: '2025-10-11T08:30:00',
    isRead: false,
    requiresAcknowledgment: true,
    isAcknowledged: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Traffic Delay on Route',
    message: 'Heavy traffic reported on Highway 101. Consider alternate route.',
    timestamp: '2025-10-11T09:15:00',
    isRead: true,
    requiresAcknowledgment: false,
    isAcknowledged: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Schedule Update',
    message: 'Your trip TRP-005 has been rescheduled to 2:00 PM today.',
    timestamp: '2025-10-11T10:00:00',
    isRead: false,
    requiresAcknowledgment: true,
    isAcknowledged: false,
  },
  {
    id: '4',
    type: 'maintenance',
    title: 'Tire Pressure Check',
    message: 'Tire pressure sensor indicates low pressure in front left tire.',
    timestamp: '2025-10-10T16:45:00',
    isRead: true,
    requiresAcknowledgment: false,
    isAcknowledged: false,
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch alerts from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      case 'maintenance':
        return 'build';
      default:
        return 'notifications';
    }
  };

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      case 'maintenance':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert))
    );
  };

  const handleAcknowledge = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    Alert.alert(
      'Acknowledge Alert',
      `Are you sure you want to acknowledge "${alert.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Acknowledge',
          onPress: () => {
            setAlerts((prev) =>
              prev.map((a) =>
                a.id === alertId ? { ...a, isAcknowledged: true, isRead: true } : a
              )
            );
            // TODO: Send acknowledgment to server
            console.log('Alert acknowledged:', alertId);
          },
        },
      ]
    );
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') return !alert.isRead;
    return true;
  });

  const renderAlertItem = ({ item }: { item: AlertItem }) => (
    <TouchableOpacity
      style={[styles.alertCard, !item.isRead && styles.alertCardUnread]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <View style={styles.alertHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getAlertColor(item.type) + '20' }]}>
          <Ionicons name={getAlertIcon(item.type) as any} size={24} color={getAlertColor(item.type)} />
        </View>
        <View style={styles.alertHeaderText}>
          <View style={styles.titleRow}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.alertTimestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>

      <Text style={styles.alertMessage}>{item.message}</Text>

      {item.requiresAcknowledgment && !item.isAcknowledged && (
        <TouchableOpacity
          style={styles.acknowledgeButton}
          onPress={() => handleAcknowledge(item.id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#3b82f6" />
          <Text style={styles.acknowledgeButtonText}>Acknowledge</Text>
        </TouchableOpacity>
      )}

      {item.isAcknowledged && (
        <View style={styles.acknowledgedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text style={styles.acknowledgedText}>Acknowledged</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
          onPress={() => setFilter('unread')}
        >
          <Text
            style={[styles.filterButtonText, filter === 'unread' && styles.filterButtonTextActive]}
          >
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAlerts}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No alerts</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'unread' ? 'All alerts have been read' : 'You have no alerts at this time'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  unreadBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  alertHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertHeaderText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  alertMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  acknowledgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  acknowledgeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  acknowledgedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  acknowledgedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
