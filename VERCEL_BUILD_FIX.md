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

### 3. MDX Syntax Errors ✅ FIXED
**Problem:** MDX parser cannot handle `<` or `>` followed by numbers (interprets as HTML tags)

**Fixed in** `driver-safety-scoring.mdx`:
- Line 75: `<2 harsh events` → `Less than 2 harsh events`
- Line 76: `<5% speeding` → `Less than 5% speeding`
- Line 89: `<60` → `Below 60`
- Line 90: `>10 harsh events` → `More than 10 harsh events`
- Line 91: `>20% speeding` → `More than 20% speeding`
- Line 198: `Score <40` → `Score below 40`
- Line 299: `>95%` → `greater than 95%`

### 4. TypeScript Error in pricing/page.tsx ✅ FIXED
**Problem:** Accordion components required `value` prop

**Fixed:** Added `value` prop to `AccordionTrigger` and `AccordionContent`

### 5. TypeScript Error in magnetic-button.tsx ✅ FIXED
**Problem:** Framer Motion type conflict with React ButtonHTMLAttributes

**Fixed:** Changed from `React.ButtonHTMLAttributes<HTMLButtonElement>` to `HTMLMotionProps<'button'>`

---

## 🐛 Remaining Issue: next-intl Static Rendering

### Error Message
```
Error: Usage of next-intl APIs in Server Components currently opts into dynamic rendering.
This limitation will eventually be lifted, but as a stopgap solution, you can use the
`setRequestLocale` API to enable static rendering
```

### Cause
The marketing site pages are using next-intl in server components but Next.js is trying to statically render them. Next-intl requires calling `setRequestLocale()` in each page component to enable static rendering.

### Quick Fix Options

#### Option 1: Disable Static Export (Fastest - Recommended for Vercel)
Vercel doesn't require static export. Update `apps/marketing/next.config.mjs`:

```javascript
const nextConfig = {
  // Remove or comment out the output line:
  // output: 'export',

  // Keep existing config:
  transpilePackages: ['@fleet/api', '@fleet/ui', '@fleet/utils'],
  // ... rest of config
}
```

This allows Next.js to use dynamic rendering which works fine on Vercel.

#### Option 2: Add setRequestLocale to all pages (More work)
Add to every page component in `apps/marketing/src/app/[locale]/`:

```typescript
import { setRequestLocale } from 'next-intl/server'

export default function Page({ params: { locale } }) {
  setRequestLocale(locale)  // Add this line
  // ... rest of page
}
```

Required in: `page.tsx`, `about/page.tsx`, `blog/page.tsx`, `contact/page.tsx`, `demo/page.tsx`, `features/page.tsx`, `pricing/page.tsx`

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
