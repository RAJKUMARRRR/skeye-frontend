# Environment Variables Setup Guide

Quick reference for setting up environment variables across all apps in the Fleet Management Platform monorepo.

## 🚀 Quick Start

### 1. Copy Example Files

```bash
# Web app
cp apps/web/.env.example apps/web/.env.development

# Marketing site
cp apps/marketing/.env.example apps/marketing/.env

# Mobile app
cp apps/mobile/.env.example apps/mobile/.env
```

### 2. Get Required API Keys

You'll need the following services:

| Service | Purpose | Get Keys | Required For |
|---------|---------|----------|--------------|
| **Clerk** | Authentication | [dashboard.clerk.com](https://dashboard.clerk.com) | All apps |
| **Mapbox** | Maps & Tracking | [account.mapbox.com](https://account.mapbox.com) | Web app |
| **Backend API** | Data & Business Logic | Deploy your backend | All apps |

### 3. Update Environment Files

#### Web App (`apps/web/.env.development`)

```bash
# Replace with your actual backend URL
VITE_API_URL=http://localhost:3000

# Replace with your WebSocket URL
VITE_WS_URL=ws://localhost:3000

# Set to false to connect to real backend
VITE_USE_MOCK_API=false

# Replace with your Clerk publishable key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Replace with your Mapbox token
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi...

# Marketing site URL
VITE_MARKETING_URL=http://localhost:4000
```

#### Marketing Site (`apps/marketing/.env`)

```bash
# Site URLs
NEXT_PUBLIC_SITE_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:4001

# Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Clerk redirects
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=http://localhost:4001/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=http://localhost:4001/dashboard
```

#### Mobile App (`apps/mobile/.env`)

```bash
# Backend API (include /api suffix for mobile)
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# WebSocket URL
EXPO_PUBLIC_WS_URL=ws://localhost:3000

# Clerk key
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

**Important for Mobile:** When testing on a physical device, replace `localhost` with your computer's local IP address:

```bash
# Find your IP:
# macOS/Linux: ifconfig | grep inet
# Windows: ipconfig

# Example with IP address:
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
EXPO_PUBLIC_WS_URL=ws://192.168.1.100:3000
```

## 🔧 Development vs Production

### Development Environment

Development uses localhost URLs and test keys:

```bash
# API
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000

# Clerk (test keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Production Environment

Production uses deployed URLs and live keys:

```bash
# API
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com  # Note: wss:// not ws://

# Clerk (live keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

## 🔐 Environment Variable Prefixes

Different apps require different prefixes:

| App | Prefix | Example | Exposed to Client |
|-----|--------|---------|-------------------|
| **Web** (Vite) | `VITE_` | `VITE_API_URL` | ✅ Yes |
| **Marketing** (Next.js) | `NEXT_PUBLIC_` | `NEXT_PUBLIC_SITE_URL` | ✅ Yes |
| **Marketing** (Server) | None | `CLERK_SECRET_KEY` | ❌ No |
| **Mobile** (Expo) | `EXPO_PUBLIC_` | `EXPO_PUBLIC_API_URL` | ✅ Yes |

**Security Note:** Variables with these prefixes are bundled into client-side code. Never use them for secrets!

## ✅ Verification Checklist

After setting up environment variables, verify everything works:

### Web App
```bash
cd apps/web
yarn dev

# Check browser console - should see:
# [Config] API URL: http://localhost:3000
# [Config] WS URL: ws://localhost:3000
```

### Marketing Site
```bash
cd apps/marketing
yarn dev

# Visit http://localhost:4000
# Click "Login" - should redirect to Clerk
```

### Mobile App
```bash
cd apps/mobile
yarn start

# Check terminal - should connect to API successfully
```

## 🐛 Troubleshooting

### "Missing Publishable Key" Error

**Problem:** Clerk key not set or incorrect prefix

**Solution:**
```bash
# Make sure variable has correct prefix
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...  # Web app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Marketing
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Mobile
```

### API Requests Failing

**Problem:** Wrong API URL or API not running

**Solution:**
1. Check backend is running: `curl http://localhost:3000/health`
2. Verify environment variable: `echo $VITE_API_URL`
3. Check `.env` file exists in app directory
4. Restart dev server after changing `.env`

### WebSocket Connection Fails

**Problem:** Wrong protocol or URL

**Solution:**
```bash
# Development (local)
VITE_WS_URL=ws://localhost:3000

# Production (deployed)
VITE_WS_URL=wss://api.yourdomain.com  # Use wss:// not ws://
```

### Mobile App Can't Connect (Physical Device)

**Problem:** Using `localhost` on physical device

**Solution:**
```bash
# Find your computer's IP
ifconfig | grep inet  # macOS/Linux
ipconfig  # Windows

# Update .env with your IP (e.g., 192.168.1.100)
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
EXPO_PUBLIC_WS_URL=ws://192.168.1.100:3000
```

### Changes Not Reflecting

**Problem:** Environment changes not picked up

**Solution:**
```bash
# 1. Restart dev server
# Press Ctrl+C to stop, then:
yarn dev

# 2. Clear cache (if still not working)
yarn clean
yarn install
yarn dev
```

## 📝 Common Patterns

### Switching Between Mock and Real API

Web app supports MSW (Mock Service Worker):

```bash
# Use mock data (no backend needed)
VITE_USE_MOCK_API=true

# Use real backend
VITE_USE_MOCK_API=false
```

### Multiple Environments

Create separate env files:

```bash
apps/web/
  .env.development      # Local development
  .env.staging         # Staging server
  .env.production      # Production server
```

Load specific file:
```bash
# Vite automatically loads .env.development in dev mode
yarn dev

# For custom environments, use --mode flag
vite build --mode staging
```

### Sharing Variables Across Apps

Some variables are used across multiple apps. Keep them in sync:

```bash
# Clerk publishable key (same across all apps)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_abc123
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_abc123
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_abc123

# Backend URL (adjust format per app)
VITE_API_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000/api  # Note: /api suffix
```

## 🌍 Deployment

For production deployment to Vercel, see:
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete deployment guide

Key differences for production:
- Use `https://` and `wss://` protocols
- Use Clerk live keys (`pk_live_`, `sk_live_`)
- Set environment variables in Vercel Dashboard
- Update Clerk dashboard with production domains

## 📚 Additional Resources

- [Web App .env.example](./apps/web/.env.example)
- [Marketing .env.example](./apps/marketing/.env.example)
- [Mobile App .env.example](./apps/mobile/.env.example)
- [Root .env.example](./.env.example)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Clerk Documentation](https://clerk.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
