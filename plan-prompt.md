You are a frontend architecture expert. Create a **detailed technical architecture specification** for the frontend of a Fleet Management Platform. 
Focus strictly on **frontend architecture** — no backend or infrastructure.

---

### 🎯 Objective
The platform includes:
1. **Marketing website** for public landing pages and SEO
2. **Main web application** for authenticated fleet management
3. **Mobile app** for drivers and managers

The solution must be modular, scalable, maintainable, and built using a **monorepo setup** with **Turborepo**.

---

### 🧱 Monorepo Setup (Turborepo)
- Monorepo managed by **Turborepo**
- Structure:
  - `apps/marketing` → Next.js marketing site
  - `apps/web` → React + Vite main web app
  - `apps/mobile` → React Native (Expo) mobile app
  - `packages/ui-web` → Shared UI components for web (Tailwind + shadcn)
  - `packages/ui-mobile` → Shared UI components for mobile (nativewind)
  - `packages/config` → Shared configs (TypeScript, ESLint, Tailwind)
  - `packages/utils` → Shared utilities, hooks, constants
  - `packages/api` → Axios instance, API wrappers, query keys
- Package manager: **Yarn**
- Shared TypeScript configurations and strict type safety

---

### 🌐 Marketing Website (apps/marketing)
- Framework: **Next.js (App Router)**
- Use cases: Landing, Pricing, Features, Blog
- Features:
  - SSG for SEO
  - Dynamic metadata, sitemap, and SEO optimization
  - CMS integration-ready (Sanity, Contentlayer)
  - Shared UI from `packages/ui-web`
  - Responsive design (Tailwind)
  - Deployed easily on Vercel

---

### 🧭 Main Web Application (apps/web)
- Framework: **React + Vite**
- Purpose: Fleet management dashboard
- Features:
  - Client-side routing with React Router
  - **State management**: 
    - **React Query (TanStack)** for server state and data fetching
    - **Axios** for REST API integration (used inside React Query)
    - **Zustand** for client-side state (UI, filters, session)
  - Modular feature folders: `features/tracking`, `features/geofence`, `features/alerts`, etc.
  - UI: Tailwind + shadcn/ui components from `packages/ui-web`
  - Authentication integration (Clerk or similar)
  - Role-based access (Admin, Manager, Driver)
  - Responsive layouts and dashboards
  - Map Integration:
    - Support **Google Maps**, **Mapbox**, and **Leaflet**
    - Configurable provider (switchable via env or settings)
    - Wrapper component `MapProvider` to abstract map logic
  - Data visualization (charts for trips, fuel, stats)
  - Error boundaries and Suspense for smooth UX

---

### 📱 Mobile Application (apps/mobile)
- Framework: **React Native (Expo)**
- Purpose: Driver/manager app for trips, alerts, geofence notifications
- Features:
  - Offline support with local storage (SQLite or MMKV)
  - Shared utils/hooks from `packages/utils`
  - UI with `nativewind` (Tailwind for RN)
  - Shared UI components from `packages/ui-mobile`
  - State: **React Query + Axios + Zustand**
  - Authentication integration
  - Background location updates
  - Map screen using **react-native-maps**, configurable to Google/Mapbox
  - In-app notifications and trip checklists

---

### 🎨 Styling & UI System
- **Tailwind CSS** as the base styling system
- **shadcn/ui** for accessible and beautiful web components
- **nativewind** for mobile styling
- Shared theme and design tokens in `packages/ui-web` and `packages/ui-mobile`
- Dark/light theme support
- Reusable, documented UI components

---

### ⚙️ State Management & Data Layer
- **React Query** (TanStack) for all server data
- **Axios** for REST API calls (configured in `packages/api`)
- Global query keys, error handling, and caching strategy
- **Zustand** for local state (UI filters, modal states, temporary selections)
- Hooks-based data access (`useFleetData`, `useDeviceStats`, etc.)

---

### 🗺️ Map Integration
- Provide a unified `MapProvider` abstraction layer
- Support **Google Maps**, **Mapbox**, and **Leaflet**
- Switch map provider via environment variable or runtime settings
- Features:
  - Live tracking markers
  - Geofencing polygons
  - Device clustering
  - Click-to-info windows
- Shared map utils in `packages/utils/map`

---

### 🧰 Shared Packages
- `packages/ui-web`: Tailwind + shadcn/ui components for web
- `packages/ui-mobile`: Nativewind-based components for mobile
- `packages/utils`: Shared helpers, hooks, date formatting, map utils
- `packages/api`: Axios instance, React Query hooks, API endpoints
- `packages/config`: TypeScript configs, ESLint, Prettier, Tailwind config

---

### 🧪 Testing
- Unit tests: **Vitest** (web), **Jest** (mobile)
- UI tests: **React Testing Library**
- E2E: **Playwright** (web), **Detox** (mobile)
- Mock API: **MSW**

---

### 📈 Performance & Quality
- Code splitting and lazy loading
- Image optimization (Next.js)
- Bundle analysis (Vite + Web)
- Accessibility compliance
- Lighthouse >90
- Strict TypeScript mode
- Shared ESLint and Prettier

---

### 🧭 Monorepo Tooling
- **Turborepo** pipelines for build, lint, test, dev
- Caching and incremental builds
- Commands:
  - `turbo run dev`
  - `turbo run build`
  - `turbo run lint`
  - `turbo run test`

---

### 📂 Deliverables
- Monorepo structure diagram
- Example folder structure for each app
- Architecture flow: data flow, map provider abstraction, shared UI usage
- Explanation of how to add a new feature module
- Suggested folder layout for `features/` in web app
