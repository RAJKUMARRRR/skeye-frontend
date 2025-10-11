import NetInfo from '@react-native-community/netinfo';
import { syncQueue, SyncQueueItem } from './SyncQueue';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncStatusInfo {
  status: SyncStatus;
  queueSize: number;
  lastSyncTime?: number;
  error?: string;
}

type SyncListener = (status: SyncStatusInfo) => void;

export class SyncManager {
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Set<SyncListener> = new Set();
  private lastSyncTime?: number;
  private syncStatus: SyncStatus = 'idle';

  constructor() {
    this.setupNetworkListener();
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isSyncing) {
        console.log('Network connected, starting sync...');
        this.sync();
      }
    });
  }

  async startAutoSync(intervalMs: number = 60000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Initial sync
    await this.sync();

    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.sync();
    }, intervalMs);

    console.log(`Auto-sync started with interval: ${intervalMs}ms`);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  async sync(): Promise<void> {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      console.log('No network connection, skipping sync');
      this.updateStatus('error', 'No network connection');
      return;
    }

    this.isSyncing = true;
    this.updateStatus('syncing');

    try {
      const items = await syncQueue.getQueueItems();

      if (items.length === 0) {
        console.log('Sync queue is empty');
        this.lastSyncTime = Date.now();
        this.updateStatus('success');
        return;
      }

      console.log(`Syncing ${items.length} items...`);

      for (const item of items) {
        try {
          await this.syncItem(item);
          await syncQueue.markAsSynced(item.id);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          await syncQueue.incrementRetryCount(item.id);
        }
      }

      this.lastSyncTime = Date.now();
      this.updateStatus('success');
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync error:', error);
      this.updateStatus('error', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const payload = JSON.parse(item.payload);

    // TODO: Implement actual API calls based on entity type and action
    console.log(`Syncing ${item.entity_type} ${item.action}:`, item.entity_id);

    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 100));

    // Example implementation:
    // switch (item.entity_type) {
    //   case 'trip':
    //     await this.syncTrip(item.action, item.entity_id, payload);
    //     break;
    //   case 'checklist':
    //     await this.syncChecklist(item.action, item.entity_id, payload);
    //     break;
    //   case 'alert':
    //     await this.syncAlert(item.action, item.entity_id, payload);
    //     break;
    //   case 'trip_location':
    //     await this.syncTripLocation(item.action, item.entity_id, payload);
    //     break;
    // }
  }

  private async updateStatus(status: SyncStatus, error?: string) {
    this.syncStatus = status;
    const queueSize = await syncQueue.getQueueSize();

    const statusInfo: SyncStatusInfo = {
      status,
      queueSize,
      lastSyncTime: this.lastSyncTime,
      error,
    };

    this.notifyListeners(statusInfo);
  }

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(status: SyncStatusInfo) {
    this.listeners.forEach(listener => listener(status));
  }

  async getSyncStatus(): Promise<SyncStatusInfo> {
    const queueSize = await syncQueue.getQueueSize();
    return {
      status: this.syncStatus,
      queueSize,
      lastSyncTime: this.lastSyncTime,
    };
  }

  async getFailedItems() {
    return await syncQueue.getFailedItems();
  }

  async clearFailedItems() {
    const failedItems = await syncQueue.getFailedItems();
    for (const item of failedItems) {
      await syncQueue.removeFailedItem(item.id);
    }
  }
}

export const syncManager = new SyncManager();
