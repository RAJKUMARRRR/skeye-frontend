# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **Fleet Management Platform** built as a Turborepo monorepo with three applications (Web, Mobile, Marketing) and five shared packages. The platform enables real-time vehicle tracking, driver management, maintenance scheduling, alerts, analytics, and more.

## Development Commands

### Setup
```bash
yarn install              # Install all dependencies
```

### Running Applications
```bash
# Run all apps in parallel
yarn dev

# Individual apps
yarn dev:web              # Web app → http://localhost:4001
yarn dev:mobile           # Mobile app (Expo)
yarn dev:marketing        # Marketing site → http://localhost:4000

# Mobile-specific
yarn mobile               # Start Expo dev server
yarn mobile:ios           # iOS simulator (macOS only)
yarn mobile:android       # Android emulator
```

### Building
```bash
yarn build                # Build all apps
yarn build:web            # Build web app only
yarn build:marketing      # Build marketing site only
```

### Code Quality
```bash
yarn lint                 # Lint all packages
yarn format               # Format with Prettier
yarn test                 # Run tests (all packages)
```

### Testing
```bash
# Run all tests
yarn test

# Mobile app tests (from root or apps/mobile)
cd apps/mobile && yarn test

# Web app tests
cd apps/web && yarn test
```

### Cleanup
```bash
yarn clean                # Remove build artifacts and node_modules
```

### Testing Single Files/Modules
For web app (Vite):
```bash
cd apps/web
yarn dev                  # Component changes hot reload automatically
```

For mobile app (Expo):
```bash
cd apps/mobile
yarn start --clear        # Clear cache and restart
```

## Architecture

### Monorepo Structure

**3 Applications:**
- `apps/web/` - React + Vite web app (port 4001)
- `apps/mobile/` - React Native + Expo mobile app
- `apps/marketing/` - Next.js marketing site (port 4000)

**5 Shared Packages:**
- `packages/api/` - API client, types, mock server (MSW)
- `packages/ui-web/` - Shared React components for web
- `packages/ui-mobile/` - Shared React Native components for mobile
- `packages/utils/` - Utility functions (formatting, validation, i18n)
- `packages/config/` - Shared configuration

### Key Architectural Patterns

#### Feature-Based Organization
Both web and mobile apps use **feature modules** for better scalability:

**Web app features** (`apps/web/src/features/`):
- `auth/` - Authentication & authorization
- `vehicles/` - Vehicle management
- `drivers/` - Driver management
- `tracking/` - Real-time tracking
- `alerts/` - Alert management
- `maintenance/` - Maintenance scheduling
- `routes/` - Route planning
- `geofencing/` - Geofence management
- `reports/` - Reporting & analytics
- `financial/` - Expense tracking & budgeting
- `safety/` - Safety monitoring
- `notifications/` - Notification center
- `documents/` - Document management
- `settings/` - Application settings

**Mobile app features** (`apps/mobile/src/features/`):
- `auth/` - Driver authentication
- `tracking/` - Background location tracking
- `trips/` - Trip recording & management
- `checklists/` - Pre/post-trip vehicle checklists
- `incidents/` - Incident reporting
- `messaging/` - Driver communication
- `profile/` - Driver profile
- `alerts/` - Alert notifications
- `settings/` - App preferences

Each feature typically contains:
```
feature/
├── components/      # Feature-specific UI components
├── contexts/        # React contexts (if needed)
├── hooks/           # Custom hooks
└── utils/           # Feature utilities
```

#### State Management Strategy

**Web App:**
- **TanStack Query** (React Query) - Server state, caching, real-time updates
- **Zustand** - Client state (UI, filters, dashboard)
  - `stores/dashboardStore.ts` - Dashboard state
  - `stores/filterStore.ts` - Filter preferences
  - `stores/uiStore.ts` - UI state (sidebar, modals)
- **Context API** - Auth & permissions
  - `AuthContext` - Authentication state
  - `PermissionContext` - Role-based access control

**Mobile App:**
- **TanStack Query** - Server state
- **React Context** - Local state management
- **SQLite** (`lib/db/`) - Offline data persistence
- **Async Storage** - User preferences

#### Real-Time Architecture

The platform uses a **dual-channel approach** for real-time updates:

