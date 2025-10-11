# Fleet Driver Mobile App

React Native mobile application for fleet drivers built with Expo.

## Features Implemented (T181-T195)

### Core Setup
- **T181**: Expo React Native app initialization
- **T182**: React Navigation with tab/stack navigators
- **T183**: NativeWind (Tailwind for React Native)
- **T184**: React Query for data fetching
- **T185**: Mobile authentication flow with biometric login
- **T186**: Expo SQLite for offline storage
- **T187**: Offline sync manager with queue-based syncing
- **T188**: Background location tracking with Expo Task Manager
- **T189**: Push notifications with Expo Notifications

### UI Components
- **T190**: Mobile layout components (Screen, Header)

### Screens (Placeholders)
- **T191**: Trip Tracking Screen
- **T192**: Trip History Screen
- **T193**: Checklists Screen
- **T194**: Alerts Screen
- **T195**: Driver Profile Screen

## Project Structure

```
apps/mobile/
├── src/
│   ├── components/
│   │   └── layouts/          # Screen and Header components
│   ├── features/
│   │   ├── auth/            # Authentication screens and hooks
│   │   ├── trips/           # Trip-related screens
│   │   ├── tracking/        # Real-time tracking screen
│   │   ├── alerts/          # Alerts management
│   │   ├── checklists/      # Checklist screens
│   │   └── profile/         # Driver profile
│   ├── lib/
│   │   ├── db/              # SQLite database setup and helpers
│   │   ├── sync/            # Offline sync manager
│   │   ├── location/        # Location tracking and geofencing
│   │   ├── notifications/   # Push notification handlers
│   │   └── react-query.ts   # React Query configuration
│   └── navigation/          # Navigation structure
├── assets/                  # Images and other assets
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json
└── tsconfig.json

```

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

From the monorepo root:
```bash
yarn install
```

### Development

```bash
# Start the development server
cd apps/mobile
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android
```

## Key Technologies

- **Expo SDK 51**: Development platform
- **React Navigation 6**: Navigation library
- **React Query**: Data fetching and caching
- **Expo SQLite**: Local database for offline storage
- **Expo Location**: GPS tracking and geofencing
- **Expo Notifications**: Push notifications
- **Expo Local Authentication**: Biometric authentication
- **NativeWind**: Tailwind CSS for React Native

## Database Schema

The app uses SQLite for offline storage with the following tables:
- `trips`: Trip information
- `trip_locations`: GPS coordinates for trips
- `checklists`: Checklist data
- `checklist_items`: Individual checklist items
- `alerts`: Alert notifications
- `sync_queue`: Queue for offline sync

## Offline Functionality

The app supports full offline operation with:
- Local SQLite database
- Queue-based sync system
- Last-write-wins conflict resolution
- Automatic sync when online

## Background Services

- **Location Tracking**: Updates every 5 seconds or 10 meters
- **Geofencing**: Monitor entry/exit of designated areas
- **Push Notifications**: Real-time alerts from backend

## Permissions Required

### iOS
- Location (Always/When In Use)
- Camera
- Microphone
- Face ID/Touch ID

### Android
- Access Fine Location
- Access Background Location
- Camera
- Record Audio
- Biometric

## Next Steps

The placeholder screens need to be fully implemented with:
- Trip tracking with live GPS
- Checklist completion with photo/signature capture
- Alert acknowledgment
- Driver performance metrics
- Incident reporting
- In-app messaging

## Notes

- The app is configured for Expo Go but can be built as standalone apps
- Biometric authentication requires physical device testing
- Background location requires app to be approved for production use
- Push notifications require EAS project ID configuration
