# Implementation Plan: Fleet Management Platform - Frontend Architecture

**Branch**: `001-you-are-a` | **Date**: 2025-10-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-you-are-a/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ Loaded: 630 lines, 213 functional requirements, 16 entities
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ All clarifications resolved (15/15)
   → Project Type: Web + Mobile (Turborepo monorepo)
   → Set Structure Decision: Monorepo with 3 apps + 5 shared packages
3. Fill the Constitution Check section
   → ✅ Constitution template loaded (placeholder - no project-specific constitution yet)
4. Evaluate Constitution Check section
   → ✅ No violations detected
   → Update Progress Tracking: Initial Constitution Check PASS
5. Execute Phase 0 → research.md
   → ✅ In progress
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → Pending Phase 0 completion
7. Re-evaluate Constitution Check
   → Pending Phase 1 completion
8. Plan Phase 2 → Describe task generation approach
   → Pending Phase 1 completion
9. STOP - Ready for /tasks command
```

## Summary

Building a comprehensive Fleet Management Platform frontend using a Turborepo monorepo architecture with three applications (Next.js marketing site, React+Vite web app, React Native mobile app) and five shared packages (ui-web, ui-mobile, api, utils, config). The platform handles real-time vehicle tracking for up to 5,000 vehicles per tenant, supports multi-tenant architecture with role-based access, provides offline-capable mobile apps, and includes advanced features like geofencing, route optimization, driver behavior monitoring, and predictive maintenance insights.

**Primary Technical Approach**:
- **Monorepo**: Turborepo with Yarn workspaces
- **Web Stack**: Next.js (marketing) + React 18 + Vite (main app) + React Router
- **Mobile Stack**: React Native with Expo SDK 50+
- **State Management**: React Query (TanStack) for server state + Zustand for client state
- **Real-Time**: WebSocket (socket.io-client) for live vehicle tracking and updates
- **Styling**: Tailwind CSS + shadcn/ui (web) + nativewind (mobile)
- **Maps**: Abstracted provider layer supporting Google Maps, Mapbox, and Leaflet
- **Data Fetching**: Axios with React Query hooks + WebSocket for real-time data
- **Testing**: Vitest (web), Jest (mobile), React Testing Library, Playwright (E2E web), Detox (E2E mobile)

## Technical Context

**Language/Version**:
- TypeScript 5.3+
- React 18.2+
- React Native / Expo SDK 50+
- Node.js 20 LTS

**Primary Dependencies**:
- **Monorepo**: Turborepo 1.11+, Yarn 4.x
- **Web Framework**: Next.js 14+ (App Router), Vite 5+, React Router 6+
- **Mobile Framework**: Expo 50+, React Native 0.73+
- **State Management**: @tanstack/react-query 5+, zustand 4+
- **HTTP Client**: axios 1.6+
- **WebSocket**: socket.io-client 4+ (real-time updates)
- **UI Libraries**:
  - Web: @radix-ui/*, class-variance-authority, tailwindcss
  - Mobile: nativewind, react-native-reanimated, react-native-gesture-handler
- **Maps**:
  - Web: @react-google-maps/api, mapbox-gl, react-leaflet
  - Mobile: react-native-maps
- **Forms**: react-hook-form 7+, zod 3+
- **Charts**: recharts (web), victory-native (mobile)
- **Authentication**: @clerk/nextjs, @clerk/expo (or similar)
- **Offline Storage (Mobile)**: expo-sqlite, @react-native-async-storage/async-storage, or MMKV
- **i18n**: next-intl (web), i18next + expo-localization (mobile)

**Storage**:
- Web: IndexedDB (via localforage) for offline caching
- Mobile: SQLite or MMKV for offline data (7-day retention)
- API: REST endpoints consumed via React Query

**Testing**:
- Unit: Vitest (web apps), Jest (mobile)
- Component: React Testing Library
- E2E: Playwright (web), Detox (mobile)
- API Mocking: MSW (Mock Service Worker) + Faker.js
- Mock Strategy: Environment-based switching (no hard-coded data in frontend)

**Target Platform**:
- Web: Modern browsers (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+)
- Mobile: iOS 14+, Android 11+ (API 30+)
- Responsive: Desktop, tablet, mobile web

**Project Type**: Monorepo (Web + Mobile)
- 3 applications: marketing (Next.js), web (React+Vite), mobile (Expo)
- 5 shared packages: ui-web, ui-mobile, api, utils, config

**Performance Goals**:
- Map load time: <2 seconds (MVP target)
- Real-time location updates: Every 10 seconds
- Dashboard refresh: 60 seconds
- Handle 500 concurrent vehicles in live view (with clustering)
- Lighthouse score: >90 (web)
- Mobile app startup: <3 seconds
- Offline-first mobile with seamless sync

**Constraints**:
- Multi-tenant data isolation (client-side enforcement via React Query keys)
- Maximum 5,000 vehicles per tenant
- Maximum 500 geofences per organization
- Mobile offline storage: 7 days, mandatory sync after 48 hours
- Support 5 languages: English, Spanish, French, German, Hindi
- WCAG 2.1 Level AA accessibility compliance
- Real-time data with 10-second update frequency
- Role-based UI rendering (Admin, Manager, Dispatcher, Driver)

**Scale/Scope**:
- 213 functional requirements across 14 modules
- 16 key entities
- 3 distinct applications
- 5 shared packages
- Multi-language support (5 languages)
- White-label capabilities
- Estimated 50+ feature modules in main web app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: Project uses a generic constitution template. No project-specific constitution file exists yet.

### Generic Frontend Best Practices Compliance

✅ **Component-Driven Architecture**
- Shared UI component libraries (`packages/ui-web`, `packages/ui-mobile`)
- Documented, reusable components
- Storybook-ready structure

✅ **Type Safety**
- Strict TypeScript mode across all packages
- Shared TypeScript configurations in `packages/config`
- Zod schemas for runtime validation

✅ **Testing Strategy**
- TDD approach: Tests before implementation
- Unit tests (Vitest/Jest)
- Component tests (React Testing Library)
- E2E tests (Playwright/Detox)
- Contract tests for API integration

✅ **Code Quality**
- Shared ESLint + Prettier configurations
- Pre-commit hooks via Husky
- Automated linting in Turborepo pipelines

✅ **Performance & Optimization**
- Code splitting and lazy loading
- Image optimization (Next.js Image component)
- Bundle analysis (Vite rollup-plugin-visualizer)
- React Query caching strategies
- Virtualization for large lists (react-window)

✅ **Accessibility**
- WCAG 2.1 Level AA compliance
- Semantic HTML
- ARIA labels via Radix UI primitives
- Keyboard navigation support

✅ **Maintainability**
- Feature-based folder structure
- Clear separation of concerns (presentation/logic/data)
- Centralized API layer (`packages/api`)
- Shared utilities (`packages/utils`)

**Status**: ✅ PASS - All core principles aligned

## Project Structure

### Documentation (this feature)
```
specs/001-you-are-a/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── api-endpoints.md
│   ├── react-query-hooks.md
│   └── type-definitions.md
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
fleet-management-platform/
├── apps/
│   ├── marketing/                 # Next.js 14 marketing website
│   │   ├── src/
│   │   │   ├── app/              # App Router pages
│   │   │   │   ├── (marketing)/  # Marketing routes
│   │   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   │   ├── pricing/
│   │   │   │   │   ├── features/
│   │   │   │   │   └── about/
│   │   │   │   ├── blog/         # Blog section
│   │   │   │   └── layout.tsx
│   │   │   ├── components/       # Marketing-specific components
│   │   │   ├── lib/              # Marketing utils
│   │   │   └── styles/           # Global styles
│   │   ├── public/               # Static assets
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── web/                       # React + Vite fleet management app
│   │   ├── src/
│   │   │   ├── features/         # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── stores/   # Zustand stores
│   │   │   │   │   └── routes.tsx
│   │   │   │   ├── tracking/     # Live tracking
│   │   │   │   ├── geofencing/
│   │   │   │   ├── fleet/        # Fleet management
│   │   │   │   ├── drivers/
│   │   │   │   ├── vehicles/
│   │   │   │   ├── maintenance/
│   │   │   │   ├── reports/
│   │   │   │   ├── alerts/
│   │   │   │   ├── routes/       # Route optimization
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   ├── components/       # Shared app components
│   │   │   │   ├── layouts/
│   │   │   │   ├── map/          # Map abstraction layer
│   │   │   │   │   ├── MapProvider.tsx
│   │   │   │   │   ├── GoogleMapAdapter.tsx
│   │   │   │   │   ├── MapboxAdapter.tsx
│   │   │   │   │   ├── LeafletAdapter.tsx
│   │   │   │   │   └── types.ts
│   │   │   │   └── navigation/
│   │   │   ├── lib/              # App utilities
│   │   │   ├── routes/           # React Router configuration
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── mobile/                    # React Native Expo app
│       ├── src/
│       │   ├── features/         # Feature modules
│       │   │   ├── auth/
│       │   │   ├── trips/
│       │   │   ├── tracking/
│       │   │   ├── checklists/
│       │   │   ├── alerts/
│       │   │   ├── profile/
│       │   │   └── settings/
│       │   ├── components/       # Shared mobile components
│       │   ├── navigation/       # React Navigation setup
│       │   ├── lib/              # Mobile utilities
│       │   │   ├── offline/      # Offline sync logic
│       │   │   └── location/     # Background location
│       │   ├── stores/           # Zustand stores
│       │   └── App.tsx
│       ├── app.json
│       ├── babel.config.js
│       ├── tailwind.config.js
│       └── package.json
│
├── packages/
│   ├── ui-web/                   # Shared web UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button/
│   │   │   │   ├── input/
│   │   │   │   ├── select/
│   │   │   │   ├── table/
│   │   │   │   ├── modal/
│   │   │   │   ├── card/
│   │   │   │   ├── badge/
│   │   │   │   └── ...          # shadcn/ui components
│   │   │   ├── theme/
│   │   │   └── index.ts
│   │   ├── tailwind.config.js    # Base Tailwind config
│   │   └── package.json
│   │
│   ├── ui-mobile/                # Shared mobile UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   ├── List/
│   │   │   │   └── ...
│   │   │   ├── theme/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── api/                      # API client & React Query hooks
│   │   ├── src/
│   │   │   ├── client/           # HTTP & WebSocket clients
│   │   │   │   ├── axios.ts
│   │   │   │   ├── websocket.ts  # WebSocket client (socket.io)
│   │   │   │   ├── interceptors.ts
│   │   │   │   └── config.ts
│   │   │   ├── mocks/            # Mock server (MSW)
│   │   │   │   ├── browser.ts    # MSW for browser
│   │   │   │   ├── server.ts     # MSW for Node (tests)
│   │   │   │   ├── handlers/     # Request handlers
│   │   │   │   │   ├── auth.ts
│   │   │   │   │   ├── vehicles.ts
│   │   │   │   │   ├── drivers.ts
│   │   │   │   │   └── ...
│   │   │   │   ├── data/         # Mock data generators
│   │   │   │   │   ├── generators/
│   │   │   │   │   ├── database.ts
│   │   │   │   │   └── seed.ts
│   │   │   │   └── websocket/    # WebSocket mock
│   │   │   │       └── mockSocket.ts
│   │   │   ├── hooks/            # React Query hooks
│   │   │   │   ├── useFleet.ts
│   │   │   │   ├── useVehicles.ts
│   │   │   │   ├── useDrivers.ts
│   │   │   │   ├── useTrips.ts
│   │   │   │   ├── useGeofences.ts
│   │   │   │   ├── useAlerts.ts
│   │   │   │   ├── useMaintenance.ts
│   │   │   │   └── ...
│   │   │   ├── types/            # API response types
│   │   │   ├── queries/          # Query key factory
│   │   │   ├── mutations/        # Mutation helpers
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── utils/                    # Shared utilities
│   │   ├── src/
│   │   │   ├── date/             # Date formatting
│   │   │   ├── format/           # Number, currency formatting
│   │   │   ├── map/              # Map utilities
│   │   │   │   ├── clustering.ts
│   │   │   │   ├── bounds.ts
│   │   │   │   └── distance.ts
│   │   │   ├── validation/       # Zod schemas
│   │   │   ├── constants/        # Shared constants
│   │   │   ├── hooks/            # Platform-agnostic hooks
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                   # Shared configurations
│       ├── eslint/
│       │   ├── next.js
│       │   ├── react.js
│       │   └── react-native.js
│       ├── typescript/
│       │   ├── base.json
│       │   ├── next.json
│       │   ├── react.json
│       │   └── react-native.json
│       ├── tailwind/
│       │   ├── base.js
│       │   ├── web.js
│       │   └── mobile.js
│       └── package.json
│
├── turbo.json                    # Turborepo pipeline config
├── package.json                  # Root package.json
├── yarn.lock
├── .gitignore
├── .prettierrc
└── README.md
```

**Structure Decision**:

Selected **Monorepo (Web + Mobile)** structure using Turborepo because:

1. **Code Sharing**: Maximum reuse of business logic, utilities, API layer, and type definitions across web and mobile apps
2. **Consistent Tooling**: Shared ESLint, TypeScript, and Prettier configurations ensure code quality
3. **Atomic Changes**: Single PR can update API types, shared components, and consuming apps simultaneously
4. **Build Optimization**: Turborepo's intelligent caching dramatically speeds up CI/CD (only rebuild changed packages)
5. **Developer Experience**: Single repository checkout, unified dependency management, coordinated releases

The structure separates concerns by:
- **Applications** (`apps/`): Platform-specific implementations
- **Shared Packages** (`packages/`): Reusable, platform-aware modules
- **Feature Modules**: Collocated components, hooks, and stores within each feature domain
- **Map Abstraction**: Provider-agnostic map interface supporting Google Maps, Mapbox, Leaflet

## Phase 0: Outline & Research

### Unknowns Requiring Research

Based on the Technical Context analysis, the following research tasks are needed:

1. **Map Provider Abstraction Layer**
   - Research: Design pattern for switching between Google Maps, Mapbox, and Leaflet dynamically
   - Investigation: Performance implications of abstraction layer
   - Deliverable: MapProvider interface design

2. **Offline Sync Strategy (Mobile)**
   - Research: Best practices for 7-day offline storage with SQLite/MMKV
   - Investigation: Conflict resolution for 48-hour sync interval
   - Deliverable: Offline sync architecture document

3. **Real-Time Data Updates (10-second interval)**
   - Research: WebSocket vs. Server-Sent Events vs. Polling for 500 concurrent vehicles
   - Investigation: React Query integration with real-time updates
   - Deliverable: Real-time update strategy

4. **Map Clustering (>500 vehicles)**
   - Research: Clustering algorithms for web (Supercluster) and mobile
   - Investigation: Performance benchmarks for 5,000 vehicle dataset
   - Deliverable: Clustering implementation approach

5. **Multi-Language Support**
   - Research: next-intl (Next.js), i18next (React), expo-localization (Expo)
   - Investigation: RTL support for potential future expansion
   - Deliverable: i18n architecture for 5 languages

6. **White-Label Theming**
   - Research: Runtime theme switching with Tailwind CSS
   - Investigation: CSS variable approach vs. multiple theme files
   - Deliverable: White-label theming strategy

7. **Role-Based UI Rendering**
   - Research: Permission-based component rendering patterns
   - Investigation: React Query integration with RBAC
   - Deliverable: RBAC UI architecture

8. **Background Location Updates (Mobile)**
   - Research: Expo Task Manager for background geolocation
   - Investigation: Battery optimization strategies
   - Deliverable: Background location implementation guide

9. **Chart Library Selection**
   - Research: Recharts (web) vs. Victory Native (mobile) performance
   - Investigation: Shared chart configuration abstraction
   - Deliverable: Chart library integration plan

10. **Form Management**
    - Research: react-hook-form with Zod schema validation
    - Investigation: Complex form scenarios (multi-step, dynamic fields)
    - Deliverable: Form architecture guidelines

### Research Execution Plan

**Output Location**: `specs/001-you-are-a/research.md`

**Structure**:
```markdown
# Research Document: Fleet Management Platform Frontend