1. **WebSocket** (via socket.io-client):
   - Vehicle location updates (every 2 seconds for active vehicles)
   - Real-time alerts
   - Driver status changes
   - Connection: `@fleet/api/client/websocket.ts`

2. **React Query Polling**:
   - Dashboard statistics (30s intervals)
   - Alert acknowledgments
   - Background data sync

**Mock WebSocket Server** (`packages/api/src/mocks/websocket/`):
- Simulates real-time location updates using custom DOM events
- 50 demo vehicles with realistic movement patterns
- Easy to swap for production WebSocket server

#### Type System

All types are centralized in `packages/api/src/types/`:
- `Vehicle` - Vehicle entities with status, location, fuel
- `Driver` - Driver profiles with license info
- `Alert` - Alert types (speeding, harsh braking, low fuel, etc.)
- `Trip` - Trip records with start/end locations
- `Location` - GPS coordinates with speed/heading
- `ApiResponse<T>` - Standardized API response wrapper

**Type sharing across apps:**
```typescript
// All apps import from @fleet/api
import { Vehicle, Driver, Alert } from '@fleet/api'
```

#### API Integration

**Development Mode (MSW Mock Server):**
- Mock API handlers in `packages/api/src/mocks/handlers/`
- Realistic data generated with Faker.js
- 50 vehicles, 30 drivers, 20 alerts pre-seeded
- Handlers for vehicles, drivers, organizations, trips, alerts

**Production Mode:**
- Axios client configured in `packages/api/src/client/axios.ts`
- Base URL from environment variables
- Easy switch: remove MSW initialization in `apps/web/src/main.tsx`

#### Routing

**Web App (React Router v6):**
- Route definitions in `apps/web/src/routes/index.tsx`
- Protected routes with `ProtectedRoute` component
- Nested routes for settings pages
- Layout wrapper with sidebar navigation

**Mobile App (React Navigation):**
- Bottom tab navigator (`MainTabNavigator.tsx`)
- Stack navigator for trips (`TripStackNavigator.tsx`)
- Root navigator (`RootNavigator.tsx`)

#### Mobile-Specific Architecture

**Background Location Tracking** (`lib/location/`):
- Uses Expo Location + Task Manager
- Tracks driver location during trips
- Battery-optimized with configurable intervals
- Offline queue for poor connectivity

**Offline-First Data Sync** (`lib/sync/`):
- SQLite for local storage
- Background sync when connectivity restored
- Conflict resolution strategy

**Push Notifications** (`lib/notifications/`):
- Expo Notifications for alerts
- Local notifications for trip reminders
- Background notification handling

## Environment Variables

### Web App (`apps/web/.env.local`)
```env
VITE_USE_MOCK_API=true                    # Enable MSW mock server
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=http://localhost:8000
```

### Mobile App (`apps/mobile/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### Marketing Site (`apps/marketing/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Path Aliases

Configured in `tsconfig.base.json` and Vite config:

```typescript
'@fleet/api'    → packages/api/src
'@fleet/utils'  → packages/utils/src
'@fleet/ui'     → packages/ui/src
'@/'            → apps/[app]/src  (in-app imports)
```

## Mobile App Architecture

### App Structure (`apps/mobile/`)

**Entry Point** (`App.tsx`):
- Sets up QueryClient with 5-minute stale time and 2 retries
- Wraps app with AuthProvider, SafeAreaProvider, QueryClientProvider
- Initializes RootNavigator

**Navigation Structure**:
```
RootNavigator (apps/mobile/src/navigation/)
├── MainTabNavigator.tsx      # Bottom tabs (Home, Trips, Alerts, Profile)
├── TripStackNavigator.tsx    # Trip-related screens
└── RootNavigator.tsx          # Top-level navigation + auth flow
```

**Core Libraries** (`apps/mobile/src/lib/`):
- `db/` - SQLite setup and schemas for offline storage
- `location/` - Background location tracking with Expo Location + Task Manager
- `notifications/` - Push notifications setup (Expo Notifications)
- `sync/` - Offline-first sync logic with conflict resolution
- `react-query.ts` - React Query hooks and configurations
- `retry.ts` - Network retry strategies

