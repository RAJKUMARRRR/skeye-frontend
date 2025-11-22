# Environment Variables - Configuration Summary

## ✅ What Was Done

All environment variables, API endpoints, and WebSocket URLs across the Fleet Management Platform monorepo have been configured to be easily manageable for Vercel deployments.

## 📁 Files Created/Updated

### New Documentation
1. **`VERCEL_DEPLOYMENT.md`** - Complete Vercel deployment guide
2. **`ENV_SETUP_GUIDE.md`** - Quick reference for environment setup
3. **`.env.example`** - Root-level environment variable reference

### Environment Example Files
4. **`apps/web/.env.example`** - Web app environment template (updated)
5. **`apps/marketing/.env.example`** - Marketing site environment template (updated)
6. **`apps/mobile/.env.example`** - Mobile app environment template (created)

### Code Updates
7. **`apps/marketing/src/components/marketing/Header.tsx`** - Uses `NEXT_PUBLIC_APP_URL` env var
8. **`apps/marketing/.env`** - Added `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_APP_URL`
9. **`packages/api/src/client/config.ts`** - Enhanced to support multiple environments

## 🎯 Key Features

### 1. Consistent Environment Variable Usage

All apps now properly use environment variables:

**Web App (Vite):**
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_MAPBOX_TOKEN=pk.eyJ1...
```

**Marketing Site (Next.js):**
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

**Mobile App (Expo):**
```bash
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
EXPO_PUBLIC_WS_URL=wss://api.yourdomain.com
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

### 2. No Hardcoded URLs

All hardcoded URLs have been replaced with environment variables or have fallback values for development:

- ✅ API endpoints use environment variables
- ✅ WebSocket URLs use environment variables
- ✅ Cross-app navigation URLs use environment variables
- ✅ Only fallback values remain (for development)

### 3. Vercel-Ready Configuration

Complete deployment instructions including:
- Environment variable setup per app
- Custom domain configuration
- Security best practices
- Build configurations
- Troubleshooting guide

### 4. Developer-Friendly Documentation

Three levels of documentation:
1. **Quick Start:** ENV_SETUP_GUIDE.md - Get up and running fast
2. **Deployment:** VERCEL_DEPLOYMENT.md - Production deployment
3. **Reference:** .env.example files - All available options

## 🔐 Security Best Practices Implemented

### Public vs Secret Variables

**✅ Safe to Expose (Client-Side):**
- `VITE_API_URL` - API endpoint
- `NEXT_PUBLIC_SITE_URL` - Site URL
- `EXPO_PUBLIC_API_URL` - Mobile API
- `*_CLERK_PUBLISHABLE_KEY` - Clerk public keys
- `VITE_MAPBOX_TOKEN` - Mapbox access token

**❌ Must Keep Secret (Server-Side):**
- `CLERK_SECRET_KEY` - Never prefix with NEXT_PUBLIC_
- Database credentials
- API secrets
- SendGrid keys

### Variable Prefixes

Each framework requires specific prefixes for client-side exposure:

| Framework | Prefix | Exposed to Client |
|-----------|--------|-------------------|
| Vite | `VITE_` | Yes |
| Next.js | `NEXT_PUBLIC_` | Yes |
| Next.js | (no prefix) | No (server-only) |
| Expo | `EXPO_PUBLIC_` | Yes |

## 📋 Environment Variable Inventory

### Web App (11 variables)

**Required:**
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk auth
- `VITE_MAPBOX_TOKEN` - Map functionality

**Optional:**
- `VITE_USE_MOCK_API` - Enable MSW mocking
- `VITE_MARKETING_URL` - Marketing site URL
- `VITE_GA_MEASUREMENT_ID` - Google Analytics
- `VITE_SENTRY_DSN` - Error tracking
- `VITE_ENABLE_BETA_FEATURES` - Feature flags
- `VITE_DEBUG_MODE` - Debug logging
- `VITE_API_TIMEOUT` - Request timeout

### Marketing Site (16+ variables)

**Required:**
- `NEXT_PUBLIC_SITE_URL` - Marketing site URL
- `NEXT_PUBLIC_APP_URL` - Web app URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

**Clerk Configuration:**
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Sign-in path
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Sign-up path
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Post-auth redirect
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Post-signup redirect

