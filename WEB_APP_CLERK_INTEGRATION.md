# Web App Clerk Integration - Complete

## ✅ What Was Fixed

The web app wasn't redirecting to Clerk because it was using the old mock authentication system. I've integrated Clerk with the existing `AuthContext` to make it work seamlessly.

## Changes Made

### 1. Updated AuthContext to Use Clerk
**File: `apps/web/src/features/auth/contexts/AuthContext.tsx`**

- ✅ Imported Clerk hooks: `useAuth` (as `useClerkAuth`) and `useUser`
- ✅ Maps Clerk user to the app's User interface
- ✅ Uses Clerk's `isSignedIn` and `isLoaded` states
- ✅ `isAuthenticated` now comes from Clerk, not localStorage
- ✅ `isLoading` now comes from Clerk's loading state

### 2. Updated ProtectedRoute Redirect
**File: `apps/web/src/features/auth/components/ProtectedRoute.tsx`**

- Changed redirect from `/login` → `/sign-in`
- Now redirects unauthenticated users to Clerk's sign-in page

## How It Works Now

1. **User visits protected route** (e.g., `/`, `/dashboard`, `/vehicles`)
2. **ProtectedRoute checks** `isAuthenticated` from AuthContext
3. **AuthContext uses Clerk** to determine if user is signed in
4. **If not authenticated** → Redirects to `/sign-in` (Clerk's page)
5. **After Clerk sign-in** → User is redirected back to dashboard
6. **User data is mapped** from Clerk to your app's User interface

## User Data Mapping

Clerk user → App User:
```typescript
{
  id: clerkUser.id,
  email: clerkUser.primaryEmailAddress?.emailAddress,
  name: clerkUser.fullName || clerkUser.firstName,
  role: 'admin', // Default - customize via Clerk metadata
  organizationId: 'org-1', // Default - customize via Clerk metadata
}
```

## Testing the Integration

1. **Start the web app:**
   ```bash
   cd apps/web
   yarn dev
   ```

2. **Visit:** http://localhost:3001

3. **Expected behavior:**
   - App redirects to `/sign-in`
   - Shows Clerk's sign-in component
   - After sign-in → Redirects to `/dashboard`

## Setting Up Clerk Keys

Create `apps/web/.env` file:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=http://localhost:8000
```

Get your Clerk keys from: https://dashboard.clerk.com → API Keys

## Customizing User Roles

To assign roles based on Clerk metadata, update `AuthContext.tsx`:

```typescript
// In the useEffect where we map Clerk user
const mappedUser: User = {
  id: clerkUser.id,
  email: clerkUser.primaryEmailAddress?.emailAddress || '',
  name: clerkUser.fullName || clerkUser.firstName || 'User',
  // Get role from Clerk public metadata
  role: (clerkUser.publicMetadata?.role as User['role']) || 'admin',
  // Get org from Clerk organization ID
  organizationId: clerkUser.publicMetadata?.organizationId || 'org-1',
}
```

Then in Clerk Dashboard, set user metadata:
```json
{
  "role": "admin",
  "organizationId": "org-123"
}
```

## What About the Old Login Page?

The old `/login` page still exists in routes but won't be used. You can:

**Option 1: Keep it** (for backward compatibility)
- It will redirect to `/sign-in` anyway

**Option 2: Remove it** (clean up)
- Delete `apps/web/src/pages/Login.tsx`
- Remove `/login` route from `routes/index.tsx`

## Summary

✅ Web app now uses Clerk for authentication
✅ Seamless integration with existing AuthContext
✅ Protected routes redirect to Clerk sign-in
✅ User data properly mapped from Clerk
✅ Ready to use once you add Clerk API keys

No breaking changes to the rest of your app - all components using `useAuth()` will work exactly as before!
