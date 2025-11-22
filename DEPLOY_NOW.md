# 🚀 Deploy to Vercel RIGHT NOW

## 5-Minute Quick Start (Using Dashboard)

### 1. Deploy Marketing Site (2 minutes)

1. **Go to:** [vercel.com/new](https://vercel.com/new)

2. **Import your repository** and configure:
   ```
   Project Name: fleet-marketing
   Framework: Next.js ✅ (auto-detected)
   Root Directory: apps/marketing
   ```

3. **Override build settings:**
   ```
   Build Command: cd ../.. && yarn build:marketing
   Output Directory: .next (default)
   Install Command: yarn install
   ```

4. **Add these environment variables:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://YOUR_VERCEL_URL
   NEXT_PUBLIC_APP_URL=https://YOUR_WEB_APP_URL
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY
   CLERK_SECRET_KEY=sk_live_YOUR_SECRET
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://YOUR_WEB_APP_URL/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://YOUR_WEB_APP_URL/dashboard
   ```

5. **Click "Deploy"**

✅ Marketing site will be live in ~2 minutes!

---

### 2. Deploy Web App (2 minutes)

1. **Go to:** [vercel.com/new](https://vercel.com/new)

2. **Import SAME repository** again and configure:
   ```
   Project Name: fleet-web-app
   Framework: Other
   Root Directory: apps/web
   ```

3. **Override build settings:**
   ```
   Build Command: cd ../.. && yarn build:web
   Output Directory: dist
   Install Command: yarn install
   ```

4. **Add these environment variables:**
   ```bash
   VITE_API_URL=https://YOUR_BACKEND_API
   VITE_WS_URL=wss://YOUR_BACKEND_API
   VITE_USE_MOCK_API=false
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY
   VITE_MAPBOX_TOKEN=pk.eyJ1YOUR_MAPBOX_TOKEN
   VITE_MARKETING_URL=https://YOUR_MARKETING_VERCEL_URL
   ```

5. **Click "Deploy"**

✅ Web app will be live in ~2 minutes!

---

### 3. Update Clerk (1 minute)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to your app → **Paths**
3. Add allowed origins:
   ```
   https://YOUR_MARKETING_URL.vercel.app
   https://YOUR_WEB_APP_URL.vercel.app
   ```

✅ Done! Test your deployed apps!

---

## 📝 What You Need Before Starting

- [ ] Backend API URL (or use placeholder temporarily)
- [ ] Clerk Production Keys ([get here](https://dashboard.clerk.com))
  - `pk_live_...` (publishable key)
  - `sk_live_...` (secret key)
- [ ] Mapbox Token ([get here](https://account.mapbox.com))
- [ ] Your GitHub/GitLab repository URL

---

## 🎯 URLs After Deployment

You'll get these URLs:

```
Marketing: https://fleet-marketing-username.vercel.app
Web App:   https://fleet-web-app-username.vercel.app
```

**Update environment variables** with actual URLs after first deployment!

---

## 🐛 If Build Fails

### Common Issue: "Module not found"

**Fix:** Make sure build command has `cd ../..`:
```bash
cd ../.. && yarn build:marketing
```

### Common Issue: "Environment variable undefined"

**Fix:**
1. Go to Project Settings → Environment Variables
2. Verify all variables are set for "Production"
3. Redeploy

---

## 📚 Detailed Guides

- **Full Guide:** [VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md)
- **Production Env:** [PRODUCTION_ENV_TEMPLATE.md](./PRODUCTION_ENV_TEMPLATE.md)
- **Environment Setup:** [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)

---

## ⚡ Even Faster: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy marketing site
cd apps/marketing
vercel --prod

# Deploy web app
cd ../web
vercel --prod
```

---

## ✅ Verification

After deployment, test:

- [ ] Visit marketing site URL
- [ ] Click "Login" → Should go to Clerk
- [ ] Sign in → Should redirect to web app dashboard
- [ ] Check web app loads correctly
- [ ] Verify API connection works
- [ ] Check browser console for errors

---

**Need help?** See [VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md) for troubleshooting!
