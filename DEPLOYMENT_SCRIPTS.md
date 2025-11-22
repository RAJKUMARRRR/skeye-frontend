# Deployment Scripts Guide

## 🚀 Quick Deploy Commands

All deployment commands are now available via `yarn` or `pnpm` scripts!

---

## 📋 Available Commands

### Root Level (Deploy from project root)

```bash
# Marketing Site
yarn deploy:dev:marketing          # Deploy to preview
yarn deploy:preview:marketing      # Deploy to preview (same as dev)
yarn deploy:prod:marketing         # Deploy to production

# Web App
yarn deploy:dev:web                # Deploy to preview
yarn deploy:preview:web            # Deploy to preview (same as dev)
yarn deploy:prod:web               # Deploy to production

# Deploy Both Apps
yarn deploy:preview                # Deploy both to preview
yarn deploy:prod                   # Deploy both to production
```

### App Level (From inside app directory)

```bash
# From apps/marketing/
cd apps/marketing
yarn deploy:dev                    # Deploy to preview
yarn deploy:preview                # Deploy to preview
yarn deploy:prod                   # Deploy to production

# From apps/web/
cd apps/web
yarn deploy:dev                    # Deploy to preview
yarn deploy:preview                # Deploy to preview
yarn deploy:prod                   # Deploy to production
```

---

## 🎯 Usage Examples

### Deploy Marketing Site to Production

```bash
# Option 1: From root
yarn deploy:prod:marketing

# Option 2: From marketing directory
cd apps/marketing
yarn deploy:prod
```

### Deploy Web App to Preview

```bash
# Option 1: From root
yarn deploy:preview:web

# Option 2: From web directory
cd apps/web
yarn deploy:preview
```

### Deploy Both Apps to Production

```bash
# From root - deploys marketing first, then web app
yarn deploy:prod
```

---

## 🔧 What Each Command Does

### Preview Deployments (`deploy:dev` / `deploy:preview`)

**Command:** `vercel`

- Creates a preview deployment
- Generates unique URL like `https://your-app-git-branch-username.vercel.app`
- Perfect for testing before production
- Uses environment variables set for "Preview" in Vercel Dashboard
- **Does NOT affect production site**

**When to use:**
- Testing new features
- Reviewing pull requests
- Sharing work-in-progress

### Production Deployments (`deploy:prod`)

**Command:** `vercel --prod`

- Deploys to your production URL
- Updates live site immediately
- Uses environment variables set for "Production" in Vercel Dashboard
- Assigns to custom domain (if configured)

**When to use:**
- Deploying stable, tested code
- Releasing new features to users
- After merging to main branch

---

## 🔑 First Time Setup

Before running deployment commands for the first time:

### 1. Install Vercel CLI

```bash
npm install -g vercel
# or
yarn global add vercel
# or
pnpm add -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 3. Link Projects (One-time per app)

**Marketing Site:**
```bash
cd apps/marketing
vercel

# You'll be prompted:
# Set up and deploy? Yes
# Which scope? (select your account)
# Link to existing project? No (first time) or Yes (if exists)
# Project name? fleet-marketing (or your choice)
# In which directory is your code located? ./
```

**Web App:**
```bash
cd apps/web
vercel

# Same prompts as above
# Project name? fleet-web-app (or your choice)
```

### 4. Configure Build Settings in Vercel Dashboard

After first deployment, update settings in Vercel Dashboard:

**Marketing Site:**
- Build Command: `cd ../.. && yarn build:marketing`
- Output Directory: `.next`
- Install Command: `yarn install`

**Web App:**
- Build Command: `cd ../.. && yarn build:web`
- Output Directory: `dist`
- Install Command: `yarn install`

### 5. Add Environment Variables

Go to each project in Vercel Dashboard:
- Settings → Environment Variables
- Add all required variables (see `PRODUCTION_ENV_TEMPLATE.md`)
- Choose environment: Production / Preview / Development

---

## 📊 Deployment Workflow

### Development Workflow

```bash
# 1. Make changes locally
git checkout -b feature/new-feature

# 2. Test locally
yarn dev:marketing
# or
yarn dev:web

# 3. Deploy to preview for testing
yarn deploy:preview:marketing
# or
yarn deploy:preview:web

# 4. Review preview URL
# Vercel will output: https://fleet-marketing-git-feature-username.vercel.app

# 5. If good, merge to main
git checkout main
git merge feature/new-feature
git push

# 6. Deploy to production
yarn deploy:prod:marketing
# or
yarn deploy:prod:web
```

### Quick Production Deploy

```bash
# If already on main branch and everything is tested
yarn deploy:prod
```

This deploys both apps to production!

---

## 🎨 Deployment Environments

Vercel provides three environments:

### 1. **Development**
- Local development only
- Uses `.env.local` or `.env.development`
- Not deployed to Vercel

### 2. **Preview**
- Every branch gets a preview deployment
- Automatic on git push (if connected to GitHub)
- Manual via `yarn deploy:preview`
- Unique URL per branch/commit
- Uses "Preview" environment variables

### 3. **Production**
- Main branch (or custom production branch)
- Your live site
- Manual via `yarn deploy:prod`
- Uses "Production" environment variables
- Assigned to custom domain (if configured)

---

## 🔍 Monitoring Deployments

### View Deployment Status

After running a deploy command:

```bash
# Vercel will output:
Inspecting deployment...
✓ Production deployment ready
   https://your-app.vercel.app