**App Components** (`apps/mobile/src/components/`):
- `ErrorBoundary.tsx` - Catches and handles runtime errors
- `NetworkStatus.tsx` - Shows online/offline indicator
- `SyncStatus.tsx` - Displays data sync status
- `layouts/` - Screen layout wrappers

**Contexts** (`apps/mobile/src/contexts/`):
- `AuthContext` - Driver authentication state

**Key Mobile Features**:
1. **Background Location Tracking** - Continues tracking even when app is backgrounded
2. **Offline-First** - SQLite caching with background sync when online
3. **Push Notifications** - Real-time alerts even when app is closed
4. **Biometric Auth** - Face ID/Touch ID/Fingerprint via `expo-local-authentication`
5. **Camera & Scanner** - Vehicle inspection photos via `expo-image-picker`
6. **Signature Capture** - Digital signatures for checklists via `react-native-signature-canvas`

### Mobile Testing & Development

**Running on Simulator/Emulator**:
```bash
yarn mobile:ios        # iOS simulator
yarn mobile:android    # Android emulator
```

**Running on Physical Device**:
1. Install Expo Go from App Store/Play Store
2. Run `yarn mobile` from root
3. Scan QR code with camera (iOS) or Expo Go app (Android)

**Features Requiring Physical Device**:
- Biometric authentication (Face ID, Touch ID, Fingerprint)
- Accurate GPS/location tracking
- Push notifications (full testing)
- Camera and accelerometer
- Background task testing

**Mobile-Specific Environment Variables**:
- `EXPO_PUBLIC_API_URL` - Backend API URL

## UI Packages

### `@fleet/ui-web` (Shared Web Components)

**Location**: `packages/ui-web/`

**20+ Components** built on Radix UI primitives + Tailwind CSS:

**Form Components**:
- `Button.tsx` - Primary, secondary, ghost, outline variants
- `Input.tsx` - Text input with validation states
- `Textarea.tsx` - Multi-line text input
- `Checkbox.tsx` - Checkbox with label
- `RadioGroup.tsx` - Radio button groups
- `Select.tsx` - Dropdown select (Radix)
- `Switch.tsx` - Toggle switch
- `Form.tsx` - Form wrapper with validation

**Layout Components**:
- `Card.tsx` - Content container with variants
- `Badge.tsx` - Status badges (success, warning, error, info)
- `Table.tsx` - Data table with sorting
- `Tabs.tsx` - Tab navigation
- `Dialog.tsx` - Modal dialog (Radix)
- `Modal.tsx` - Alternative modal implementation

**Data Visualization**:
- `Chart.tsx` - Recharts wrapper for common chart types
- `widgets/StatCard.tsx` - KPI stat card
- `widgets/KPICard.tsx` - Dashboard KPI widget

**Feedback**:
- `Toast.tsx` - Toast notifications
- `Label.tsx` - Form labels
- `Dropdown.tsx` - Dropdown menu (Radix)

**Dependencies**:
- **Radix UI** - Accessible component primitives
- **class-variance-authority** - Component variants
- **clsx + tailwind-merge** - Conditional className merging
- **lucide-react** - Icon library
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **recharts** - Chart library

**Usage in Web App**:
```typescript
import { Button, Card, Input } from '@fleet/ui-web'
```

### `@fleet/ui-mobile` (Shared Mobile Components)

**Location**: `packages/ui-mobile/`

**6 Core Components** for React Native with NativeWind:

- `Button.tsx` - Touchable button with variants
- `Card.tsx` - Content container for mobile
- `Input.tsx` - Text input for React Native
- `Badge.tsx` - Status indicators
- `Modal.tsx` - React Native modal wrapper
- `List.tsx` - List view component

**Dependencies**:
- **NativeWind** - Tailwind CSS for React Native
- **class-variance-authority** - Component variants
- **clsx + tailwind-merge** - Conditional styling

**Usage in Mobile App**:
```typescript
import { Button, Card, Input } from '@fleet/ui-mobile'
```

**Cross-Platform Component Strategy**:
- Same component names across `@fleet/ui-web` and `@fleet/ui-mobile`
- Consistent API and variants where possible
- Platform-specific implementations
- Shared design tokens via Tailwind config

### Adding New UI Components

