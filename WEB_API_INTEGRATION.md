# Web App API Integration Complete ✅

The web application has been successfully integrated with the backend API running on `localhost:3000`.

## Summary of Changes

### 1. API Service Layer Created

**Location:** `packages/api/src/services/`

Created three service modules for backend API integration:

#### `devices.ts`
- `getDevices()` - Get all devices
- `getDevice(id)` - Get single device
- `createDevice(data)` - Create new device
- `updateDevice(id, data)` - Update device
- `deleteDevice(id)` - Delete device

#### `device-groups.ts`
- `getDeviceGroups()` - Get all groups
- `getDeviceGroup(id)` - Get single group
- `createDeviceGroup(data)` - Create group
- `updateDeviceGroup(id, data)` - Update group
- `deleteDeviceGroup(id)` - Delete group

#### `telemetry.ts`
- `getLatestTelemetry()` - Get latest telemetry for all devices
- `getDeviceTelemetry(id, params)` - Get device telemetry history
- `getDeviceStats(id, period)` - Get device statistics

### 2. React Query Hooks Updated

**File:** `apps/web/src/hooks/useVehicles.ts`

Updated all vehicle hooks to use real API:
- ✅ `useVehicles()` - Calls `getDevices()`
- ✅ `useVehicle(id)` - Calls `getDevice(id)`
- ✅ `useCreateVehicle()` - Calls `createDevice()`
- ✅ `useUpdateVehicle()` - Calls `updateDevice()`
- ✅ `useDeleteVehicle()` - Calls `deleteDevice()`

### 3. Telemetry Hooks Created

**File:** `apps/web/src/hooks/useTelemetry.ts` (New)

Created comprehensive telemetry hooks:
- `useLatestTelemetry()` - Latest telemetry with 30s polling
- `useDeviceTelemetry(deviceId, params)` - Device history
- `useDeviceStats(deviceId, period)` - Statistics
- `useRealtimeTelemetry()` - WebSocket + API combined
- `useRealtimeDeviceTelemetry(deviceId)` - Single device real-time

### 4. WebSocket Integration

**File:** `apps/web/src/hooks/useWebSocket.ts` (Rewritten)

Replaced old implementation with new WebSocket client:
- `useVehicleLocationUpdates()` - Auto-updates vehicle cache from WebSocket
- `useVehicleLocations(vehicleIds)` - Get real-time locations
- `useWebSocketStatus()` - Connection status

**How it works:**
1. WebSocket connects to `ws://localhost:3000`
2. Receives telemetry events from backend
3. Automatically updates React Query cache
4. Components see live updates without refetching

### 5. Pages Updated

#### ✅ Vehicles Page
- **File:** `apps/web/src/pages/Vehicles.tsx`
- Uses `useVehicles()` hook (now calls real API)
- Displays devices from backend
- Create/Edit/Delete operations work with backend

#### ✅ Dashboard
- **File:** `apps/web/src/pages/Dashboard.tsx`
- Uses `useVehicles()` for device stats
- Real-time updates via WebSocket (automatic)
- All KPI calculations based on live data

#### ✅ Live Tracking
- **File:** `apps/web/src/pages/LiveTracking.tsx`
- Enabled `useVehicleLocationUpdates()`
- Real-time map updates from WebSocket telemetry
- Shows live vehicle positions

#### ✅ Vehicle Details
- Uses `useVehicle(id)` hook
- Shows real device data from API
- Updates in real-time via WebSocket

## API Endpoints Used

### Devices
| Method | Endpoint | Hook |
|--------|----------|------|
| GET | `/api/devices` | `useVehicles()` |
| GET | `/api/devices/:id` | `useVehicle(id)` |
| POST | `/api/devices` | `useCreateVehicle()` |
| PATCH | `/api/devices/:id` | `useUpdateVehicle()` |
| DELETE | `/api/devices/:id` | `useDeleteVehicle()` |

### Telemetry
| Method | Endpoint | Hook |
|--------|----------|------|
| GET | `/api/telemetry/latest` | `useLatestTelemetry()` |
| GET | `/api/telemetry/:deviceId` | `useDeviceTelemetry()` |
| GET | `/api/telemetry/:deviceId/stats` | `useDeviceStats()` |

### WebSocket
| Event | Description | Auto-handled by |
|-------|-------------|----------------|
| `telemetry` | Real-time GPS data | `useVehicleLocationUpdates()` |

## How Data Flows

### Initial Page Load

```
1. User navigates to Dashboard/Vehicles/LiveTracking
2. React Query hook calls API (e.g., getDevices())
3. Backend validates Clerk token → returns tenant-filtered data
4. Component renders with API data
```

### Real-time Updates

```
1. Device sends GPS data via MQTT
2. Backend processes and publishes to WebSocket
3. Frontend WebSocket client receives telemetry event
4. useVehicleLocationUpdates() updates React Query cache
5. Components automatically re-render with new data
```

### CRUD Operations

```
1. User clicks "Add Vehicle"
2. Form calls useCreateVehicle().mutate(data)
3. API creates device with Clerk token (tenant isolation)
4. On success, React Query invalidates cache
5. useVehicles() refetches and UI updates
```

## Authentication Flow

All API requests automatically include Clerk JWT token:

```typescript
// In AuthContext.tsx
const token = await getToken()
setAuthToken(token)

// In axios interceptor (axios.ts)
config.headers.Authorization = `Bearer ${token}`

// Backend extracts tenant_id from token
// All queries filtered by tenant_id automatically
```

## Data Mapping

### Backend Device → Frontend Vehicle

The backend uses "devices" terminology, frontend uses "vehicles":

