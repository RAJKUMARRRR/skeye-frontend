import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { runInsert } from '../db/init';
import { syncQueue } from '../sync/SyncQueue';

const LOCATION_TASK_NAME = 'background-location-task';

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
  timestamp: number;
}

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const activeTripId = await getActiveTripId();

    if (!activeTripId) {
      console.log('No active trip, skipping location save');
      return;
    }

    for (const location of locations) {
      try {
        await saveLocationToDatabase(activeTripId, location);
      } catch (err) {
        console.error('Error saving location:', err);
      }
    }
  }
});

async function saveLocationToDatabase(
  tripId: string,
  location: Location.LocationObject
): Promise<void> {
  const id = `${tripId}_${location.timestamp}`;
  const { latitude, longitude, altitude, speed, heading, accuracy } = location.coords;
  const timestamp = location.timestamp;

  await runInsert(
    `INSERT OR REPLACE INTO trip_locations
     (id, trip_id, latitude, longitude, altitude, speed, heading, accuracy, timestamp, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, tripId, latitude, longitude, altitude, speed, heading, accuracy, timestamp, 0]
  );

  // Add to sync queue
  await syncQueue.addToQueue('trip_location', id, 'create', {
    trip_id: tripId,
    latitude,
    longitude,
    altitude,
    speed,
    heading,
    accuracy,
    timestamp,
  });

  console.log(`Location saved for trip ${tripId}:`, { latitude, longitude });
}

async function getActiveTripId(): Promise<string | null> {
  // TODO: Implement getting active trip ID from database or app state
  // For now, return null
  return null;
}

export async function requestLocationPermissions(): Promise<boolean> {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== 'granted') {
      console.log('Foreground location permission denied');
      return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== 'granted') {
      console.log('Background location permission denied');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
}

export async function startBackgroundLocationTracking(): Promise<boolean> {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      return false;
    }

    const isTaskDefined = await TaskManager.isTaskDefinedAsync(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.error('Background location task not defined');
      return false;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000, // Update every 5 seconds
      distanceInterval: 10, // Or every 10 meters
      foregroundService: {
        notificationTitle: 'Trip Tracking Active',
        notificationBody: 'Fleet Driver is tracking your trip location',
        notificationColor: '#3b82f6',
      },
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
    });

    console.log('Background location tracking started');
    return true;
  } catch (error) {
    console.error('Error starting background location tracking:', error);
    return false;
  }
}

export async function stopBackgroundLocationTracking(): Promise<void> {
  try {
    const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('Background location tracking stopped');
    }
  } catch (error) {
    console.error('Error stopping background location tracking:', error);
  }
}

export async function getCurrentLocation(): Promise<LocationUpdate | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude,
      speed: location.coords.speed,
      heading: location.coords.heading,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
}

export async function isLocationTrackingActive(): Promise<boolean> {
  try {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  } catch (error) {
    console.error('Error checking location tracking status:', error);
    return false;
  }
}
