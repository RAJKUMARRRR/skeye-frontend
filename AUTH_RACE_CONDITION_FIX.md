# Authentication Race Condition Fix

## Problem

When loading the vehicles page (`http://localhost:4001/vehicles`), API requests were firing **before** the Clerk authentication token was retrieved, causing **401 Unauthorized** errors.

## Console Logs Showing the Issue

```
[Auth] Sync triggered - isLoaded: true isSignedIn: true
[Auth] Fetching token from Clerk...
[API Client] ⚠️ Request to: /api/v1/devices - NO AUTH TOKEN!
[API Client] Token value is: null
❌ GET http://localhost:3000/api/v1/devices 401 (Unauthorized)
[Auth] ✓ Token retrieved: eyJhbGciOiJSUzI1NiI...
[API Client] Token updated: eyJhbGciOiJSUzI1NiIs...
```

**The Problem**: `isAuthenticated` was set to `true` as soon as Clerk's `isSignedIn` became true, but the JWT token wasn't retrieved yet. React Query saw `isAuthenticated = true` and fired the request immediately without waiting for the token.

## Root Cause

The AuthContext was using Clerk's `isSignedIn` directly for `isAuthenticated`:

```typescript
// ❌ WRONG - Token not ready yet!
isAuthenticated: isSignedIn || false
```

The authentication flow was:
1. Clerk loads → `isSignedIn = true` → `isAuthenticated = true` (immediately)
2. React Query sees `isAuthenticated = true` → fires request (no token yet!) → **401 error**
3. `getToken()` resolves asynchronously → token set (too late)
4. React Query retries → keeps failing because token still wasn't set when enabled check passed

## Solution

**Two-part fix:**

### Part 1: Track Token Readiness in AuthContext

Added `isTokenReady` state that only becomes `true` AFTER the JWT token is successfully retrieved:

**[apps/web/src/features/auth/contexts/AuthContext.tsx](apps/web/src/features/auth/contexts/AuthContext.tsx)**

**Before (WRONG):**
```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useClerkAuth()

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isSignedIn || false, // ❌ True before token is ready!
        isLoading: !isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
```

**After (CORRECT):**
```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, getToken } = useClerkAuth()
  const [isTokenReady, setIsTokenReady] = useState(false)

  useEffect(() => {
    async function syncAuthToken() {
      if (isLoaded && isSignedIn && clerkUser) {
        const token = await getToken()
        if (token) {
          setAuthToken(token)
          setIsTokenReady(true) // ✅ Only true when token is set
        }
      } else {
        setIsTokenReady(false)
      }
    }
    syncAuthToken()
  }, [isLoaded, isSignedIn, clerkUser, getToken])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isTokenReady, // ✅ Only true when token is ready
        isLoading: !isLoaded || (isSignedIn && !isTokenReady), // ✅ Loading until token ready
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
```

### Part 2: Add Auth Guards to React Query Hooks

**[apps/web/src/hooks/useVehicles.ts](apps/web/src/hooks/useVehicles.ts)**

```typescript
export function useVehicles() {
  const { isAuthenticated, isLoading } = useAuth()

  return useQuery({
    queryKey: ['vehicles'],
    queryFn: getDevices,
    enabled: isAuthenticated && !isLoading, // ✅ Wait for token
  })
}
```

## Files Updated

### 1. [apps/web/src/features/auth/contexts/AuthContext.tsx](apps/web/src/features/auth/contexts/AuthContext.tsx)
- Added `isTokenReady` state
- Changed `isAuthenticated` to use `isTokenReady` instead of `isSignedIn`
- Updated `isLoading` to include token retrieval state

### 2. [apps/web/src/hooks/useVehicles.ts](apps/web/src/hooks/useVehicles.ts)
- `useVehicles()` - Get all vehicles
- `useVehicle(id)` - Get single vehicle
- `useVehicleLocation(vehicleId)` - Get vehicle location

### 3. [apps/web/src/hooks/useTelemetry.ts](apps/web/src/hooks/useTelemetry.ts)
- `useLatestTelemetry()` - Get latest telemetry for all devices
- `useDeviceTelemetry(deviceId, params)` - Get device telemetry history
- `useDeviceStats(deviceId, period)` - Get device statistics

### 4. [apps/web/src/hooks/useDrivers.ts](apps/web/src/hooks/useDrivers.ts)
- `useDrivers()` - Get all drivers
- `useDriver(id)` - Get single driver
- `useDriverTrips(driverId)` - Get driver trips

### 5. [apps/web/src/hooks/useAlerts.ts](apps/web/src/hooks/useAlerts.ts)
- `useAlerts(filters)` - Get filtered alerts
- `useAlert(id)` - Get single alert

## How It Works Now

**Correct Flow:**
1. Component mounts
2. `isLoaded = false` → `isLoading = true` → queries disabled
3. Clerk finishes loading → `isLoaded = true`, `isSignedIn = true`
4. `isTokenReady = false` → `isLoading = true` → **queries still disabled**
5. `getToken()` starts → `[Auth] Fetching token from Clerk...`
6. Token retrieved → `setAuthToken(token)` → `setIsTokenReady(true)`
7. `isAuthenticated = true`, `isLoading = false` → **queries enabled**
8. React Query fires requests **with token** → Success!

## Console Logs After Fix

```
[Auth] Sync triggered - isLoaded: true isSignedIn: true
[Auth] Fetching token from Clerk...
[Auth] ✓ Token retrieved: eyJhbGciOiJSUzI1NiI...
[API Client] Token updated: eyJhbGciOiJSUzI1NiIs...
[WebSocket] Token updated, reconnecting...
[Auth] User mapped: raj@skeye.io
[API Client] Request to: /api/v1/devices - Auth header set ✓
✅ GET http://localhost:3000/api/v1/devices 200 (OK)
```

**No more "NO AUTH TOKEN" warnings!**

## Testing

### Test the Fix:
1. Clear browser cache and reload
2. Navigate to `http://localhost:4001/vehicles`
3. Open DevTools → Console
4. You should see:
   - `[Auth] Fetching token from Clerk...`
   - `[Auth] ✓ Token retrieved: ...`
   - `[API Client] Request to: /api/v1/devices - Auth header set ✓`
   - **No 401 errors!**

### Verify Authentication Flow:
1. Sign out
2. Sign in again
3. Navigate to vehicles page
4. Verify no 401 errors in console

## Pattern for Future Hooks

When creating new hooks that make authenticated API requests:

```typescript
import { useAuth } from '../features/auth/contexts/AuthContext'

export function useMyData() {
  const { isAuthenticated, isLoading } = useAuth()

  return useQuery({
    queryKey: ['my-data'],
    queryFn: getMyData,
    enabled: isAuthenticated && !isLoading, // ✅ Always add this
  })
}
```

## Related Files

- [apps/web/src/features/auth/contexts/AuthContext.tsx](apps/web/src/features/auth/contexts/AuthContext.tsx) - Provides `useAuth` hook
- [packages/api/src/client/axios.ts](packages/api/src/client/axios.ts) - HTTP client with token interceptor
- [packages/api/src/services/devices.ts](packages/api/src/services/devices.ts) - Device API service

## Summary

✅ **Fixed**: Race condition where API requests fired before token was available
✅ **Solution**: Added `enabled: isAuthenticated && !isLoading` to all query hooks
✅ **Result**: API requests now wait for Clerk authentication to complete before firing
✅ **No more 401 errors** on page load!
