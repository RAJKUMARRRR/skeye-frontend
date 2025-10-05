# Tasks: Fleet Management Platform - Complete Implementation

**Feature**: Fleet Management Platform - Full-Featured Multi-Platform System
**Branch**: `001-you-are-a`
**Input**: Design documents from `/specs/001-you-are-a/`
**Prerequisites**: plan.md ✅, research.md ✅, spec.md ✅
**Goal**: Implement all 213 functional requirements across web, mobile, and marketing platforms

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Loaded: Turborepo monorepo with 3 apps + 5 packages
   → Tech Stack: Next.js (marketing), React+Vite (web), Expo (mobile)
2. Load design documents:
   → ✅ research.md: 11 technical decisions documented
   → ✅ spec.md: 213 functional requirements, 16 entities
3. Generate tasks by category:
   → Foundation: Monorepo, shared packages, tooling (T001-T025)
   → Mock Server: MSW with realistic data (T026-T035)
   → Marketing Site: Next.js 14 with App Router (T036-T050)
   → Web App Core: Auth, layout, dashboard (T051-T075)
   → Web App Features: All 14 modules (T076-T160)
   → Mobile App: React Native with Expo (T161-T195)
   → Integration: WebSocket, offline sync (T196-T210)
   → Testing: Unit, component, E2E (T211-T230)
   → Polish: i18n, accessibility, performance (T231-T250)
4. Apply dependency ordering:
   → Foundation → Shared Packages → Apps in parallel
   → Core before features, tests throughout
5. Number tasks sequentially (T001-T250)
6. Return: SUCCESS (complete implementation ready)
```

## Scope

**Complete Implementation**:
✅ Marketing website (Next.js 14 - App Router, SSG, SEO)
✅ Web application (React+Vite - all 14 feature modules)
✅ Mobile application (React Native+Expo - driver experience)
✅ Mock API server (MSW + Faker.js - all entities)
✅ Real-time updates (WebSocket simulation)
✅ Offline sync (Mobile - SQLite with 7-day retention)
✅ Multi-language support (5 languages)
✅ White-label theming (Runtime CSS variables)
✅ Role-based access control (4 roles)
✅ All 213 functional requirements

**Total Tasks**: 250
**Estimated Timeline**: 16-20 weeks (team of 4-5 developers)

---

# PHASE 1: FOUNDATION & MONOREPO SETUP (T001-T025)

## 1.1 Monorepo Infrastructure

### T001: Initialize Turborepo monorepo with Yarn 4 ✅
**Description**: Create root-level Turborepo configuration with Yarn workspaces
**Files**:
- `package.json` (root)
- `turbo.json`
- `.gitignore`
- `yarn.lock`
- `.yarnrc.yml`

**Steps**:
```bash
yarn init -y
yarn set version stable
yarn add -D turbo
```

**Acceptance**: `yarn --version` shows 4.x, `turbo --version` works

---

### T002: Create complete workspace structure ✅
**Description**: Set up folder structure for all 3 apps and 5 packages
**Files**:
- `apps/marketing/`, `apps/web/`, `apps/mobile/`
- `packages/ui-web/`, `packages/ui-mobile/`, `packages/api/`, `packages/utils/`, `packages/config/`

**Dependencies**: T001
**Acceptance**: Directory structure matches plan.md

---

### T003 [P]: Configure shared TypeScript configs ✅
**Description**: Create TypeScript configurations for all platforms
**Files**:
- `packages/config/typescript/base.json`
- `packages/config/typescript/next.json`
- `packages/config/typescript/react.json`
- `packages/config/typescript/react-native.json`
- `packages/config/package.json`

**Dependencies**: T002
**Acceptance**: All configs are valid and extend correctly

---

### T004 [P]: Configure shared ESLint configs ✅
**Description**: Create ESLint configurations for all platforms
**Files**:
- `packages/config/eslint/base.js`
- `packages/config/eslint/next.js`
- `packages/config/eslint/react.js`
- `packages/config/eslint/react-native.js`

**Dependencies**: T002
**Acceptance**: ESLint runs without errors

---

### T005 [P]: Configure shared Tailwind configs ✅
**Description**: Create Tailwind configurations for web and mobile
**Files**:
- `packages/config/tailwind/base.js`
- `packages/config/tailwind/web.js`
- `packages/config/tailwind/mobile.js`

**Dependencies**: T002
**Acceptance**: Tailwind configs merge correctly

---

### T006 [P]: Configure Prettier and Husky ✅
**Description**: Set up code formatting and pre-commit hooks
**Files**:
- `.prettierrc`
- `.prettierignore`
- `.husky/pre-commit`
- `package.json` (scripts)

**Dependencies**: T001
**Acceptance**: `yarn format` works, pre-commit hook runs

---

## 1.2 Shared Packages - Utils

### T007: Initialize packages/utils with constants ✅
**Description**: Set up shared utilities package with TypeScript
**Files**:
- `packages/utils/package.json`
- `packages/utils/tsconfig.json`
- `packages/utils/src/index.ts`
- `packages/utils/src/constants/roles.ts`
- `packages/utils/src/constants/vehicle-status.ts`
- `packages/utils/src/constants/alert-types.ts`

**Content**:
```typescript
// constants/roles.ts
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
```

**Dependencies**: T003
**Acceptance**: Package builds successfully

---

### T008 [P]: Create date utility functions ✅
**Description**: Implement date formatting utilities
**Files**: `packages/utils/src/date/format.ts`, `index.ts`

**Dependencies**: T007
**Acceptance**: Date functions export correctly

---

### T009 [P]: Create format utility functions ✅
**Description**: Number, currency, distance formatting
**Files**: `packages/utils/src/format/number.ts`, `currency.ts`, `index.ts`

**Dependencies**: T007
**Acceptance**: Format functions work with test cases

---

### T010 [P]: Create map utility functions ✅
**Description**: Clustering, bounds, distance calculations
**Files**:
- `packages/utils/src/map/clustering.ts`
- `packages/utils/src/map/bounds.ts`
- `packages/utils/src/map/distance.ts`

**Content**:
```typescript
// clustering.ts - using supercluster
import Supercluster from 'supercluster'

export const createClusterIndex = (points: GeoJSONPoint[]) => {
  return new Supercluster({
    radius: 60,
    maxZoom: 16,
    minZoom: 0,
    minPoints: 2
  }).load(points)
}
```

**Dependencies**: T007
**Acceptance**: Clustering works with 500+ points

---

### T011 [P]: Create validation schemas with Zod ✅
**Description**: Shared validation schemas for all entities
**Files**:
- `packages/utils/src/validation/vehicle.ts`
- `packages/utils/src/validation/driver.ts`
- `packages/utils/src/validation/geofence.ts`
- `packages/utils/src/validation/route.ts`
- (+ 12 more entity schemas)

**Content**:
```typescript
// validation/vehicle.ts
import { z } from 'zod'

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN'),
  licensePlate: z.string().min(1)
})
```

**Dependencies**: T007
**Acceptance**: All 16 entity schemas created

---

## 1.3 Shared Packages - API & Types

### T012: Create TypeScript type definitions for all 16 entities ✅
**Description**: Complete type system in packages/api/src/types/
**Files**:
- `packages/api/src/types/organization.ts`
- `packages/api/src/types/user.ts`
- `packages/api/src/types/device.ts`
- `packages/api/src/types/vehicle.ts`
- `packages/api/src/types/driver.ts`
- `packages/api/src/types/trip.ts`
- `packages/api/src/types/geofence.ts`
- `packages/api/src/types/alert.ts`
- `packages/api/src/types/maintenance.ts`
- `packages/api/src/types/route.ts`
- `packages/api/src/types/behavior-event.ts`
- `packages/api/src/types/report.ts`
- `packages/api/src/types/webhook.ts`
- `packages/api/src/types/fuel-transaction.ts`
- `packages/api/src/types/checklist.ts`
- `packages/api/src/types/index.ts`

**Content**: (Based on spec.md entity definitions)
```typescript
// types/vehicle.ts
export interface Location {
  lat: number
  lng: number
  timestamp: string
  speed?: number
  heading?: number
  accuracy?: number
}

export interface Vehicle {
  id: string
  organizationId: string
  deviceId: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  odometer: number
  fuelLevel: number
  engineHours: number
  batteryVoltage: number
  status: 'active' | 'idle' | 'parked' | 'maintenance' | 'offline'
  location: Location
  assignedDriverId?: string
  createdAt: string
  updatedAt: string
}

// types/driver.ts (FR-068 to FR-078)
export interface Driver {
  id: string
  organizationId: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: string
  licenseState: string
  status: 'active' | 'inactive' | 'suspended'
  photoUrl?: string
  assignedVehicleIds: string[]
  performanceScore: number
  totalTrips: number
  totalDistance: number
  totalDrivingHours: number
  createdAt: string
  updatedAt: string
}

// types/geofence.ts (FR-031 to FR-041)
export interface Geofence {
  id: string
  organizationId: string
  name: string
  description?: string
  type: 'circle' | 'polygon'
  center?: { lat: number; lng: number }
  radius?: number
  coordinates?: Array<{ lat: number; lng: number }>
  color: string
  assignedVehicleIds: string[]
  rules: GeofenceRule[]
  createdAt: string
  updatedAt: string
}

export interface GeofenceRule {
  id: string
  eventType: 'entry' | 'exit'
  enabled: boolean
  alertUserIds: string[]
  timeRestriction?: {
    startTime: string
    endTime: string
    daysOfWeek: number[]
  }
}

// ... (continue for all 16 entities)
```

**Dependencies**: T003
**Acceptance**: All types export correctly, no TypeScript errors

---

### T013: Set up Axios client with interceptors ✅
**Description**: Configure HTTP client
**Files**:
- `packages/api/src/client/axios.ts`
- `packages/api/src/client/config.ts`
- `packages/api/src/client/interceptors.ts`

**Dependencies**: T012
**Acceptance**: Axios instance configured with auth interceptor

---

### T014: Create WebSocket client wrapper ✅
**Description**: Socket.io client with reconnection logic (research.md #3)
**Files**:
- `packages/api/src/client/websocket.ts`

**Content**:
```typescript
import { io, Socket } from 'socket.io-client'

class WebSocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private mockMode = import.meta.env.VITE_USE_MOCK_API === 'true'

  connect(token: string) {
    if (this.mockMode) {
      return this.connectMock()
    }

    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    return this.socket
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (this.mockMode) {
      window.addEventListener(`mock:${channel}`, (e: any) => callback(e.detail))
    } else {
      this.socket?.on(channel, callback)
    }
  }

  // ... (full implementation from research.md)
}

