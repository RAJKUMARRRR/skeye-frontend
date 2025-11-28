# Clerk Dashboard Setup Guide

## Required Configuration to Use Custom UI

Follow these steps to configure Clerk to use your custom organization selection UI instead of Clerk's default UI.

---

## 1. Configure Paths

**Go to:** [Clerk Dashboard](https://dashboard.clerk.com) → Your Application → **Configure** → **Paths**

Set the following URLs:

```
Application URLs:
├── Home URL: http://localhost:4001
├── Sign-in URL: http://localhost:4001/sign-in
├── Sign-up URL: http://localhost:4001/sign-up
├── After sign-in URL: http://localhost:4001/select-organization
└── After sign-up URL: http://localhost:4001/select-organization
```

**Important:** These URLs tell Clerk where to redirect users after authentication.

---

## 2. Configure Organizations

**Go to:** Clerk Dashboard → **Configure** → **Organizations**

### Enable Organization Features:
- ✅ **Enable organizations** - Turn this ON
- ✅ **Allow users to create organizations** - Turn this ON
- ✅ **Allow users to join via invitation** - Turn this ON

### Organization Selection Settings:
This is the **critical setting** to use your custom UI:

1. Scroll to **"Organization selection"** section
2. Find **"Skip organization selection screen"** or **"Disable organization selection screen"**
3. **Turn this ON** ✅

**What this does:**
- Disables Clerk's default organization selection UI (the one you're seeing)
- Allows your custom `/select-organization` page to handle organization selection
- Users will be redirected to your custom page instead of Clerk's

### Alternative Setting Names:
Depending on your Clerk version, this might be called:
- "Skip organization selection screen"
- "Disable organization selection screen"
- "Custom organization selection"
- Under "Advanced settings" → "Organization selection behavior"

---

## 3. Configure Allowed Domains

**Go to:** Clerk Dashboard → **Configure** → **Domains**

Add your application domains:

**Development:**
```
localhost:4001
```

**Production (when deploying):**
```
app.yourdomain.com
yourdomain.com
```

---

## 4. Organization Invitation Settings

**Go to:** Clerk Dashboard → **Organizations** → **Settings** → **Invitations**

Configure:
- ✅ **Email address domains** - Leave blank or set specific domains
- ✅ **Invitation expiration** - Set to your preference (default: 7 days)
- ✅ **Require email verification** - Recommended: ON

---

## 5. Session & Token Settings

**Go to:** Clerk Dashboard → **Configure** → **Sessions**

Recommended settings:
- **Session lifetime**: 7 days (default)
- **Inactive timeout**: 30 minutes (default)
- **Multi-session handling**: Single session (or Multiple if needed)

---

## 6. Verification Settings

**Go to:** Clerk Dashboard → **Configure** → **Email, Phone, Username**

Ensure:
- ✅ **Email address** - Required for sign-up
- ✅ **Email verification** - Recommended: Required

---

## Configuration Checklist

Use this checklist to verify your setup:

### Paths Configuration
- [ ] Home URL set to `http://localhost:4001`
- [ ] Sign-in URL set to `http://localhost:4001/sign-in`
- [ ] Sign-up URL set to `http://localhost:4001/sign-up`
- [ ] After sign-in URL set to `http://localhost:4001/select-organization`
- [ ] After sign-up URL set to `http://localhost:4001/select-organization`

### Organizations Configuration
- [ ] Organizations feature enabled
- [ ] Users can create organizations enabled
- [ ] Users can join via invitation enabled
- [ ] **Organization selection screen DISABLED** ✅ (Critical!)

### Domains Configuration
- [ ] `localhost:4001` added to allowed domains

### Code Configuration
- [ ] `skipInvitationScreen={true}` in ClerkProvider (already set in code)
- [ ] Redirect URLs configured in ClerkProvider (already set in code)

---

## Testing After Configuration