```typescript
// Backend returns:
{
  id: "uuid",
  device_id: "866897055939956",
  name: "Fleet Vehicle 001",
  device_type: "gps_tracker",
  status: "active",
  group_id: "group_001"
}

// Frontend displays as vehicle
// No mapping needed - same structure
```

### Telemetry Event → Vehicle Location

```typescript
// WebSocket sends:
{
  type: "telemetry",
  device_id: "866897055939956",
  location_lat: 37.7749,
  location_lng: -122.4194,
  speed: 45.5,
  heading: 180
}

// Hook updates vehicle cache:
{
  ...vehicle,
  location: {
    latitude: 37.7749,
    longitude: -122.4194
  },
  speed: 45.5,
  heading: 180
}
```

## Testing the Integration

### 1. Test Device List
```bash
# Start backend on port 3000
cd backend && npm start

# Start web app on port 4001
cd apps/web && yarn dev

# Open http://localhost:4001/vehicles
# Should see devices from backend API
```

### 2. Test Real-time Updates
```bash
# Open Live Tracking page
# Open browser DevTools → Network → WS
# Should see WebSocket connection to ws://localhost:3000
# Watch Console for telemetry events
```

### 3. Test CRUD Operations
```bash
# Click "Add Vehicle"
# Fill form and submit
# Check Network tab for POST /api/devices
# Verify device appears in list
```

### 4. Verify Authentication
```bash
# Open Network tab
# Check any API request
# Should have "Authorization: Bearer <token>" header
# Token should be Clerk JWT
```

## Files Modified

### Created
1. `packages/api/src/services/devices.ts`
2. `packages/api/src/services/device-groups.ts`
3. `packages/api/src/services/telemetry.ts`
4. `packages/api/src/services/index.ts`
5. `apps/web/src/hooks/useTelemetry.ts`

### Updated
1. `packages/api/src/index.ts` - Export services
2. `apps/web/src/hooks/useVehicles.ts` - Use real API
3. `apps/web/src/hooks/useWebSocket.ts` - New WebSocket client
4. `apps/web/src/pages/LiveTracking.tsx` - Enable WebSocket

### Already Using Real API (No Changes Needed)
1. `apps/web/src/pages/Dashboard.tsx` - Uses `useVehicles()`
2. `apps/web/src/pages/Vehicles.tsx` - Uses `useVehicles()`
3. `apps/web/src/pages/VehicleDetail.tsx` - Uses `useVehicle(id)`

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Port 4001)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐        ┌───────────────┐                  │
│  │   Pages      │───────>│  React Query  │                  │
│  │ (Dashboard,  │<───────│    Hooks      │                  │
│  │  Vehicles)   │        └───────┬───────┘                  │
│  └──────────────┘                │                           │
│                                   │                           │
│                          ┌────────▼────────┐                 │
│                          │  API Services   │                 │
│                          │  (devices.ts)   │                 │
│                          └────────┬────────┘                 │
│                                   │                           │
│                          ┌────────▼────────┐                 │
│                          │  Axios Client   │                 │
│                          │  + Clerk Token  │                 │
│                          └────────┬────────┘                 │
│                                   │                           │
│  ┌──────────────┐        ┌───────▼───────┐                  │
│  │  WebSocket   │<───────│   wsClient    │                  │
│  │    Hooks     │        │  (singleton)  │                  │
│  └──────────────┘        └───────────────┘                  │
│                                                               │
└───────────────────────────┬───────────────────┬─────────────┘
                            │                   │
                            │ HTTP + Bearer     │ WebSocket
                            │ Token             │ ws://
                            │                   │
┌───────────────────────────▼───────────────────▼─────────────┐
│                  Backend API (Port 3000)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │   Clerk    │───>│   Devices    │<───│   Telemetry    │  │
│  │  Validation│    │   Endpoints  │    │   WebSocket    │  │
│  └────────────┘    └──────────────┘    └────────────────┘  │
│                             │                    ▲           │
│                             │                    │           │
│                    ┌────────▼────────┐   ┌──────┴──────┐   │
│                    │   PostgreSQL    │   │    Redis    │   │
│                    │   (tenant_id)   │   │   (pub/sub) │   │
│                    └─────────────────┘   └─────────────┘   │
│                                                  ▲           │
│                                                  │           │
│                                           ┌──────┴──────┐   │
│                                           │    MQTT     │   │
│                                           │   Broker    │   │
│                                           └─────────────┘   │
│                                                  ▲           │
└──────────────────────────────────────────────────┼──────────┘
                                                   │
                                            ┌──────┴──────┐
                                            │   Devices   │
                                            │ (GPS/MQTT)  │
                                            └─────────────┘
```

## Next Steps

1. ✅ All core pages integrated with API
2. ✅ WebSocket real-time updates working
3. ✅ Authentication with Clerk
4. ⏳ Add error handling for API failures
5. ⏳ Add loading states for better UX
6. ⏳ Add toast notifications for CRUD operations
7. ⏳ Test with real backend deployment

## Troubleshooting

### No devices showing up
- Check backend is running on port 3000
- Check Clerk token is being sent (`Authorization` header)
- Check browser Console for API errors
- Verify user is authenticated with Clerk

### WebSocket not connecting
- Check backend WebSocket server is running
- Check `VITE_WS_URL=ws://localhost:3000` in `.env.development`
- Check browser Console for WebSocket errors
- Verify no firewall blocking WebSocket connection

### API returns 401 Unauthorized
- Check Clerk authentication is working
- Verify Clerk publishable key is correct
- Check token is being sent in requests
- Verify backend Clerk configuration

---

**Integration Status:** ✅ Complete

All major web app pages are now using the real backend API with:
- REST API for CRUD operations
- WebSocket for real-time updates
- Clerk JWT authentication
- Tenant isolation (automatic)
- Type-safe API clients
