# Vercel Quick Deployment Guide

## 🚀 Deploy Your Apps in 10 Minutes

This guide will help you deploy both the Web App (Vite) and Marketing Site (Next.js) to Vercel.

---

## 📋 Prerequisites

Before you start:

- [ ] Vercel account ([sign up free](https://vercel.com/signup))
- [ ] GitHub repository with this code pushed
- [ ] Backend API deployed (or use placeholder URL temporarily)
- [ ] Clerk account with API keys ([get keys](https://dashboard.clerk.com))
- [ ] Mapbox token ([get token](https://account.mapbox.com)) - for web app

---

## 🎯 Deployment Strategy

You'll create **TWO separate Vercel projects**:

1. **Marketing Site** - `apps/marketing` (Next.js)
   - Domain: `yourdomain.com` or `marketing-yourproject.vercel.app`

2. **Web App** - `apps/web` (Vite React)
   - Domain: `app.yourdomain.com` or `app-yourproject.vercel.app`

---

## 📱 Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Deploy Marketing Site (Next.js)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Find and select your repository
   - Click "Import"

3. **Configure Project**
   ```
   Project Name: fleet-marketing
   Framework Preset: Next.js
   Root Directory: apps/marketing
   Build Command: cd ../.. && yarn build:marketing
   Output Directory: (leave default - Next.js auto-detects)
   Install Command: yarn install
   ```

4. **Add Environment Variables**

   Click "Environment Variables" and add these:

   **Required:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourproject.vercel.app
   NEXT_PUBLIC_APP_URL=https://app-yourproject.vercel.app
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
   CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://app-yourproject.vercel.app/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://app-yourproject.vercel.app/dashboard
   ```

   **Optional:**
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_code
   ```

   > **Important:** Use **Production** keys from Clerk, not test keys!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Marketing site deployed!

---

### Step 2: Deploy Web App (Vite React)

1. **Create New Project**
   - Go back to [vercel.com/new](https://vercel.com/new)
   - Select the **same repository** again

2. **Configure Project**
   ```
   Project Name: fleet-web-app
   Framework Preset: Vite (or Other)
   Root Directory: apps/web
   Build Command: cd ../.. && yarn build:web
   Output Directory: dist
   Install Command: yarn install
   ```

3. **Add Environment Variables**

   **Required:**
   ```bash
   VITE_API_URL=https://your-backend-api.com
   VITE_WS_URL=wss://your-backend-api.com
   VITE_USE_MOCK_API=false
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
   VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi...
   VITE_MARKETING_URL=https://yourproject.vercel.app
   ```

   **Optional:**
   ```bash
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   VITE_API_TIMEOUT=30000
   ```

   > **Security Note:** Use `https://` and `wss://` for production!

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Web app deployed!

---

## 💻 Option 2: Deploy via Vercel CLI (Faster for Updates)

### Install Vercel CLI

```bash
npm i -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy Marketing Site

```bash
cd apps/marketing
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? (select your account)
# Link to existing project? No
# Project name? fleet-marketing
# In which directory is your code located? ./
# Override settings? Yes
#   Build Command: cd ../.. && yarn build:marketing
#   Output Directory: .next
#   Development Command: yarn dev
```

After first deployment, set environment variables:

```bash
# Required variables
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL production
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL production

# Deploy to production
vercel --prod
```

### Deploy Web App

```bash
cd apps/web
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? (select your account)
# Link to existing project? No
# Project name? fleet-web-app
# In which directory is your code located? ./
# Override settings? Yes
#   Build Command: cd ../.. && yarn build:web
#   Output Directory: dist
#   Development Command: yarn dev
```

Set environment variables:

```bash
# Required variables
vercel env add VITE_API_URL production
vercel env add VITE_WS_URL production
vercel env add VITE_USE_MOCK_API production
vercel env add VITE_CLERK_PUBLISHABLE_KEY production
vercel env add VITE_MAPBOX_TOKEN production
vercel env add VITE_MARKETING_URL production

# Deploy to production
vercel --prod
```

---

## 🌍 Step 3: Configure Custom Domains (Optional)

### Marketing Site (yourdomain.com)

1. Go to your marketing project in Vercel
2. Settings → Domains
3. Add domain: `yourdomain.com`
4. Add domain: `www.yourdomain.com`
5. Update DNS with your registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

6. **Update environment variables:**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://app.yourdomain.com/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://app.yourdomain.com/dashboard
   ```

### Web App (app.yourdomain.com)

1. Go to your web app project in Vercel
2. Settings → Domains
3. Add domain: `app.yourdomain.com`
4. Update DNS:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

5. **Update environment variables:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
   VITE_MARKETING_URL=https://yourdomain.com
   ```

---

## 🔧 Step 4: Update Clerk Settings

After deploying, update Clerk configuration:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Paths** settings
4. Add your production domains:
   ```
   Allowed Origins:
   - https://yourdomain.com
   - https://www.yourdomain.com
   - https://app.yourdomain.com
   ```

5. Configure redirect URLs:
   ```
   Sign-in URL: https://yourdomain.com/sign-in
   Sign-up URL: https://yourdomain.com/sign-up
   After sign in URL: https://app.yourdomain.com/dashboard
   After sign up URL: https://app.yourdomain.com/dashboard
   ```

---

## ✅ Verification Checklist

After deployment, test these:

### Marketing Site
- [ ] Visit your marketing site URL
- [ ] Check homepage loads
- [ ] Test navigation menu
- [ ] Click "Login" button - should redirect to Clerk
- [ ] Complete sign-in - should redirect to web app dashboard
- [ ] Check responsive design on mobile

### Web App
- [ ] Visit your web app URL
- [ ] Login with Clerk
- [ ] Verify API connection works
- [ ] Check WebSocket connection (real-time updates)
- [ ] Test map functionality (Mapbox)
- [ ] Navigate between pages
- [ ] Check browser console for errors

---

## 🐛 Common Issues & Solutions

### Build Fails: "Module not found"

**Problem:** Monorepo dependencies not found

**Solution:** Ensure build command includes `cd ../..`:
```bash
cd ../.. && yarn build:web
```

### Environment Variables Not Working

**Checklist:**
- [ ] Variable has correct prefix (`VITE_` or `NEXT_PUBLIC_`)
- [ ] Variable is set for "Production" environment
- [ ] Project was redeployed after adding variables
- [ ] No typos in variable names

**Fix:** Redeploy after adding variables:
```bash
vercel --prod
```

### CORS Errors from Backend

**Problem:** Backend doesn't allow your Vercel domain

**Solution:** Add Vercel domains to backend CORS config:
```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://app.yourdomain.com',
  'https://yourproject.vercel.app',
  'https://app-yourproject.vercel.app',
]
```

### WebSocket Connection Fails

**Problem:** Using `ws://` instead of `wss://`

**Solution:** Update environment variable:
```bash
VITE_WS_URL=wss://your-backend-api.com  # Use wss:// not ws://
```

### Clerk Authentication Not Working

**Checklist:**
- [ ] Using production Clerk keys (`pk_live_`, `sk_live_`)
- [ ] Added production domains to Clerk dashboard
- [ ] All redirect URLs use `https://`
- [ ] `CLERK_SECRET_KEY` is set (marketing site only)

### Build Succeeds but Site Shows Blank Page

**Common Causes:**
1. **Check browser console** for errors
2. **Verify base path** - Vite might need `base: '/'` in config
3. **Check API URL** - ensure backend is accessible
4. **Environment variables** - verify all required vars are set

---

## 📊 Monitoring Your Deployments

### View Build Logs

1. Go to your project in Vercel
2. Click on a deployment
3. View "Building" tab for logs
4. Check "Functions" tab for runtime logs

### Set Up Alerts

1. Project Settings → Notifications
2. Add email or Slack webhook
3. Get notified on:
   - Failed deployments
   - Build errors
   - Performance issues

---

## 🔄 Continuous Deployment

Vercel automatically deploys:

- **Production:** Every push to `main` branch
- **Preview:** Every pull request

### Preview Deployments

Each PR gets a unique preview URL:
```
https://fleet-marketing-git-feature-branch-username.vercel.app
```

Perfect for testing before merging!

---

## 📱 Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Pull environment variables to local
vercel env pull .env.local

# Link local project to Vercel
vercel link

# Remove deployment
vercel remove [deployment-url]
```

---

## 🎯 Production Deployment Checklist

Before going live:

### Web App
- [ ] `VITE_API_URL` points to production backend
- [ ] `VITE_WS_URL` uses `wss://` protocol
- [ ] `VITE_USE_MOCK_API=false`
- [ ] Clerk production keys set
- [ ] Mapbox token valid
- [ ] Analytics configured (if using)
- [ ] Error tracking set up (Sentry)

### Marketing Site
- [ ] `NEXT_PUBLIC_SITE_URL` is production domain
- [ ] `NEXT_PUBLIC_APP_URL` points to web app
- [ ] Clerk production keys set
- [ ] All redirect URLs use production domains
- [ ] SEO meta tags configured
- [ ] Analytics configured (if using)

### Both Apps
- [ ] Custom domains configured (if using)
- [ ] SSL certificates active (automatic with Vercel)
- [ ] Backend CORS allows Vercel domains
- [ ] Clerk dashboard updated with domains
- [ ] Test all critical user flows
- [ ] Monitor logs for errors
- [ ] Set up alerts for downtime

---

## 💡 Pro Tips

1. **Use Environment Variable Templates**
   - Create `.env.production` files locally for reference
   - Never commit production secrets to Git

2. **Test Preview Deployments First**
   - Push to a feature branch
   - Test preview URL before merging to main

3. **Monitor Performance**
   - Use Vercel Analytics (free tier available)
   - Check Core Web Vitals

4. **Set Up Redirects**
   - Use `vercel.json` for URL redirects
   - Configure in Vercel dashboard

5. **Use Vercel Edge Functions**
   - Next.js API routes auto-deploy to Edge
   - Faster response times globally

---

## 📞 Need Help?

- **Vercel Status:** [vercel-status.com](https://www.vercel-status.com/)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🎉 You're Done!

Your apps should now be live on Vercel! 🚀

**Next Steps:**
- Share your production URLs
- Set up monitoring and alerts
- Configure custom domains
- Enable Vercel Analytics
- Set up GitHub integration for auto-deploy

---

**Deployment URLs Example:**
- Marketing: `https://fleet-marketing.vercel.app` → `https://yourdomain.com`
- Web App: `https://fleet-web-app.vercel.app` → `https://app.yourdomain.com`