export const wsClient = new WebSocketClient()
```

**Dependencies**: T013
**Acceptance**: WebSocket client connects/reconnects correctly

---

### T015: Create React Query key factory ✅
**Description**: Centralized query keys for all entities
**Files**: `packages/api/src/queries/keys.ts`

**Content**:
```typescript
export const queryKeys = {
  // Organizations
  organizations: ['organizations'] as const,
  organization: (id: string) => ['organization', id] as const,

  // Vehicles
  vehicles: (filters?: VehicleFilters) => ['vehicles', filters] as const,
  vehicle: (id: string) => ['vehicle', id] as const,
  vehicleLocations: (ids: string[]) => ['vehicle-locations', ids] as const,

  // Drivers
  drivers: (filters?: DriverFilters) => ['drivers', filters] as const,
  driver: (id: string) => ['driver', id] as const,

  // Trips
  trips: (filters?: TripFilters) => ['trips', filters] as const,
  trip: (id: string) => ['trip', id] as const,

  // Geofences
  geofences: ['geofences'] as const,
  geofence: (id: string) => ['geofence', id] as const,

  // ... (continue for all 16 entities)
}
```

**Dependencies**: T012
**Acceptance**: Type-safe query keys for all entities

---

## 1.4 Shared UI Packages

### T016 [P]: Create ui-web package with shadcn/ui base components ✅
**Description**: Implement web UI component library
**Files**:
- `packages/ui-web/src/components/Button.tsx`
- `packages/ui-web/src/components/Input.tsx`
- `packages/ui-web/src/components/Card.tsx`
- `packages/ui-web/src/components/Badge.tsx`
- `packages/ui-web/src/components/Select.tsx`
- `packages/ui-web/src/components/Table.tsx`
- `packages/ui-web/src/components/Modal.tsx`
- `packages/ui-web/src/components/Dropdown.tsx`
- `packages/ui-web/src/components/Tabs.tsx`
- `packages/ui-web/src/components/Toast.tsx`

**Dependencies**: T005
**Acceptance**: All components styled with Tailwind, TypeScript types

---

### T017 [P]: Create ui-mobile package with nativewind components ✅
**Description**: Implement mobile UI component library
**Files**:
- `packages/ui-mobile/src/components/Button.tsx`
- `packages/ui-mobile/src/components/Input.tsx`
- `packages/ui-mobile/src/components/Card.tsx`
- `packages/ui-mobile/src/components/List.tsx`
- `packages/ui-mobile/src/components/Badge.tsx`
- `packages/ui-mobile/src/components/Modal.tsx`

**Dependencies**: T005
**Acceptance**: Components work with React Native, nativewind styling

---

### T018: Configure theme system for white-labeling ✅
**Description**: CSS variables setup (research.md #6)
**Files**:
- `packages/ui-web/src/theme/variables.css`
- `packages/ui-web/src/theme/themes.ts`

**Content**:
```css
:root {
  --color-primary: 59 130 246; /* blue-500 */
  --color-primary-foreground: 255 255 255;
  --color-secondary: 100 116 139;
  --color-accent: 34 197 94;
  --color-destructive: 239 68 68;
  --color-background: 255 255 255;
  --color-foreground: 15 23 42;
  --radius: 0.5rem;
}

.dark {
  --color-background: 15 23 42;
  --color-foreground: 248 250 252;
}