### Test 1: New User Sign-Up
1. Go to `http://localhost:4001/sign-up`
2. Create a new account
3. **Expected:** Redirects to `/select-organization` (your custom page)
4. **Should NOT see:** Clerk's default organization selection modal

### Test 2: Existing User Sign-In
1. Go to `http://localhost:4001/sign-in`
2. Sign in with existing account
3. **Expected:** Redirects to `/select-organization` (your custom page)
4. **Should NOT see:** Clerk's default organization selection modal

### Test 3: Organization Invitation (New User)
1. Invite a new user to an organization
2. User clicks invitation link
3. **Expected:**
   - Redirects to `/sign-up`
   - After sign-up, goes to `/select-organization` (your custom page)
   - Auto-selects organization and goes to `/dashboard`
4. **Should NOT see:** Clerk's "Choose an organization" modal

### Test 4: Organization Invitation (Existing User)
1. Invite an existing user to an organization
2. User clicks invitation link
3. **Expected:**
   - Redirects to `/sign-in`
   - After sign-in, goes to `/select-organization` (your custom page)
   - Shows organization in custom list
4. **Should NOT see:** Clerk's "Choose an organization" modal

---

## Troubleshooting

### Still Seeing Clerk's Default Organization Selection Screen?

**Problem:** URL shows `localhost:4001/sign-in/tasks/choose-organization`

**Solutions:**

1. **Check Organization Selection Setting:**
   - Go to: Clerk Dashboard → Organizations → Settings
   - Find: "Skip organization selection screen" or similar
   - Ensure: It's turned **ON** ✅

2. **Clear Browser Cache:**
   ```bash
   # Hard refresh
   Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)

   # Or clear all cookies for localhost:4001
   ```

3. **Check ClerkProvider Configuration:**
   - Verify `skipInvitationScreen={true}` in `main.tsx`
   - Verify `afterSignInUrl="/select-organization"`

4. **Restart Development Server:**
   ```bash
   yarn dev:web
   ```

5. **Check Clerk Dashboard Paths:**
   - Verify all redirect URLs point to your app, not Clerk's domain
   - Should be: `http://localhost:4001/...`
   - Should NOT be: `https://clerk.accounts.dev/...`

### Invitation Links Redirect to Clerk Domain?

**Problem:** Clicking invitation redirects to `solid-turkey-46.clerk.accounts.dev`

**Solution:**
1. Go to: Clerk Dashboard → Configure → Paths
2. Ensure **Home URL** is set to `http://localhost:4001`
3. Ensure **After sign-in URL** is set to `http://localhost:4001/select-organization`

### Custom Page Not Loading?

**Check:**
1. Route exists in `apps/web/src/routes/index.tsx`
2. Component exists at `apps/web/src/pages/SelectOrganization.tsx`
3. No TypeScript/build errors in console

---

## Production Deployment Changes

When deploying to production, update Clerk Dashboard:

### Paths (Production)
```
Home URL: https://app.yourdomain.com
Sign-in URL: https://app.yourdomain.com/sign-in
Sign-up URL: https://app.yourdomain.com/sign-up
After sign-in URL: https://app.yourdomain.com/select-organization
After sign-up URL: https://app.yourdomain.com/select-organization
```

### Domains (Production)
```
app.yourdomain.com
```

### Environment Variables (Production)
Update `.env.production`:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
```

---

## Support

If you're still seeing Clerk's default UI after following these steps:

1. **Screenshot the exact screen you're seeing**
2. **Check the URL** - is it your domain or Clerk's?
3. **Check browser console** for any errors
4. **Verify Clerk Dashboard settings** against this guide
5. **Try in incognito mode** to rule out browser cache issues

### Clerk Support Resources:
- [Clerk Documentation](https://clerk.com/docs)
- [Organizations Guide](https://clerk.com/docs/organizations/overview)
- [Custom Flow Guide](https://clerk.com/docs/custom-flows/overview)
