# Fleet Management Platform - MVP

A modern fleet management platform built with React, TypeScript, and Vite in a Turborepo monorepo.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

The app will be available at **http://localhost:3001**

## 📁 Project Structure

```
frontend-v2/
├── apps/
│   └── web/                 # React web application (Vite)
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/       # Page components
│       │   ├── hooks/       # Custom React hooks
│       │   └── App.tsx
├── packages/
│   ├── api/                 # API client & mock server
│   │   └── src/
│   │       ├── client/      # Axios client & WebSocket
│   │       ├── types/       # TypeScript types
│   │       └── mocks/       # MSW mock server
│   ├── ui/                  # Shared UI components
│   └── utils/               # Utility functions
└── turbo.json               # Turborepo configuration
```

## 🎯 Features

### Current MVP Features
- **Dashboard**: Real-time vehicle statistics (Total, Active, Idle, Maintenance, Offline)
- **Vehicles List**: Browse all vehicles in the fleet
- **Live Tracking**: Real-time vehicle location tracking
- **Mock Backend**: Complete MSW-based mock API with 50 demo vehicles
- **WebSocket Simulation**: Real-time location updates every 2 seconds

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Mock Backend**: MSW (Mock Service Worker) + Faker.js
- **Build Tool**: Vite
- **Monorepo**: Turborepo + Yarn workspaces

## 🔧 Available Scripts

```bash
# Development
yarn dev          # Start dev server (all packages)

# Build
yarn build        # Build all packages

# Linting
yarn lint         # Run ESLint

# Code Formatting
yarn format       # Format code with Prettier

# Clean
yarn clean        # Remove build artifacts and node_modules
```

## 📦 Packages

### `@fleet/web`
Main web application built with Vite + React. Runs on port 3001.

### `@fleet/api`
API client package with:
- Axios HTTP client
- WebSocket client (socket.io-client)
- TypeScript types
- MSW mock server with handlers for vehicles, drivers, and alerts

### `@fleet/utils`
Shared utility functions for formatting distances, dates, fuel levels, etc.

### `@fleet/ui`
Shared UI components (currently a stub for future expansion).

## 🎨 Mock Data

The mock server generates realistic data using Faker.js:
- **50 vehicles** with various statuses (active, idle, maintenance, offline)
- **30 drivers** with contact information
- **20 alerts** with different severity levels
- Real-time location updates every 2 seconds for active vehicles

## 🌐 Environment Variables

Create a `.env.development` file in `apps/web/`:

```env
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

## 🔄 WebSocket Real-Time Updates

The mock WebSocket server simulates real-time vehicle location updates:
- Updates broadcast every 2 seconds
- Only active vehicles receive updates
- Uses custom DOM events for simulation
- Can be easily replaced with real WebSocket server

## 🚦 Next Steps

To extend this MVP:
1. Add vehicle list with filtering and search
2. Implement live tracking map view
3. Add driver management
4. Create alerts dashboard
5. Build trip history
6. Add authentication

## 📝 Notes

- This is an MVP using mock data for local testing
- No hard-coded data in frontend - all data comes from mock API
- Easy to replace mock server with real backend API
- TypeScript strict mode enabled for better type safety
