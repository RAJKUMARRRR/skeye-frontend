# Debug Authentication 401 Error

## Step 1: Check if User is Signed In

Open browser console and run:
```javascript
window.Clerk.user
```

You should see a user object. If `null`, you're not signed in.

## Step 2: Get the Clerk Token

In browser console:
```javascript
const token = await window.Clerk.session.getToken()
console.log('Token:', token)
```

Copy this token and decode it at https://jwt.io to verify:
- It has the correct claims
- It's not expired
- It has `org_id` or tenant information

## Step 3: Check Network Request

1. Open DevTools → Network tab
2. Reload the page to trigger API call to `/api/v1/devices`
3. Click on the `/devices` request
4. Check **Request Headers** section
5. Verify there's an `Authorization: Bearer <token>` header

If missing, the token is not being set in axios.

## Step 4: Manual Test

In browser console, test the API directly:
```javascript
const response = await fetch('http://localhost:3000/api/v1/devices', {
  headers: {
    'Authorization': `Bearer ${await window.Clerk.session.getToken()}`,
    'Content-Type': 'application/json'
  }
})
const data = await response.json()
console.log('Status:', response.status)
console.log('Data:', data)
```

If this returns 200 OK, the token works but our axios setup has an issue.
If this returns 401, the backend Clerk configuration is wrong.

## Common Fixes

### Fix 1: Backend Clerk Secret Mismatch
Backend `.env` must have:
```env
CLERK_SECRET_KEY=sk_test_...
```

This secret key must match the publishable key's Clerk instance:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Both should be from the same Clerk application.

### Fix 2: Token Template Issue
Backend might expect a specific Clerk token template. Check backend code for:
```javascript
clerkMiddleware({
  template: 'your-template-name'
})
```

If backend uses a custom template, update frontend:
```typescript
const token = await getToken({ template: 'your-template-name' })
```

### Fix 3: Organization/Tenant ID Missing
If backend expects `org_id` in token, ensure:
1. User is part of a Clerk organization
2. Organization ID is included in the JWT

Run in console:
```javascript
const token = await window.Clerk.session.getToken()
// Decode at jwt.io and check for org_id claim
```

## Next Steps After Debugging

Report in console:
1. User signed in: Yes/No
2. Token retrieved: Yes/No (first 20 chars)
3. Authorization header present: Yes/No
4. Response status: 401/200/etc
5. Error message from response (if any)