[data-theme="acme"] {
  --color-primary: 220 38 38;
}
```

**Dependencies**: T016
**Acceptance**: Theme switching works at runtime

---

### T019: Create i18n configuration and translation files ✅
**Description**: Multi-language support (research.md #5)
**Files**:
- `packages/utils/src/i18n/locales/en/common.json`
- `packages/utils/src/i18n/locales/en/tracking.json`
- `packages/utils/src/i18n/locales/en/geofencing.json`
- `packages/utils/src/i18n/locales/es/*.json` (Spanish)
- `packages/utils/src/i18n/locales/fr/*.json` (French)
- `packages/utils/src/i18n/locales/de/*.json` (German)
- `packages/utils/src/i18n/locales/hi/*.json` (Hindi)

**Content**:
```json
// en/tracking.json
{
  "title": "Live Tracking",
  "activeVehicles": "Active Vehicles",
  "totalDistance": "Total Distance",
  "averageSpeed": "Average Speed",
  "mapView": "Map View",
  "listView": "List View"
}
```

**Dependencies**: T007
**Acceptance**: All 5 languages have complete translations

---

### T020: Update turbo.json with complete pipeline ✅
**Description**: Configure Turborepo for all workspaces
**Files**: `turbo.json`

**Content**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "cache": false
    }
  }
}
```

**Dependencies**: T001
**Acceptance**: `turbo run build` builds all packages in correct order

---

# PHASE 2: MOCK SERVER SETUP (T026-T035)

### T026: Create MSW browser and server setup ✅
**Description**: Initialize Mock Service Worker
**Files**:
- `packages/api/src/mocks/browser.ts`
- `packages/api/src/mocks/server.ts`
- `packages/api/src/mocks/handlers/index.ts`

**Dependencies**: T013
**Acceptance**: MSW worker starts in browser, MSW server works in Node tests

---

### T027: Create Faker.js data generators for all 16 entities ✅
**Description**: Realistic mock data generation (research.md #11)
**Files**:
- `packages/api/src/mocks/data/generators/organization.ts`
- `packages/api/src/mocks/data/generators/user.ts`
- `packages/api/src/mocks/data/generators/device.ts`
- `packages/api/src/mocks/data/generators/vehicle.ts`
- `packages/api/src/mocks/data/generators/driver.ts`
- `packages/api/src/mocks/data/generators/trip.ts`
- `packages/api/src/mocks/data/generators/geofence.ts`
- `packages/api/src/mocks/data/generators/alert.ts`
- `packages/api/src/mocks/data/generators/maintenance.ts`
- `packages/api/src/mocks/data/generators/route.ts`
- `packages/api/src/mocks/data/generators/behavior-event.ts`
- `packages/api/src/mocks/data/generators/report.ts`
- `packages/api/src/mocks/data/generators/webhook.ts`
- `packages/api/src/mocks/data/generators/fuel-transaction.ts`
- `packages/api/src/mocks/data/generators/checklist.ts`

**Dependencies**: T012
**Acceptance**: Can generate 500 vehicles, 100 drivers, etc.

---

### T028: Create in-memory mock database with CRUD operations ✅
**Description**: Mock database for all entities
**Files**:
- `packages/api/src/mocks/data/database.ts`
- `packages/api/src/mocks/data/seed.ts`

**Dependencies**: T027
**Acceptance**: Database seeds with realistic data, CRUD works

---

### T029: Create MSW handlers for Organizations & Users ✅ (FR-001 to FR-009)
**Description**: Auth and organization endpoints
**Files**: `packages/api/src/mocks/handlers/auth.ts`, `organizations.ts`, `users.ts`

**Dependencies**: T028
**Acceptance**: Login, user CRUD, role assignment endpoints work

---

### T030: Create MSW handlers for Devices & Vehicles ✅ (FR-010 to FR-030)
**Description**: Device and vehicle management endpoints
**Files**: `packages/api/src/mocks/handlers/devices.ts`, `vehicles.ts`

**Dependencies**: T028
**Acceptance**: Device registration, vehicle CRUD, status updates work

---

### T031: Create MSW handlers for Geofences ✅ (FR-031 to FR-041)
**Description**: Geofencing endpoints
**Files**: `packages/api/src/mocks/handlers/geofences.ts`

**Dependencies**: T028
**Acceptance**: Geofence CRUD, event logging work

---

### T032: Create MSW handlers for Drivers & Trips ✅ (FR-068 to FR-078, FR-020 to FR-030)
**Description**: Driver management and trip tracking endpoints
**Files**: `packages/api/src/mocks/handlers/drivers.ts`, `trips.ts`

**Dependencies**: T028
**Acceptance**: Driver CRUD, trip history, playback endpoints work

---

### T033: Create MSW handlers for Alerts, Maintenance, Routes ✅ (FR-133+, FR-079+, FR-099+)
**Description**: Operational features endpoints
**Files**: `packages/api/src/mocks/handlers/alerts.ts`, `maintenance.ts`, `routes.ts`

**Dependencies**: T028
**Acceptance**: Alert rules, maintenance scheduling, route optimization work

---

### T034: Create MSW handlers for Reports, Fuel, Checklists ✅ (FR-121+, FR-111+, FR-161+)
**Description**: Analytics and mobile features endpoints
**Files**: `packages/api/src/mocks/handlers/reports.ts`, `fuel.ts`, `checklists.ts`

**Dependencies**: T028
**Acceptance**: Report generation, fuel tracking, checklist submission work

---

### T035: Create mock WebSocket server for real-time updates ✅
**Description**: WebSocket simulation (research.md #3, #11)
**Files**: `packages/api/src/mocks/websocket/mockSocket.ts`

**Content**: Broadcasts location updates every 10 seconds, geofence events, alerts

**Dependencies**: T028
**Acceptance**: Mock WebSocket broadcasts vehicle:location events

---

# PHASE 3: MARKETING WEBSITE (T036-T050)

### T036: Initialize Next.js 14 app with App Router
**Description**: Create marketing website (FR-176 to FR-185 UX requirements)
**Files**:
- `apps/marketing/package.json`
- `apps/marketing/next.config.js`
- `apps/marketing/tsconfig.json`
- `apps/marketing/app/layout.tsx`
- `apps/marketing/app/page.tsx`

**Dependencies**: T003, T004, T005
**Acceptance**: Next.js dev server runs on port 3000

---

### T037: Set up next-intl for multi-language marketing site
**Description**: i18n for marketing (research.md #5)
**Files**:
- `apps/marketing/i18n.ts`
- `apps/marketing/app/[locale]/layout.tsx`

**Dependencies**: T019, T036
**Acceptance**: Marketing site switches between 5 languages

---

### T038 [P]: Create marketing homepage (/)
**Description**: Hero, features overview, CTA
**Files**: `apps/marketing/app/[locale]/page.tsx`

**Content**: Hero section, fleet management benefits, demo CTA, customer logos

**Dependencies**: T037
**Acceptance**: Homepage renders with SEO meta tags

---

### T039 [P]: Create pricing page (/pricing)
**Description**: Subscription tiers (Trial, Basic, Pro, Enterprise)
**Files**: `apps/marketing/app/[locale]/pricing/page.tsx`

**Content**: 4 pricing tiers, feature comparison table, FAQ

**Dependencies**: T037
**Acceptance**: Pricing page shows all plans (FR-004)

---

### T040 [P]: Create features page (/features)
**Description**: Detailed product features showcase
**Files**: `apps/marketing/app/[locale]/features/page.tsx`

**Content**: Sections for tracking, geofencing, maintenance, analytics, mobile app

**Dependencies**: T037
**Acceptance**: Features page highlights all major capabilities

---

### T041 [P]: Create about page (/about)
**Description**: Company information, mission, team
**Files**: `apps/marketing/app/[locale]/about/page.tsx`

**Dependencies**: T037
**Acceptance**: About page renders

---

### T042 [P]: Create contact page (/contact)
**Description**: Contact form, support information
**Files**: `apps/marketing/app/[locale]/contact/page.tsx`

**Dependencies**: T037
**Acceptance**: Contact form submits (can be mocked)

---

### T043: Set up Contentlayer for blog (MDX)
**Description**: Blog content management
**Files**:
- `apps/marketing/contentlayer.config.ts`
- `apps/marketing/app/[locale]/blog/page.tsx`
- `apps/marketing/app/[locale]/blog/[slug]/page.tsx`
- `apps/marketing/content/blog/` (sample posts)

**Dependencies**: T036
**Acceptance**: Blog posts render from MDX files

---

### T044: Create marketing layout with navigation
**Description**: Header, footer, navigation
**Files**:
- `apps/marketing/components/Header.tsx`
- `apps/marketing/components/Footer.tsx`
- `apps/marketing/components/Navigation.tsx`

**Dependencies**: T036, T016
**Acceptance**: Responsive navigation, language switcher

---

### T045: Implement SEO optimization (FR-096)
**Description**: Meta tags, sitemap, structured data
**Files**:
- `apps/marketing/app/sitemap.ts`
- `apps/marketing/app/robots.ts`
- `apps/marketing/lib/seo.ts`

**Dependencies**: T036
**Acceptance**: Lighthouse SEO score >90

---

### T046 [P]: Create reusable marketing components
**Description**: CTA buttons, feature cards, testimonials
**Files**:
- `apps/marketing/components/CTASection.tsx`
- `apps/marketing/components/FeatureCard.tsx`
- `apps/marketing/components/Testimonial.tsx`

**Dependencies**: T016
**Acceptance**: Components reusable across pages

---

### T047: Optimize images with Next.js Image component
**Description**: Performance optimization (FR-092)
**Files**: Update all image usage to use `next/image`

**Dependencies**: T038-T042
**Acceptance**: Lighthouse Performance >90

---

### T048: Add analytics tracking (Google Analytics/Plausible)
**Description**: Marketing analytics
**Files**: `apps/marketing/lib/analytics.ts`

**Dependencies**: T036
**Acceptance**: Page views tracked

---

### T049: Create demo request form
**Description**: Lead generation
**Files**: `apps/marketing/app/[locale]/demo/page.tsx`

**Dependencies**: T037
**Acceptance**: Form collects name, email, company, fleet size

---

### T050: Marketing site testing and deployment config
**Description**: Vercel deployment configuration
**Files**: `apps/marketing/vercel.json`, E2E tests

**Dependencies**: T036-T049
**Acceptance**: `yarn build` succeeds, static pages generated

---

# PHASE 4: WEB APP - FOUNDATION (T051-T075)

### T051: Initialize Vite + React web app
**Description**: Main fleet management application
**Files**:
- `apps/web/package.json`
- `apps/web/vite.config.ts`
- `apps/web/tsconfig.json`
- `apps/web/index.html`
- `apps/web/src/main.tsx`
- `apps/web/src/App.tsx`

**Dependencies**: T003, T004, T005, T026
**Acceptance**: Vite dev server runs on port 3001, MSW initializes

---

### T052: Set up React Router with all routes
**Description**: Navigation for all 14 feature modules
**Files**: `apps/web/src/routes/index.tsx`

**Routes**:
```typescript
/ - Dashboard
/tracking - Live Tracking
/vehicles - Vehicle Management
/vehicles/:id - Vehicle Detail
/drivers - Driver Management
/drivers/:id - Driver Detail
/trips - Trip History
/geofences - Geofencing
/maintenance - Maintenance Management
/routes - Route Optimization
/alerts - Alerts & Notifications
/reports - Reports
/analytics - Analytics Dashboard
/fuel - Fuel Management
/settings - Settings
/settings/organization - Organization Settings
/settings/users - User Management
/settings/integrations - Webhook Configuration
/settings/white-label - White-Label Customization
```

**Dependencies**: T051
**Acceptance**: All routes defined, nested routing works

---

### T053: Set up React Query provider
**Description**: TanStack Query configuration
**Files**: `apps/web/src/lib/react-query.ts`

**Dependencies**: T051, T015
**Acceptance**: React Query DevTools visible

---

### T054: Set up Tailwind CSS in web app
**Description**: Styling configuration
**Files**:
- `apps/web/tailwind.config.js`
- `apps/web/postcss.config.js`
- `apps/web/src/index.css`

**Dependencies**: T005, T051
**Acceptance**: Tailwind classes work, dark mode toggles

---

### T055: Create authentication flow (FR-186 to FR-198)
**Description**: Login, logout, MFA, protected routes
**Files**:
- `apps/web/src/features/auth/components/LoginForm.tsx`
- `apps/web/src/features/auth/hooks/useAuth.ts`
- `apps/web/src/features/auth/contexts/AuthContext.tsx`
- `apps/web/src/features/auth/routes.tsx`

**Content**: Mock authentication (real auth in Phase 2)

**Dependencies**: T029, T053
**Acceptance**: Login redirects to dashboard, logout works, protected routes block unauthenticated users

---

### T056: Create permission context for RBAC (FR-188, research.md #7)
**Description**: Role-based access control
**Files**:
- `apps/web/src/features/auth/contexts/PermissionContext.tsx`
- `apps/web/src/features/auth/components/Protected.tsx`

**Content**:
```typescript
interface PermissionContextValue {
  user: User | null
  hasRole: (role: Role) => boolean
  hasPermission: (permission: Permission) => boolean
}

// Usage: <Protected requiredRole="admin">...</Protected>
```

**Dependencies**: T055
**Acceptance**: Components render based on user role

---

### T057: Create app layout with sidebar and header (FR-176, FR-183)
**Description**: Main application layout
**Files**:
- `apps/web/src/components/layouts/AppLayout.tsx`
- `apps/web/src/components/layouts/Sidebar.tsx`
- `apps/web/src/components/layouts/Header.tsx`

**Dependencies**: T016, T052
**Acceptance**: Sidebar shows links for user's role, responsive on tablet/mobile

---

### T058: Create breadcrumb navigation component
**Description**: Breadcrumbs for nested pages
**Files**: `apps/web/src/components/navigation/Breadcrumbs.tsx`

**Dependencies**: T057
**Acceptance**: Breadcrumbs update based on route

---

### T059: Create loading states and skeleton screens (FR-184)
**Description**: Loading UX
**Files**: `apps/web/src/components/ui/Skeleton.tsx`, `LoadingSpinner.tsx`

**Dependencies**: T016
**Acceptance**: Skeleton screens show while data loads

---

### T060: Create error boundaries and error pages (FR-185)
**Description**: Error handling
**Files**:
- `apps/web/src/components/ErrorBoundary.tsx`
- `apps/web/src/pages/Error404.tsx`
- `apps/web/src/pages/Error500.tsx`

**Dependencies**: T051
**Acceptance**: Errors caught gracefully, user-friendly messages

---

### T061: Create toast notification system (FR-136, FR-144)
**Description**: Global notifications
**Files**: `apps/web/src/components/Toast.tsx`, `ToastProvider.tsx`

**Dependencies**: T016
**Acceptance**: Success/error toasts appear

---

### T062: Set up Zustand stores for client state
**Description**: UI state management
**Files**:
- `apps/web/src/stores/uiStore.ts` (sidebar, theme, map provider)
- `apps/web/src/stores/filterStore.ts` (vehicle filters, date ranges)

**Dependencies**: T053
**Acceptance**: UI state persists, filters work

---

### T063: Create React Query hooks for Organizations & Users (FR-001 to FR-009)
**Description**: Organization and user management hooks
**Files**:
- `packages/api/src/hooks/useOrganization.ts`
- `packages/api/src/hooks/useUsers.ts`

**Dependencies**: T015, T029
**Acceptance**: Hooks fetch data from mock API

---

### T064: Create React Query hooks for Devices & Vehicles (FR-010 to FR-030)
**Description**: Device and vehicle hooks
**Files**:
- `packages/api/src/hooks/useDevices.ts`
- `packages/api/src/hooks/useVehicles.ts`
- `packages/api/src/hooks/useVehicle.ts`

**Dependencies**: T015, T030
**Acceptance**: Vehicle list and detail hooks work

---

### T065: Create React Query hooks for Drivers & Trips
**Description**: Driver and trip hooks
**Files**:
- `packages/api/src/hooks/useDrivers.ts`
- `packages/api/src/hooks/useTrips.ts`

**Dependencies**: T015, T032
**Acceptance**: Driver and trip data loads

---

### T066: Create React Query hooks for Geofences
**Description**: Geofencing hooks
**Files**: `packages/api/src/hooks/useGeofences.ts`

**Dependencies**: T015, T031
**Acceptance**: Geofence CRUD hooks work

---

### T067: Create React Query hooks for Alerts
**Description**: Alert management hooks
**Files**: `packages/api/src/hooks/useAlerts.ts`

**Dependencies**: T015, T033
**Acceptance**: Alert fetching and acknowledgment work

---

### T068: Create React Query hooks for Maintenance
**Description**: Maintenance hooks
**Files**: `packages/api/src/hooks/useMaintenance.ts`

**Dependencies**: T015, T033
**Acceptance**: Maintenance records and scheduling work

---

### T069: Create React Query hooks for Routes
**Description**: Route optimization hooks
**Files**: `packages/api/src/hooks/useRoutes.ts`

**Dependencies**: T015, T033
**Acceptance**: Route creation and optimization work

---

### T070: Create React Query hooks for Reports
**Description**: Reporting hooks
**Files**: `packages/api/src/hooks/useReports.ts`

**Dependencies**: T015, T034
**Acceptance**: Report generation and scheduling work

---

### T071: Create React Query hooks for Fuel
**Description**: Fuel management hooks
**Files**: `packages/api/src/hooks/useFuel.ts`

**Dependencies**: T015, T034
**Acceptance**: Fuel transaction tracking works

---

### T072: Create React Query hooks for Checklists
**Description**: Checklist hooks (mobile + web)
**Files**: `packages/api/src/hooks/useChecklists.ts`

**Dependencies**: T015, T034
**Acceptance**: Checklist templates and submissions work

---

### T073: Create React Query hooks for Webhooks (FR-199 to FR-212)
**Description**: Integration management hooks
**Files**: `packages/api/src/hooks/useWebhooks.ts`

**Dependencies**: T015, T034
**Acceptance**: Webhook CRUD and delivery logs work

---

### T074: Create WebSocket hook for real-time updates (FR-020 to FR-030)
**Description**: Real-time vehicle locations
**Files**: `apps/web/src/hooks/useVehicleLiveLocations.ts`

**Content**:
```typescript
const useVehicleLiveLocations = (vehicleIds: string[]) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    wsClient.subscribe('vehicle:location', (update) => {
      queryClient.setQueryData(['vehicle-location', update.vehicleId], update)
    })

    wsClient.emit('track:vehicles', { vehicleIds })

    return () => {
      wsClient.unsubscribe('vehicle:location')
    }
  }, [vehicleIds, queryClient])
}
```

**Dependencies**: T014, T035, T064
**Acceptance**: Vehicle markers update in real-time (every 10 seconds)

---

### T075: Create form components with react-hook-form + Zod (research.md #10)
**Description**: Reusable form wrappers
**Files**:
- `apps/web/src/components/forms/FormInput.tsx`
- `apps/web/src/components/forms/FormSelect.tsx`
- `apps/web/src/components/forms/FormTextarea.tsx`

**Dependencies**: T016, T011
**Acceptance**: Forms validate with Zod schemas

---

# PHASE 5: WEB APP - DASHBOARD & TRACKING (T076-T095)

### T076: Create Dashboard page with KPIs (FR-051 to FR-060)
**Description**: Fleet overview dashboard
**Files**: `apps/web/src/pages/Dashboard.tsx`

**Widgets**:
- Total vehicles, active trips, alerts count
- Distance traveled (today/week/month)
- Fuel consumed, idle time, average speed
- Fleet utilization chart
- Recent alerts list
- Vehicle status breakdown (pie chart)

**Dependencies**: T064, T067, research.md #9 (Recharts)
**Acceptance**: Dashboard refreshes every 60 seconds (FR-060)

---

### T077: Create map abstraction layer (research.md #1)
**Description**: Map provider adapter pattern
**Files**:
- `apps/web/src/components/map/MapProvider.tsx`
- `apps/web/src/components/map/GoogleMapAdapter.tsx`
- `apps/web/src/components/map/MapboxAdapter.tsx`
- `apps/web/src/components/map/LeafletAdapter.tsx`
- `apps/web/src/components/map/types.ts`

**Content**:
```typescript
interface MapProviderProps {
  center: LatLng
  zoom: number
  markers: Marker[]
  geofences: Geofence[]
  clustering: boolean
  onMarkerClick: (markerId: string) => void
}

interface MapAdapter {
  render(props: MapProviderProps): ReactElement
  fitBounds(bounds: LatLngBounds): void
  setCenter(center: LatLng): void
}
```

**Dependencies**: T062, T010 (map utils)
**Acceptance**: Can switch map provider via settings, all 3 providers work

---

### T078: Implement map clustering with supercluster (FR-026, research.md #4)
**Description**: Handle 500+ vehicles on map
**Files**: `apps/web/src/components/map/useMapClustering.tsx`

**Dependencies**: T010, T077
**Acceptance**: 500 vehicles cluster correctly, <100ms update time

---

### T079: Create Live Tracking page (FR-020 to FR-030)
**Description**: Real-time vehicle tracking
**Files**:
- `apps/web/src/pages/Tracking.tsx`
- `apps/web/src/features/tracking/components/VehicleMarker.tsx`
- `apps/web/src/features/tracking/components/VehicleInfoPopup.tsx`

**Features**:
- Real-time vehicle locations (10-second updates)
- Vehicle status indicators (moving/stopped/idling/parked)
- Click vehicle marker → show popup with telemetry
- Filter by status, search by license plate
- Clustering for 500+ vehicles

**Dependencies**: T074, T077, T078
**Acceptance**: Map updates smoothly, no lag with 500 vehicles

---

### T080: Create vehicle telemetry display (FR-021, FR-022)
**Description**: Speed, fuel, odometer, engine hours in popup
**Files**: `apps/web/src/features/tracking/components/TelemetryPanel.tsx`

**Dependencies**: T079
**Acceptance**: Shows real-time telemetry data

---

### T081: Create trip playback feature (FR-024, FR-025)
**Description**: Historical trip visualization
**Files**:
- `apps/web/src/features/tracking/components/TripPlayback.tsx`
- `apps/web/src/features/tracking/components/PlaybackControls.tsx`

**Features**:
- Timeline scrubber
- Play/pause/speed controls (1x, 2x, 5x)
- Show breadcrumb trail
- Display trip statistics (distance, duration, avg speed)

**Dependencies**: T065, T079
**Acceptance**: Trip plays back with smooth animation

---

### T082: Create trip statistics panel (FR-025)
**Description**: Trip summary data
**Files**: `apps/web/src/features/tracking/components/TripStats.tsx`

**Dependencies**: T081
**Acceptance**: Shows distance, duration, stops, idle time

---

### T083: Create last known location indicator (FR-028)
**Description**: Show offline vehicles
**Files**: Update VehicleMarker.tsx to show grayed-out markers for offline vehicles

**Dependencies**: T079
**Acceptance**: Offline vehicles show last known location with timestamp

---

### T084: Add custom map layers (FR-030)
**Description**: Satellite, terrain, traffic toggles
**Files**: `apps/web/src/features/tracking/components/MapLayerControl.tsx`

**Dependencies**: T077
**Acceptance**: Map layer switches work for all 3 providers

---

### T085: Create vehicle list sidebar on tracking page
**Description**: List view alongside map
**Files**: `apps/web/src/features/tracking/components/VehicleListSidebar.tsx`

**Dependencies**: T079
**Acceptance**: Clicking list item centers map on vehicle

---

### T086: Add geofence visualization on tracking map (FR-041)
**Description**: Show geofences as overlays
**Files**: `apps/web/src/features/tracking/components/GeofenceOverlay.tsx`

**Dependencies**: T066, T079
**Acceptance**: Geofences render on map with colors, clickable

---

### T087: Create real-time alert notifications (FR-133 to FR-144)
**Description**: Toast notifications for new alerts
**Files**: `apps/web/src/features/alerts/components/AlertToast.tsx`

**Dependencies**: T061, T067, T074
**Acceptance**: Toast appears when alert fires (WebSocket)

---

### T088: Create chart components with Recharts (research.md #9)
**Description**: Reusable chart wrappers
**Files**:
- `apps/web/src/components/charts/LineChart.tsx`
- `apps/web/src/components/charts/BarChart.tsx`
- `apps/web/src/components/charts/PieChart.tsx`

**Dependencies**: T076
**Acceptance**: Charts render responsive, show data correctly

---

### T089: Create KPI widget components
**Description**: Reusable dashboard widgets
**Files**: `apps/web/src/components/widgets/KPICard.tsx`, `StatCard.tsx`

**Dependencies**: T016
**Acceptance**: Widgets display icons, values, trends

---

### T090: Add dashboard customization (FR-055)
**Description**: Widget selection and arrangement
**Files**: `apps/web/src/features/dashboard/hooks/useDashboardLayout.ts`

**Content**: Save layout preferences to localStorage

**Dependencies**: T076
**Acceptance**: User can show/hide widgets, arrangement persists

---

### T091: Create dashboard date range filter (FR-056)
**Description**: Filter dashboard by date
**Files**: `apps/web/src/features/dashboard/components/DateRangePicker.tsx`

**Dependencies**: T076, T062
**Acceptance**: KPIs update when date range changes

---

### T092: Add dashboard export functionality (FR-057)
**Description**: Export dashboard data as CSV/PDF
**Files**: `apps/web/src/features/dashboard/utils/exportDashboard.ts`

**Dependencies**: T076
**Acceptance**: Downloads CSV with dashboard metrics

---

### T093: Create trend charts for KPIs (FR-058)
**Description**: Time-series charts
**Files**: `apps/web/src/features/dashboard/components/TrendChart.tsx`

**Dependencies**: T088
**Acceptance**: Shows weekly/monthly trends

---

### T094: Add comparison views (FR-059)
**Description**: Compare vehicles, drivers, time periods
**Files**: `apps/web/src/features/dashboard/components/ComparisonView.tsx`

**Dependencies**: T088
**Acceptance**: Side-by-side comparison charts

---

### T095: Implement dashboard auto-refresh (FR-060)
**Description**: Refresh every 60 seconds
**Files**: Update Dashboard.tsx with auto-refresh logic

**Dependencies**: T076
**Acceptance**: Dashboard data refreshes automatically

---

# PHASE 6: WEB APP - VEHICLE & DRIVER MANAGEMENT (T096-T120)

### T096: Create Vehicles list page with table (FR-010 to FR-030)
**Description**: Vehicle management main page
**Files**:
- `apps/web/src/pages/Vehicles.tsx`
- `apps/web/src/features/vehicles/components/VehicleTable.tsx`

**Features**:
- Searchable table (license plate, VIN)
- Filterable (status, assigned driver, device)
- Sortable columns
- Bulk actions (assign driver, export)
- Pagination

**Dependencies**: T064, T016
**Acceptance**: Table shows all vehicles, search/filter works

---

### T097: Create Vehicle detail page
**Description**: Single vehicle view
**Files**: `apps/web/src/pages/VehicleDetail.tsx`

**Tabs**:
- Overview (details, current location, telemetry)
- Trip History
- Maintenance Records
- Alerts
- Documents

**Dependencies**: T064, T096
**Acceptance**: All tabs load data correctly

---

### T098: Create Add/Edit Vehicle form (FR-017)
**Description**: Vehicle CRUD forms
**Files**: `apps/web/src/features/vehicles/components/VehicleForm.tsx`

**Fields**: Make, model, year, VIN, license plate, odometer, device assignment

**Dependencies**: T075, T011, T064
**Acceptance**: Form validates with Zod, creates/updates vehicle

---

### T099: Create bulk vehicle import (FR-016)
**Description**: CSV upload for vehicles
**Files**: `apps/web/src/features/vehicles/components/BulkImportModal.tsx`

**Dependencies**: T064
**Acceptance**: Uploads CSV, creates multiple vehicles

---

### T100: Create vehicle grouping feature (FR-015)
**Description**: Organize vehicles into groups
**Files**: `apps/web/src/features/vehicles/components/VehicleGroups.tsx`

**Dependencies**: T064
**Acceptance**: Groups created, vehicles assigned to groups

---

### T101: Create device registration flow (FR-010, FR-011)
**Description**: Register devices via serial/IMEI/QR
**Files**:
- `apps/web/src/features/devices/components/DeviceRegistration.tsx`
- `apps/web/src/features/devices/components/QRScanner.tsx`

**Dependencies**: T063
**Acceptance**: Device registration works, QR code scans

---

### T102: Create device health monitoring (FR-013, FR-014)
**Description**: Device status dashboard
**Files**: `apps/web/src/pages/Devices.tsx`

**Displays**: Signal strength, battery, connection status, firmware version

**Dependencies**: T063
**Acceptance**: Device health metrics display

---

### T103: Create Drivers list page (FR-068 to FR-078)
**Description**: Driver management
**Files**:
- `apps/web/src/pages/Drivers.tsx`
- `apps/web/src/features/drivers/components/DriverTable.tsx`

**Dependencies**: T065, T016
**Acceptance**: Driver table with search/filter

---

### T104: Create Driver detail page
**Description**: Single driver view
**Files**: `apps/web/src/pages/DriverDetail.tsx`

**Tabs**:
- Profile (photo, license info, contact)
- Performance Scorecard
- Trip History
- Behavior Events
- Documents

**Dependencies**: T065
**Acceptance**: All tabs load

---

### T105: Create Add/Edit Driver form
**Description**: Driver CRUD forms
**Files**: `apps/web/src/features/drivers/components/DriverForm.tsx`

**Fields**: Name, email, phone, license number, expiry, photo upload

**Dependencies**: T075, T011, T065
**Acceptance**: Form validates, creates/updates driver

---

### T106: Create license expiration tracking (FR-069)
**Description**: License renewal reminders
**Files**: `apps/web/src/features/drivers/components/LicenseExpiryWidget.tsx`

**Dependencies**: T065
**Acceptance**: Shows drivers with expiring licenses

---

### T107: Create driver-to-vehicle assignment (FR-070)
**Description**: Assign drivers to vehicles
**Files**: `apps/web/src/features/drivers/components/DriverVehicleAssignment.tsx`

**Dependencies**: T064, T065
**Acceptance**: Assignment works, shows on vehicle detail

---

### T108: Create driver performance scorecard (FR-075, FR-076)
**Description**: Driver scoring dashboard
**Files**: `apps/web/src/features/drivers/components/DriverScorecard.tsx`

**Metrics**: Overall score, harsh braking, speeding, idling, acceleration

**Dependencies**: T065
**Acceptance**: Scorecard displays with trends

---

### T109: Create driver ranking view (FR-077)
**Description**: Leaderboard of top/bottom drivers
**Files**: `apps/web/src/features/drivers/components/DriverRanking.tsx`

**Dependencies**: T065
**Acceptance**: Shows ranked list with scores

---

### T110: Create coaching suggestions (FR-077)
**Description**: Automated coaching tips
**Files**: `apps/web/src/features/drivers/components/CoachingSuggestions.tsx`

**Dependencies**: T065
**Acceptance**: Shows personalized tips based on behavior

---

### T111: Create driver behavior event log (FR-089 to FR-098)
**Description**: List of all behavior events
**Files**: `apps/web/src/features/drivers/components/BehaviorEventLog.tsx`

**Events**: Harsh braking, rapid acceleration, speeding, excessive idling

**Dependencies**: T065
**Acceptance**: Event log filterable by type, severity

---

### T112: Create behavior event detail view
**Description**: Single event with map location
**Files**: `apps/web/src/features/drivers/components/BehaviorEventDetail.tsx`

**Dependencies**: T111, T077
**Acceptance**: Shows event on map with telemetry snapshot

---

### T113: Create configurable scoring algorithm (FR-096)
**Description**: Admin can adjust scoring weights
**Files**: `apps/web/src/features/settings/components/ScoringConfig.tsx`

**Dependencies**: T065
**Acceptance**: Weights saved, scorecard recalculates

---

### T114: Create driver group management (FR-078)
**Description**: Organize drivers into teams
**Files**: `apps/web/src/features/drivers/components/DriverGroups.tsx`

**Dependencies**: T065
**Acceptance**: Groups created, drivers assigned

---

### T115: Create hours-of-service tracking (FR-071, FR-072)
**Description**: Duty hours compliance
**Files**: `apps/web/src/features/drivers/components/HoursOfService.tsx`

**Dependencies**: T065
**Acceptance**: Shows daily/weekly hours, compliance status

---

### T116: Create digital checklist builder (FR-073)
**Description**: Create custom inspection checklists
**Files**: `apps/web/src/features/checklists/components/ChecklistBuilder.tsx`

**Dependencies**: T072
**Acceptance**: Checklist templates created with custom items

---

### T117: Create checklist submission viewer
**Description**: View completed checklists
**Files**: `apps/web/src/features/checklists/components/ChecklistSubmissions.tsx`

**Dependencies**: T072
**Acceptance**: Shows submissions with photos, signatures

---

### T118: Create trip history page (FR-023)
**Description**: Search and filter trips
**Files**: `apps/web/src/pages/TripHistory.tsx`

**Filters**: Date range, vehicle, driver, location

**Dependencies**: T065
**Acceptance**: Trip search works, exports to CSV

---

### T119: Add trip comparison feature
**Description**: Compare multiple trips side-by-side
**Files**: `apps/web/src/features/trips/components/TripComparison.tsx`

**Dependencies**: T065, T088
**Acceptance**: Shows comparison charts (distance, fuel, time)

---

### T120: Create vehicle utilization report (FR-053, FR-057)
**Description**: Active vs idle time analysis
**Files**: `apps/web/src/features/analytics/components/UtilizationReport.tsx`

**Dependencies**: T064, T088
**Acceptance**: Chart shows utilization percentage per vehicle

---

# PHASE 7: WEB APP - GEOFENCING & ROUTES (T121-T135)

### T121: Create Geofences list page (FR-031 to FR-041)
**Description**: Geofence management
**Files**: `apps/web/src/pages/Geofences.tsx`

**Dependencies**: T066
**Acceptance**: Shows all geofences in list/grid view

---

### T122: Create geofence creation on map (FR-031, FR-032)
**Description**: Draw geofences on map
**Files**:
- `apps/web/src/features/geofencing/components/GeofenceDrawing.tsx`
- `apps/web/src/features/geofencing/components/CircleTool.tsx`
- `apps/web/src/features/geofencing/components/PolygonTool.tsx`

**Dependencies**: T066, T077
**Acceptance**: Can draw circles and polygons on map

---

### T123: Create geofence detail page
**Description**: Edit geofence, view events
**Files**: `apps/web/src/pages/GeofenceDetail.tsx`

**Tabs**: Settings, Assigned Vehicles, Rules, Event History

**Dependencies**: T066
**Acceptance**: All tabs load data

---

### T124: Create geofence rule builder (FR-035 to FR-037)
**Description**: Configure entry/exit alerts
**Files**: `apps/web/src/features/geofencing/components/RuleBuilder.tsx`

**Rules**: Entry alert, exit alert, time-based restrictions

**Dependencies**: T066
**Acceptance**: Rules saved, alerts trigger (mock)

---

### T125: Create geofence event log (FR-038)
**Description**: History of all geofence events
**Files**: `apps/web/src/features/geofencing/components/GeofenceEvents.tsx`

**Dependencies**: T066
**Acceptance**: Shows entry/exit events with vehicle, timestamp

---

### T126: Create geofence import/export (FR-040)
**Description**: Upload geofences via GeoJSON/KML
**Files**: `apps/web/src/features/geofencing/components/GeofenceImport.tsx`

**Dependencies**: T066
**Acceptance**: Imports geofences from file

---

### T127: Create geofence limit warning (FR-039)
**Description**: Warn when approaching 500 geofence limit
**Files**: Update Geofences.tsx with limit warning

**Dependencies**: T121
**Acceptance**: Shows warning at 450+ geofences

---

### T128: Create Routes list page (FR-099 to FR-112)
**Description**: Route management
**Files**: `apps/web/src/pages/Routes.tsx`

**Dependencies**: T069
**Acceptance**: Shows routes (planned, in-progress, completed)

---

### T129: Create route planning with multi-stop (FR-099, FR-100)
**Description**: Create routes with multiple stops
**Files**: `apps/web/src/features/routes/components/RoutePlanner.tsx`

**Features**:
- Add stops via address search or map click
- Drag to reorder stops
- Optimize sequence button

**Dependencies**: T069, T077
**Acceptance**: Route with 10 stops creates successfully

---

### T130: Implement route optimization algorithm (FR-100, FR-101)
**Description**: Minimize distance and time
**Files**: `apps/web/src/features/routes/utils/optimizeRoute.ts`

**Content**: Call mock API endpoint that returns optimized sequence

**Dependencies**: T129
**Acceptance**: Optimized route shows reduced distance/time

---

### T131: Create route assignment to driver (FR-103, FR-104)
**Description**: Assign route to vehicle/driver
**Files**: `apps/web/src/features/routes/components/RouteAssignment.tsx`

**Dependencies**: T065, T129
**Acceptance**: Assignment sends notification (mock)

---

### T132: Create route progress tracking (FR-105, FR-107)
**Description**: Monitor route completion
**Files**: `apps/web/src/features/routes/components/RouteProgress.tsx`

**Displays**: Completed stops, current location, ETA per stop

**Dependencies**: T069, T079
**Acceptance**: Shows live progress on map

---

### T133: Create ETA calculation (FR-106, FR-107)
**Description**: Estimated time of arrival
**Files**: `apps/web/src/features/routes/utils/calculateETA.ts`

**Dependencies**: T069
**Acceptance**: ETA updates based on current location

---

### T134: Create route templates (FR-110)
**Description**: Recurring routes
**Files**: `apps/web/src/features/routes/components/RouteTemplates.tsx`

**Dependencies**: T069
**Acceptance**: Template saves, can be reused

---

### T135: Create route completion summary (FR-109)
**Description**: Actual vs planned metrics
**Files**: `apps/web/src/features/routes/components/RouteCompletion.tsx`

**Displays**: Planned time vs actual, distance variance, delay reasons

**Dependencies**: T069
**Acceptance**: Summary shows after route completes

---

# PHASE 8: WEB APP - ALERTS & MAINTENANCE (T136-T150)

### T136: Create Alerts page (FR-133 to FR-144)
**Description**: Alert management dashboard
**Files**: `apps/web/src/pages/Alerts.tsx`

**Dependencies**: T067
**Acceptance**: Shows all alerts, filterable by type/severity

---

### T137: Create custom alert rule builder (FR-133)
**Description**: Create alert rules
**Files**: `apps/web/src/features/alerts/components/AlertRuleBuilder.tsx`

**Rule types**: Speed threshold, geofence, idle time, fuel level, maintenance due

**Dependencies**: T067
**Acceptance**: Rules saved, can be enabled/disabled

---

### T138: Create alert routing configuration (FR-137)
**Description**: Assign alerts to users/roles
**Files**: `apps/web/src/features/alerts/components/AlertRouting.tsx`

**Dependencies**: T067
**Acceptance**: Alert routes to correct users

---

### T139: Create alert escalation flow (FR-138)
**Description**: Escalate unacknowledged alerts
**Files**: `apps/web/src/features/alerts/components/AlertEscalation.tsx`

**Dependencies**: T067
**Acceptance**: Escalation triggers after 15 minutes (FR-138)

---

### T140: Create alert acknowledgment UI (FR-139)
**Description**: Acknowledge alerts with notes
**Files**: `apps/web/src/features/alerts/components/AlertAcknowledgment.tsx`

**Dependencies**: T067
**Acceptance**: Acknowledgment saves, alert marked as resolved

---

### T141: Create alert history view (FR-140)
**Description**: Past alerts with status
**Files**: `apps/web/src/features/alerts/components/AlertHistory.tsx`

**Dependencies**: T067
**Acceptance**: Shows resolved/unresolved alerts

---

### T142: Create alert muting (FR-141)
**Description**: Temporarily disable alerts
**Files**: `apps/web/src/features/alerts/components/AlertMuting.tsx`

**Dependencies**: T067
**Acceptance**: Alert muted for set duration

---

### T143: Create quiet hours configuration (FR-142)
**Description**: Suppress non-critical alerts during hours
**Files**: `apps/web/src/features/alerts/components/QuietHours.tsx`

**Dependencies**: T067
**Acceptance**: Alerts suppressed during quiet hours

---

### T144: Create alert notification preferences (FR-144)
**Description**: Per-user notification settings
**Files**: `apps/web/src/features/settings/components/NotificationPreferences.tsx`

**Channels**: Email, SMS, push notification (mock)

**Dependencies**: T067
**Acceptance**: Preferences saved per alert type

---

### T145: Create Maintenance page (FR-079 to FR-088)
**Description**: Maintenance management
**Files**: `apps/web/src/pages/Maintenance.tsx`

**Dependencies**: T068
**Acceptance**: Shows upcoming and overdue maintenance

---

### T146: Create preventive maintenance scheduler (FR-079, FR-080)
**Description**: Schedule based on mileage/time
**Files**: `apps/web/src/features/maintenance/components/MaintenanceScheduler.tsx`

**Dependencies**: T068
**Acceptance**: Reminders trigger 7 days before due date (FR-080)

---

### T147: Create maintenance record form (FR-081)
**Description**: Log completed maintenance
**Files**: `apps/web/src/features/maintenance/components/MaintenanceForm.tsx`

**Fields**: Type, date, odometer, cost, provider, description, receipts

**Dependencies**: T068, T075
**Acceptance**: Record saved with attachments

---

### T148: Create maintenance cost tracking (FR-083, FR-085)
**Description**: Cost analysis per vehicle
**Files**: `apps/web/src/features/maintenance/components/MaintenanceCosts.tsx`

**Dependencies**: T068, T088
**Acceptance**: Chart shows maintenance costs over time

---

### T149: Create total cost of ownership calculator (FR-088)
**Description**: TCO including fuel, maintenance
**Files**: `apps/web/src/features/analytics/components/TCOCalculator.tsx`

**Dependencies**: T068, T071
**Acceptance**: Shows TCO per vehicle

---

### T150: Create predictive maintenance suggestions (FR-153 to FR-160)
**Description**: AI-driven maintenance alerts
**Files**: `apps/web/src/features/maintenance/components/PredictiveMaintenance.tsx`

**Content**: Mock predictions based on telemetry anomalies

**Dependencies**: T068
**Acceptance**: Shows suggestions with confidence level

---

# PHASE 9: WEB APP - REPORTS & ANALYTICS (T151-T165)

### T151: Create Reports page (FR-121 to FR-132)
**Description**: Report generation dashboard
**Files**: `apps/web/src/pages/Reports.tsx`

**Dependencies**: T070
**Acceptance**: Shows available reports, scheduled reports

---

### T152: Create report template builder
**Description**: Custom report designer
**Files**: `apps/web/src/features/reports/components/ReportBuilder.tsx`

**Dependencies**: T070
**Acceptance**: Template saved with selected metrics

---

### T153: Create scheduled report configuration (FR-121, FR-129)
**Description**: Schedule daily/weekly/monthly reports
**Files**: `apps/web/src/features/reports/components/ReportScheduler.tsx`

**Dependencies**: T070
**Acceptance**: Schedule saved, email delivery configured

---

### T154: Create on-demand report generation (FR-122)
**Description**: Generate reports instantly
**Files**: `apps/web/src/features/reports/components/OnDemandReport.tsx`

**Dependencies**: T070
**Acceptance**: Report generates and downloads

---

### T155: Create PDF export functionality (FR-123)
**Description**: Export reports as PDF
**Files**: `apps/web/src/features/reports/utils/exportPDF.ts`

**Dependencies**: T070
**Acceptance**: PDF downloads with charts/tables

---

### T156: Create CSV export functionality (FR-123)
**Description**: Export reports as CSV
**Files**: `apps/web/src/features/reports/utils/exportCSV.ts`

**Dependencies**: T070
**Acceptance**: CSV downloads with raw data

---

### T157: Create trip summary report (FR-124)
**Description**: Trip report template
**Files**: `apps/web/src/features/reports/templates/TripSummaryReport.tsx`

**Dependencies**: T070
**Acceptance**: Shows distance, duration, fuel per trip

---

### T158: Create cost analysis report (FR-125)
**Description**: Fuel and maintenance cost report
**Files**: `apps/web/src/features/reports/templates/CostAnalysisReport.tsx`

**Dependencies**: T070, T071, T068
**Acceptance**: Shows total costs breakdown

---

### T159: Create compliance report (FR-126)
**Description**: Hours-of-service compliance
**Files**: `apps/web/src/features/reports/templates/ComplianceReport.tsx`

**Dependencies**: T070, T065
**Acceptance**: Shows driver hours, violations

---

### T160: Create driver performance comparison report (FR-127)
**Description**: Compare driver scores
**Files**: `apps/web/src/features/reports/templates/DriverPerformanceReport.tsx`

**Dependencies**: T070, T065
**Acceptance**: Shows ranking with charts

---

### T161: Create vehicle utilization report (FR-128)
**Description**: Utilization percentage per vehicle
**Files**: `apps/web/src/features/reports/templates/UtilizationReport.tsx`

**Dependencies**: T070, T064
**Acceptance**: Shows active/idle breakdown

---

### T162: Create executive summary report (FR-131)
**Description**: High-level management report
**Files**: `apps/web/src/features/reports/templates/ExecutiveSummary.tsx`

**Dependencies**: T070
**Acceptance**: Shows key KPIs, trends, insights

---

### T163: Create Analytics dashboard (beyond basic dashboard)
**Description**: Advanced analytics and insights
**Files**: `apps/web/src/pages/Analytics.tsx`

**Charts**: Fleet efficiency trends, cost per mile, fuel economy, driver rankings

**Dependencies**: T064, T065, T071, T088
**Acceptance**: All charts load with data

---

### T164: Create sustainability insights (FR-145 to FR-152)
**Description**: Carbon emissions tracking
**Files**: `apps/web/src/features/analytics/components/SustainabilityDashboard.tsx`

**Displays**: Emissions per vehicle, eco-driving tips, carbon offset calculations

**Dependencies**: T064, T071
**Acceptance**: Emissions calculated correctly

---

### T165: Create fuel management dashboard (FR-111 to FR-120)
**Description**: Fuel tracking and theft detection
**Files**: `apps/web/src/pages/FuelManagement.tsx`

**Features**:
- Fuel consumption charts
- Fuel efficiency (MPG/L per 100km)
- Theft detection alerts
- Fuel card integration (mock)

**Dependencies**: T071
**Acceptance**: Fuel data displays, theft alerts trigger

---

# PHASE 10: WEB APP - SETTINGS & ADMIN (T166-T180)

### T166: Create Settings page with tabs
**Description**: Application settings hub
**Files**: `apps/web/src/pages/Settings.tsx`

**Tabs**: Profile, Organization, Users, Integrations, White-Label, Regional Access

**Dependencies**: T052
**Acceptance**: All tabs navigate correctly

---

### T167: Create User Management page (FR-006, FR-007)
**Description**: CRUD users and roles
**Files**: `apps/web/src/features/settings/components/UserManagement.tsx`

**Dependencies**: T063
**Acceptance**: Users created, roles assigned, invitations sent

---

### T168: Create custom role creation (FR-009)
**Description**: Define custom roles with permissions
**Files**: `apps/web/src/features/settings/components/CustomRoles.tsx`

**Dependencies**: T056
**Acceptance**: Custom role created with granular permissions

---

### T169: Create Organization Settings page (FR-002)
**Description**: Company profile, subscription
**Files**: `apps/web/src/features/settings/components/OrganizationSettings.tsx`

**Dependencies**: T063
**Acceptance**: Organization details editable

---

### T170: Create subscription management UI (FR-004)
**Description**: View plan, upgrade/downgrade
**Files**: `apps/web/src/features/settings/components/SubscriptionManagement.tsx`

**Dependencies**: T063
**Acceptance**: Shows current plan, feature limits

---

### T171: Create trial subscription countdown (FR-003)
**Description**: Days remaining in trial
**Files**: `apps/web/src/components/TrialBanner.tsx`

**Dependencies**: T063
**Acceptance**: Banner shows at 7 days remaining

---

### T172: Create regional access control UI (FR-061 to FR-067)
**Description**: Assign users to regions
**Files**: `apps/web/src/features/settings/components/RegionalAccess.tsx`

**Dependencies**: T063
**Acceptance**: User assigned to city/region, data filtered

---

### T173: Create white-label customization UI (FR-209 to FR-212)
**Description**: Logo, colors, domain
**Files**: `apps/web/src/features/settings/components/WhiteLabelSettings.tsx`

**Features**:
- Logo upload
- Primary color picker
- Accent color picker
- Border radius slider
- Preview panel

**Dependencies**: T018
**Acceptance**: Theme updates in real-time

---

### T174: Create webhook configuration page (FR-199 to FR-212)
**Description**: Manage webhooks
**Files**: `apps/web/src/pages/Integrations.tsx`

**Dependencies**: T073
**Acceptance**: Webhook CRUD, event subscriptions, delivery logs

---

### T175: Create webhook event selector (FR-202, FR-203)
**Description**: Choose events to subscribe
**Files**: `apps/web/src/features/integrations/components/WebhookEvents.tsx`

**Events**: device.*, alert.*, trip.*, maintenance.*

**Dependencies**: T073
**Acceptance**: Events selected, webhook fires (mock)

---

### T176: Create webhook delivery log (FR-205)
**Description**: View webhook attempts and responses
**Files**: `apps/web/src/features/integrations/components/WebhookLogs.tsx`

**Dependencies**: T073
**Acceptance**: Shows successful/failed deliveries

---

### T177: Create API key management (FR-200)
**Description**: Generate/revoke API keys
**Files**: `apps/web/src/features/settings/components/APIKeys.tsx`

**Dependencies**: T063
**Acceptance**: API key generated, copyable

---

### T178: Create audit log viewer (FR-189, FR-190, FR-196)
**Description**: View all user activities
**Files**: `apps/web/src/features/settings/components/AuditLog.tsx`

**Displays**: User, action, timestamp, IP address (2-year retention)

**Dependencies**: T063
**Acceptance**: Audit log filterable by user, action

---

### T179: Create IP whitelisting (FR-197)
**Description**: Restrict admin access by IP
**Files**: `apps/web/src/features/settings/components/IPWhitelist.tsx`

**Dependencies**: T063
**Acceptance**: IP whitelist saved

---

### T180: Create multi-factor authentication setup (FR-186)
**Description**: Enable MFA for account
**Files**: `apps/web/src/features/auth/components/MFASetup.tsx`

**Dependencies**: T055
**Acceptance**: MFA enabled via QR code (mock)

---

# PHASE 11: MOBILE APP - FOUNDATION (T181-T195)

### T181: Initialize Expo React Native app
**Description**: Create mobile app in apps/mobile/
**Files**:
- `apps/mobile/package.json`
- `apps/mobile/app.json`
- `apps/mobile/babel.config.js`
- `apps/mobile/App.tsx`

**Dependencies**: T003, T004, T005
**Acceptance**: Expo dev server runs, app loads on simulator/device

---

### T182: Set up React Navigation with tab/stack navigators
**Description**: Mobile app navigation
**Files**:
- `apps/mobile/src/navigation/RootNavigator.tsx`
- `apps/mobile/src/navigation/MainTabNavigator.tsx`
- `apps/mobile/src/navigation/TripStackNavigator.tsx`

**Tabs**: Trips, Tracking, Alerts, Checklists, Profile

**Dependencies**: T181
**Acceptance**: Navigation works, deep linking configured

---

### T183: Set up nativewind (Tailwind for React Native)
**Description**: Styling configuration
**Files**:
- `apps/mobile/tailwind.config.js`
- `apps/mobile/babel.config.js` (update)

**Dependencies**: T005, T181
**Acceptance**: Tailwind classes work in React Native

---

### T184: Set up React Query for mobile
**Description**: Data fetching on mobile
**Files**: `apps/mobile/src/lib/react-query.ts`

**Dependencies**: T015, T181
**Acceptance**: React Query works, DevTools accessible

---

### T185: Create mobile authentication flow (FR-162)
**Description**: Login, biometric unlock
**Files**:
- `apps/mobile/src/features/auth/screens/LoginScreen.tsx`
- `apps/mobile/src/features/auth/hooks/useBiometric.ts`

**Dependencies**: T055, T182
**Acceptance**: Login works, Face ID/Touch ID optional

---

### T186: Set up expo-sqlite for offline storage (research.md #2)
**Description**: SQLite database for offline data
**Files**:
- `apps/mobile/src/lib/db/schema.ts`
- `apps/mobile/src/lib/db/init.ts`

**Schema**: trips, checklists, sync_queue

**Dependencies**: T181
**Acceptance**: Database creates, tables exist

---

### T187: Create offline sync manager (research.md #2)
**Description**: Queue-based sync with last-write-wins
**Files**:
- `apps/mobile/src/lib/sync/SyncManager.ts`
- `apps/mobile/src/lib/sync/SyncQueue.ts`

**Dependencies**: T186
**Acceptance**: Offline writes queue, sync when online

---

### T188: Set up background location tracking (research.md #8)
**Description**: Expo Task Manager for geolocation
**Files**:
- `apps/mobile/src/lib/location/backgroundLocation.ts`
- `apps/mobile/src/lib/location/geofencing.ts`

**Dependencies**: T181
**Acceptance**: Background location updates when trip active

---

### T189: Set up push notifications (FR-168)
**Description**: Expo Notifications
**Files**: `apps/mobile/src/lib/notifications/index.ts`

**Dependencies**: T181
**Acceptance**: Push notification token generated

---

### T190: Create mobile layout components
**Description**: Screen wrappers, headers
**Files**:
- `apps/mobile/src/components/layouts/Screen.tsx`
- `apps/mobile/src/components/layouts/Header.tsx`

**Dependencies**: T017, T182
**Acceptance**: Layouts work on iOS/Android

---

### T191: Create trip tracking screen (FR-165, FR-390)
**Description**: Start/stop trip
**Files**: `apps/mobile/src/features/trips/screens/TripTrackingScreen.tsx`

**Features**:
- Start Trip button
- Live stats (distance, duration, speed)
- Stop Trip button
- Auto-save to SQLite

**Dependencies**: T065, T186, T188
**Acceptance**: Trip tracks location, saves offline

---

### T192: Create trip history screen (FR-166)
**Description**: List past trips
**Files**: `apps/mobile/src/features/trips/screens/TripHistoryScreen.tsx`

**Dependencies**: T065, T186
**Acceptance**: Shows trips from SQLite when offline

---

### T193: Create checklist screen (FR-167, FR-392)
**Description**: Complete daily checklists
**Files**:
- `apps/mobile/src/features/checklists/screens/ChecklistScreen.tsx`
- `apps/mobile/src/features/checklists/components/ChecklistItem.tsx`

**Features**:
- Checklist items (text, checkbox, photo)
- Photo capture
- Signature pad
- Submit button (saves to SQLite if offline)

**Dependencies**: T072, T186
**Acceptance**: Checklist completes, syncs when online

---

### T194: Create alerts screen (FR-168)
**Description**: View in-app alerts
**Files**: `apps/mobile/src/features/alerts/screens/AlertsScreen.tsx`

**Dependencies**: T067, T184
**Acceptance**: Alerts list, acknowledgment works

---

### T195: Create driver profile screen (FR-163, FR-174)
**Description**: Driver info and scorecard
**Files**: `apps/mobile/src/features/profile/screens/ProfileScreen.tsx`

**Displays**: Name, photo, assigned vehicle, performance score

**Dependencies**: T065, T184
**Acceptance**: Profile loads, scorecard displays

---

# PHASE 12: MOBILE APP - FEATURES (T196-T210)

### T196: Create incident reporting (FR-170 to FR-173)
**Description**: Report incidents with photos/voice
**Files**:
- `apps/mobile/src/features/incidents/screens/IncidentReportScreen.tsx`
- `apps/mobile/src/features/incidents/components/PhotoCapture.tsx`
- `apps/mobile/src/features/incidents/components/VoiceRecorder.tsx`

**Dependencies**: T186, T188
**Acceptance**: Incident saved with GPS, photo, voice note

---

### T197: Create in-app messaging (FR-175)
**Description**: Driver-dispatcher communication
**Files**: `apps/mobile/src/features/messaging/screens/MessagingScreen.tsx`

**Dependencies**: T184
**Acceptance**: Messages send/receive (mock)

---

### T198: Create map screen for mobile (FR-073)
**Description**: View assigned route on map
**Files**: `apps/mobile/src/features/tracking/screens/MapScreen.tsx`

**Dependencies**: T069, react-native-maps
**Acceptance**: Route displays on map with stops

---

### T199: Create offline data cleanup (FR-169)
**Description**: Delete synced data older than 7 days
**Files**: `apps/mobile/src/lib/sync/cleanup.ts`

**Dependencies**: T186
**Acceptance**: Old records deleted automatically

---

### T200: Create mandatory sync enforcement (FR-170, FR-175a)
**Description**: Block writes after 48 hours offline
**Files**: `apps/mobile/src/lib/sync/enforceSync.ts`

**Dependencies**: T187
**Acceptance**: Alert triggers at 48 hours, sync required

---

### T201: Create settings screen (mobile) (FR-072)
**Description**: Language, notifications, offline behavior
**Files**: `apps/mobile/src/features/settings/screens/SettingsScreen.tsx`

**Dependencies**: T019, T189
**Acceptance**: Settings saved to device storage

---

### T202: Create battery optimization UI
**Description**: Show battery usage tips
**Files**: `apps/mobile/src/features/settings/components/BatteryOptimization.tsx`

**Dependencies**: T188
**Acceptance**: Tips displayed (accuracy tuning, background tracking)

---

### T203: Create network status indicator
**Description**: Show online/offline badge
**Files**: `apps/mobile/src/components/NetworkStatus.tsx`

**Dependencies**: T187
**Acceptance**: Badge updates when connectivity changes

---

### T204: Create sync status indicator
**Description**: Show pending sync items count
**Files**: `apps/mobile/src/components/SyncStatus.tsx`

**Dependencies**: T187
**Acceptance**: Shows "3 items pending sync"

---

### T205: Create geofence monitoring on mobile
**Description**: Detect geofence entry/exit
**Files**: `apps/mobile/src/lib/location/geofencing.ts` (enhancement)

**Dependencies**: T188, T066
**Acceptance**: Geofence events trigger alerts

---

### T206: Create vehicle inspection photo gallery
**Description**: View checklist photos
**Files**: `apps/mobile/src/features/checklists/components/PhotoGallery.tsx`

**Dependencies**: T193
**Acceptance**: Photos display in grid

---

### T207: Create signature capture (FR-167)
**Description**: Signature pad for checklists
**Files**: `apps/mobile/src/features/checklists/components/SignaturePad.tsx`

**Dependencies**: T193
**Acceptance**: Signature saves as base64 image

---

### T208: Create driver hours dashboard (mobile)
**Description**: View daily/weekly hours
**Files**: `apps/mobile/src/features/profile/components/HoursDashboard.tsx`

**Dependencies**: T065, T184
**Acceptance**: Shows hours remaining today

---

### T209: Create mobile onboarding flow
**Description**: Welcome screens on first launch
**Files**: `apps/mobile/src/features/onboarding/screens/OnboardingScreen.tsx`

**Dependencies**: T181
**Acceptance**: Onboarding shows once, skippable

---

### T210: Create mobile error handling
**Description**: Error boundaries and retry logic
**Files**:
- `apps/mobile/src/components/ErrorBoundary.tsx`
- `apps/mobile/src/lib/retry.ts`

**Dependencies**: T181
**Acceptance**: Errors caught, retry button works

---

# PHASE 13: TESTING (T211-T230)

### T211: Set up Vitest for web app
**Description**: Unit testing configuration
**Files**:
- `apps/web/vitest.config.ts`
- `apps/web/src/setupTests.ts`

**Dependencies**: T051
**Acceptance**: `yarn test` runs

---

### T212: Set up Jest for mobile app
**Description**: Unit testing configuration
**Files**:
- `apps/mobile/jest.config.js`
- `apps/mobile/src/setupTests.ts`

**Dependencies**: T181
**Acceptance**: `yarn test` runs on mobile

---

### T213: Set up MSW for testing
**Description**: Mock API in tests
**Files**: `apps/web/src/setupTests.ts` (update to start MSW server)

**Dependencies**: T026, T211
**Acceptance**: Tests use mock API

---

### T214 [P]: Write unit tests for utility functions
**Description**: Test date, format, map utils
**Files**: `packages/utils/src/**/*.test.ts`

**Dependencies**: T007-T010
**Acceptance**: 80%+ coverage for utils

---

### T215 [P]: Write unit tests for API hooks
**Description**: Test React Query hooks
**Files**: `packages/api/src/hooks/**/*.test.ts`

**Dependencies**: T063-T073, T213
**Acceptance**: All hooks tested with mock data

---

### T216 [P]: Write component tests for ui-web
**Description**: Test Button, Input, Card, etc.
**Files**: `packages/ui-web/src/components/**/*.test.tsx`

**Dependencies**: T016, T211
**Acceptance**: All components tested

---

### T217 [P]: Write component tests for web app features
**Description**: Test dashboard, tracking, vehicles, etc.
**Files**: `apps/web/src/features/**/*.test.tsx`

**Dependencies**: T076-T165, T213
**Acceptance**: Key components tested

---

### T218 [P]: Write component tests for mobile app
**Description**: Test trip tracking, checklists, etc.
**Files**: `apps/mobile/src/features/**/*.test.tsx`

**Dependencies**: T191-T210, T212
**Acceptance**: Key screens tested

---

### T219: Set up Playwright for E2E tests (web)
**Description**: E2E testing configuration
**Files**:
- `apps/web/playwright.config.ts`
- `apps/web/e2e/fixtures/auth.ts`

**Dependencies**: T051
**Acceptance**: Playwright runs against dev server

---

### T220: Write E2E test - User authentication flow
**Description**: Login → Dashboard → Logout
**Files**: `apps/web/e2e/auth.spec.ts`

**Dependencies**: T055, T219
**Acceptance**: E2E test passes

---

### T221: Write E2E test - Vehicle management flow
**Description**: Add vehicle → View detail → Edit → Delete
**Files**: `apps/web/e2e/vehicles.spec.ts`

**Dependencies**: T096-T098, T219
**Acceptance**: E2E test passes

---

### T222: Write E2E test - Live tracking flow
**Description**: Open tracking → View vehicles → Click marker
**Files**: `apps/web/e2e/tracking.spec.ts`

**Dependencies**: T079, T219
**Acceptance**: E2E test passes

---

### T223: Write E2E test - Geofence creation flow
**Description**: Create geofence → Assign vehicle → View events
**Files**: `apps/web/e2e/geofencing.spec.ts`

**Dependencies**: T121-T125, T219
**Acceptance**: E2E test passes

---

### T224: Set up Detox for E2E tests (mobile)
**Description**: Mobile E2E testing configuration
**Files**:
- `apps/mobile/.detoxrc.js`
- `apps/mobile/e2e/init.ts`

**Dependencies**: T181
**Acceptance**: Detox runs on simulator

---

### T225: Write E2E test - Trip tracking flow (mobile)
**Description**: Start trip → Stop trip → View history
**Files**: `apps/mobile/e2e/trip-tracking.spec.ts`

**Dependencies**: T191-T192, T224
**Acceptance**: E2E test passes

---

### T226: Write E2E test - Checklist flow (mobile)
**Description**: Complete checklist → Capture photo → Submit
**Files**: `apps/mobile/e2e/checklist.spec.ts`

**Dependencies**: T193, T224
**Acceptance**: E2E test passes

---

### T227: Write E2E test - Offline sync flow (mobile)
**Description**: Go offline → Create trip → Go online → Sync
**Files**: `apps/mobile/e2e/offline-sync.spec.ts`

**Dependencies**: T187, T224
**Acceptance**: E2E test passes

---

### T228: Set up visual regression testing (Chromatic/Percy)
**Description**: Screenshot comparison tests
**Files**: `.chromatic/config.json`

**Dependencies**: T016
**Acceptance**: Visual tests run on CI

---

### T229: Create test data seeders
**Description**: Seed scripts for realistic test data
**Files**: `packages/api/src/mocks/data/seeders/`

**Dependencies**: T027
**Acceptance**: Can seed 1000 vehicles, 200 drivers for stress testing

---

### T230: Set up CI/CD pipeline (GitHub Actions)
**Description**: Automated testing on PR
**Files**: `.github/workflows/ci.yml`

**Content**: Lint → Type check → Unit tests → E2E tests → Build

**Dependencies**: T020
**Acceptance**: CI passes on PR

---

# PHASE 14: POLISH & OPTIMIZATION (T231-T250)

### T231: Implement i18n in web app (FR-179)
**Description**: Multi-language support
**Files**: `apps/web/src/lib/i18n.ts`

**Dependencies**: T019, T051
**Acceptance**: Web app switches between 5 languages

---

### T232: Implement i18n in mobile app
**Description**: Multi-language support
**Files**: `apps/mobile/src/lib/i18n.ts`

**Dependencies**: T019, T181
**Acceptance**: Mobile app switches between 5 languages

---

### T233: Translate all 5 languages (EN, ES, FR, DE, HI)
**Description**: Complete translation files
**Files**: Update all locale JSON files with translations

**Dependencies**: T019
**Acceptance**: All strings translated (can use AI translation initially)

---

### T234: Implement accessibility features (FR-180)
**Description**: WCAG 2.1 Level AA compliance
**Tasks**:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

**Dependencies**: T016
**Acceptance**: Lighthouse Accessibility score >90

---

### T235: Add skip links for keyboard navigation
**Description**: Skip to main content
**Files**: `apps/web/src/components/SkipLinks.tsx`

**Dependencies**: T057
**Acceptance**: Tab key shows skip link

---

### T236: Implement code splitting and lazy loading (FR-092)
**Description**: Route-based code splitting
**Files**: Update route definitions to use React.lazy()

**Dependencies**: T052
**Acceptance**: Lighthouse Performance >90

---

### T237: Implement bundle analysis
**Description**: Analyze and reduce bundle size
**Files**: `apps/web/vite.config.ts` (add rollup-plugin-visualizer)

**Dependencies**: T051
**Acceptance**: Bundle size documented, no huge chunks

---

### T238: Optimize images across all apps
**Description**: WebP format, lazy loading
**Files**: Update all image usage

**Dependencies**: T038-T042 (marketing), T076+ (web)
**Acceptance**: Images lazy load, use WebP

---

### T239: Implement virtualization for large lists
**Description**: react-window for vehicle/driver tables
**Files**: Update VehicleTable.tsx, DriverTable.tsx with virtualization

**Dependencies**: T096, T103
**Acceptance**: 1000 rows render smoothly

---

### T240: Add service worker for web app
**Description**: Offline caching for web
**Files**: `apps/web/src/service-worker.ts`

**Dependencies**: T051
**Acceptance**: Web app works offline (read-only)

---

### T241: Implement error logging (Sentry)
**Description**: Production error tracking
**Files**: `apps/web/src/lib/sentry.ts`, `apps/mobile/src/lib/sentry.ts`

**Dependencies**: T051, T181
**Acceptance**: Errors logged to Sentry

---

### T242: Implement analytics (PostHog/Mixpanel)
**Description**: User behavior tracking
**Files**: `apps/web/src/lib/analytics.ts`, `apps/mobile/src/lib/analytics.ts`

**Dependencies**: T051, T181
**Acceptance**: Page views, button clicks tracked

---

### T243: Create Storybook for web components (FR-097)
**Description**: Component documentation
**Files**:
- `apps/web/.storybook/main.ts`
- `packages/ui-web/src/components/**/*.stories.tsx`

**Dependencies**: T016
**Acceptance**: Storybook runs, all components documented

---

### T244: Create API documentation with Swagger
**Description**: Interactive API docs
**Files**: `docs/api-swagger.yaml`

**Dependencies**: T029-T034
**Acceptance**: Swagger UI shows all endpoints

---

### T245: Create architecture diagrams
**Description**: System design documentation
**Files**: `docs/architecture.md`, `docs/diagrams/`

**Content**: Data flow, component hierarchy, deployment diagram

**Dependencies**: T001-T250
**Acceptance**: Diagrams accurate and up-to-date

---

### T246: Create developer onboarding guide
**Description**: README improvements
**Files**: `README.md`, `docs/CONTRIBUTING.md`, `docs/DEVELOPMENT.md`

**Content**: Setup, testing, deployment, troubleshooting

**Dependencies**: T001-T245
**Acceptance**: New developer can set up in <30 minutes

---

### T247: Optimize mobile app bundle size
**Description**: Reduce APK/IPA size
**Tasks**: Remove unused dependencies, enable Hermes

**Dependencies**: T181
**Acceptance**: APK <50MB, IPA <60MB

---

### T248: Add performance monitoring (Web Vitals)
**Description**: Track Core Web Vitals
**Files**: `apps/web/src/lib/web-vitals.ts`

**Dependencies**: T051
**Acceptance**: LCP <2.5s, FID <100ms, CLS <0.1

---

### T249: Create demo data reset script
**Description**: Reset mock database on demand
**Files**: `packages/api/src/mocks/scripts/reset.ts`

**Dependencies**: T028
**Acceptance**: Script reseeds database

---

### T250: Final integration testing - Full user flows
**Description**: Manual QA of complete feature set
**Test Flows**:
1. Marketing site → Sign up → Onboard organization
2. Add vehicles and drivers
3. Create geofences and routes
4. Start trip on mobile → Track on web
5. Complete checklist offline → Sync when online
6. Generate reports
7. Configure webhooks
8. White-label customization
9. Multi-language switching
10. Dark mode

**Dependencies**: All previous tasks
**Acceptance**: All flows work end-to-end

---

# DEPENDENCIES GRAPH (High-Level)

```
PHASE 1: Foundation (T001-T025)
    ↓
