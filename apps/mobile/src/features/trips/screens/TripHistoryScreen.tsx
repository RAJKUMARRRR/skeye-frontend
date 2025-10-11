import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TripStackParamList } from '../../../navigation/TripStackNavigator';

type NavigationProp = NativeStackNavigationProp<TripStackParamList>;

interface Trip {
  id: string;
  tripNumber: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  origin: string;
  destination: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  distance?: string;
}

// Mock data - replace with actual data from API/SQLite
const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    tripNumber: 'TRP-001',
    status: 'scheduled',
    origin: 'Warehouse A, 123 Main St',
    destination: 'Customer Site B, 456 Oak Ave',
    scheduledStartTime: '2025-10-11T09:00:00',
    scheduledEndTime: '2025-10-11T11:00:00',
    distance: '25 mi',
  },
  {
    id: '2',
    tripNumber: 'TRP-002',
    status: 'in_progress',
    origin: 'Depot C, 789 Elm St',
    destination: 'Distribution Center D, 321 Pine Rd',
    scheduledStartTime: '2025-10-11T08:00:00',
    scheduledEndTime: '2025-10-11T10:30:00',
    distance: '18 mi',
  },
  {
    id: '3',
    tripNumber: 'TRP-003',
    status: 'completed',
    origin: 'Warehouse E, 555 Maple Dr',
    destination: 'Customer F, 888 Cedar Ln',
    scheduledStartTime: '2025-10-10T14:00:00',
    scheduledEndTime: '2025-10-10T16:00:00',
    distance: '32 mi',
  },
];

export default function TripHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch trips from API or SQLite
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'scheduled':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: Trip['status']) => {
    switch (status) {
      case 'scheduled':
        return 'calendar-outline';
      case 'in_progress':
        return 'navigate-circle-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
    >
      <View style={styles.tripHeader}>
        <View style={styles.tripNumberContainer}>
          <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
          <Text style={styles.tripNumber}>{item.tripNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons name={getStatusIcon(item.status) as any} size={16} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#10b981" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>From</Text>
            <Text style={styles.locationText}>{item.origin}</Text>
          </View>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.locationRow}>
          <Ionicons name="flag-outline" size={20} color="#ef4444" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>To</Text>
            <Text style={styles.locationText}>{item.destination}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tripFooter}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.timeText}>
            {formatDate(item.scheduledStartTime)} - {formatDate(item.scheduledEndTime)}
          </Text>
        </View>
        {item.distance && (
          <View style={styles.distanceContainer}>
            <Ionicons name="speedometer-outline" size={16} color="#6b7280" />
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No trips assigned</Text>
            <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
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
  listContainer: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#1f2937',
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#d1d5db',
    marginLeft: 9,
    marginVertical: 4,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#6b7280',
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
  },
});
