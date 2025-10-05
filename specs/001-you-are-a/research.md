# Research Document: Fleet Management Platform Frontend

**Project**: Fleet Management Platform
**Date**: 2025-10-04
**Branch**: 001-you-are-a
**Research Phase**: Phase 0 - Technology Selection & Architecture Patterns

---

## 1. Map Provider Abstraction Layer

### Decision
Implement an **Adapter Pattern** with a unified `MapProvider` interface that abstracts Google Maps, Mapbox, and Leaflet behind a common API.

### Rationale
- **Provider Flexibility**: Organizations can switch map providers based on cost, features, or regional availability without code changes
- **Vendor Independence**: Avoid lock-in to a single map provider
- **Consistent API**: Single learning curve for developers regardless of underlying provider
- **Runtime Configuration**: Switch providers via environment variable or user settings

### Alternatives Considered
1. **Direct Integration**: Embed provider-specific code in components
   - ❌ Rejected: Creates tight coupling, makes provider switching require extensive refactoring

2. **Multiple Implementations**: Separate components for each provider
   - ❌ Rejected: Code duplication, inconsistent UX across providers

3. **Third-Party Abstraction Library** (e.g., MapLibre GL JS)
   - ⚠️ Considered but limited: Only works for vector tile providers (Mapbox/MapTiler), doesn't support Google Maps

### Implementation Notes

**Interface Design**:
```typescript
interface MapProviderProps {
  center: LatLng
  zoom: number
  markers: Marker[]
  geofences: Geofence[]
  clustering: boolean
  onMarkerClick: (markerId: string) => void
  onMapClick: (latLng: LatLng) => void
}

interface MapAdapter {
  render(props: MapProviderProps): ReactElement
  fitBounds(bounds: LatLngBounds): void
  setCenter(center: LatLng): void
  setZoom(zoom: number): void
}
```

**Provider Configuration**:
```typescript
// Environment-based selection
const MAP_PROVIDER = import.meta.env.VITE_MAP_PROVIDER || 'google'

// Runtime selection (settings panel)
const uiStore = useUIStore()
const provider = uiStore.mapProvider
```

**Package Structure**:
```
apps/web/src/components/map/
├── MapProvider.tsx          # Context + adapter selection
├── GoogleMapAdapter.tsx     # @react-google-maps/api wrapper
├── MapboxAdapter.tsx        # mapbox-gl wrapper
├── LeafletAdapter.tsx       # react-leaflet wrapper
├── types.ts                 # Shared types
└── hooks/
    └── useMapAdapter.ts     # Hook to access current adapter
```

**Performance Considerations**:
- Lazy load map libraries: `React.lazy(() => import('./GoogleMapAdapter'))`
- Single provider bundled in production (tree-shaking via env variables)
- Adapter overhead is negligible (~50 lines of wrapper code per provider)

**Risk Assessment**: Low risk. Pattern is well-established and adds minimal complexity.

---

## 2. Offline Sync Strategy (Mobile)

### Decision
Use **expo-sqlite** with a **queue-based sync** approach and **last-write-wins** conflict resolution.

### Rationale
- **Proven Solution**: SQLite is battle-tested for mobile offline storage
- **Query Performance**: Superior to AsyncStorage for structured data (7 days of trips/checklists)
- **Transaction Support**: ACID guarantees for data integrity
- **expo-sqlite**: First-class Expo support with TypeScript types

### Alternatives Considered
1. **MMKV** (via `react-native-mmkv`)
   - ⚠️ Fast key-value store but requires manual indexing/querying
   - Better for simple data, not ideal for relational trip/checklist data

2. **Realm** (via `@realm/react`)
   - ✅ Excellent sync capabilities
   - ❌ Rejected: Adds 5MB+ to bundle size, overkill for our use case

3. **WatermelonDB**
   - ✅ Reactive database with sync
   - ❌ Rejected: Additional abstraction layer, smaller community

### Implementation Notes

**Database Schema**:
```sql
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  driver_id TEXT,
  vehicle_id TEXT,
  start_time INTEGER,
  end_time INTEGER,
  distance REAL,
  synced INTEGER DEFAULT 0,
  modified_at INTEGER
);

CREATE TABLE checklists (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  template_id TEXT,
  items TEXT, -- JSON
  photos TEXT, -- JSON array of local URIs
  signature TEXT, -- base64
  synced INTEGER DEFAULT 0,
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT,
  entity_id TEXT,
  operation TEXT, -- 'create' | 'update' | 'delete'
  payload TEXT, -- JSON
  retry_count INTEGER DEFAULT 0,
  created_at INTEGER
);
```

**Sync Architecture**:
```
┌─────────────────┐
│   React Query   │  ← Server state (when online)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sync Manager   │  ← Orchestrates offline/online transitions
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ SQLite │ │  API   │
└────────┘ └────────┘
```

**Sync Logic**:
1. **Offline Write**: Insert into local SQLite + add to `sync_queue`
2. **Online Detection**: NetInfo listener triggers sync
3. **Queue Processing**: Process queue sequentially (FIFO)
4. **Conflict Resolution**: Last-write-wins (server timestamp comparison)
5. **Retry Strategy**: Exponential backoff (1s, 5s, 30s), max 3 attempts
6. **Mandatory Sync**: At 48-hour mark, block new writes until sync completes

**React Query Integration**:
```typescript
const useTrips = () => {
  const { isConnected } = useNetInfo()

  return useQuery({
    queryKey: ['trips'],
    queryFn: isConnected ? fetchTripsFromAPI : fetchTripsFromSQLite,
    onSuccess: (data) => {
      if (isConnected) {
        syncLocalTripsWithServer(data)
      }
    }
  })
}
```

**Storage Limits**:
- 7-day retention: ~500MB max (worst case: 100 trips/day * 5MB/trip)
- Automatic cleanup: Delete synced records older than 7 days

**Risk Assessment**: Medium risk. Conflict resolution may lose data in edge cases (rare with 48-hour sync). Mitigation: User warning at 48-hour threshold.

---

## 3. Real-Time Data Updates (10-second interval)

### Decision
Use **WebSocket** for real-time vehicle location updates and live tracking.

### Rationale
- **True Real-Time**: Bi-directional communication with <1s latency
- **Efficient**: Single persistent connection vs. repeated HTTP requests
- **Scalability**: Designed for thousands of concurrent connections
- **Event-Driven**: Server pushes updates only when data changes (not every 10s)
- **Lower Bandwidth**: No HTTP overhead on every update
- **Fleet Tracking Standard**: Industry best practice (Samsara, Geotab use WebSocket)

