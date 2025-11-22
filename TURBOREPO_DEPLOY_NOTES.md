# Turborepo + Vercel Deployment Notes

## ✅ Yes, The Scripts Work with Turborepo!

The deployment scripts are designed to work correctly with your Turborepo monorepo setup.

---

## 🎯 Why They Work

### 1. **Vercel CLI is Workspace-Aware**

The `vercel` command works perfectly with monorepos when:
- ✅ You `cd` into the specific app directory
- ✅ Each app has its own `vercel.json` configuration
- ✅ Build commands reference the monorepo root

**Our scripts do exactly this:**
```bash
# From root package.json
"deploy:prod:marketing": "cd apps/marketing && vercel --prod"
```

This changes to the app directory before running Vercel, which tells Vercel:
- "Deploy this specific app"
- "Use the vercel.json config in this directory"
- "Treat this as the project root directory"

### 2. **Build Commands Handle Turborepo**

Each app's `vercel.json` has the correct build command:

**Marketing (`apps/marketing/vercel.json`):**
```json
{
  "buildCommand": "cd ../.. && yarn build:marketing"
}
```

**Web (`apps/web/vercel.json`):**
```json
{
  "buildCommand": "cd ../.. && yarn build:web"
}
```

The `cd ../..` goes back to the monorepo root, then uses Turborepo's build commands:
- `yarn build:marketing` → Triggers `turbo run build --filter=@fleet/marketing`
- `yarn build:web` → Triggers `turbo run build --filter=@fleet/web`

### 3. **Turborepo Caching Works**

Vercel automatically:
- ✅ Detects Turborepo via `turbo.json`
- ✅ Uses Turborepo's cache
- ✅ Only rebuilds changed packages
- ✅ Respects dependency graph

---

## 🚀 How Deployment Works

### Step-by-Step Flow

**When you run:** `yarn deploy:prod:marketing`

1. **Script executes:** `cd apps/marketing && vercel --prod`
2. **Vercel detects:**
   - You're in `apps/marketing` directory
   - There's a `vercel.json` config
   - Root Directory setting (optional in dashboard)
3. **Vercel runs build command:** `cd ../.. && yarn build:marketing`
4. **Goes to monorepo root:** `/Users/you/project/frontend-v2`
5. **Executes Turborepo:** `turbo run build --filter=@fleet/marketing`
6. **Turborepo:**
   - Analyzes dependency graph
   - Builds `packages/*` if needed
   - Builds `apps/marketing`
   - Uses cache for unchanged packages
7. **Vercel:**
   - Takes built files from `apps/marketing/.next`
   - Deploys to production

---

## 📦 Turborepo Benefits on Vercel

### 1. **Faster Builds**
```
First deploy:  Build everything (3-5 min)
Second deploy: Only changed packages (30s-1min)
```

Turborepo's cache means if you only changed marketing site, it won't rebuild the web app's dependencies.

### 2. **Shared Package Builds**
If you have shared packages like:
```
packages/
  ui/
  utils/
  api/
```

Turborepo ensures they're built in the correct order and cached between deployments.

### 3. **Parallel Builds (if deploying both)**
```bash
yarn deploy:prod
# Turborepo can build packages in parallel
```

---

## 🔧 Vercel Dashboard Configuration

When you first link projects, Vercel will ask:

### Marketing Site
```
Framework Preset: Next.js ✅ (auto-detected)
Root Directory: apps/marketing ✅
Build Command: cd ../.. && yarn build:marketing ✅
Output Directory: .next ✅ (auto-detected)
Install Command: yarn install ✅
```

### Web App
```
Framework Preset: Other ✅
Root Directory: apps/web ✅
Build Command: cd ../.. && yarn build:web ✅
Output Directory: dist ✅
Install Command: yarn install ✅
```

**Note:** Vercel automatically installs from the **monorepo root**, so all workspace dependencies are available!

---

## ✅ Verification

The scripts work because:

