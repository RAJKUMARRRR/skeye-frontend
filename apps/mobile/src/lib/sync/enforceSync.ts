import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const LAST_SYNC_KEY = '@last_sync_timestamp';
const MAX_OFFLINE_HOURS = 48;
const WARNING_HOURS = 36;

export async function getLastSyncTime(): Promise<number | null> {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return null;
  }
}

export async function updateLastSyncTime(): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error updating last sync time:', error);
  }
}

export async function getHoursSinceLastSync(): Promise<number> {
  const lastSync = await getLastSyncTime();
  if (!lastSync) return Infinity;

  const now = Date.now();
  const diffMs = now - lastSync;
  return diffMs / (1000 * 60 * 60);
}

export async function checkSyncEnforcement(): Promise<{
  allowed: boolean;
  hoursOffline: number;
  warning?: string;
  error?: string;
}> {
  const hoursOffline = await getHoursSinceLastSync();

  // Check if we're online
  const networkState = await NetInfo.fetch();
  const isOnline = networkState.isConnected;

  if (hoursOffline >= MAX_OFFLINE_HOURS && !isOnline) {
    return {
      allowed: false,
      hoursOffline,
      error: `You have been offline for ${Math.floor(hoursOffline)} hours. Please connect to the internet to sync your data before continuing.`,
    };
  }

  if (hoursOffline >= WARNING_HOURS) {
    return {
      allowed: true,
      hoursOffline,
      warning: `You have been offline for ${Math.floor(hoursOffline)} hours. Please sync your data soon to avoid data loss.`,
    };
  }

  return {
    allowed: true,
    hoursOffline,
  };
}

export async function showSyncEnforcementAlert(): Promise<boolean> {
  const status = await checkSyncEnforcement();

  if (status.error) {
    return new Promise((resolve) => {
      Alert.alert(
        'Sync Required',
        status.error,
        [
          {
            text: 'OK',
            onPress: () => resolve(false),
          },
        ],
        { cancelable: false }
      );
    });
  }

  if (status.warning) {
    return new Promise((resolve) => {
      Alert.alert(
        'Sync Warning',
        status.warning,
        [
          {
            text: 'Remind Me Later',
            style: 'cancel',
            onPress: () => resolve(true),
          },
          {
            text: 'Sync Now',
            onPress: () => {
              // TODO: Trigger sync
              resolve(true);
            },
          },
        ]
      );
    });
  }

  return true;
}

export function startSyncEnforcementMonitoring(): NodeJS.Timeout {
  // Check sync enforcement every hour
  const intervalId = setInterval(async () => {
    const status = await checkSyncEnforcement();

    if (status.warning || status.error) {
      await showSyncEnforcementAlert();
    }
  }, 60 * 60 * 1000); // 1 hour

  console.log('Sync enforcement monitoring started');
  return intervalId;
}

export function stopSyncEnforcementMonitoring(intervalId: NodeJS.Timeout): void {
  clearInterval(intervalId);
  console.log('Sync enforcement monitoring stopped');
}

export async function getSyncStatus(): Promise<{
  lastSyncTime: number | null;
  hoursOffline: number;
  isBlocked: boolean;
  needsWarning: boolean;
}> {
  const lastSyncTime = await getLastSyncTime();
  const hoursOffline = await getHoursSinceLastSync();

  return {
    lastSyncTime,
    hoursOffline,
    isBlocked: hoursOffline >= MAX_OFFLINE_HOURS,
    needsWarning: hoursOffline >= WARNING_HOURS,
  };
}
