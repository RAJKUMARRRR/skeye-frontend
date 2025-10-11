import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const GEOFENCING_TASK_NAME = 'geofencing-task';

export interface Geofence {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
  notifyOnEntry?: boolean;
  notifyOnExit?: boolean;
}

export interface GeofenceEvent {
  identifier: string;
  eventType: 'enter' | 'exit';
  latitude: number;
  longitude: number;
  timestamp: number;
}

type GeofenceEventHandler = (event: GeofenceEvent) => void;

let eventHandlers: Set<GeofenceEventHandler> = new Set();

// Define the geofencing task
TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Geofencing error:', error);
    return;
  }

  if (data) {
    const { eventType, region } = data as {
      eventType: Location.GeofencingEventType;
      region: Location.LocationRegion;
    };

    const event: GeofenceEvent = {
      identifier: region.identifier,
      eventType: eventType === Location.GeofencingEventType.Enter ? 'enter' : 'exit',
      latitude: region.latitude,
      longitude: region.longitude,
      timestamp: Date.now(),
    };

    console.log('Geofence event:', event);

    // Notify all event handlers
    eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (err) {
        console.error('Error in geofence event handler:', err);
      }
    });
  }
});

export async function startGeofencing(geofences: Geofence[]): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Location permission denied for geofencing');
      return false;
    }

    const regions: Location.LocationRegion[] = geofences.map(fence => ({
      identifier: fence.identifier,
      latitude: fence.latitude,
      longitude: fence.longitude,
      radius: fence.radius,
      notifyOnEnter: fence.notifyOnEntry ?? true,
      notifyOnExit: fence.notifyOnExit ?? true,
    }));

    await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, regions);

    console.log(`Geofencing started for ${geofences.length} regions`);
    return true;
  } catch (error) {
    console.error('Error starting geofencing:', error);
    return false;
  }
}

export async function stopGeofencing(): Promise<void> {
  try {
    const isGeofencing = await Location.hasStartedGeofencingAsync(GEOFENCING_TASK_NAME);

    if (isGeofencing) {
      await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
      console.log('Geofencing stopped');
    }
  } catch (error) {
    console.error('Error stopping geofencing:', error);
  }
}

export async function addGeofence(geofence: Geofence): Promise<boolean> {
  try {
    // Get current geofences
    const isGeofencing = await Location.hasStartedGeofencingAsync(GEOFENCING_TASK_NAME);

    if (!isGeofencing) {
      // Start with just this geofence
      return await startGeofencing([geofence]);
    }

    // TODO: To add to existing geofences, we need to get current regions,
    // add the new one, and restart geofencing
    // For now, just log
    console.log('Adding geofence to existing set not yet implemented');
    return false;
  } catch (error) {
    console.error('Error adding geofence:', error);
    return false;
  }
}

export async function removeGeofence(identifier: string): Promise<void> {
  try {
    // TODO: To remove a specific geofence, we need to get current regions,
    // remove the specified one, and restart geofencing
    // For now, just log
    console.log(`Removing geofence ${identifier} not yet implemented`);
  } catch (error) {
    console.error('Error removing geofence:', error);
  }
}

export function subscribeToGeofenceEvents(handler: GeofenceEventHandler): () => void {
  eventHandlers.add(handler);

  // Return unsubscribe function
  return () => {
    eventHandlers.delete(handler);
  };
}

export async function isGeofencingActive(): Promise<boolean> {
  try {
    return await Location.hasStartedGeofencingAsync(GEOFENCING_TASK_NAME);
  } catch (error) {
    console.error('Error checking geofencing status:', error);
    return false;
  }
}

// Calculate distance between two coordinates (in meters)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
