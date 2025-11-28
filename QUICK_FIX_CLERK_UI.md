# Quick Fix: Stop Clerk's Organization Selection UI

## The Problem

You're seeing Clerk's default "Choose an organization" modal instead of your custom UI.

## The Solution (2 Steps)

### Step 1: Clerk Dashboard Configuration

1. **Go to:** https://dashboard.clerk.com
2. **Select your application** (solid-turkey-46 or whatever your app name is)

3. **Navigate to: Configure → Paths** (left sidebar)

   Set these values:
   ```
   After sign-in URL: http://localhost:4001/select-organization
   After sign-up URL: http://localhost:4001/select-organization
   ```

4. **Navigate to: Configure → Organizations** (left sidebar)

   Look for these settings and configure them:

   **Enable Organizations:**
   - ✅ Turn ON "Enable organizations"

   **Organization Selection (THIS IS THE KEY!):**
   - Look for one of these settings:
     - "Skip organization selection screen"
     - "Disable organization selection"
     - "Organization selection behavior"

   - **If you see a toggle:** Turn it **ON** to skip Clerk's UI
   - **If you see a dropdown:** Select "Skip" or "Custom"
   - **If you see "Allow organization selection":** Turn it **OFF**

   **The goal is to tell Clerk:** "Don't show your default organization selection UI, let my app handle it"

5. **Save changes**

### Step 2: Test

1. **Clear your browser cache** (or use Incognito/Private mode)
2. **Sign out completely** from http://localhost:4001
3. **Go to:** http://localhost:4001/sign-in
4. **Sign in again**

**Expected result:**
- After sign-in, you should be redirected to your custom page at `/select-organization`
- You should see your Skeye-branded page with organization list
- You should NOT see Clerk's modal

---

## Still Not Working?

### Try This Alternative Approach:

If you can't find the "skip organization selection" setting in Clerk Dashboard, try this:

#### Option A: Disable Organization Selection in Sessions

1. Go to: **Configure → Sessions**
2. Look for: "Organization selection" or "Multi-organization"
3. Try setting it to "Off" or "Disabled"

#### Option B: Check Organization Domains

1. Go to: **Organizations → Settings**
2. Look for: "Organization selection"
3. Ensure it's set to allow custom selection

#### Option C: Contact Clerk Support

If the setting doesn't exist in your Clerk plan, you might need to:
1. Upgrade your Clerk plan (some features are in higher tiers)
2. Or contact Clerk support to enable custom organization selection

---

## What The Code Does (Already Updated)

I've updated your code to force redirection:

1. **`main.tsx`:**
   - Added `signInFallbackRedirectUrl` and `signUpFallbackRedirectUrl`
   - These tell Clerk where to redirect if normal flow fails

2. **`SignIn.tsx` and `SignUp.tsx`:**
   - Added `forceRedirectUrl="/select-organization"`
   - This **forces** Clerk to redirect to your custom page

These code changes work together with the Dashboard configuration to bypass Clerk's UI.

---

## Visual Guide to Clerk Dashboard

### What You're Looking For:

In **Clerk Dashboard → Organizations section**, look for:

```
┌─────────────────────────────────────────┐
│ Organization selection                   │
│                                          │
│ ○ Show organization selection screen    │
│ ● Skip organization selection screen ✓  │  ← Select this!
│                                          │
│ Users will be redirected to your         │
│ custom organization selection page.      │
└─────────────────────────────────────────┘
```

OR

```
┌─────────────────────────────────────────┐
│ Organization selection behavior          │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ Skip organization selection     ▼  │  │  ← Select this!
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

OR

```
┌─────────────────────────────────────────┐
│ Advanced settings                        │
│                                          │
│ ☐ Allow organization selection          │  ← Uncheck this!
└─────────────────────────────────────────┘
```

---

## Troubleshooting

### Still seeing `/sign-in/tasks/choose-organization`?

This URL is Clerk's internal route for organization selection. If you're still seeing it:

1. **Double-check Clerk Dashboard settings** - The "skip organization selection" setting is KEY
2. **Clear ALL browser data** for localhost:4001 (cookies, cache, local storage)
3. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   yarn dev:web
   ```
4. **Try in a completely fresh Incognito/Private browser window**

### Can't find the setting?

Different Clerk pricing plans may have different features available. The setting might be:
- Under "Organizations" → "Settings"
- Under "Organizations" → "Advanced"
- Under "Configure" → "Sessions"
- Under "Configure" → "Organization behavior"

If you truly can't find it, you may need to:
1. Check if your Clerk plan supports custom organization selection
2. Upgrade your plan
3. Contact Clerk support: support@clerk.com

---

## Alternative: Remove Clerk's SignIn Component (Nuclear Option)

If nothing else works, you can build a completely custom sign-in flow without using Clerk's `<SignIn>` component:

1. Use Clerk's hooks: `useSignIn()`, `useSignUp()`
2. Build your own forms
3. Handle authentication manually

This gives you COMPLETE control but requires more work.

**Only do this if:**
- You've tried everything above
- Clerk's UI keeps appearing
- You're willing to build custom forms

---

## Summary

**The root cause:** Clerk has a setting to show its own organization selection screen

**The fix:** Disable that setting in Clerk Dashboard + use `forceRedirectUrl` in code

**Most likely location of setting:** Clerk Dashboard → Configure → Organizations → "Skip organization selection screen"

**After fixing:** Users will see YOUR custom `/select-organization` page instead of Clerk's modal
