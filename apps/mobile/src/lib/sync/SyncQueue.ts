import { runInsert, runQuery, runUpdate, runDelete } from '../db/init';

export type SyncAction = 'create' | 'update' | 'delete';
export type EntityType = 'trip' | 'checklist' | 'alert' | 'trip_location';

export interface SyncQueueItem {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  action: SyncAction;
  payload: string;
  retry_count: number;
  created_at: number;
  last_attempt_at?: number;
}

const MAX_RETRIES = 3;

export class SyncQueue {
  async addToQueue(
    entityType: EntityType,
    entityId: string,
    action: SyncAction,
    payload: any
  ): Promise<void> {
    const id = `${entityType}_${entityId}_${action}_${Date.now()}`;
    const now = Date.now();

    await runInsert(
      `INSERT INTO sync_queue (id, entity_type, entity_id, action, payload, retry_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, entityType, entityId, action, JSON.stringify(payload), 0, now]
    );

    console.log(`Added to sync queue: ${entityType} ${action} ${entityId}`);
  }

  async getQueueItems(limit: number = 50): Promise<SyncQueueItem[]> {
    const items = await runQuery<SyncQueueItem>(
      `SELECT * FROM sync_queue
       WHERE retry_count < ?
       ORDER BY created_at ASC
       LIMIT ?`,
      [MAX_RETRIES, limit]
    );

    return items.map(item => ({
      ...item,
      payload: item.payload, // Keep as string, will be parsed when needed
    }));
  }

  async markAsSynced(id: string): Promise<void> {
    await runDelete('DELETE FROM sync_queue WHERE id = ?', [id]);
    console.log(`Removed from sync queue: ${id}`);
  }

  async incrementRetryCount(id: string): Promise<void> {
    const now = Date.now();
    await runUpdate(
      `UPDATE sync_queue
       SET retry_count = retry_count + 1, last_attempt_at = ?
       WHERE id = ?`,
      [now, id]
    );
    console.log(`Incremented retry count for: ${id}`);
  }

  async getQueueSize(): Promise<number> {
    const result = await runQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM sync_queue WHERE retry_count < ?',
      [MAX_RETRIES]
    );
    return result[0]?.count || 0;
  }

  async clearQueue(): Promise<void> {
    await runDelete('DELETE FROM sync_queue', []);
    console.log('Sync queue cleared');
  }

  async getFailedItems(): Promise<SyncQueueItem[]> {
    const items = await runQuery<SyncQueueItem>(
      'SELECT * FROM sync_queue WHERE retry_count >= ?',
      [MAX_RETRIES]
    );

    return items.map(item => ({
      ...item,
      payload: item.payload,
    }));
  }

  async removeFailedItem(id: string): Promise<void> {
    await runDelete('DELETE FROM sync_queue WHERE id = ?', [id]);
    console.log(`Removed failed item from sync queue: ${id}`);
  }
}

export const syncQueue = new SyncQueue();
