# Test Authentication in Browser Console

Open the browser console (F12) and run these commands to diagnose the 401 issue:

## Step 1: Check Clerk User
```javascript
console.log('Clerk loaded:', !!window.Clerk)
console.log('User:', window.Clerk?.user)
console.log('Session:', window.Clerk?.session)
```

Expected: Should show user object and session

## Step 2: Get Token Manually
```javascript
const token = await window.Clerk?.session?.getToken()
console.log('Token:', token)
console.log('Token length:', token?.length)
console.log('First 50 chars:', token?.substring(0, 50))
```

Expected: Should return a JWT token (long string starting with "eyJ...")

## Step 3: Decode Token
```javascript
// Copy the token and go to https://jwt.io
// Or decode in console:
const token = await window.Clerk?.session?.getToken()
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Token payload:', payload)
console.log('Has org_id:', !!payload.org_id)
console.log('Expiry:', new Date(payload.exp * 1000))
```

Expected: Should show token claims including user ID, org ID, expiry

## Step 4: Test API Request Manually
```javascript
const token = await window.Clerk?.session?.getToken()

const response = await fetch('http://localhost:3000/api/v1/devices', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

console.log('Status:', response.status)
console.log('Status Text:', response.statusText)

if (response.ok) {
  const data = await response.json()
  console.log('Success! Data:', data)
} else {
  const error = await response.text()
  console.log('Error:', error)
}
```

Expected:
- 200 OK with device data = Backend is working, frontend axios setup is the issue
- 401 Unauthorized = Token problem or backend Clerk config issue

## Step 5: Check Current Token in App
```javascript
// This checks what token is currently set in the app
import { getAuthToken } from '@fleet/api'

// Run this in console (won't work directly, but can add to a component)
// Or check the logs - look for "[API Client] Token updated"
```

## Step 6: Force Token Refresh
```javascript
// Force re-authentication
const token = await window.Clerk?.session?.getToken({ skipCache: true })
console.log('Fresh token:', token?.substring(0, 50))

// Then manually call setAuthToken (if available in window scope)
```

## What the Logs Should Show

When you load the page, you should see in console:

1. `[Config] API URL: http://localhost:3000`
2. `[Auth] Sync triggered - isLoaded: true isSignedIn: true`
3. `[Auth] Fetching token from Clerk...`
4. `[Auth] ✓ Token retrieved: eyJhbGciOiJSUzI1NiIsImtpZCI...`
5. `[API Client] Token updated: eyJhbGciOiJSUzI1NiI...`
6. `[Auth] User mapped: user@example.com`
7. `[API Client] Request to: /api/v1/devices - Auth header set ✓`

If you see:
- `[Auth] ✗ Token is null/undefined!` → Clerk is not returning a token
- `[API Client] ⚠️ Request to: /api/v1/devices - NO AUTH TOKEN!` → Token not being set in axios

## Common Issues

### Issue: "Cannot read property 'getToken' of null"
**Fix:** You're not signed in. Go to `/login` and sign in with Clerk

### Issue: Token retrieved but still 401
**Fix:** Backend Clerk secret key doesn't match. Check:
1. Backend `.env` has `CLERK_SECRET_KEY=sk_test_...`
2. Frontend `.env.development` has matching `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`
3. Both from the same Clerk application

### Issue: Token not being retrieved at all
**Fix:** Check Clerk configuration in `apps/web/src/main.tsx`:
```typescript
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
```

Make sure the key is valid and starts with `pk_test_` or `pk_live_`
