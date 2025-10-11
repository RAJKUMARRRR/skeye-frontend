# Package Management in Turborepo

## Architecture
This is a **Turborepo monorepo** with Yarn workspaces for package management.

## Installation Guidelines

### App-Specific Dependencies
Install in the specific app/package where they're used:

```bash
# For web app
yarn workspace @fleet/web add <package>

# For mobile app
yarn workspace @fleet/mobile add <package>

# For marketing app
yarn workspace @fleet/marketing add <package>
```

### Shared Dependencies
If a package is used across multiple apps/packages, consider:

1. **Create a shared package** (preferred):
   ```bash
   # Create packages/ui, packages/utils, etc.
   yarn workspace @fleet/ui add <package>
   ```

2. **Or install at root** (for tooling only):
   ```bash
   # Only for build tools, testing, linting, etc.
   yarn add -W <package>
   ```

### Dev Dependencies
```bash
# App-specific dev dependencies
yarn workspace @fleet/web add -D <package>

# Root-level dev tools (ESLint, Prettier, TypeScript)
yarn add -W -D <package>
```

## Current Package Structure

### Root Level
- Build tools: `turbo`, `prettier`, `eslint`, `typescript`
- Git hooks: `husky`, `lint-staged`

### @fleet/web (apps/web)
- UI Framework: `react`, `react-dom`
- Routing: `react-router-dom`
- State: `zustand`, `@tanstack/react-query`
- Forms: `react-hook-form`, `zod`, `@hookform/resolvers`
- UI: `react-hot-toast`, `tailwindcss`, `shadcn`
- Build: `vite`, `@vitejs/plugin-react`

### @fleet/mobile (apps/mobile)
- React Native specific packages

### @fleet/marketing (apps/marketing)
- Next.js specific packages

### Internal Packages
- `@fleet/api`: API client and types
- `@fleet/ui`: Shared UI components
- `@fleet/utils`: Shared utilities

## Turborepo Benefits
- ✅ Parallel builds and caching
- ✅ Dependency graph resolution
- ✅ Remote caching support
- ✅ Incremental builds

## Commands

```bash
# Install all dependencies
yarn install

# Run all apps in dev mode
turbo dev

# Build all apps
turbo build

# Lint all code
turbo lint

# Clean all builds
turbo clean
```
