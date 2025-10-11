import { getDatabase } from '../db/init';

const RETENTION_DAYS = 7;
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function cleanupOldData(): Promise<void> {
  const db = getDatabase();
  const cutoffTime = Date.now() - (RETENTION_DAYS * 24 * 60 * 60 * 1000);

  try {
    // Delete old synced trips
    await db.runAsync(
      'DELETE FROM trips WHERE synced = 1 AND updated_at < ?',
      [cutoffTime]
    );

    // Delete old synced trip locations
    await db.runAsync(
      'DELETE FROM trip_locations WHERE synced = 1 AND timestamp < ?',
      [cutoffTime]
    );

    // Delete old synced checklists
    await db.runAsync(
      'DELETE FROM checklists WHERE synced = 1 AND updated_at < ?',
      [cutoffTime]
    );

    // Delete old synced alerts
    await db.runAsync(
      'DELETE FROM alerts WHERE synced = 1 AND created_at < ?',
      [cutoffTime]
    );

    // Delete old successful sync queue items
    await db.runAsync(
      'DELETE FROM sync_queue WHERE created_at < ?',
      [cutoffTime - (3 * 24 * 60 * 60 * 1000)] // Keep for 3 days
    );

    console.log('Old data cleanup completed successfully');
  } catch (error) {
    console.error('Error during data cleanup:', error);
  }
}

export function startAutomaticCleanup(): NodeJS.Timeout {
  // Run cleanup immediately
  cleanupOldData();

  // Schedule periodic cleanup
  const intervalId = setInterval(() => {
    cleanupOldData();
  }, CLEANUP_INTERVAL_MS);

  console.log('Automatic cleanup started');
  return intervalId;
}

export function stopAutomaticCleanup(intervalId: NodeJS.Timeout): void {
  clearInterval(intervalId);
  console.log('Automatic cleanup stopped');
}

export async function getStorageStats(): Promise<{
  trips: number;
  locations: number;
  checklists: number;
  alerts: number;
  syncQueue: number;
}> {
  const db = getDatabase();

  const trips = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM trips'
  );
  const locations = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM trip_locations'
  );
  const checklists = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM checklists'
  );
  const alerts = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM alerts'
  );
  const syncQueue = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sync_queue'
  );

  return {
    trips: trips[0]?.count || 0,
    locations: locations[0]?.count || 0,
    checklists: checklists[0]?.count || 0,
    alerts: alerts[0]?.count || 0,
    syncQueue: syncQueue[0]?.count || 0,
  };
}