```

### Check Deployment Logs

```bash
# View logs for latest deployment
vercel logs

# View logs for specific deployment
vercel logs [deployment-url]
```

### List All Deployments

```bash
# From app directory
cd apps/marketing
vercel ls

# Or from root
cd apps/marketing && vercel ls
```

---

## 🐛 Troubleshooting

### Command Not Found: `vercel`

**Problem:** Vercel CLI not installed globally

**Solution:**
```bash
npm install -g vercel
# or
yarn global add vercel
# or
pnpm add -g vercel
```

### Error: "No existing credentials found"

**Problem:** Not logged in to Vercel

**Solution:**
```bash
vercel login
```

### Error: "Build failed"

**Common causes:**

1. **Monorepo build command wrong**
   - Check `vercel.json` has: `cd ../.. && yarn build:marketing`

2. **Environment variables missing**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all required variables
   - Redeploy

3. **Dependencies not installed**
   - Vercel should auto-install, but check Install Command is `yarn install`

**Debug:**
```bash
# Check build locally first
yarn build:marketing
# or
yarn build:web
```

### Error: "Project not linked"

**Problem:** App not linked to Vercel project

**Solution:**
```bash
cd apps/marketing  # or apps/web
vercel link

# Follow prompts to link to existing project
```

---

## 🔄 CI/CD with GitHub Actions (Optional)

Auto-deploy on git push:

### Create `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install

      - name: Deploy Marketing to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_MARKETING_PROJECT_ID }}
          working-directory: ./apps/marketing
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}

      - name: Deploy Web to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_WEB_PROJECT_ID }}
          working-directory: ./apps/web
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

**Setup secrets in GitHub:**
1. Go to repository Settings → Secrets
2. Add:
   - `VERCEL_TOKEN` - From Vercel Settings → Tokens
   - `VERCEL_ORG_ID` - Run `vercel whoami`
   - `VERCEL_MARKETING_PROJECT_ID` - From project settings
   - `VERCEL_WEB_PROJECT_ID` - From project settings

---

## 📱 Using pnpm Instead of yarn

All commands work with `pnpm` too:

```bash
# Replace yarn with pnpm
pnpm deploy:prod:marketing
pnpm deploy:preview:web
pnpm deploy:prod
```

---

## ⚡ Pro Tips

### 1. **Alias for Quick Deploy**

Add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
alias deploy-marketing="yarn deploy:prod:marketing"
alias deploy-web="yarn deploy:prod:web"
alias deploy-all="yarn deploy:prod"
```

Then just run:
```bash
deploy-marketing
```

### 2. **Check Before Deploy**

```bash
# Run tests first
yarn test

# Check types
cd apps/web && yarn build  # TypeScript check
cd apps/marketing && yarn type-check

# Then deploy
yarn deploy:prod
```

### 3. **Preview Before Production**

```bash
# Always preview first
yarn deploy:preview:marketing

# Test the preview URL
# If good, then deploy to production
yarn deploy:prod:marketing
```

### 4. **Rollback if Needed**

```bash
# List recent deployments
cd apps/marketing
vercel ls

# Promote previous deployment to production
vercel promote [previous-deployment-url]
```

---

## 📊 Command Reference Table

| Command | Location | Environment | What It Does |
|---------|----------|-------------|--------------|
| `yarn deploy:dev:marketing` | Root | Preview | Deploy marketing to preview |
| `yarn deploy:prod:marketing` | Root | Production | Deploy marketing to production |
| `yarn deploy:dev:web` | Root | Preview | Deploy web to preview |
| `yarn deploy:prod:web` | Root | Production | Deploy web to production |
| `yarn deploy:preview` | Root | Preview | Deploy both to preview |
| `yarn deploy:prod` | Root | Production | Deploy both to production |
| `yarn deploy:dev` | App dir | Preview | Deploy current app to preview |
| `yarn deploy:prod` | App dir | Production | Deploy current app to production |

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally (`yarn test`)
- [ ] Build succeeds locally (`yarn build:marketing` / `yarn build:web`)
- [ ] Environment variables set in Vercel Dashboard
- [ ] Preview deployment tested and working
- [ ] No console errors in browser
- [ ] API connections working
- [ ] Authentication flow tested
- [ ] Responsive design checked

---

## 🆘 Get Help

**Vercel CLI Help:**
```bash
vercel --help
vercel deploy --help
```

**Check Vercel Status:**
```bash
vercel whoami      # Check login status
vercel ls          # List deployments
vercel inspect     # Inspect latest deployment
```

**Documentation:**
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Deployment Guide](./VERCEL_QUICK_DEPLOY.md)
- [Environment Variables](./PRODUCTION_ENV_TEMPLATE.md)

---

Happy deploying! 🚀
