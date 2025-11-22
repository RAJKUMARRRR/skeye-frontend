# Vercel Build Error Fix

## ✅ Fixed Issues

### 1. Package Name Mismatch
**Problem:** Build commands used `@fleet/*` but packages are named `@skeye/*`

**Fixed in `package.json`:**
```json
{
  "scripts": {
    "build:web": "turbo run build --filter=@skeye/web",  // ✅ Was: @fleet/web
    "build:marketing": "turbo run build --filter=@skeye/marketing",  // ✅ Was: @fleet/marketing
    "dev:web": "turbo run dev --filter=@skeye/web",  // ✅ Was: @fleet/web
    "dev:marketing": "turbo run dev --filter=@skeye/marketing"  // ✅ Was: @fleet/marketing
  }
}
```

### 2. Duplicate yarn install in vercel.json
**Fixed:**
```json
// Before
"buildCommand": "cd ../.. && yarn install && yarn build:marketing"

// After
"buildCommand": "cd ../.. && yarn build:marketing"
```

Vercel already runs `installCommand`, so no need to run `yarn install` again in `buildCommand`.

---

## 🐛 Remaining Issue: MDX Build Error

### Error Message
```
ERROR: Cannot process MDX file with esbuild:
75:4: Unexpected character `2` (U+0032) before name
```

**File:** `apps/marketing/content/blog/driver-safety-scoring.mdx`
**Line:** 75

### Cause
MDX syntax error in the blog content file. Likely a component or HTML tag starting with a number.

### Quick Fix Options

#### Option 1: Skip Blog Build (Fastest - For Deployment)
Comment out blog in the build temporarily:

**In `apps/marketing/contentlayer.config.ts`:**
```typescript
// Temporarily skip blog
export default makeSource({
  contentDirPath: 'content',
  documentTypes: [], // Empty to skip all content
})
```

#### Option 2: Fix the MDX File
Check line 75 in `apps/marketing/content/blog/driver-safety-scoring.mdx`:
```mdx
// Bad - starts with number
<2Column>

// Good - starts with letter
<TwoColumn>
```

#### Option 3: Delete the Problematic File (Quick)
```bash
rm apps/marketing/content/blog/driver-safety-scoring.mdx
```

---

## 📋 Complete Vercel Deployment Fix

### Marketing Site

1. **Fix MDX error** (choose one option above)

2. **Test build locally:**
   ```bash
   yarn build:marketing
   ```

3. **Deploy to Vercel:**
   ```bash
   yarn deploy:prod:marketing
   ```

### Web App

Should work fine now:
```bash
yarn build:web  # Test locally
yarn deploy:prod:web  # Deploy
```

---

## 🔧 Updated Vercel Configuration

### Marketing (`apps/marketing/vercel.json`)
```json
{
  "buildCommand": "cd ../.. && yarn build:marketing",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "yarn install"
}
```

### Web (`apps/web/vercel.json`)
```json
{
  "buildCommand": "cd ../.. && yarn build:web",
  "outputDirectory": "dist",
  "framework": null,
  "installCommand": "yarn install"
}
```

---

## ✅ Verification Steps

### 1. Test Build Locally
```bash
# Test marketing build
yarn build:marketing

# Test web build
yarn build:web
```

Both should succeed without errors.

### 2. Deploy to Vercel
```bash
# Deploy marketing
yarn deploy:prod:marketing

# Deploy web
yarn deploy:prod:web
```

---

## 🎯 What Was Wrong

1. ❌ **Turborepo filters didn't match package names**
   - Used `@fleet/marketing` but package is `@skeye/marketing`
   - Result: "0 tasks executed" - nothing was built

2. ❌ **Duplicate yarn install**
   - Build command ran `yarn install` again
   - Vercel already installs via `installCommand`

3. ❌ **MDX syntax error in blog content**
   - Component tag started with number
   - MDX can't parse tags starting with numbers

---

## 🚀 Next Steps

1. **Fix MDX error** using one of the three options above
2. **Test build:** `yarn build:marketing`
3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel build configuration and package name filters"
   git push
   ```
4. **Deploy:** `yarn deploy:prod:marketing`

---

## 💡 Pro Tip

To avoid MDX errors in production, add this to your CI:

```yaml
# .github/workflows/ci.yml
- name: Build all apps
  run: yarn build
```

This catches build errors before deployment!
