# Clerk Authentication Setup

## The Error You're Seeing

```
@clerk/clerk-react: The publishableKey passed to Clerk is invalid.
```

This means your Clerk API keys are not configured yet.

---

## Quick Fix (5 minutes)

### Step 1: Get Your Clerk Keys

1. **Go to** [Clerk Dashboard](https://dashboard.clerk.com)
2. **Sign in** or create a free account
3. **Create a new application** (if you don't have one)
4. **Copy your API keys** from the API Keys section:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

### Step 2: Update Environment Variables

**For Web App:**

Edit `apps/web/.env.development`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
yarn dev:web
```

✅ **Done!**

---

## Full Setup Guide

See the instructions in `apps/web/.env.development` for detailed setup steps.

---

## Alternative: Use Mock API

If you want to develop without Clerk for now:

Edit `apps/web/.env.development`:
```env
VITE_USE_MOCK_API=true
```

This will bypass authentication during development.