PHASE 2: Mock Server (T026-T035)
    ↓
    ├─→ PHASE 3: Marketing (T036-T050)
    │
    ├─→ PHASE 4-10: Web App (T051-T180)
    │   ├─→ Foundation (T051-T075)
    │   ├─→ Dashboard & Tracking (T076-T095)
    │   ├─→ Vehicle & Driver (T096-T120)
    │   ├─→ Geofencing & Routes (T121-T135)
    │   ├─→ Alerts & Maintenance (T136-T150)
    │   ├─→ Reports & Analytics (T151-T165)
    │   └─→ Settings & Admin (T166-T180)
    │
    └─→ PHASE 11-12: Mobile App (T181-T210)
        ├─→ Foundation (T181-T190)
        └─→ Features (T191-T210)
            ↓
PHASE 13: Testing (T211-T230)
    ↓
PHASE 14: Polish (T231-T250)
```

---

# PARALLEL EXECUTION OPPORTUNITIES

## Setup Phase (T003-T006)
```bash
# All config files are independent
Task: T003 - TypeScript configs
Task: T004 - ESLint configs
Task: T005 - Tailwind configs
Task: T006 - Prettier and Husky
```

## Utility Functions (T008-T011)
```bash
# Independent utility modules
Task: T008 - Date utils
Task: T009 - Format utils
Task: T010 - Map utils
Task: T011 - Validation schemas
```

## UI Packages (T016-T017)
```bash
# Web and mobile UI can be built in parallel
Task: T016 - ui-web package
Task: T017 - ui-mobile package
```

## Mock Data Generators (T027)
```bash
# All entity generators are independent
Task: Generate vehicles
Task: Generate drivers
Task: Generate trips
Task: Generate geofences
# ... (16 entities)
```

## React Query Hooks (T063-T073)
```bash
# All hooks are independent
Task: T063 - Organization hooks
Task: T064 - Vehicle hooks
Task: T065 - Driver hooks
# ... (11 hook files)
```

## Marketing Pages (T038-T042, T046)
```bash
# All pages are independent
Task: T038 - Homepage
Task: T039 - Pricing
Task: T040 - Features
Task: T041 - About
Task: T042 - Contact
Task: T046 - Marketing components
```

## Web App Feature Modules (After core foundation)
```bash
# Features can be built in parallel after T075
Task: T096-T120 - Vehicle & Driver module
Task: T121-T135 - Geofencing & Routes module
Task: T136-T150 - Alerts & Maintenance module
Task: T151-T165 - Reports & Analytics module
```

## Mobile Features (After T190)
```bash
# Mobile screens are independent
Task: T191 - Trip tracking
Task: T192 - Trip history
Task: T193 - Checklists
Task: T194 - Alerts
Task: T195 - Profile
```

## Testing (T214-T218)
```bash
# All test suites can run in parallel
Task: T214 - Utils tests
Task: T215 - Hook tests
Task: T216 - Component tests (web)
Task: T217 - Feature tests (web)
Task: T218 - Component tests (mobile)
```

---

# VALIDATION CHECKLIST

## Functional Requirements Coverage
- [x] FR-001 to FR-009: Company & Users (T029, T055, T063, T167-T169)
- [x] FR-010 to FR-030: Devices & Vehicles (T030, T064, T096-T102)
- [x] FR-031 to FR-041: Geofencing (T031, T066, T121-T127)
- [x] FR-042 to FR-050: Remote Controls (Mock in T030)
- [x] FR-051 to FR-060: Dashboards (T076, T088-T095)
- [x] FR-061 to FR-067: Regional Access (T172)
- [x] FR-068 to FR-078: Driver Management (T065, T103-T115)
- [x] FR-079 to FR-088: Maintenance (T068, T145-T149)
- [x] FR-089 to FR-098: Driver Behavior (T111-T113)
- [x] FR-099 to FR-112: Routes & Fuel (T069, T128-T135, T165)
- [x] FR-121 to FR-132: Reporting (T070, T151-T162)
- [x] FR-133 to FR-144: Alerts (T067, T136-T144)
- [x] FR-145 to FR-152: Sustainability (T164)
- [x] FR-153 to FR-160: Predictive Maintenance (T150)
- [x] FR-161 to FR-175: Mobile App (T181-T210)
- [x] FR-176 to FR-185: UX Requirements (T057, T059-T061, T234-T235)
- [x] FR-186 to FR-198: Security (T055, T180, T178-T179)
- [x] FR-199 to FR-212: Integrations (T073, T174-T177, T173)

## Entity Coverage (16 entities)
- [x] Organization (T012, T029, T063, T169)
- [x] User (T012, T029, T063, T167)
- [x] Device (T012, T030, T101-T102)
- [x] Vehicle (T012, T030, T064, T096-T100)
- [x] Driver (T012, T032, T065, T103-T115)
- [x] Trip (T012, T032, T065, T118-T119, T191-T192)
- [x] Geofence (T012, T031, T066, T121-T127)
- [x] Alert (T012, T033, T067, T136-T144)
- [x] Maintenance Record (T012, T033, T068, T145-T150)
- [x] Route (T012, T033, T069, T128-T135)
- [x] Behavior Event (T012, T111-T112)
- [x] Report (T012, T034, T070, T151-T162)
- [x] Webhook (T012, T034, T073, T174-T176)
- [x] Fuel Transaction (T012, T034, T071, T165)
- [x] Checklist Template (T012, T034, T072, T116)
- [x] Checklist Submission (T012, T034, T072, T117, T193)

## Platform Coverage
- [x] Marketing website (Next.js 14) - T036-T050
- [x] Web application (React+Vite) - T051-T180
- [x] Mobile application (Expo) - T181-T210

## Testing Coverage
- [x] Unit tests - T211-T218
- [x] E2E tests web - T219-T223
- [x] E2E tests mobile - T224-T227
- [x] Visual tests - T228

## Research Decisions Implemented
- [x] Map provider abstraction (T077)
- [x] Offline sync strategy (T186-T187, T199-T200)
- [x] WebSocket real-time (T014, T035, T074)
- [x] Map clustering (T078)
- [x] Multi-language (T019, T231-T233)
- [x] White-label theming (T018, T173)
- [x] RBAC UI rendering (T056)
- [x] Background location (T188)
- [x] Chart library (T088)
- [x] Form management (T075)
- [x] Mock server (T026-T035)

---

# SUCCESS CRITERIA

## MVP Readiness (After T050, T095, T120)
✅ Marketing site live with SEO
✅ Web app with dashboard, tracking, vehicles, drivers
✅ Mock API with realistic data
✅ Real-time map updates

## Full Web App (After T180)
✅ All 14 feature modules complete
✅ All 213 web-related functional requirements met
✅ Settings, admin, integrations working
✅ Reports generating

## Mobile App (After T210)
✅ Driver app with trip tracking
✅ Offline sync working (7-day retention)
✅ Checklists, alerts, messaging functional
✅ Background location tracking

## Production Ready (After T250)
✅ All tests passing (unit, E2E)
✅ Lighthouse scores >90 (Performance, Accessibility, SEO)
✅ i18n complete for 5 languages
✅ Documentation complete
✅ CI/CD pipeline working
✅ Error logging and analytics configured

---

**Total Tasks**: 250
**Estimated Timeline**: 16-20 weeks with team of 4-5 developers
- Foundation: 2 weeks
- Mock Server: 1 week
- Marketing: 2 weeks (parallel)
- Web App: 10-12 weeks
- Mobile App: 4-5 weeks (parallel with web after T095)
- Testing: 2 weeks (ongoing)
- Polish: 2 weeks

**Parallel Work Streams**:
- Stream 1: Marketing site (1 dev)
- Stream 2: Web app core (2 devs)
- Stream 3: Mobile app (1 dev, starts after week 8)
- Stream 4: Testing/QA (1 dev, ongoing)

---

*Generated from spec.md (213 functional requirements), plan.md (architecture), and research.md (technical decisions)*
*Last updated: 2025-10-04*