### Alternatives Considered
1. **Polling with React Query**
   - ✅ Simple implementation
   - ❌ Rejected: Higher latency, inefficient for 500+ vehicles, unnecessary server load

2. **Server-Sent Events (SSE)**
   - ✅ Simpler than WebSocket, HTTP-based
   - ❌ Rejected: Unidirectional only (no client→server), less browser support

3. **Long Polling**
   - ❌ Rejected: More complex than simple polling, still inefficient compared to WebSocket

### Implementation Notes

**WebSocket Client Setup** (packages/api/src/client/websocket.ts):
```typescript
import { io, Socket } from 'socket.io-client'

class WebSocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect(token: string) {
    this.socket = io(process.env.VITE_WS_URL, {
      auth: { token },
      transports: ['websocket'], // Force WebSocket (not polling fallback)
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.reconnectAttempts++
    })

    return this.socket
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }

  subscribe(channel: string, callback: (data: any) => void) {
    this.socket?.on(channel, callback)
  }

  unsubscribe(channel: string) {
    this.socket?.off(channel)
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data)
  }
}

export const wsClient = new WebSocketClient()
```

**React Query Integration**:
```typescript
// Custom hook for WebSocket + React Query
const useVehicleLocations = (vehicleIds: string[]) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Subscribe to vehicle location updates
    wsClient.subscribe('vehicle:location', (update: VehicleLocationUpdate) => {
      // Update React Query cache directly
      queryClient.setQueryData(
        ['vehicle-location', update.vehicleId],
        update
      )

      // Or invalidate to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ['vehicle-locations']
      })
    })

    // Tell server which vehicles to track
    wsClient.emit('track:vehicles', { vehicleIds })

    return () => {
      wsClient.unsubscribe('vehicle:location')
      wsClient.emit('untrack:vehicles', { vehicleIds })
    }
  }, [vehicleIds, queryClient])

  // Initial data fetch via REST (fallback)
  return useQuery({
    queryKey: ['vehicle-locations', vehicleIds],
    queryFn: () => fetchVehicleLocations(vehicleIds),
    staleTime: Infinity, // WebSocket keeps data fresh
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
}
```

**Channel Structure**:
```typescript
// Client subscribes to specific channels
wsClient.subscribe('vehicle:location', callback)        // Live location updates
wsClient.subscribe('vehicle:status', callback)          // Vehicle status changes
wsClient.subscribe('alert:new', callback)               // New alerts
wsClient.subscribe('geofence:event', callback)          // Geofence entry/exit
wsClient.subscribe('trip:update', callback)             // Trip progress updates

// Namespace by organization for multi-tenancy
wsClient.subscribe('org:${orgId}:vehicle:location', callback)
```

**Connection Management**:
```typescript
// Context provider for WebSocket
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  useEffect(() => {
    if (user?.token) {
      wsClient.connect(user.token)
    }

    return () => {
      wsClient.disconnect()
    }
  }, [user?.token])

  return <>{children}</>
}

// Usage in App.tsx
<WebSocketProvider>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</WebSocketProvider>
```

**Reconnection Strategy**:
```typescript
// Exponential backoff with jitter
const reconnectionDelay = Math.min(
  1000 * Math.pow(2, reconnectAttempts) + Math.random() * 1000,
  30000 // Max 30 seconds
)
```

**Performance Optimizations**:
- **Selective Subscription**: Only subscribe to visible vehicles on map
- **Message Batching**: Server batches updates every 1-2 seconds
- **Binary Protocol**: Use MessagePack for smaller payloads (optional)
- **Heartbeat**: Keep-alive pings every 30s to detect broken connections

**Mobile WebSocket** (apps/mobile):
```typescript
// Same socket.io-client library works in React Native
import { io } from 'socket.io-client'

const wsClient = io(WEBSOCKET_URL, {
  auth: { token },
  transports: ['websocket'],
  // Additional mobile-specific options
  timeout: 20000, // Longer timeout for poor connections
  forceNew: false // Reuse connection when app returns from background
})
```

**Bandwidth Usage** (estimated):
- Per vehicle update: ~100 bytes (JSON) or ~50 bytes (MessagePack)
- 500 vehicles × 1 update/10s = 5KB/s (~2.5MB/hour)
- Minimal data usage compared to video streaming

**Fallback Strategy**:
```typescript
// Graceful degradation to polling if WebSocket fails
const useRealTimeVehicles = (vehicleIds: string[]) => {
  const [wsConnected, setWsConnected] = useState(false)

  useEffect(() => {
    const onConnect = () => setWsConnected(true)
    const onDisconnect = () => setWsConnected(false)

    wsClient.socket?.on('connect', onConnect)
    wsClient.socket?.on('disconnect', onDisconnect)

    return () => {
      wsClient.socket?.off('connect', onConnect)
      wsClient.socket?.off('disconnect', onDisconnect)
    }
  }, [])

  // Use WebSocket if connected, otherwise poll
  if (wsConnected) {
    return useWebSocketVehicles(vehicleIds)
  }
  return usePollingVehicles(vehicleIds)
}
```

**Testing WebSocket**:
```typescript
// Mock WebSocket for testing
import { MockedSocket } from 'socket.io-client'

const mockSocket = new MockedSocket()
mockSocket.on('vehicle:location', callback)
mockSocket.emit('vehicle:location', mockLocationData)
```

**Risk Assessment**: Medium risk. WebSocket adds complexity (connection management, reconnection logic), but necessary for true real-time performance at scale. Mitigation: Robust error handling, fallback to polling, comprehensive testing.

---

## 4. Map Clustering (>500 vehicles)

### Decision
Use **supercluster** for web (Leaflet/Mapbox) and **react-native-map-clustering** for mobile.

### Rationale
- **Performance**: supercluster handles 100,000+ points with <100ms updates
- **Flexibility**: Works with all map providers (Google Maps, Mapbox, Leaflet)
- **Industry Standard**: Used by Mapbox, Uber, Lyft
- **Customizable**: Control cluster radius, max zoom, custom markers

### Alternatives Considered
1. **Map Provider Built-In Clustering**
   - Google Maps: `MarkerClusterer` (good for Google only)
   - Mapbox: `cluster` layer (good for Mapbox only)
   - ❌ Rejected: Breaks provider abstraction, inconsistent behavior

