# Production Environment Variables Template

Copy these into Vercel Dashboard when deploying to production.

---

## 🌐 Marketing Site (Next.js)

**Project:** `apps/marketing`

### Required Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com

# Clerk Authentication (PRODUCTION KEYS!)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx

# Clerk Domain Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://app.yourdomain.com/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://app.yourdomain.com/dashboard
```

### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# SEO Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_verification_code

# Contact Form
NEXT_PUBLIC_CONTACT_API_URL=/api/contact
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
CONTACT_EMAIL=support@yourdomain.com

# Error Tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Features
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_DEMO_REQUEST=true
```

---

## 🚀 Web App (Vite)

**Project:** `apps/web`

### Required Variables

```bash
# Backend API Configuration (USE PRODUCTION URLs!)
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Mock API (MUST BE FALSE IN PRODUCTION!)
VITE_USE_MOCK_API=false

# Clerk Authentication (PRODUCTION KEY!)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# Mapbox
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi...

# Application URLs
VITE_MARKETING_URL=https://yourdomain.com
```

### Optional Variables

```bash
# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Feature Flags
VITE_ENABLE_BETA_FEATURES=false
VITE_ENABLE_OFFLINE_MODE=true

# Development Settings
VITE_DEBUG_MODE=false
VITE_API_TIMEOUT=30000
```

---

## 🔐 Security Checklist

Before deploying:

### Marketing Site
- [ ] Using `pk_live_` and `sk_live_` (NOT test keys)
- [ ] `CLERK_SECRET_KEY` is set (server-side only)
- [ ] All URLs use `https://`
- [ ] Redirect URLs point to production domains

### Web App
- [ ] `VITE_API_URL` uses `https://`
- [ ] `VITE_WS_URL` uses `wss://` (NOT `ws://`)
- [ ] `VITE_USE_MOCK_API=false`
- [ ] Using production Clerk key (`pk_live_`)
- [ ] Mapbox token is valid

---

## 📝 How to Add Variables in Vercel

### Method 1: Vercel Dashboard

1. Go to your project
2. Settings → Environment Variables
3. Add each variable:
   - **Key:** Variable name (e.g., `VITE_API_URL`)
   - **Value:** Your production value
   - **Environment:** Select "Production"
4. Click "Save"
5. Redeploy project

### Method 2: Vercel CLI

```bash
# Navigate to project directory
cd apps/web  # or apps/marketing

# Add each variable
vercel env add VITE_API_URL production
# Paste value when prompted

# Repeat for all variables

# Deploy to production
vercel --prod
```

---

## 🔄 Environment-Specific Values

### Development vs Production

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_API_URL` | `http://localhost:3000` | `https://api.yourdomain.com` |
| `VITE_WS_URL` | `ws://localhost:3000` | `wss://api.yourdomain.com` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:4000` | `https://yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:4001` | `https://app.yourdomain.com` |
| Clerk Keys | `pk_test_...`, `sk_test_...` | `pk_live_...`, `sk_live_...` |

---

## ⚠️ Common Mistakes to Avoid

1. **Using test Clerk keys in production**
   - ❌ `pk_test_xxxxx`
   - ✅ `pk_live_xxxxx`

2. **Using `ws://` instead of `wss://` for WebSocket**
   - ❌ `VITE_WS_URL=ws://api.yourdomain.com`
   - ✅ `VITE_WS_URL=wss://api.yourdomain.com`

3. **Forgetting to set `VITE_USE_MOCK_API=false`**
   - Mock API only works locally!

4. **Mixing development and production URLs**
   - All URLs must be production in production environment

5. **Not updating Clerk dashboard with production domains**
   - Add all production URLs to Clerk's allowed origins

---

## 📋 Quick Copy-Paste Templates

### Marketing Site - Minimal Production Config

```bash
NEXT_PUBLIC_SITE_URL=https://YOUR_MARKETING_DOMAIN
NEXT_PUBLIC_APP_URL=https://YOUR_WEB_APP_DOMAIN
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY
CLERK_SECRET_KEY=sk_live_YOUR_SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://YOUR_WEB_APP_DOMAIN/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://YOUR_WEB_APP_DOMAIN/dashboard
```

### Web App - Minimal Production Config

```bash
VITE_API_URL=https://YOUR_BACKEND_API
VITE_WS_URL=wss://YOUR_BACKEND_API
VITE_USE_MOCK_API=false
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY
VITE_MAPBOX_TOKEN=pk.eyJ1YOUR_TOKEN
VITE_MARKETING_URL=https://YOUR_MARKETING_DOMAIN
```

---

## 🎯 Deployment Order

1. **Deploy Backend API first**
   - Get production API URL
   - Test with Postman/curl

2. **Get Clerk Production Keys**
   - Create production instance
   - Copy `pk_live_` and `sk_live_`

3. **Deploy Marketing Site**
   - Use temporary Vercel URL first
   - Test authentication flow

4. **Deploy Web App**
   - Use marketing site URL for `VITE_MARKETING_URL`
   - Test end-to-end flow

5. **Add Custom Domains**
   - Configure DNS
   - Update environment variables
   - Update Clerk allowed origins

---

## ✅ Post-Deployment Verification

After deploying, verify:

- [ ] Marketing site loads
- [ ] Web app loads
- [ ] Sign-in redirects work
- [ ] Sign-up redirects work
- [ ] After auth, redirects to dashboard
- [ ] API calls work (check Network tab)
- [ ] WebSocket connects (check Console)
- [ ] Map loads (Mapbox)
- [ ] No console errors
- [ ] SSL certificates active (https://)
