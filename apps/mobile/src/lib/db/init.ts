import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME, SCHEMA, INDEXES } from './schema';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.execAsync(SCHEMA.TRIPS);
    await db.execAsync(SCHEMA.TRIP_LOCATIONS);
    await db.execAsync(SCHEMA.CHECKLISTS);
    await db.execAsync(SCHEMA.CHECKLIST_ITEMS);
    await db.execAsync(SCHEMA.SYNC_QUEUE);
    await db.execAsync(SCHEMA.ALERTS);

    // Create indexes
    for (const index of INDEXES) {
      await db.execAsync(index);
    }

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

export async function clearDatabase(): Promise<void> {
  const database = getDatabase();

  const tables = ['trips', 'trip_locations', 'checklists', 'checklist_items', 'sync_queue', 'alerts'];

  for (const table of tables) {
    await database.execAsync(`DELETE FROM ${table};`);
  }

  console.log('Database cleared');
}

// Helper functions for common database operations
export async function runQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  const database = getDatabase();
  const result = await database.getAllAsync<T>(query, params);
  return result;
}

export async function runInsert(
  query: string,
  params: any[] = []
): Promise<SQLite.SQLiteRunResult> {
  const database = getDatabase();
  return await database.runAsync(query, params);
}

export async function runUpdate(
  query: string,
  params: any[] = []
): Promise<SQLite.SQLiteRunResult> {
  const database = getDatabase();
  return await database.runAsync(query, params);
}

export async function runDelete(
  query: string,
  params: any[] = []
): Promise<SQLite.SQLiteRunResult> {
  const database = getDatabase();
  return await database.runAsync(query, params);
}