## 1. Map Provider Abstraction Layer
- **Decision**: [chosen approach]
- **Rationale**: [why chosen]
- **Alternatives Considered**: [what else evaluated]
- **Implementation Notes**: [key technical details]

## 2. Offline Sync Strategy
[same structure]

... [continue for all 10 research topics]

## Summary
- Key Decisions Matrix
- Technology Stack Confirmation
- Risk Assessment
```

**Next**: Execute research tasks and generate `research.md`

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

### Planned Outputs

1. **data-model.md**
   - Frontend data models derived from 16 key entities
   - TypeScript interfaces for all entities
   - Zod validation schemas
   - State shape for Zustand stores
   - React Query cache keys structure

2. **contracts/** directory
   - `api-endpoints.md`: REST API contract specification
   - `react-query-hooks.md`: Custom hook signatures
   - `type-definitions.md`: TypeScript interfaces and types
   - `zustand-stores.md`: Client state store contracts

3. **quickstart.md**
   - Development environment setup
   - Running the monorepo locally
   - Running tests
   - Building for production
   - Storybook setup

4. **CLAUDE.md** (agent context file)
   - Technology stack summary
   - Recent architectural decisions
   - Code patterns and conventions
   - Common pitfalls to avoid

### Entity Extraction (16 Key Entities → TypeScript)

From feature spec, the following entities will be modeled:

1. **Organization**: Multi-tenant root entity
2. **User**: Authentication and RBAC
3. **Device**: IoT device metadata
4. **Vehicle**: Fleet asset
5. **Driver**: User subtype with driver-specific fields
6. **Trip**: Journey records
7. **Geofence**: Geographic boundaries
8. **Alert**: Notification system
9. **Maintenance Record**: Service history
10. **Route**: Journey planning
11. **Behavior Event**: Driver performance tracking
12. **Report**: Analytics and exports
13. **Webhook Configuration**: Integration setup
14. **Fuel Transaction**: Fuel tracking
15. **Checklist Template**: Inspection templates
16. **Checklist Submission**: Completed inspections

### API Contract Generation

From 213 functional requirements, the following API endpoint categories will be defined:

- **Auth**: Login, logout, MFA, session management
- **Organizations**: Tenant management, settings
- **Users**: CRUD, role assignment, regional access
- **Devices**: Registration, status, health monitoring
- **Vehicles**: CRUD, device assignment, status
- **Drivers**: CRUD, license tracking, performance
- **Trips**: Live tracking, history, playback
- **Geofences**: CRUD, event logging
- **Alerts**: Rules, notifications, acknowledgment
- **Maintenance**: Scheduling, records, reminders
- **Routes**: Optimization, assignment, tracking
- **Reports**: Generation, scheduling, export
- **Fuel**: Transactions, analytics
- **Checklists**: Templates, submissions

### React Query Hook Pattern

Example contract for each entity:

```typescript
// Read operations
useFleet(orgId: string): UseQueryResult<Fleet>
useVehicles(filters?: VehicleFilters): UseQueryResult<Vehicle[]>
useVehicle(id: string): UseQueryResult<Vehicle>