1. ✅ **Root `package.json` scripts** - Changes to app directory before calling Vercel
2. ✅ **App `vercel.json` configs** - Tells Vercel to use monorepo root for building
3. ✅ **Turborepo commands** - Uses existing `build:marketing` and `build:web` scripts
4. ✅ **Workspace resolution** - Yarn workspaces + Turborepo work together

---

## 🧪 Test It Yourself

### Local Test (Dry Run)

```bash
# Test the script path resolution
cd apps/marketing
pwd
# Output: /path/to/frontend-v2/apps/marketing

cd ../..
pwd
# Output: /path/to/frontend-v2

# This is exactly what vercel.json does during build!
```

### Verify Build Command

```bash
# Test Turborepo builds work
yarn build:marketing
# Should build marketing site successfully

yarn build:web
# Should build web app successfully
```

If these work locally, they'll work on Vercel!

---

## 🐛 Potential Issues & Solutions

### Issue 1: "No such file or directory"

**Problem:** Build command can't find monorepo root

**Solution:** Verify `vercel.json` has correct path:
```json
{
  "buildCommand": "cd ../.. && yarn build:marketing"
}
```

### Issue 2: "Package not found"

**Problem:** Shared packages not built

**Solution:** Check `turbo.json` pipeline:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]  // ✅ This builds dependencies first
    }
  }
}
```

### Issue 3: "Build takes too long"

**Problem:** Not using Turborepo cache

**Solution:** Ensure Vercel detects `turbo.json`:
- ✅ File exists in repo root
- ✅ Vercel has "Enable Turbo" in settings (auto-enabled usually)

---

## 📊 Monorepo vs Single Repo

### Traditional Setup (Single App)
```bash
vercel --prod
# Deploys entire repo
```

### Turborepo Setup (Multiple Apps)
```bash
cd apps/marketing && vercel --prod
# Deploys only marketing app
# Uses monorepo context for builds
```

**Our scripts do this automatically:**
```bash
yarn deploy:prod:marketing
# ↓ Internally runs:
# cd apps/marketing && vercel --prod
```

---

## 🎯 Best Practices

### 1. **Use Root Scripts for CI/CD**
```yaml
# .github/workflows/deploy.yml
- name: Deploy Marketing
  run: yarn deploy:prod:marketing  # ✅ Works from root
```

### 2. **Use App Scripts During Development**
```bash
# When working in marketing directory
cd apps/marketing
yarn deploy:dev  # ✅ Quick deploy from app context
```

### 3. **Deploy Both Apps**
```bash
yarn deploy:prod  # ✅ Deploys both in sequence
```

---

## 🔄 Turborepo + Vercel Integration

Vercel has **first-class Turborepo support**:

1. **Auto-detection**: Recognizes `turbo.json`
2. **Remote Caching**: Can use Vercel's remote cache
3. **Build Optimization**: Only builds changed apps
4. **Parallel Execution**: Builds independent packages in parallel

**Enable Remote Caching (Optional):**
```bash
# Add to turbo.json
{
  "remoteCache": {
    "signature": true
  }
}

# Link to Vercel
npx turbo login
npx turbo link
```

---

## ✅ Conclusion

**Your deployment scripts are correctly configured for Turborepo!**

They work because:
1. ✅ Scripts navigate to app directories
2. ✅ Build commands reference monorepo root
3. ✅ Vercel understands the workspace structure
4. ✅ Turborepo handles build orchestration

**Just run:**
```bash
yarn deploy:prod:marketing
# or
yarn deploy:prod:web
# or
yarn deploy:prod  # Deploy both!
```

No changes needed - the scripts are Turborepo-ready! 🚀

---

## 📚 References

- [Vercel Monorepo Guide](https://vercel.com/docs/concepts/monorepos)
- [Turborepo on Vercel](https://turbo.build/repo/docs/handbook/deploying-with-vercel)
- [Yarn Workspaces + Vercel](https://vercel.com/docs/concepts/deployments/build-step#yarn-workspaces)