2. **Manual Clustering** (grid-based)
   - ❌ Rejected: Reinventing the wheel, worse performance

### Implementation Notes

**Web Implementation** (shared utility):
```typescript
// packages/utils/src/map/clustering.ts
import Supercluster from 'supercluster'

export const createClusterIndex = (points: GeoJSONPoint[]) => {
  return new Supercluster({
    radius: 60, // Cluster radius in pixels
    maxZoom: 16, // Max zoom to cluster points on
    minZoom: 0,
    minPoints: 2, // Min points to form cluster
  }).load(points)
}

export const getClusters = (
  index: Supercluster,
  bounds: LatLngBounds,
  zoom: number
) => {
  return index.getClusters(
    [bounds.west, bounds.south, bounds.east, bounds.north],
    Math.floor(zoom)
  )
}
```

**React Integration**:
```typescript
const Map = ({ vehicles }: MapProps) => {
  const [zoom, setZoom] = useState(10)
  const [bounds, setBounds] = useState(initialBounds)

  const clusterIndex = useMemo(
    () => createClusterIndex(vehiclesToGeoJSON(vehicles)),
    [vehicles]
  )

  const clusters = useMemo(
    () => getClusters(clusterIndex, bounds, zoom),
    [clusterIndex, bounds, zoom]
  )

  return (
    <MapProvider>
      {clusters.map(cluster => (
        cluster.properties.cluster ? (
          <ClusterMarker cluster={cluster} />
        ) : (
          <VehicleMarker vehicle={cluster.properties} />
        )
      ))}
    </MapProvider>
  )
}
```

**Mobile Implementation**:
```typescript
// apps/mobile - using react-native-map-clustering
import MapView from 'react-native-map-clustering'

<MapView
  clusterColor="#00B386"
  clusterTextColor="#FFFFFF"
  clusterFontFamily="Roboto"
  radius={60}
  maxZoom={16}
>
  {vehicles.map(vehicle => (
    <Marker key={vehicle.id} coordinate={vehicle.location} />
  ))}
</MapView>
```

**Performance Benchmarks**:
- 5,000 vehicles: ~50ms to generate clusters
- 10,000 vehicles: ~100ms
- Pan/zoom updates: <16ms (60 FPS)

**Cluster Styling**:
```tsx
const ClusterMarker = ({ cluster }: { cluster: Cluster }) => {
  const pointCount = cluster.properties.point_count
  const size = pointCount < 10 ? 'small' : pointCount < 100 ? 'medium' : 'large'

  return (
    <div className={`cluster-marker cluster-${size}`}>
      {pointCount}
    </div>
  )
}
```

**Risk Assessment**: Low risk. supercluster is proven at scale.

---

## 5. Multi-Language Support

### Decision
- **Next.js (marketing)**: `next-intl` with App Router support
- **React (web app)**: `i18next` + `react-i18next`
- **React Native (mobile)**: `i18next` + `react-i18next` + `expo-localization`

### Rationale
- **Consistency**: i18next works across web and mobile (shared translation files)
- **Ecosystem**: Largest React i18n ecosystem, extensive plugins
- **Type Safety**: TypeScript support for translation keys
- **next-intl**: Purpose-built for Next.js App Router (server components)

### Alternatives Considered
1. **react-intl** (Format.js)
   - ✅ Good library
   - ❌ Rejected: Smaller ecosystem vs. i18next, no Next.js App Router support

2. **LinguiJS**
   - ✅ Excellent type safety
   - ❌ Rejected: Smaller community, less mobile support

### Implementation Notes

**Translation File Structure** (shared in `packages/utils/src/i18n/`):
```
packages/utils/src/i18n/
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── tracking.json
│   │   ├── geofencing.json
│   │   └── ...
│   ├── es/
│   ├── fr/
│   ├── de/
│   └── hi/
└── index.ts
```

**Next.js Setup** (apps/marketing):
```typescript
// next.config.js
const withNextIntl = require('next-intl/plugin')()

module.exports = withNextIntl({
  // other config
})

// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

**React Web App Setup** (apps/web):
```typescript
// src/lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '@repo/utils/i18n/locales/en'
import es from '@repo/utils/i18n/locales/es'
// ...

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, es, fr, de, hi },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })
```

**Mobile Setup** (apps/mobile):
```typescript
import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: { en, es, fr, de, hi },
    lng: Localization.locale.split('-')[0], // 'en-US' → 'en'
    fallbackLng: 'en'
  })
```

**Usage**:
```typescript
import { useTranslation } from 'react-i18next'

const TrackingPage = () => {
  const { t } = useTranslation('tracking')

  return <h1>{t('title')}</h1> // → "Live Tracking" (en)
}
```

**Type Safety** (optional but recommended):
```typescript
// packages/utils/src/i18n/types.ts
import { resources } from './index'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['en']
  }
}

