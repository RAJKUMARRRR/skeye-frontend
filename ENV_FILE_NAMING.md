# Environment File Naming Conventions

## 📁 Correct File Names by Framework

Each framework has different conventions for environment file names. Here's what to use:

### Web App (Vite)

**Location:** `apps/web/`

| File | Purpose | Loaded When | Committed to Git |
|------|---------|-------------|------------------|
| `.env` | Base environment variables | Always | ❌ No |
| `.env.local` | Local overrides (all modes) | Always | ❌ No |
| `.env.development` | Development mode | `yarn dev` | ✅ Yes (template) |
| `.env.development.local` | Development overrides | `yarn dev` | ❌ No |
| `.env.production` | Production mode | `yarn build` | ✅ Yes (template) |
| `.env.production.local` | Production overrides | `yarn build` | ❌ No |
| `.env.example` | Template/documentation | Never (manual copy) | ✅ Yes |

**Priority Order (highest to lowest):**
1. `.env.[mode].local` (e.g., `.env.development.local`)
2. `.env.local`
3. `.env.[mode]` (e.g., `.env.development`)
4. `.env`

**Current Setup:**
```bash
apps/web/
  .env.development      # ✅ Development variables (committed)
  .env.example          # ✅ Template (committed)
```

**Recommended Local Setup:**
```bash
# Option 1: Use .env.development as-is (quickest)
# Just run: yarn dev

# Option 2: Create local override
cp .env.development .env.development.local
# Edit .env.development.local with your values
```

---

### Marketing Site (Next.js)

**Location:** `apps/marketing/`

| File | Purpose | Loaded When | Committed to Git |
|------|---------|-------------|------------------|
| `.env` | Default environment variables | Always | ❌ No |
| `.env.local` | Local secrets & overrides | Always (all modes) | ❌ No |
| `.env.development` | Development defaults | `yarn dev` | ✅ Yes (template) |
| `.env.development.local` | Development secrets | `yarn dev` | ❌ No |
| `.env.production` | Production defaults | `yarn build` | ✅ Yes (template) |
| `.env.production.local` | Production secrets | `yarn build` | ❌ No |
| `.env.test` | Test environment | `yarn test` | ✅ Yes (template) |
| `.env.test.local` | Test secrets | `yarn test` | ❌ No |
| `.env.example` | Template/documentation | Never (manual copy) | ✅ Yes |

**Priority Order (highest to lowest):**
1. `.env.[mode].local` (e.g., `.env.production.local`)
2. `.env.local` (**NOT loaded in test mode**)
3. `.env.[mode]` (e.g., `.env.production`)
4. `.env`

**Current Setup:**
```bash
apps/marketing/
  .env.local            # ✅ Local development (not committed)
  .env.example          # ✅ Template (committed)
```

**Recommended:**
- Use `.env.local` for local development (already set up ✅)
- Use `.env.production` for production templates (create if needed)
- Never commit `.env.local` (contains secrets)

---

### Mobile App (Expo)

**Location:** `apps/mobile/`

| File | Purpose | Loaded When | Committed to Git |
|------|---------|-------------|------------------|
| `.env` | Default environment variables | Always | ❌ No |
| `.env.local` | Local overrides | Always | ❌ No |
| `.env.development` | Development mode | EAS dev builds | ✅ Yes (template) |
| `.env.staging` | Staging mode | EAS staging builds | ✅ Yes (template) |
| `.env.production` | Production mode | EAS production builds | ✅ Yes (template) |
| `.env.example` | Template/documentation | Never (manual copy) | ✅ Yes |

**Priority Order:**
1. `.env.local`
2. `.env.[environment]` (specified via `--env` flag)
3. `.env`

**Current Setup:**
```bash
apps/mobile/
  .env                  # ✅ Default variables (not committed)
  .env.example          # ✅ Template (committed)
```

**Recommended:**
- Use `.env` for local development (already set up ✅)
- Create `.env.production` for production template
- Use EAS environment variables for secrets in builds

---

## 🎯 Summary Table

| App | Framework | Local Dev File | Example File | Notes |
|-----|-----------|----------------|--------------|-------|
| **Web** | Vite | `.env.development` | `.env.example` | Mode-specific files |
| **Marketing** | Next.js | `.env.local` | `.env.example` | `.local` for secrets |
| **Mobile** | Expo | `.env` | `.env.example` | Simple `.env` file |

## 🔒 What to Commit vs Ignore

### ✅ COMMIT to Git (Templates)
```bash
.env.example              # All apps
.env.development          # Vite (web app)
.env.production           # Vite (web app) - if created
```

### ❌ NEVER COMMIT (Secrets & Local)
```bash
.env                      # Contains actual secrets
.env.local                # Local overrides with secrets
.env.development.local    # Development secrets
.env.production.local     # Production secrets
.env.test.local           # Test secrets
```

## 📝 Current File Structure

```bash
frontend-v2/
├── .gitignore                    # ✅ Updated to ignore all .env* except examples
├── .env.example                  # ✅ Root-level reference
│
├── apps/web/
│   ├── .env.development          # ✅ Development config (committed)
│   └── .env.example              # ✅ Template (committed)
│
├── apps/marketing/
│   ├── .env.local                # ✅ Local secrets (NOT committed)
│   └── .env.example              # ✅ Template (committed)
│
└── apps/mobile/
    ├── .env                      # ✅ Local config (NOT committed)
    └── .env.example              # ✅ Template (committed)
```

## 🚀 Quick Setup Commands

### Web App (Vite)
```bash
cd apps/web
# Already has .env.development - just run:
yarn dev

# Or create local override:
cp .env.development .env.development.local
# Edit .env.development.local
```

### Marketing Site (Next.js)
```bash
cd apps/marketing
# Already has .env.local - just run:
yarn dev

# Or copy from example:
cp .env.example .env.local
# Edit .env.local with your keys
```

### Mobile App (Expo)
```bash
cd apps/mobile
# Already has .env - just run:
yarn start

# Or copy from example:
cp .env.example .env
# Edit .env with your keys
```

## 🔄 Switching Environments

### Vite (Web)
```bash
# Development (loads .env.development)
yarn dev

# Production build (loads .env.production)
yarn build

# Custom mode
vite build --mode staging  # Loads .env.staging
```

### Next.js (Marketing)
```bash
# Development (loads .env.development + .env.local)
yarn dev

# Production build (loads .env.production + .env.local)
yarn build

# Test (loads .env.test + .env.test.local, NOT .env.local)
yarn test
```

### Expo (Mobile)
```bash
# Development (loads .env)
yarn start

# With specific env file
eas build --platform ios --profile production
# Uses .env.production if configured in eas.json
```

## 🐛 Troubleshooting

### "Environment variable not loading"

**Check file name:**
- ✅ Vite: `.env.development` (not `.env.dev`)
- ✅ Next.js: `.env.local` or `.env.development`
- ✅ Expo: `.env` (not `.env.development` for local)

**Check variable prefix:**
- ✅ Vite: `VITE_API_URL` (must start with `VITE_`)
- ✅ Next.js: `NEXT_PUBLIC_SITE_URL` (client-side needs `NEXT_PUBLIC_`)
- ✅ Expo: `EXPO_PUBLIC_API_URL` (must start with `EXPO_PUBLIC_`)

**Restart dev server:**
```bash
# Stop server (Ctrl+C)
# Restart
yarn dev
```

### "Variables work locally but not in Vercel"

**Solution:** Set in Vercel Dashboard, not in files
- Go to Project Settings → Environment Variables
- Add each variable for Production/Preview/Development
- Redeploy

## 📚 References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
