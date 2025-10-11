# Running Apps Guide

This guide explains how to run all applications in the monorepo from the root folder.

## Quick Start

### Install Dependencies (First Time)
```bash
yarn install
```

This installs dependencies for all apps and packages in the monorepo.

---

## Running Apps from Root

### Mobile App (React Native + Expo)

#### Start Development Server
```bash
yarn mobile
# or
yarn dev:mobile
```

This starts the Expo development server. You can then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

#### Direct Platform Launch
```bash
# iOS Simulator (Mac only)
yarn mobile:ios

# Android Emulator
yarn mobile:android
```

### Web App (React + Vite)
```bash
yarn dev:web
```

Opens at `http://localhost:3001`

### Marketing Site (Next.js)
```bash
yarn dev:marketing
```

Opens at `http://localhost:3000`

### All Apps Simultaneously
```bash
yarn dev
```

Runs all apps in parallel using Turborepo.

---

## Building Apps

### Build Mobile App
```bash
cd apps/mobile
yarn build
# Note: Expo apps use EAS Build for production builds
```

### Build Web App
```bash
yarn build:web
```

### Build Marketing Site
```bash
yarn build:marketing
```

### Build All Apps
```bash
yarn build
```

---

## Mobile App Specific Commands

All mobile commands work from root or from `apps/mobile`:

### From Root
```bash
# Start Expo dev server
yarn mobile

# iOS Simulator
yarn mobile:ios

# Android Emulator
yarn mobile:android
```

### From apps/mobile
```bash
cd apps/mobile

# Start Expo dev server
yarn start

# iOS Simulator
yarn ios

# Android Emulator
yarn android

# Clear cache and restart
yarn start --clear
```

---

## Development Workflow

### Typical Day-to-Day

**Frontend Web Development:**
```bash
yarn dev:web
```

**Mobile Development:**
```bash
yarn mobile
```

**Full Stack Development:**
```bash
yarn dev
```

---

## Prerequisites by App

### Mobile App
- Node.js 18+
- Yarn
- Expo CLI (installed via npx)
- **For iOS**: macOS + Xcode + iOS Simulator
- **For Android**: Android Studio + Android Emulator
- **For Device**: Expo Go app on iOS/Android

### Web App
- Node.js 18+
- Yarn
- Modern browser

### Marketing Site
- Node.js 18+
- Yarn

---

## Troubleshooting

### Mobile App Won't Start

**Issue**: Metro bundler errors or dependency issues
```bash
cd apps/mobile
rm -rf node_modules
cd ../..
yarn install
yarn mobile --clear
```

**Issue**: Native module errors
```bash
cd apps/mobile
npx expo prebuild --clean
```

### Port Already in Use

**Mobile** (default port 8081):
```bash
lsof -ti:8081 | xargs kill -9
yarn mobile
```

**Web** (default port 3001):
```bash
lsof -ti:3001 | xargs kill -9
yarn dev:web
```

**Marketing** (default port 3000):
```bash
lsof -ti:3000 | xargs kill -9
yarn dev:marketing
```

### Turbo Cache Issues
```bash
yarn clean
yarn install
```

---

## Package Development

When working on shared packages:

```bash
# Make changes in packages/ui-web, packages/api, etc.
# Apps will auto-reload with changes (HMR)

# If changes aren't reflected:
yarn clean
yarn install
yarn dev:web  # or yarn mobile
```

---

## Environment Variables

### Web App
Create `apps/web/.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

### Mobile App
Create `apps/mobile/.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### Marketing Site
Create `apps/marketing/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Additional Commands

### Linting
```bash
yarn lint
```

### Testing
```bash
yarn test
```

### Code Formatting
```bash
yarn format
```

### Clean Everything
```bash
yarn clean
```

---

## Mobile App on Physical Device

### iOS Device (via Expo Go)
1. Install Expo Go from App Store
2. Run `yarn mobile` from root
3. Scan QR code with Camera app
4. App opens in Expo Go

### Android Device (via Expo Go)
1. Install Expo Go from Play Store
2. Run `yarn mobile` from root
3. Scan QR code with Expo Go app
4. App opens in Expo Go

### Features Requiring Physical Device
- Biometric authentication (Face ID, Touch ID, Fingerprint)
- Push notifications
- Background location tracking
- Camera and microphone (work in simulator but better on device)
- Accelerometer and gyroscope

---

## Production Builds

### Web App
```bash
yarn build:web
cd apps/web
yarn preview  # Preview production build
```

### Mobile App (EAS Build)
```bash
cd apps/mobile
eas build --platform ios
eas build --platform android
```

Requires EAS account and configuration.

---

## Architecture Notes

- **Monorepo**: Turborepo with Yarn workspaces
- **Apps**: 3 independent applications
- **Packages**: 5 shared packages (ui-web, ui-mobile, api, utils, config)
- **Hot Reload**: Changes in packages trigger app reloads
- **Parallel Execution**: `yarn dev` runs all apps simultaneously

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `yarn install` | Install all dependencies |
| `yarn dev` | Run all apps |
| `yarn dev:web` | Run web app only |
| `yarn mobile` | Run mobile app |
| `yarn mobile:ios` | Run mobile on iOS |
| `yarn mobile:android` | Run mobile on Android |
| `yarn dev:marketing` | Run marketing site |
| `yarn build` | Build all apps |
| `yarn lint` | Lint all code |
| `yarn test` | Run all tests |
| `yarn format` | Format all code |
| `yarn clean` | Clean all builds |

---

## Support

If you encounter issues:
1. Try `yarn clean && yarn install`
2. Check that all prerequisites are installed
3. Verify Node.js version (18+)
4. Check port availability
5. For mobile: Try `yarn mobile --clear`