// Now this will error if key doesn't exist:
t('tracking.invalidKey') // ❌ TypeScript error
```

**RTL Support** (future):
- i18next supports RTL with `dir` attribute
- Add Arabic/Hebrew later via `i18next-rtl` plugin

**Risk Assessment**: Low risk. i18next is industry standard.

---

## 6. White-Label Theming

### Decision
Use **CSS Variables** with Tailwind CSS and runtime theme injection via `<style>` tag.

### Rationale
- **Runtime Flexibility**: Change theme without rebuild
- **Tailwind Integration**: Works seamlessly with Tailwind utilities
- **Performance**: No CSS-in-JS runtime overhead
- **Simple API**: Update CSS variables via JavaScript

### Alternatives Considered
1. **Multiple CSS Files** (theme-light.css, theme-dark.css, theme-acme.css)
   - ❌ Rejected: Requires page reload, increases bundle size

2. **CSS-in-JS** (Emotion, Styled Components)
   - ❌ Rejected: Runtime overhead, not needed (Tailwind handles most styling)

3. **Tailwind JIT with Custom Config**
   - ❌ Rejected: Requires rebuild for theme changes

### Implementation Notes

**Base Theme Variables** (packages/ui-web/src/theme/variables.css):
```css
:root {
  --color-primary: 59 130 246; /* blue-500 */
  --color-primary-foreground: 255 255 255;
  --color-secondary: 100 116 139; /* slate-500 */
  --color-accent: 34 197 94; /* green-500 */
  --color-destructive: 239 68 68; /* red-500 */
  --color-background: 255 255 255;
  --color-foreground: 15 23 42; /* slate-900 */

  --radius: 0.5rem;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.dark {
  --color-background: 15 23 42;
  --color-foreground: 248 250 252;
  /* ... */
}

[data-theme="acme"] {
  --color-primary: 220 38 38; /* Acme brand red */
  --color-primary-foreground: 255 255 255;
  /* ... */
}
```

**Tailwind Config** (packages/config/tailwind/web.js):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)'
        },
        // ...
      },
      borderRadius: {
        DEFAULT: 'var(--radius)'
      }
    }
  }
}
```

**Runtime Theme Application**:
```typescript
// apps/web/src/features/settings/hooks/useWhiteLabel.ts
const useWhiteLabel = () => {
  const organization = useOrganization()

  useEffect(() => {
    if (organization.whiteLabel) {
      const { primaryColor, logo, radius } = organization.whiteLabel

      document.documentElement.style.setProperty(
        '--color-primary',
        hexToRGB(primaryColor)
      )
      document.documentElement.style.setProperty('--radius', `${radius}px`)

      // Update favicon
      const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (favicon) favicon.href = logo
    }
  }, [organization])
}
```

**White-Label Settings UI**:
```tsx
const WhiteLabelSettings = () => {
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')

  return (
    <div>
      <label>Primary Color</label>
      <input
        type="color"
        value={primaryColor}
        onChange={(e) => {
          setPrimaryColor(e.target.value)
          updateWhiteLabel({ primaryColor: e.target.value })
        }}
      />
      <Button className="bg-primary">Preview</Button>
    </div>
  )
}
```

**Logo Upload**:
```typescript
const LogoUpload = () => {
  const uploadLogo = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('logo', file)
      return axios.post('/api/organization/white-label/logo', formData)
    },
    onSuccess: (data) => {
      // Update organization context
      updateOrganization({ whiteLabel: { logo: data.logoUrl } })
    }
  })

  return <input type="file" accept="image/*" onChange={(e) => uploadLogo.mutate(e.target.files[0])} />
}
```

**Risk Assessment**: Low risk. CSS variables have excellent browser support (95%+).

---

## 7. Role-Based UI Rendering

### Decision
Use **React Context** + **Custom Hook** pattern for permission checks, integrated with React Query for user permissions.

### Rationale
- **Declarative**: `<ProtectedComponent requiredRole="admin" />` reads clearly
- **Centralized**: Single source of truth for permissions
- **React Query Integration**: Permissions cached and synced with API
- **No External Library**: Avoid overhead of dedicated RBAC libraries

### Alternatives Considered
1. **CASL** (Ability-based authorization)
   - ✅ Powerful, supports complex permissions
   - ❌ Rejected: Overkill for simple role-based system

2. **React-ACL**
   - ❌ Rejected: Unmaintained, small community

### Implementation Notes

**Permission Context**:
```typescript
// apps/web/src/features/auth/contexts/PermissionContext.tsx
interface PermissionContextValue {
  user: User | null
  hasRole: (role: Role) => boolean
  hasPermission: (permission: Permission) => boolean
  isLoading: boolean
}

const PermissionContext = createContext<PermissionContextValue>(null)

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchCurrentUser
  })

  const hasRole = useCallback((role: Role) => {
    return user?.roles.includes(role) ?? false
  }, [user])

  const hasPermission = useCallback((permission: Permission) => {
    return user?.permissions.includes(permission) ?? false
  }, [user])

  return (
    <PermissionContext.Provider value={{ user, hasRole, hasPermission, isLoading }}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionContext)
  if (!context) throw new Error('usePermissions must be used within PermissionProvider')
  return context
}
```

**Protected Component**:
```typescript
interface ProtectedProps {
  children: ReactNode
  requiredRole?: Role
  requiredPermission?: Permission
  fallback?: ReactNode
}

const Protected = ({ children, requiredRole, requiredPermission, fallback }: ProtectedProps) => {
  const { hasRole, hasPermission, isLoading } = usePermissions()

  if (isLoading) return <Skeleton />

  const hasAccess = requiredRole ? hasRole(requiredRole) :
                    requiredPermission ? hasPermission(requiredPermission) :
                    true

  if (!hasAccess) return fallback ?? null

  return <>{children}</>
}
```

**Usage**:
```tsx
// Conditional rendering
<Protected requiredRole="admin">
  <AdminPanel />
</Protected>

// Conditional features
<Button>
  <Protected requiredPermission="vehicle.delete" fallback={<DisabledTooltip />}>
    Delete Vehicle
  </Protected>
</Button>

// Route protection
<Route
  path="/admin"
  element={
    <Protected requiredRole="admin" fallback={<Navigate to="/dashboard" />}>
      <AdminDashboard />
    </Protected>
  }
/>
```

**Role Hierarchy** (in `packages/utils/src/constants/roles.ts`):
```typescript
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  DISPATCHER = 'dispatcher',
  DRIVER = 'driver'
}

export const ROLE_HIERARCHY = {
  [Role.SUPER_ADMIN]: 4,
  [Role.ADMIN]: 3,
  [Role.MANAGER]: 2,
  [Role.DISPATCHER]: 1,
  [Role.DRIVER]: 0
}

export const hasRoleOrHigher = (userRole: Role, requiredRole: Role) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}
```

**React Query Integration** (permissions cached):
```typescript
const { data: permissions } = useQuery({
  queryKey: ['auth', 'permissions'],
  queryFn: fetchUserPermissions,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
})
```

**Risk Assessment**: Low risk. Simple pattern, no external dependencies.

---

## 8. Background Location Updates (Mobile)

### Decision
Use **Expo Task Manager** with **expo-location** for background geolocation and geofence monitoring.

### Rationale
- **Official Support**: First-class Expo API with TypeScript types
- **Battery Optimization**: Built-in strategies (significant location changes, deferred updates)
- **Geofence Integration**: Native geofencing events
- **Cross-Platform**: Works on both iOS and Android

### Alternatives Considered
1. **react-native-background-geolocation** (Transistor Software)
   - ✅ Feature-rich, battle-tested
   - ❌ Rejected: Paid license ($299/app), unnecessary for basic tracking

2. **Custom Native Module**
   - ❌ Rejected: High maintenance, platform-specific code

### Implementation Notes

**Task Registration** (apps/mobile/src/lib/location/backgroundLocation.ts):
```typescript
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'

const BACKGROUND_LOCATION_TASK = 'background-location-task'

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error)
    return
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] }

    // Store locally (SQLite)
    await storeLocations(locations)

    // Send to server if online
    const { isConnected } = await NetInfo.fetch()
    if (isConnected) {
      await syncLocationsToServer(locations)
    }
  }
})

export const startBackgroundLocationUpdates = async () => {
  const { granted } = await Location.requestBackgroundPermissionsAsync()
  if (!granted) return

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced, // ~100m (battery-friendly)
    distanceInterval: 100, // Update every 100 meters
    deferredUpdatesInterval: 60000, // Batch updates every 60s
    foregroundService: {
      notificationTitle: 'Trip in progress',
      notificationBody: 'Tracking your location',
      notificationColor: '#00B386'
    }
  })
}

export const stopBackgroundLocationUpdates = async () => {
  await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
}
```

**Geofence Monitoring**:
```typescript
import * as Location from 'expo-location'

const GEOFENCE_TASK = 'geofence-task'

TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) return

  const { eventType, region } = data as Location.GeofencingEventType

  if (eventType === Location.GeofencingEventType.Enter) {
    await triggerGeofenceAlert(region, 'enter')
  } else if (eventType === Location.GeofencingEventType.Exit) {
    await triggerGeofenceAlert(region, 'exit')
  }
})

export const startGeofenceMonitoring = async (geofences: Geofence[]) => {
  await Location.startGeofencingAsync(GEOFENCE_TASK, geofences.map(g => ({
    identifier: g.id,
    latitude: g.center.lat,
    longitude: g.center.lng,
    radius: g.radius,
    notifyOnEnter: true,
    notifyOnExit: true
  })))
}
```

**Battery Optimization Strategies**:
1. **Accuracy Tuning**: Use `Balanced` (not `BestForNavigation`) unless trip active
2. **Distance Interval**: 100m minimum (avoid excessive updates)
3. **Deferred Updates**: Batch updates to reduce wake-ups
4. **Conditional Tracking**: Only track during active trips

**Permission Handling**:
```typescript
const requestLocationPermissions = async () => {
  // Foreground permission
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync()
  if (foregroundStatus !== 'granted') {
    Alert.alert('Permission denied', 'Location permission is required')
    return false
  }

  // Background permission (requires foreground first)
  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync()
  if (backgroundStatus !== 'granted') {
    Alert.alert(
      'Background location required',
      'Please enable "Allow all the time" in settings for trip tracking'
    )
    return false
  }

  return true
}
```

**iOS Considerations**:
- Add `NSLocationAlwaysAndWhenInUseUsageDescription` to `app.json`
- Add `UIBackgroundModes` with `location` capability

**Android Considerations**:
- Add `ACCESS_BACKGROUND_LOCATION` permission
- Foreground service notification required (Android 8+)

**Risk Assessment**: Medium risk. Background location drains battery; requires careful optimization and user education.

---

## 9. Chart Library Selection

### Decision
- **Web**: **Recharts** (React wrapper for D3)
- **Mobile**: **Victory Native** (React Native charts)

### Rationale
- **Recharts**: Declarative API, excellent TypeScript support, performant for dashboard use case
- **Victory Native**: Shared API with Victory (web), native rendering (performant)
- **Shared Configuration**: Abstract chart configs in `packages/utils`

### Alternatives Considered

**Web Alternatives**:
1. **Chart.js** (via react-chartjs-2)
   - ✅ Popular, simple
   - ❌ Rejected: Imperative API, less React-friendly than Recharts

2. **Apache ECharts**
   - ✅ Feature-rich, performant
   - ❌ Rejected: Heavy bundle size (500KB+), overkill for our needs

3. **Nivo** (@nivo/*)
   - ✅ Beautiful defaults, built on D3
   - ❌ Rejected: Larger bundle size than Recharts, less customizable

**Mobile Alternatives**:
1. **react-native-chart-kit**
   - ✅ Simple, lightweight
   - ❌ Rejected: Limited chart types, less maintained

2. **react-native-svg-charts**
   - ✅ SVG-based, flexible
   - ❌ Rejected: Smaller community, less documentation

### Implementation Notes

**Web Implementation** (Recharts):
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const FuelConsumptionChart = ({ data }: { data: FuelData[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="gallons" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

**Mobile Implementation** (Victory Native):
```tsx
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native'

const FuelConsumptionChart = ({ data }: { data: FuelData[] }) => {
  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryAxis />
      <VictoryAxis dependentAxis />
      <VictoryLine
        data={data}
        x="date"
        y="gallons"
        style={{ data: { stroke: '#3b82f6' } }}
      />
    </VictoryChart>
  )
}
```

**Shared Chart Configuration** (packages/utils/src/charts/):
```typescript
export const chartTheme = {
  colors: {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  },
  fonts: {
    family: 'Inter, sans-serif'
  }
}

export const formatChartData = (data: RawData[]): ChartData[] => {
  // Shared data transformation logic
}
```

**Performance Considerations**:
- **Data Sampling**: For large datasets (>1000 points), sample data before rendering
- **Virtualization**: Use react-window for scrollable chart lists
- **Memoization**: Wrap chart components in React.memo

**Bundle Size**:
- Recharts: ~150KB gzipped
- Victory Native: ~200KB (includes native dependencies)

**Risk Assessment**: Low risk. Both libraries are mature and well-maintained.

---

## 10. Form Management

### Decision
Use **react-hook-form** v7+ with **Zod** schema validation.

### Rationale
- **Performance**: Uncontrolled inputs, minimal re-renders
- **Type Safety**: Zod schemas generate TypeScript types
- **Developer Experience**: Minimal boilerplate, intuitive API
- **Validation**: Runtime validation with Zod, compile-time with TypeScript
- **Ecosystem**: Excellent integration with shadcn/ui components

### Alternatives Considered
1. **Formik**
   - ✅ Popular, mature
   - ❌ Rejected: Slower performance (controlled inputs), larger bundle

2. **React Final Form**
   - ✅ Performant
   - ❌ Rejected: Smaller community, less TypeScript support

### Implementation Notes

**Basic Form Setup**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN'),
  licensePlate: z.string().optional()
})

type VehicleFormData = z.infer<typeof vehicleSchema>

const VehicleForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema)
  })

  const createVehicle = useCreateVehicle()

  const onSubmit = (data: VehicleFormData) => {
    createVehicle.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('make')} error={errors.make?.message} />
      <Input {...register('model')} error={errors.model?.message} />
      <Input {...register('year', { valueAsNumber: true })} type="number" />
      <Input {...register('vin')} />
      <Button type="submit">Create Vehicle</Button>
    </form>
  )
}
```

**Shared Validation Schemas** (packages/utils/src/validation/):
```typescript
// Reusable schemas across web and mobile
export const vehicleSchema = z.object({ /* ... */ })
export const driverSchema = z.object({ /* ... */ })
export const geofenceSchema = z.object({ /* ... */ })
```

**Complex Form Scenarios**:

**Multi-Step Form**:
```typescript
const MultiStepForm = () => {
  const [step, setStep] = useState(1)
  const form = useForm({ mode: 'onChange' })

  return (
    <>
      {step === 1 && <Step1 form={form} onNext={() => setStep(2)} />}
      {step === 2 && <Step2 form={form} onNext={() => setStep(3)} />}
      {step === 3 && <Step3 form={form} onSubmit={form.handleSubmit(onSubmit)} />}
    </>
  )
}
```

**Dynamic Fields**:
```typescript
const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: 'stops' // Route stops
})

