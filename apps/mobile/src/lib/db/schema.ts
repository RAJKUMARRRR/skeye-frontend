// Database schema for offline storage

export const DATABASE_NAME = 'fleet_driver.db';
export const DATABASE_VERSION = 1;

export const SCHEMA = {
  TRIPS: `
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      driver_id TEXT NOT NULL,
      vehicle_id TEXT,
      start_time INTEGER NOT NULL,
      end_time INTEGER,
      start_location TEXT,
      end_location TEXT,
      distance REAL DEFAULT 0,
      duration INTEGER DEFAULT 0,
      status TEXT NOT NULL,
      notes TEXT,
      synced INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `,

  TRIP_LOCATIONS: `
    CREATE TABLE IF NOT EXISTS trip_locations (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      altitude REAL,
      speed REAL,
      heading REAL,
      accuracy REAL,
      timestamp INTEGER NOT NULL,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );
  `,

  CHECKLISTS: `
    CREATE TABLE IF NOT EXISTS checklists (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL,
      driver_id TEXT NOT NULL,
      vehicle_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      completed_at INTEGER,
      synced INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `,

  CHECKLIST_ITEMS: `
    CREATE TABLE IF NOT EXISTS checklist_items (
      id TEXT PRIMARY KEY,
      checklist_id TEXT NOT NULL,
      question TEXT NOT NULL,
      item_type TEXT NOT NULL,
      is_required INTEGER DEFAULT 0,
      answer TEXT,
      photo_uri TEXT,
      completed INTEGER DEFAULT 0,
      completed_at INTEGER,
      FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE
    );
  `,

  SYNC_QUEUE: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      action TEXT NOT NULL,
      payload TEXT NOT NULL,
      retry_count INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      last_attempt_at INTEGER
    );
  `,

  ALERTS: `
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      vehicle_id TEXT,
      acknowledged INTEGER DEFAULT 0,
      acknowledged_at INTEGER,
      synced INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `,
};

export const INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);',
  'CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);',
  'CREATE INDEX IF NOT EXISTS idx_trips_synced ON trips(synced);',
  'CREATE INDEX IF NOT EXISTS idx_trip_locations_trip_id ON trip_locations(trip_id);',
  'CREATE INDEX IF NOT EXISTS idx_trip_locations_synced ON trip_locations(synced);',
  'CREATE INDEX IF NOT EXISTS idx_checklists_driver_id ON checklists(driver_id);',
  'CREATE INDEX IF NOT EXISTS idx_checklists_status ON checklists(status);',
  'CREATE INDEX IF NOT EXISTS idx_checklists_synced ON checklists(synced);',
  'CREATE INDEX IF NOT EXISTS idx_sync_queue_entity ON sync_queue(entity_type, entity_id);',
  'CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged);',
];