**For Web Components**:
1. Add to `packages/ui-web/src/components/`
2. Export from `packages/ui-web/src/index.ts`
3. Use Radix UI primitives when possible
4. Follow existing variant patterns with CVA
5. Include TypeScript types

**For Mobile Components**:
1. Add to `packages/ui-mobile/src/components/`
2. Export from `packages/ui-mobile/src/index.ts`
3. Use NativeWind for styling
4. Ensure touch targets are 44x44px minimum
5. Test on both iOS and Android

## Code Quality

### Linting & Formatting
- **ESLint** - Configured in `.eslintrc.json`
- **Prettier** - Auto-formatting on save
- **lint-staged + Husky** - Pre-commit hooks enforce linting/formatting

### TypeScript
- Strict mode enabled (`strict: true`)
- Unused variables/parameters warn
- Path aliases for cleaner imports

## Turborepo Pipeline

Defined in `turbo.json`:

- `build` - Depends on package builds, outputs to `dist/`, `.next/`, `build/`
- `dev` - No cache, persistent (long-running)
- `lint` - Depends on package lints
- `test` - Depends on builds, outputs to `coverage/`
- `clean` - No cache

**Parallel execution:** `yarn dev` runs all apps simultaneously with intelligent caching.

## Working with Packages

When modifying shared packages (`api`, `ui-web`, `utils`, etc.):

1. Make changes in `packages/[package]/src/`
2. Apps auto-reload via HMR
3. If changes don't reflect:
   ```bash
   yarn clean
   yarn install
   yarn dev:web  # or yarn mobile
   ```

## Key Implementation Notes

### Adding a New Feature
1. Create feature directory in `apps/web/src/features/[feature-name]/`
2. Add components, hooks, contexts
3. Create page in `apps/web/src/pages/`
4. Add route in `apps/web/src/routes/index.tsx`
5. Add types to `packages/api/src/types/` if needed
6. Add MSW handlers to `packages/api/src/mocks/handlers/` for development

### Adding Real-Time Updates
1. Define event in WebSocket client (`packages/api/src/client/websocket.ts`)
2. Subscribe in component using `useQuery` with `refetchInterval` or custom hook
3. Update mock server (`packages/api/src/mocks/websocket/`) to simulate events

### Adding a Mobile Feature
1. Create feature directory in `apps/mobile/src/features/[feature-name]/`
2. Add screens, components, hooks
3. Create screen component
4. Add to navigation in `MainTabNavigator.tsx` or `TripStackNavigator.tsx`
5. Add types to `packages/api/src/types/` if needed
6. Set up offline storage in `lib/db/` if feature needs offline support
7. Configure background tasks in `lib/location/` if feature needs background processing

### Mobile Development Prerequisites
- Node.js 18+
- Expo CLI (via npx)
- **iOS**: macOS + Xcode + iOS Simulator
- **Android**: Android Studio + Android Emulator
- **Device Testing**: Expo Go app (iOS/Android)

### Biometric Features (Mobile)
- Face ID, Touch ID via `expo-local-authentication`
- Requires physical device for full testing
- Simulator has limited biometric simulation

## Troubleshooting

### Mobile Metro bundler errors
```bash
cd apps/mobile
rm -rf node_modules
cd ../..
yarn install
yarn mobile --clear
```

### Port conflicts
```bash
# Kill process on port
lsof -ti:4001 | xargs kill -9  # Web (4001)
lsof -ti:4000 | xargs kill -9  # Marketing (4000)
lsof -ti:8081 | xargs kill -9  # Mobile (8081)
lsof -ti:3000 | xargs kill -9  # Backend API (3000)
```

### Turbo cache issues
```bash
yarn clean
yarn install
```

### Package changes not reflecting
```bash
yarn clean
yarn install
yarn dev:[app-name]
```

## Production Builds

### Web App
```bash
yarn build:web
cd apps/web
yarn preview              # Preview production build locally
```

### Mobile App (EAS Build)
```bash
cd apps/mobile
eas build --platform ios
eas build --platform android
```
Requires EAS account and configuration.

## Git Workflow

The repository uses:
- **Husky** for Git hooks
- **lint-staged** for pre-commit linting/formatting
- Main branch: `main`

When committing:
- Linting and formatting run automatically
- TypeScript checks should pass
- Build artifacts are gitignored