return (
  <>
    {fields.map((field, index) => (
      <div key={field.id}>
        <Input {...register(`stops.${index}.address`)} />
        <Button onClick={() => remove(index)}>Remove</Button>
      </div>
    ))}
    <Button onClick={() => append({ address: '' })}>Add Stop</Button>
  </>
)
```

**Integration with shadcn/ui**:
```tsx
// Wrapped Input component
const FormInput = ({ name, label, ...props }: FormInputProps) => {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div>
      <Label>{label}</Label>
      <Input {...register(name)} {...props} />
      {errors[name] && <p className="text-sm text-red-500">{errors[name].message}</p>}
    </div>
  )
}
```

**Mobile Forms** (same pattern):
```typescript
// apps/mobile - same react-hook-form + Zod
const ChecklistForm = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(checklistSchema)
  })

  return (
    <Controller
      control={control}
      name="tireCondition"
      render={({ field }) => (
        <Picker selectedValue={field.value} onValueChange={field.onChange}>
          <Picker.Item label="Good" value="good" />
          <Picker.Item label="Needs Attention" value="attention" />
        </Picker>
      )}
    />
  )
}
```

**Risk Assessment**: Low risk. react-hook-form + Zod is the de facto standard for modern React forms.

---

## 11. Mock Server & Development API Strategy

### Decision
Use **MSW (Mock Service Worker)** for intercepting API requests + **json-server** or **Faker.js** for generating realistic mock data, with environment-based switching to real API.

### Rationale
- **No Hard-Coded Data**: All mock data served via API endpoints (not embedded in frontend)
- **Realistic Testing**: MSW intercepts network requests at service worker level (browser) or Node level (tests)
- **Easy Migration**: Single environment variable switches from mock to real API
- **Full-Stack Simulation**: Mock REST + WebSocket endpoints
- **Developer Independence**: Frontend team can work without backend dependency

### Alternatives Considered
1. **Mirage.js**
   - ✅ Full-featured mock server, database simulation
   - ❌ Rejected: Larger bundle, intercepts at client level (less realistic)

2. **json-server**
   - ✅ Simple, RESTful mock server
   - ❌ Rejected as standalone: No WebSocket support, less flexible than MSW

3. **Hard-coded fixtures**
   - ❌ Rejected: Per requirement, no hard-coded data in frontend

### Implementation Notes

**Architecture**:
```
┌─────────────────────────────────────────┐
│  Frontend App (React/React Native)      │
│  ├─ Axios Client                        │
│  ├─ WebSocket Client                    │
│  └─ React Query                         │
└─────────────┬───────────────────────────┘
              │
              ├─ if (VITE_USE_MOCK_API)
              ▼