**Optional:**
- `NEXT_PUBLIC_GA_ID` - Google Analytics
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Plausible Analytics
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` - SEO verification
- `SENDGRID_API_KEY` - Email service
- `SENTRY_DSN` - Error tracking

### Mobile App (8+ variables)

**Required:**
- `EXPO_PUBLIC_API_URL` - Backend API
- `EXPO_PUBLIC_WS_URL` - WebSocket URL
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth

**Optional:**
- `EXPO_PUBLIC_LOCATION_UPDATE_INTERVAL` - GPS interval
- `EXPO_PUBLIC_LOCATION_ACCURACY` - GPS accuracy
- `EXPO_PUBLIC_SEGMENT_WRITE_KEY` - Analytics
- `EXPO_PUBLIC_SENTRY_DSN` - Error tracking
- Firebase config (5 variables if using Firebase)

## 🚀 Deployment Workflows

### Web App to Vercel

1. **Create Vercel Project**
   - Framework: Vite
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && yarn build:web`

2. **Set Environment Variables** in Vercel Dashboard
   - All `VITE_*` variables
   - Use production values (https://, wss://)

3. **Configure Custom Domain**
   - Add `app.yourdomain.com`
   - Update `VITE_MARKETING_URL`

### Marketing Site to Vercel

1. **Create Vercel Project**
   - Framework: Next.js
   - Root Directory: `apps/marketing`
   - Build Command: `cd ../.. && yarn build:marketing`

2. **Set Environment Variables**
   - All `NEXT_PUBLIC_*` variables
   - `CLERK_SECRET_KEY` (secret!)
   - Update URLs to production

3. **Configure Custom Domain**
   - Add `yourdomain.com` and `www.yourdomain.com`

### Mobile App (Not on Vercel)

Deploy via Expo EAS Build:
```bash
cd apps/mobile
eas build --platform ios
eas build --platform android
```

## 📖 Documentation Quick Links

| Document | Purpose | Use When |
|----------|---------|----------|
| [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) | Complete deployment guide | Deploying to production |
| [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) | Quick setup reference | Setting up development |
| [.env.example](./.env.example) | All variables at a glance | Quick reference |
| [apps/web/.env.example](./apps/web/.env.example) | Web app variables | Configuring web app |
| [apps/marketing/.env.example](./apps/marketing/.env.example) | Marketing variables | Configuring marketing |
| [apps/mobile/.env.example](./apps/mobile/.env.example) | Mobile app variables | Configuring mobile |

## ✅ Verification Checklist

Before deploying to production:

### Web App
- [ ] `VITE_API_URL` uses `https://`
- [ ] `VITE_WS_URL` uses `wss://`
- [ ] `VITE_USE_MOCK_API=false`
- [ ] Clerk key is production key (`pk_live_`)
- [ ] Mapbox token is valid
- [ ] All URLs point to production domains

### Marketing Site
- [ ] `NEXT_PUBLIC_SITE_URL` is production domain
- [ ] `NEXT_PUBLIC_APP_URL` points to web app
- [ ] Clerk redirect URLs use production domains
- [ ] `CLERK_SECRET_KEY` is set in Vercel (not Git)
- [ ] Analytics IDs configured (if using)

### Mobile App
- [ ] `EXPO_PUBLIC_API_URL` uses `https://`
- [ ] `EXPO_PUBLIC_WS_URL` uses `wss://`
- [ ] Clerk key is production key
- [ ] Push notification credentials configured

## 🎉 Benefits

### For Development
- Easy local setup with `.env` files
- Mock API support for offline development
- Consistent configuration across apps
- Clear documentation for new developers

### For Deployment
- One-click Vercel deployment
- Environment-specific configurations
- No code changes between environments
- Secure secret management

### For Maintenance
- All configuration in one place
- Easy to update API endpoints
- Feature flags for gradual rollouts
- Environment parity (dev/staging/prod)

## 🔄 Next Steps

1. **Local Development:** Follow ENV_SETUP_GUIDE.md
2. **Deploy to Vercel:** Follow VERCEL_DEPLOYMENT.md
3. **Configure Custom Domains:** See domain sections in deployment guide
4. **Set Up Monitoring:** Configure Sentry, Analytics (optional)
5. **Enable CI/CD:** Set up GitHub Actions (template in deployment guide)

## 📞 Support

- **Issues:** Check VERCEL_DEPLOYMENT.md troubleshooting section
- **Vercel Docs:** https://vercel.com/docs
- **Clerk Docs:** https://clerk.com/docs
- **Environment Variables:** See app-specific .env.example files
