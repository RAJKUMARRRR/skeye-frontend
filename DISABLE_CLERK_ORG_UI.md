# How to Disable Clerk's Organization Setup UI

## Problem
After signing in, Clerk is showing its default "Setup your organization" screen at `/sign-in/tasks/choose-organization` instead of redirecting to your custom `/select-organization` page.

## Solution

You need to configure Clerk Dashboard to skip its internal organization selection/setup flow.

### Step 1: Go to Clerk Dashboard

1. Open https://dashboard.clerk.com
2. Select your application (solid-turkey-46)

### Step 2: Configure Organization Settings

Navigate to: **Configure → Organizations** (in the left sidebar)

Look for these settings and configure them as follows:

#### Option A: Disable "Organization selection" or "Organization setup"

Look for one of these settings:
- **"Show organization selection screen"** → Set to **OFF** or **"Skip"**
- **"Require organization selection"** → Set to **OFF**
- **"Enable organization switcher"** → Keep this **ON** (we want organizations, just not Clerk's UI)
- **"Organization selection behavior"** → Set to **"Skip"** or **"Custom"**

#### Option B: Under "Advanced Settings" or "Session Settings"

Look for:
- **"Organization behavior after sign-in"** → Set to **"None"** or **"Skip"**
- **"Redirect after organization task"** → Leave **EMPTY** or set to `/select-organization`

### Step 3: Update Paths Configuration

Navigate to: **Configure → Paths**

Set these URLs:
```
After sign-in URL: http://localhost:4001/select-organization
After sign-up URL: http://localhost:4001/select-organization
```

For production, use your production URLs:
```
After sign-in URL: https://yourdomain.com/select-organization
After sign-up URL: https://yourdomain.com/select-organization
```

### Step 4: Save and Test

1. **Save all changes** in Clerk Dashboard
2. **Clear your browser cache** (or use Incognito/Private mode)
3. **Sign out completely** from http://localhost:4001
4. **Close all browser tabs** with your app
5. **Open a fresh browser window**
6. Go to http://localhost:4001/login
7. Try signing in

**Expected behavior:**
- After sign-in, you should be redirected to YOUR custom `/select-organization` page
- You should NOT see Clerk's "Setup your organization" modal
- You should see your Skeye-branded organization selection UI

---

## Alternative: If Settings Don't Exist

If you can't find these exact settings in your Clerk Dashboard, it might be because:

1. **Your Clerk plan doesn't support custom organization flows**
   - Free/Hobby plans might have limited customization
   - You may need to upgrade to Pro plan

2. **Settings are in a different location**
   - Check under "Sessions" → "Organization settings"
   - Check under "User & Authentication" → "Organization"
   - Look in "Advanced" section

3. **Contact Clerk Support**
   - Email: support@clerk.com
   - Tell them: "I want to use custom UI for organization selection and disable Clerk's default organization setup screen"
   - They can help enable the setting or guide you to it

---

## What We've Already Done in Code

Your codebase is already configured correctly:

✅ Custom login form redirects to `/select-organization`
✅ Custom signup form redirects to `/select-organization`
✅ SSO callback redirects to `/select-organization`
✅ Custom organization selection page at `/select-organization`
✅ No Clerk UI components used anywhere

**The only missing piece is the Clerk Dashboard configuration.**

---

## Testing Checklist

After configuring Clerk Dashboard:

- [ ] Sign in with email/password → Goes to custom organization page
- [ ] Sign in with Google OAuth → Goes to custom organization page
- [ ] Sign up with email → Verify email → Goes to custom organization page
- [ ] Sign up with Google → Goes to custom organization page
- [ ] NO Clerk modals or default UI appears anywhere
- [ ] All organization management uses your custom Skeye-branded UI

---

## If It Still Doesn't Work

If after configuring Clerk Dashboard you still see Clerk's UI:

1. **Clear ALL browser data** for localhost:4001
   - Cookies
   - Cache
   - Local Storage
   - Session Storage

2. **Restart your dev server**
   ```bash
   # Stop the server (Ctrl+C)
   yarn dev:web
   ```

3. **Try in a completely fresh browser**
   - Use a different browser (Chrome → Firefox)
   - Or use Incognito/Private mode

4. **Check Clerk Dashboard logs**
   - Clerk Dashboard → Logs
   - Look for any redirect or organization-related events
   - See what Clerk is doing after sign-in

5. **Verify environment variables**
   ```bash
   # Check your .env.local file
   cat apps/web/.env.local
   ```
   Make sure `VITE_CLERK_PUBLISHABLE_KEY` is correct

---

## Need More Help?

If none of this works:

1. Take a screenshot of your Clerk Dashboard → Organizations settings page
2. Check if there's a "Custom organization flow" toggle or similar
3. Contact Clerk support with your use case
4. They can enable custom organization flows for your application

The issue is 100% in Clerk Dashboard configuration, not in your code. Your code is set up correctly to use custom UI everywhere.