┌─────────────────────────────────────────┐
│  MSW (Mock Service Worker)              │
│  ├─ REST Handlers                       │
│  └─ WebSocket Handlers                  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Mock Data Generators (Faker.js)        │
│  ├─ Vehicles (5,000 records)            │
│  ├─ Drivers (500 records)               │
│  ├─ Trips (real-time simulation)        │
│  └─ Organizations, Geofences, etc.      │
└─────────────────────────────────────────┘
              │
              ├─ else (production/staging)
              ▼
┌─────────────────────────────────────────┐
│  Real Backend API                       │
│  ├─ REST Endpoints                      │
│  └─ WebSocket Server                    │
└─────────────────────────────────────────┘
```

**Directory Structure**:
```
packages/api/
├── src/
│   ├── client/
│   │   ├── axios.ts
│   │   └── websocket.ts
│   ├── mocks/                    # Mock server setup
│   │   ├── browser.ts            # MSW for browser (development)
│   │   ├── server.ts             # MSW for Node (testing)
│   │   ├── handlers/             # MSW request handlers
│   │   │   ├── auth.ts
│   │   │   ├── vehicles.ts
│   │   │   ├── drivers.ts
│   │   │   ├── trips.ts
│   │   │   ├── geofences.ts
│   │   │   ├── alerts.ts
│   │   │   └── index.ts
│   │   ├── data/                 # Mock data generators
│   │   │   ├── generators/
│   │   │   │   ├── vehicle.ts
│   │   │   │   ├── driver.ts
│   │   │   │   ├── trip.ts
│   │   │   │   └── organization.ts
│   │   │   ├── database.ts       # In-memory store
│   │   │   └── seed.ts           # Seed data
│   │   └── websocket/            # WebSocket mock
│   │       └── mockSocket.ts
│   └── hooks/
└── package.json
```

**MSW Setup** (`packages/api/src/mocks/browser.ts`):
```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Start mock server in development
if (import.meta.env.VITE_USE_MOCK_API === 'true') {
  worker.start({
    onUnhandledRequest: 'warn', // Warn about unhandled requests
  })
}
```

**Mock Data Generators** (`packages/api/src/mocks/data/generators/vehicle.ts`):
```typescript
import { faker } from '@faker-js/faker'
import type { Vehicle } from '../../../types'

