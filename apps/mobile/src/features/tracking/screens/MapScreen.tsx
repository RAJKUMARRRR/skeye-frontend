import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Screen } from '../../../components/layouts/Screen';
import { Header } from '../../../components/layouts/Header';
import { getCurrentLocation } from '../../../lib/location/backgroundLocation';

interface Stop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  order: number;
  status: 'pending' | 'completed';
}

const MOCK_ROUTE_STOPS: Stop[] = [
  {
    id: '1',
    name: 'Warehouse A',
    address: '123 Main St',
    latitude: 41.8781,
    longitude: -87.6298,
    order: 1,
    status: 'completed',
  },
  {
    id: '2',
    name: 'Customer Location B',
    address: '456 Oak Ave',
    latitude: 41.8850,
    longitude: -87.6200,
    order: 2,
    status: 'pending',
  },
  {
    id: '3',
    name: 'Distribution Center C',
    address: '789 Pine Rd',
    latitude: 41.8920,
    longitude: -87.6100,
    order: 3,
    status: 'pending',
  },
];

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [stops] = useState<Stop[]>(MOCK_ROUTE_STOPS);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } else {
      // Default to Chicago if location unavailable
      setCurrentLocation({
        latitude: 41.8781,
        longitude: -87.6298,
      });
    }
  };

  const getRegion = () => {
    if (!currentLocation) {
      return {
        latitude: 41.8781,
        longitude: -87.6298,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    // Calculate region that includes all stops
    const latitudes = stops.map(stop => stop.latitude);
    const longitudes = stops.map(stop => stop.longitude);

    const minLat = Math.min(...latitudes, currentLocation.latitude);
    const maxLat = Math.max(...latitudes, currentLocation.latitude);
    const minLng = Math.min(...longitudes, currentLocation.longitude);
    const maxLng = Math.max(...longitudes, currentLocation.longitude);

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    const deltaLat = (maxLat - minLat) * 1.5;
    const deltaLng = (maxLng - minLng) * 1.5;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(deltaLat, 0.02),
      longitudeDelta: Math.max(deltaLng, 0.02),
    };
  };

  const routeCoordinates = stops.map(stop => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  return (
    <Screen safeArea={false}>
      <Header title="Route Map" showBack />

      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={getRegion()}
          showsUserLocation
          showsMyLocationButton
          showsTraffic
        >
          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Your Location"
              pinColor="#14b8a6"
            />
          )}

          {/* Stop Markers */}
          {stops.map((stop) => (
            <Marker
              key={stop.id}
              coordinate={{
                latitude: stop.latitude,
                longitude: stop.longitude,
              }}
              title={stop.name}
              description={stop.address}
              pinColor={stop.status === 'completed' ? '#10b981' : '#ef4444'}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.marker,
                    stop.status === 'completed'
                      ? styles.markerCompleted
                      : styles.markerPending,
                  ]}
                >
                  <View style={styles.markerInner} />
                </View>
                <View style={styles.markerOrder}>
                  <View style={styles.markerOrderText}>
                    {stop.order}
                  </View>
                </View>
              </View>
            </Marker>
          ))}

          {/* Route Polyline */}
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#14b8a6"
              strokeWidth={3}
              lineDashPattern={[1, 10]}
            />
          )}
        </MapView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  markerCompleted: {
    backgroundColor: '#10b981',
  },
  markerPending: {
    backgroundColor: '#ef4444',
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  markerOrder: {
    marginTop: 4,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markerOrderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
