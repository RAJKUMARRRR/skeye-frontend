# Vercel Deployment Guide

This guide covers deploying the Fleet Management Platform to Vercel with proper environment variable configuration.

## 📦 Project Structure

This monorepo contains three deployable applications:

- **Web App** (`apps/web`) - React + Vite fleet management dashboard
- **Marketing Site** (`apps/marketing`) - Next.js marketing website
- **Mobile App** (`apps/mobile`) - React Native (not deployed to Vercel)

## 🚀 Quick Start

### 1. Prerequisites

- Vercel account ([sign up free](https://vercel.com/signup))
- GitHub/GitLab/Bitbucket repository
- Backend API deployed and accessible (required for production)
- Clerk account with API keys ([get keys](https://dashboard.clerk.com))
- Mapbox account with access token ([get token](https://account.mapbox.com))

### 2. Import Project to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect the Next.js app (marketing site)
4. Configure as shown below

## 🎯 Deployment Configuration

### Web App Deployment (`apps/web`)

**Framework Preset:** Vite
**Root Directory:** `apps/web`
**Build Command:** `cd ../.. && yarn build:web`
**Output Directory:** `apps/web/dist`
**Install Command:** `yarn install`

#### Environment Variables

Add these in **Vercel Dashboard → Project → Settings → Environment Variables**:

```bash
# Backend API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Mock API (set to false for production)
VITE_USE_MOCK_API=false

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# Mapbox
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi...

# Marketing Site URL (for redirects)
VITE_MARKETING_URL=https://yourdomain.com

# Optional: Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Optional: Feature Flags
VITE_ENABLE_BETA_FEATURES=false
VITE_ENABLE_OFFLINE_MODE=true

# Optional: Debug
VITE_DEBUG_MODE=false
VITE_API_TIMEOUT=30000
```

**Deployment URL:** `https://app.yourdomain.com` or `https://your-project.vercel.app`

---

### Marketing Site Deployment (`apps/marketing`)

**Framework Preset:** Next.js
**Root Directory:** `apps/marketing`
**Build Command:** `cd ../.. && yarn build:marketing`
**Output Directory:** (auto-detected by Next.js)
**Install Command:** `yarn install`

#### Environment Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# Clerk Domain Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://app.yourdomain.com/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://app.yourdomain.com/dashboard

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Optional: SEO Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_verification_code

# Optional: Contact Form
NEXT_PUBLIC_CONTACT_API_URL=/api/contact
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
CONTACT_EMAIL=support@yourdomain.com

# Optional: Error Tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Deployment URL:** `https://yourdomain.com` or `https://your-marketing.vercel.app`

---

## 🔧 Environment Variable Setup in Vercel

### Method 1: Vercel Dashboard

1. Go to your project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with appropriate scopes:
   - **Production** - Live site
   - **Preview** - PR deployments
   - **Development** - Local development (optional)

### Method 2: Vercel CLI

```bash
# Set production environment variable
vercel env add VITE_API_URL production

# Set for all environments
vercel env add VITE_CLERK_PUBLISHABLE_KEY

# Pull environment variables to local .env file
vercel env pull .env.local
```

### Method 3: `.env` Files (Not Recommended for Secrets)

- Create `.env.production` in app directories
- **NEVER** commit secrets to Git
- Use Vercel Dashboard for sensitive keys

---

## 🏗️ Custom Build Configuration

### Option 1: Individual Vercel Projects

Deploy each app as a separate Vercel project:

**Web App (`apps/web`):**
```json
{
  "buildCommand": "cd ../.. && yarn build:web",
  "outputDirectory": "apps/web/dist",
  "framework": "vite",
  "installCommand": "yarn install"
}
```

**Marketing Site (`apps/marketing`):**
```json
{
  "buildCommand": "cd ../.. && yarn build:marketing",
  "framework": "nextjs",
  "installCommand": "yarn install"
}
```

### Option 2: Monorepo Configuration with `vercel.json`

Create `vercel.json` in project root for advanced routing:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/marketing/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/app/(.*)",
      "dest": "apps/web/$1"
    },
    {
      "src": "/(.*)",
      "dest": "apps/marketing/$1"
    }
  ]
}
```

---

## 🌍 Custom Domain Setup

### Marketing Site (yourdomain.com)

1. Go to Vercel project → **Settings** → **Domains**
2. Add `yourdomain.com` and `www.yourdomain.com`
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Web App (app.yourdomain.com)

1. Go to web app Vercel project → **Settings** → **Domains**
2. Add `app.yourdomain.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

**Update Environment Variables:**
```bash
# Marketing site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://app.yourdomain.com/dashboard

# Web app
VITE_MARKETING_URL=https://yourdomain.com
```

---

## 🔐 Security Best Practices

### Environment Variable Hierarchy

1. **Public Variables** (exposed to client):
   - `VITE_*` (Vite apps)
   - `NEXT_PUBLIC_*` (Next.js apps)
   - Safe to expose: API URLs, Clerk publishable keys, Mapbox tokens

2. **Secret Variables** (server-side only):
   - `CLERK_SECRET_KEY`
   - `SENDGRID_API_KEY`
   - Database credentials
   - **NEVER** prefix with `VITE_` or `NEXT_PUBLIC_`

### Clerk Configuration

1. **Development Keys** (for testing):
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. **Production Keys** (for live site):
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

3. **Update Clerk Dashboard:**
   - Add production domains to **Allowed Origins**
   - Configure redirect URLs
   - Enable production instances

---

## 🧪 Testing Deployments

### Preview Deployments (Automatic)

Every Git push to a branch creates a preview deployment:

```bash
# Push feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Vercel creates: `https://your-project-git-feature-new-feature.vercel.app`

### Production Deployments

Merge to main branch triggers production deployment:

```bash
git checkout main
git merge feature/new-feature
git push origin main
```

### Manual Deployment

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

---

## 🐛 Troubleshooting

### Build Fails with "Module not found"

**Solution:** Ensure monorepo build commands navigate to root:

```json
{
  "buildCommand": "cd ../.. && yarn build:web"
}
```

### Environment Variables Not Working

**Checklist:**
- ✅ Variables have correct prefix (`VITE_` or `NEXT_PUBLIC_`)
- ✅ Variables are set for the correct environment (Production/Preview)
- ✅ Project was re-deployed after adding variables
- ✅ No typos in variable names

### WebSocket Connection Fails

**Solution:** Use `wss://` (not `ws://`) for production:

```bash
VITE_WS_URL=wss://api.yourdomain.com
```

### CORS Errors

**Solution:** Configure backend to allow Vercel domains:

```javascript
// Backend CORS config
const allowedOrigins = [
  'https://yourdomain.com',
  'https://app.yourdomain.com',
  'https://your-project.vercel.app',
  'http://localhost:4000',
  'http://localhost:4001',
]
```

### Build Size Too Large

**Solutions:**
1. Enable code splitting (already configured)
2. Optimize images with Next.js Image component
3. Remove unused dependencies
4. Check bundle size: `yarn build:web && npx vite-bundle-visualizer`

---

## 📊 Performance Optimization

### Edge Functions (Marketing Site)

Next.js API routes automatically deploy as Edge Functions:

```typescript
// apps/marketing/src/app/api/contact/route.ts
export const runtime = 'edge' // Deploy to Vercel Edge Network
```

### Static Site Generation (SSG)

Pre-render marketing pages at build time:

```typescript
// Force static generation
export const dynamic = 'force-static'
```

### Image Optimization

Use Next.js Image component for automatic optimization:

```typescript
import Image from 'next/image'

<Image
  src="/hero.png"
  width={1200}
  height={630}
  alt="Hero"
  priority
/>
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn test
      - run: yarn lint
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📱 Mobile App (Not Deployed to Vercel)

The mobile app (`apps/mobile`) uses Expo and is deployed differently:

### Expo EAS Build

```bash
cd apps/mobile

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

**Environment Variables:**

Update `apps/mobile/.env` with production values:

```bash
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
EXPO_PUBLIC_WS_URL=wss://api.yourdomain.com
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

---

## 🎯 Deployment Checklist

### Before First Deployment

- [ ] Backend API is deployed and accessible
- [ ] Clerk account created with production keys
- [ ] Mapbox token obtained
- [ ] Custom domains purchased (optional)
- [ ] Analytics accounts set up (optional)

### Web App

- [ ] `VITE_API_URL` points to production API
- [ ] `VITE_WS_URL` uses `wss://` protocol
- [ ] `VITE_USE_MOCK_API=false`
- [ ] Clerk keys are production keys (`pk_live_`)
- [ ] Mapbox token is valid
- [ ] Build command includes monorepo navigation
- [ ] Custom domain configured (if using)

### Marketing Site

- [ ] `NEXT_PUBLIC_SITE_URL` is production domain
- [ ] `NEXT_PUBLIC_APP_URL` points to web app
- [ ] Clerk redirect URLs point to production
- [ ] `CLERK_SECRET_KEY` is secure (not committed to Git)
- [ ] Custom domain configured (if using)
- [ ] SEO verification codes added (if using)

### Post-Deployment

- [ ] Test authentication flow end-to-end
- [ ] Verify API connections work
- [ ] Test WebSocket real-time updates
- [ ] Check mobile responsiveness
- [ ] Test all critical user flows
- [ ] Monitor error tracking (Sentry)
- [ ] Verify analytics data collection

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Clerk Docs:** https://clerk.com/docs
- **Turborepo Docs:** https://turbo.build/repo/docs

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Monorepo Deployments](https://vercel.com/docs/concepts/monorepos)