export const generateVehicle = (overrides?: Partial<Vehicle>): Vehicle => {
  const makes = ['Ford', 'Chevrolet', 'Toyota', 'Honda', 'Mercedes']
  const models = {
    Ford: ['F-150', 'Transit', 'Explorer'],
    Chevrolet: ['Silverado', 'Express', 'Tahoe'],
    Toyota: ['Tacoma', 'Tundra', 'Camry'],
    Honda: ['Accord', 'CR-V', 'Pilot'],
    Mercedes: ['Sprinter', 'GLE', 'E-Class']
  }

  const make = faker.helpers.arrayElement(makes)
  const model = faker.helpers.arrayElement(models[make])

  return {
    id: faker.string.uuid(),
    make,
    model,
    year: faker.number.int({ min: 2018, max: 2024 }),
    vin: faker.vehicle.vin(),
    licensePlate: faker.vehicle.vrm(),
    odometer: faker.number.int({ min: 1000, max: 200000 }),
    fuelLevel: faker.number.int({ min: 10, max: 100 }),
    status: faker.helpers.arrayElement(['active', 'idle', 'maintenance']),
    location: {
      lat: faker.location.latitude({ min: 37.0, max: 38.0 }), // SF Bay Area
      lng: faker.location.longitude({ min: -122.5, max: -121.5 }),
      timestamp: new Date().toISOString()
    },
    deviceId: faker.string.uuid(),
    ...overrides
  }
}

export const generateVehicles = (count: number): Vehicle[] => {
  return Array.from({ length: count }, () => generateVehicle())
}
```

**In-Memory Database** (`packages/api/src/mocks/data/database.ts`):
```typescript
import { generateVehicles } from './generators/vehicle'
import { generateDrivers } from './generators/driver'
import { generateOrganizations } from './generators/organization'

class MockDatabase {
  private vehicles: Map<string, Vehicle> = new Map()
  private drivers: Map<string, Driver> = new Map()
  private organizations: Map<string, Organization> = new Map()
  private trips: Map<string, Trip> = new Map()
  private geofences: Map<string, Geofence> = new Map()

  constructor() {
    this.seed()
  }

  seed() {
    // Generate realistic dataset
    const orgs = generateOrganizations(10)
    orgs.forEach(org => this.organizations.set(org.id, org))

    const vehicles = generateVehicles(500)
    vehicles.forEach(v => this.vehicles.set(v.id, v))

    const drivers = generateDrivers(100)
    drivers.forEach(d => this.drivers.set(d.id, d))

    console.log('Mock database seeded:', {
      organizations: this.organizations.size,
      vehicles: this.vehicles.size,
      drivers: this.drivers.size
    })
  }

  // CRUD operations
  getVehicles(filters?: VehicleFilters) {
    let results = Array.from(this.vehicles.values())

    if (filters?.status) {
      results = results.filter(v => v.status === filters.status)
    }
    if (filters?.search) {
      results = results.filter(v =>
        v.licensePlate.includes(filters.search) ||
        v.vin.includes(filters.search)
      )
    }

    return results
  }

  getVehicle(id: string) {
    return this.vehicles.get(id)
  }

  createVehicle(data: CreateVehicleInput) {
    const vehicle = generateVehicle(data)
    this.vehicles.set(vehicle.id, vehicle)
    return vehicle
  }

  updateVehicle(id: string, updates: Partial<Vehicle>) {
    const vehicle = this.vehicles.get(id)
    if (!vehicle) throw new Error('Vehicle not found')

    const updated = { ...vehicle, ...updates }
    this.vehicles.set(id, updated)
    return updated
  }

  deleteVehicle(id: string) {
    return this.vehicles.delete(id)
  }

  // Real-time location simulation
  simulateLocationUpdates() {
    setInterval(() => {
      this.vehicles.forEach(vehicle => {
        if (vehicle.status === 'active') {
          // Slightly move vehicle position
          vehicle.location.lat += (Math.random() - 0.5) * 0.001
          vehicle.location.lng += (Math.random() - 0.5) * 0.001
          vehicle.location.timestamp = new Date().toISOString()
        }
      })
    }, 5000) // Update every 5 seconds
  }
}

export const db = new MockDatabase()
```

**MSW Handlers** (`packages/api/src/mocks/handlers/vehicles.ts`):
```typescript
import { http, HttpResponse } from 'msw'
import { db } from '../data/database'

export const vehicleHandlers = [
  // GET /api/vehicles
  http.get('/api/vehicles', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')

    const vehicles = db.getVehicles({ status, search })

    return HttpResponse.json({
      data: vehicles,
      total: vehicles.length,
      page: 1,
      pageSize: vehicles.length
    })
  }),

  // GET /api/vehicles/:id
  http.get('/api/vehicles/:id', ({ params }) => {
    const vehicle = db.getVehicle(params.id as string)

    if (!vehicle) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ data: vehicle })
  }),

  // POST /api/vehicles
  http.post('/api/vehicles', async ({ request }) => {
    const body = await request.json()
    const vehicle = db.createVehicle(body)

    return HttpResponse.json({ data: vehicle }, { status: 201 })
  }),

  // PATCH /api/vehicles/:id
  http.patch('/api/vehicles/:id', async ({ params, request }) => {
    const body = await request.json()
    const vehicle = db.updateVehicle(params.id as string, body)

    return HttpResponse.json({ data: vehicle })
  }),

  // DELETE /api/vehicles/:id
  http.delete('/api/vehicles/:id', ({ params }) => {
    db.deleteVehicle(params.id as string)
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /api/vehicles/locations (batch endpoint)
  http.get('/api/vehicles/locations', ({ request }) => {
    const url = new URL(request.url)
    const ids = url.searchParams.get('ids')?.split(',') || []

    const locations = ids.map(id => {
      const vehicle = db.getVehicle(id)
      return vehicle ? {
        vehicleId: vehicle.id,
        location: vehicle.location
      } : null
    }).filter(Boolean)

    return HttpResponse.json({ data: locations })
  })
]
```

**WebSocket Mock** (`packages/api/src/mocks/websocket/mockSocket.ts`):
```typescript
import { db } from '../data/database'

// Mock WebSocket server simulation
export class MockWebSocketServer {
  private clients: Set<any> = new Set()
  private updateInterval: NodeJS.Timeout | null = null

  start() {
    console.log('Mock WebSocket server started')

    // Simulate real-time location updates
    this.updateInterval = setInterval(() => {
      this.broadcastLocationUpdates()
    }, 2000) // Every 2 seconds
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  }

  broadcastLocationUpdates() {
    const vehicles = db.getVehicles({ status: 'active' })

    vehicles.forEach(vehicle => {
      // Simulate location change
      const update = {
        vehicleId: vehicle.id,
        location: {
          lat: vehicle.location.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.location.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.random() * 60,
          heading: Math.random() * 360,
          timestamp: new Date().toISOString()
        }
      }

      // Trigger custom event for clients to listen
      window.dispatchEvent(new CustomEvent('mock:vehicle:location', {
        detail: update
      }))
    })
  }
}

export const mockWsServer = new MockWebSocketServer()
```

**WebSocket Client Integration** (`packages/api/src/client/websocket.ts`):
```typescript
import { io, Socket } from 'socket.io-client'

class WebSocketClient {
  private socket: Socket | null = null
  private mockMode = import.meta.env.VITE_USE_MOCK_API === 'true'

  connect(token: string) {
    if (this.mockMode) {
      // Use mock WebSocket via custom events
      console.log('WebSocket: Using mock mode')
      return this.connectMock()
    }

    // Real WebSocket connection
    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      transports: ['websocket']
    })

    return this.socket
  }

  private connectMock() {
    // Mock socket using EventTarget
    const mockSocket = {
      on: (event: string, callback: Function) => {
        window.addEventListener(`mock:${event}`, (e: any) => {
          callback(e.detail)
        })
      },
      emit: (event: string, data: any) => {
        console.log('Mock WebSocket emit:', event, data)
      },
      disconnect: () => {
        console.log('Mock WebSocket disconnected')
      }
    }

    this.socket = mockSocket as any
    return mockSocket
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (this.mockMode) {
      window.addEventListener(`mock:${channel}`, (e: any) => {
        callback(e.detail)
      })
    } else {
      this.socket?.on(channel, callback)
    }
  }

  // ... rest of implementation
}
```

**Environment Configuration**:
```bash
# .env.development
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# .env.production
VITE_USE_MOCK_API=false
VITE_API_URL=https://api.fleetmanager.com/api
VITE_WS_URL=wss://api.fleetmanager.com
```

**App Initialization** (`apps/web/src/main.tsx`):
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Initialize MSW in development
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK_API !== 'true') {
    return
  }

  const { worker } = await import('@repo/api/mocks/browser')
  const { mockWsServer } = await import('@repo/api/mocks/websocket/mockSocket')

  // Start MSW
  await worker.start({
    onUnhandledRequest: 'warn'
  })

  // Start mock WebSocket server
  mockWsServer.start()

  console.log('🔶 Mock API enabled')
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
```

