# 🚀 Quick Deploy Commands

## One-Line Deploy Commands

```bash
# Marketing Site
yarn deploy:dev:marketing          # Preview
yarn deploy:prod:marketing         # Production

# Web App
yarn deploy:dev:web                # Preview
yarn deploy:prod:web               # Production

# Both Apps
yarn deploy:preview                # Both to preview
yarn deploy:prod                   # Both to production
```

---

## First Time Setup (5 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Link projects
cd apps/marketing && vercel
cd ../web && vercel

# 4. Done! Now use deploy commands above
```

---

## Common Workflows

### Deploy Marketing to Production
```bash
yarn deploy:prod:marketing
```

### Deploy Web App to Production
```bash
yarn deploy:prod:web
```

### Deploy Everything to Production
```bash
yarn deploy:prod
```

### Test with Preview First
```bash
# Deploy to preview
yarn deploy:preview:marketing

# Test the preview URL
# If good, deploy to production
yarn deploy:prod:marketing
```

---

## From App Directories

```bash
# Inside apps/marketing/
yarn deploy:prod

# Inside apps/web/
yarn deploy:prod
```

---

## Environment-Specific

| Command | Environment | URL Type |
|---------|-------------|----------|
| `deploy:dev` | Preview | `app-git-branch.vercel.app` |
| `deploy:preview` | Preview | `app-git-branch.vercel.app` |
| `deploy:prod` | Production | `app.vercel.app` or custom domain |

---

## Need More Info?

- **Full Guide:** [DEPLOYMENT_SCRIPTS.md](./DEPLOYMENT_SCRIPTS.md)
- **Vercel Setup:** [VERCEL_QUICK_DEPLOY.md](./VERCEL_QUICK_DEPLOY.md)
- **Environment Vars:** [PRODUCTION_ENV_TEMPLATE.md](./PRODUCTION_ENV_TEMPLATE.md)