// Write operations
useCreateVehicle(): UseMutationResult<Vehicle, CreateVehicleInput>
useUpdateVehicle(): UseMutationResult<Vehicle, UpdateVehicleInput>
useDeleteVehicle(): UseMutationResult<void, string>

// Real-time subscriptions (if needed)
useVehicleLiveLocation(vehicleId: string): UseQueryResult<Location>
```

### Zustand Store Pattern

Example contract for client state:

```typescript
// UI State Store
interface UIStore {
  sidebarOpen: boolean
  mapProvider: 'google' | 'mapbox' | 'leaflet'
  theme: 'light' | 'dark'
  setSidebarOpen: (open: boolean) => void
  setMapProvider: (provider: MapProvider) => void
  toggleTheme: () => void
}

// Filter State Store
interface FilterStore {
  vehicleFilters: VehicleFilters
  dateRange: DateRange
  setVehicleFilters: (filters: VehicleFilters) => void
  setDateRange: (range: DateRange) => void
  clearFilters: () => void
}
```

### Test Scenario Extraction

From user stories in spec, generate test scenarios:

1. **Company Onboarding**: Registration → Admin setup → Team invites
2. **Device Management**: QR scan → Device activation → Health monitoring
3. **Live Tracking**: Real-time updates → Map clustering → Vehicle selection
4. **Geofencing**: Create geofence → Entry/exit alerts → Event logging
5. **Driver Behavior**: Incident detection → Scorecard generation → Trend analysis
6. **Maintenance**: Preventive scheduling → Reminders → Predictive suggestions
7. **Route Optimization**: Multi-stop route → Optimization → Driver assignment
8. **Mobile App**: Offline checklist → Data sync → Incident reporting
9. **Alerts**: Custom rules → Multi-channel delivery → Escalation
10. **Reporting**: Scheduled reports → On-demand generation → Export

**Next**: Generate all Phase 1 artifacts after research completion

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

### Task Generation Strategy

The `/tasks` command will load `.specify/templates/tasks-template.md` and generate tasks in the following order:

#### Phase 1: Foundation & Tooling (Tasks 1-10)
1. **Monorepo Setup**: Initialize Turborepo with Yarn workspaces
2. **Package Scaffolding**: Create all apps and packages with basic structure
3. **Shared Configs**: Set up TypeScript, ESLint, Prettier, Tailwind configs
4. **Type Definitions**: Generate TypeScript interfaces from data-model.md [P]
5. **Validation Schemas**: Create Zod schemas for all entities [P]
6. **API Client Base**: Set up Axios instance with interceptors [P]
7. **React Query Setup**: Configure QueryClient, DevTools, persistence [P]
8. **Map Abstraction**: Implement MapProvider interface [P]
9. **Theme System**: Set up Tailwind theme with dark mode support [P]
10. **Testing Infrastructure**: Configure Vitest, Jest, RTL, Playwright, Detox

#### Phase 2: Shared Packages (Tasks 11-25)
11. **ui-web Components**: Implement shadcn/ui base components [P]
12. **ui-mobile Components**: Implement nativewind base components [P]
13. **Utility Functions**: Date, format, map utilities [P]
14. **Query Key Factory**: Centralized React Query keys [P]
15. **Custom Hooks Library**: Shared platform-agnostic hooks [P]
16-25. **API Hook Generation**: One hook per entity (16 entities) [P]

#### Phase 3: Marketing Site (Tasks 26-30)
26. **Next.js App Setup**: Initialize with App Router
27. **Landing Page**: Implement homepage with SEO
28. **Pricing Page**: Feature tiers and pricing display
29. **Features Page**: Product feature showcase
30. **Blog Setup**: MDX blog with Contentlayer integration

#### Phase 4: Web App - Core Features (Tasks 31-60)
31. **Authentication Flow**: Login, logout, MFA, protected routes
32. **Dashboard Layout**: Navigation, sidebar, header, breadcrumbs
33. **Fleet Overview Dashboard**: Summary widgets, KPIs, charts
34. **Live Tracking Module**: Real-time map, vehicle markers, clustering
35. **Vehicle Management**: CRUD operations, device assignment
36. **Device Management**: Registration, status monitoring, health metrics
37. **Geofencing Module**: Map-based creation, rule configuration, event list
38. **Driver Management**: Profiles, license tracking, assignment
39. **Trip History**: Search, filter, playback with timeline
40. **Maintenance Module**: Scheduling, reminders, service records
41. **Route Optimization**: Multi-stop planning, traffic integration, assignment
42. **Alerts Module**: Rule builder, notification preferences, history
43. **Reports Module**: Template builder, scheduling, export (PDF/CSV)
44. **Analytics Dashboard**: Charts, trends, comparisons
45. **Driver Behavior**: Scorecards, incident list, coaching suggestions
46. **Fuel Management**: Transaction tracking, theft detection, analytics
47. **Settings Module**: User preferences, organization settings, integrations
48. **Webhook Configuration**: Endpoint management, event subscriptions, logs
49. **Regional Access Control**: Region assignment, data filtering
50. **White-Label UI**: Theme switcher, logo upload, color customization
51-60. **Role-Based Views**: Admin, Manager, Dispatcher, Driver dashboards [P]

#### Phase 5: Mobile App - Core Features (Tasks 61-75)
61. **Navigation Setup**: React Navigation with tab/stack navigators
62. **Authentication Flow**: Login, biometric unlock, session management
63. **Trip Tracking Screen**: Start/stop trip, live tracking, stats
64. **Checklist Feature**: Template display, completion, signature capture
65. **Alerts Screen**: Push notifications, in-app inbox, acknowledgment
66. **Driver Profile**: Personal info, performance metrics, scorecard
67. **Trip History (Mobile)**: List view, detail screen, offline access
68. **Offline Storage**: SQLite schema, sync queue, conflict resolution
69. **Background Location**: Expo Task Manager integration, geofence monitoring
70. **Incident Reporting**: Photo capture, voice notes, GPS tagging
71. **In-App Messaging**: Dispatcher communication, message history
72. **Settings (Mobile)**: Language, notifications, offline behavior
73. **Map Screen (Mobile)**: react-native-maps, vehicle markers, route display
74. **Offline Sync Logic**: Queue management, background sync, retry logic
75. **Push Notifications**: Expo Notifications, FCM/APNs integration

#### Phase 6: Testing (Tasks 76-90)
76-80. **Unit Tests (Web)**: Core utilities, hooks, stores [P]
81-85. **Component Tests (Web)**: Feature modules, shared components [P]
86-88. **E2E Tests (Web)**: Critical user flows (Playwright) [P]
89-90. **Mobile Tests**: Component tests (Jest), E2E tests (Detox) [P]

#### Phase 7: Polish & Optimization (Tasks 91-100)
91. **Accessibility Audit**: WCAG 2.1 AA compliance, ARIA labels
92. **Performance Optimization**: Code splitting, lazy loading, bundle analysis
93. **i18n Implementation**: Translations for 5 languages
94. **Error Boundaries**: Global error handling, fallback UI
95. **Loading States**: Skeleton screens, suspense fallbacks
96. **SEO Optimization**: Meta tags, sitemap, structured data (marketing)
97. **Storybook Setup**: Component documentation, visual testing
98. **CI/CD Pipeline**: GitHub Actions for linting, testing, building
99. **Documentation**: README, API docs, architecture diagrams
100. **Quickstart Validation**: Follow quickstart.md, fix any issues

### Ordering Strategy

- **TDD Order**: Tests before implementation for each feature
- **Dependency Order**:
  1. Tooling & configs first
  2. Shared packages before apps
  3. Core features before advanced features
  4. Web and mobile apps can be parallelized after shared packages
- **Parallel Execution Markers** `[P]`:
  - Independent components can be built simultaneously
  - All API hooks can be developed in parallel (same interface pattern)
  - Web and mobile features are independent after shared foundation

### Estimated Output

**Total Tasks**: ~100 tasks
- Foundation: 10 tasks
- Shared Packages: 15 tasks
- Marketing Site: 5 tasks
- Web App: 30 tasks
- Mobile App: 15 tasks
- Testing: 15 tasks
- Polish: 10 tasks

**Execution Time Estimate** (with team of 3-4 developers):
- Phase 1-2 (Foundation + Shared): 2-3 weeks
- Phase 3-4 (Marketing + Web Core): 6-8 weeks
- Phase 5 (Mobile): 4-5 weeks
- Phase 6-7 (Testing + Polish): 2-3 weeks
- **Total MVP**: 14-19 weeks (~3.5-4.5 months)

**IMPORTANT**: This phase is executed by the `/tasks` command, NOT by `/plan`

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (`/tasks` command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following Turborepo pipeline)
**Phase 5**: Validation (run tests, execute quickstart.md, Lighthouse audits, performance benchmarks)

## Complexity Tracking

*No constitutional violations detected*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |

**Notes**:
- Monorepo adds tooling complexity but is justified by massive code reuse
- Map abstraction layer adds indirection but enables provider flexibility
- Three apps are unavoidable: marketing needs Next.js SSG, web app needs Vite performance, mobile needs React Native

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved (15/15)
- [x] Complexity deviations documented (none)

---
*Based on Constitution template - See `/memory/constitution.md`*