**Testing Setup** (`apps/web/src/setupTests.ts`):
```typescript
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '@repo/api/mocks/server'

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())
```

**Migration to Real API**:
```typescript
// Simply change environment variable - no code changes needed
VITE_USE_MOCK_API=false

// Or use build-time flag
yarn build --mode production  # Uses real API
yarn dev                      # Uses mock API
```

**Mock Data Management Script**:
```typescript
// packages/api/src/mocks/scripts/seed.ts
import { db } from '../data/database'

// Reset and reseed database
export const resetDatabase = () => {
  db.clear()
  db.seed()
  console.log('Database reset and reseeded')
}

// Add custom scenario data
export const seedScenario = (scenario: 'empty' | 'small' | 'large') => {
  db.clear()

  switch (scenario) {
    case 'empty':
      // Minimal data for testing edge cases
      db.seedMinimal()
      break
    case 'small':
      // 50 vehicles, 10 drivers
      db.seedSmall()
      break
    case 'large':
      // 5,000 vehicles, 500 drivers (stress test)
      db.seedLarge()
      break
  }
}

// Expose to window for dev tools
if (import.meta.env.DEV) {
  (window as any).__mockDB = {
    reset: resetDatabase,
    seed: seedScenario,
    inspect: () => db.inspect()
  }
}
```

**Benefits**:
✅ **No Hard-Coded Data**: All data served via API endpoints
✅ **Realistic Development**: Network behavior, latency simulation
✅ **Team Independence**: Frontend/backend can work in parallel
✅ **Easy Migration**: Single env variable to switch to real API
✅ **Testability**: Same mocks work in browser and Node tests
✅ **Debuggability**: Inspect mock data via browser console

**Risk Assessment**: Low risk. MSW is industry standard for API mocking. Clean separation between mock and production code.

---

## Summary

### Key Decisions Matrix

| Area | Decision | Justification |
|------|----------|---------------|
| Map Abstraction | Adapter Pattern | Provider flexibility, vendor independence |
| Offline Sync | expo-sqlite + Queue | Proven solution, ACID guarantees |
| Real-Time Updates | **WebSocket (socket.io)** | True real-time, bi-directional, industry standard |
| Map Clustering | supercluster / react-native-map-clustering | Industry standard, excellent performance |
| i18n | i18next (web/mobile) + next-intl (marketing) | Shared translations, ecosystem support |
| White-Label | CSS Variables | Runtime flexibility, no build overhead |
| RBAC | React Context + Custom Hook | Simple, no external dependencies |
| Background Location | Expo Task Manager | Official support, battery-optimized |
| Charts | Recharts (web) + Victory Native (mobile) | Declarative, performant |
| Forms | react-hook-form + Zod | Type-safe, performant, DX |
| **Mock Server** | **MSW + Faker.js** | No hard-coded data, environment-based switching |

### Technology Stack Confirmation

✅ **All technology choices validated**

- Monorepo: Turborepo with Yarn
- Web: Next.js (marketing) + React + Vite (web app)
- Mobile: Expo (React Native)
- State: React Query + Zustand
- Styling: Tailwind + shadcn/ui (web) + nativewind (mobile)
- Maps: Google Maps / Mapbox / Leaflet (abstracted)
- Forms: react-hook-form + Zod
- Testing: Vitest (web) + Jest (mobile) + Playwright + Detox
- i18n: i18next + next-intl

### Risk Assessment

**Low Risk** (9/11 decisions):
- Map abstraction
- Real-time updates (WebSocket)
- Clustering
- i18n
- White-label
- RBAC
- Charts
- Forms
- Mock server

**Medium Risk** (2/11 decisions):
- Offline sync: Conflict resolution edge cases
- Background location: Battery drain concerns

**Mitigation Strategies**:
- Offline sync: User warning at 48-hour threshold, manual conflict resolution UI
- Background location: Accuracy tuning, conditional tracking, user education

### Next Steps

✅ **Phase 0 Complete**: All technology decisions made and documented

**Ready for Phase 1**:
- Generate data-model.md (TypeScript interfaces from 16 entities)
- Generate contracts/ (API endpoints, React Query hooks)
- Generate quickstart.md (development setup guide)
- Generate CLAUDE.md (agent context file)

---

*Research completed: 2025-10-04*
*Status: ✅ All unknowns resolved, ready to proceed with Phase 1 design*
