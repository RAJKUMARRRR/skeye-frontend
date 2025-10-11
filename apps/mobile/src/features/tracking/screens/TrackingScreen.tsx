import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function TrackingScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [routeCoords, setRouteCoords] = useState<LocationCoords[]>([]);
  const [speed, setSpeed] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    if (isTracking) {
      startTracking();
    } else {
      if (subscription) {
        subscription.remove();
      }
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isTracking]);

  const requestLocationPermission = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const startTracking = async () => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const newCoords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };

          setLocation(newCoords);
          setSpeed(newLocation.coords.speed || 0);

          setRouteCoords((prev) => {
            const updated = [...prev, newCoords];

            // Calculate total distance
            if (updated.length > 1) {
              const lastTwo = updated.slice(-2);
              const segmentDistance = calculateDistance(
                lastTwo[0].latitude,
                lastTwo[0].longitude,
                lastTwo[1].latitude,
                lastTwo[1].longitude
              );
              setDistance((prev) => prev + segmentDistance);
            }

            return updated;
          });
        }
      );
    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const toggleTracking = () => {
    if (!isTracking) {
      setRouteCoords([]);
      setDistance(0);
    }
    setIsTracking(!isTracking);
  };

  const formatSpeed = (speedInMps: number) => {
    const speedInMph = speedInMps * 2.23694;
    return speedInMph.toFixed(1);
  };

  const formatDistance = (distanceInKm: number) => {
    const distanceInMiles = distanceInKm * 0.621371;
    return distanceInMiles.toFixed(2);
  };

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={
              location
                ? {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
                : undefined
            }
            showsUserLocation
            showsMyLocationButton
            followsUserLocation
          >
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeColor="#3b82f6"
                strokeWidth={4}
              />
            )}
          </MapView>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="speedometer-outline" size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{formatSpeed(speed)}</Text>
              <Text style={styles.statLabel}>mph</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="navigate-outline" size={24} color="#10b981" />
              <Text style={styles.statValue}>{formatDistance(distance)}</Text>
              <Text style={styles.statLabel}>miles</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{isTracking ? 'Active' : 'Stopped'}</Text>
              <Text style={styles.statLabel}>status</Text>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[
                styles.trackingButton,
                isTracking ? styles.trackingButtonActive : styles.trackingButtonInactive,
              ]}
              onPress={toggleTracking}
            >
              <Ionicons
                name={isTracking ? 'stop-circle' : 'play-circle'}
                size={32}
                color="#ffffff"
              />
              <Text style={styles.trackingButtonText}>
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Ionicons name="location-outline" size={64} color="#d1d5db" />
          <Text style={styles.loadingText}>Loading location...</Text>
          <Text style={styles.loadingSubtext}>Please enable location permissions</Text>
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
  map: {
    flex: 1,
  },
  statsContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  trackingButtonActive: {
    backgroundColor: '#ef4444',
  },
  trackingButtonInactive: {
    backgroundColor: '#3b82f6',
  },
  trackingButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
