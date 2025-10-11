import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { TripStackParamList } from '../../../navigation/TripStackNavigator';

type TripDetailsRouteProp = RouteProp<TripStackParamList, 'TripDetails'>;

interface TripDetails {
  id: string;
  tripNumber: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  origin: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  distance: string;
  vehicle: {
    number: string;
    type: string;
  };
  cargo?: string;
  notes?: string;
}

// Mock data - replace with actual data from API/SQLite
const MOCK_TRIP: TripDetails = {
  id: '1',
  tripNumber: 'TRP-001',
  status: 'scheduled',
  origin: {
    name: 'Warehouse A',
    address: '123 Main St, Los Angeles, CA 90001',
    coordinates: { lat: 34.0522, lng: -118.2437 },
  },
  destination: {
    name: 'Customer Site B',
    address: '456 Oak Ave, Santa Monica, CA 90401',
    coordinates: { lat: 34.0195, lng: -118.4912 },
  },
  scheduledStartTime: '2025-10-11T09:00:00',
  scheduledEndTime: '2025-10-11T11:00:00',
  distance: '25 mi',
  vehicle: {
    number: 'VEH-123',
    type: 'Box Truck',
  },
  cargo: 'Electronics - 15 pallets',
  notes: 'Contact warehouse manager upon arrival. Loading dock #3.',
};

export default function TripDetailsScreen() {
  const route = useRoute<TripDetailsRouteProp>();
  const navigation = useNavigation();
  const { tripId } = route.params;

  // TODO: Fetch trip details from API/SQLite using tripId
  const trip = MOCK_TRIP;

  const getStatusColor = (status: TripDetails['status']) => {
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleStartTrip = () => {
    // TODO: Implement start trip logic
    console.log('Starting trip:', tripId);
  };

  const handleCompleteTrip = () => {
    // TODO: Implement complete trip logic
    console.log('Completing trip:', tripId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.tripHeader}>
            <View>
              <Text style={styles.tripNumber}>{trip.tripNumber}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
                  {trip.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationItem}>
              <Ionicons name="location" size={24} color="#10b981" />
              <View style={styles.locationDetails}>
                <Text style={styles.locationName}>{trip.origin.name}</Text>
                <Text style={styles.locationAddress}>{trip.origin.address}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.locationItem}>
              <Ionicons name="flag" size={24} color="#ef4444" />
              <View style={styles.locationDetails}>
                <Text style={styles.locationName}>{trip.destination.name}</Text>
                <Text style={styles.locationAddress}>{trip.destination.address}</Text>
              </View>
            </View>
          </View>
          <View style={styles.distanceRow}>
            <Ionicons name="speedometer-outline" size={20} color="#6b7280" />
            <Text style={styles.distanceText}>Estimated distance: {trip.distance}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text style={styles.infoLabelText}>Scheduled Start</Text>
              </View>
              <Text style={styles.infoValue}>{formatDateTime(trip.scheduledStartTime)}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text style={styles.infoLabelText}>Scheduled End</Text>
              </View>
              <Text style={styles.infoValue}>{formatDateTime(trip.scheduledEndTime)}</Text>
            </View>
            {trip.actualStartTime && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
                  <Text style={styles.infoLabelText}>Actual Start</Text>
                </View>
                <Text style={styles.infoValue}>{formatDateTime(trip.actualStartTime)}</Text>
              </View>
            )}
            {trip.actualEndTime && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
                  <Text style={styles.infoLabelText}>Actual End</Text>
                </View>
                <Text style={styles.infoValue}>{formatDateTime(trip.actualEndTime)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle & Cargo</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="car-outline" size={20} color="#6b7280" />
                <Text style={styles.infoLabelText}>Vehicle</Text>
              </View>
              <Text style={styles.infoValue}>{trip.vehicle.number} ({trip.vehicle.type})</Text>
            </View>
            {trip.cargo && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="cube-outline" size={20} color="#6b7280" />
                  <Text style={styles.infoLabelText}>Cargo</Text>
                </View>
                <Text style={styles.infoValue}>{trip.cargo}</Text>
              </View>
            )}
          </View>
        </View>

        {trip.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{trip.notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {trip.status === 'scheduled' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartTrip}>
            <Ionicons name="play-circle" size={24} color="#ffffff" />
            <Text style={styles.startButtonText}>Start Trip</Text>
          </TouchableOpacity>
        </View>
      )}

      {trip.status === 'in_progress' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteTrip}>
            <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
            <Text style={styles.completeButtonText}>Complete Trip</Text>
          </TouchableOpacity>
        </View>
      )}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    gap: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#d1d5db',
    marginLeft: 11,
    marginVertical: 8,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'right',
  },
  notesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
