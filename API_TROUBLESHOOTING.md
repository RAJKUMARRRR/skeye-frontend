# API Troubleshooting Guide

## Quick Checklist

### 1. Is the Backend Running?

```bash
# Check if something is running on port 3000
lsof -ti:3000

# If nothing, start your backend
cd /path/to/backend
npm start  # or whatever command starts your backend
```

### 2. Test Backend Directly

```bash
# Test if backend is responding
curl http://localhost:3000/health

# Test devices endpoint (without auth)
curl http://localhost:3000/api/devices

# Test with Clerk token (get token from browser DevTools)
curl http://localhost:3000/api/devices \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN_HERE"
```

### 3. Check CORS Settings

Backend must allow requests from `http://localhost:4001`

**Backend CORS config should include:**
```javascript
cors({
  origin: ['http://localhost:4001', 'http://localhost:4000'],
  credentials: true
})
```

### 4. Check Clerk Configuration

**Backend needs:**
- Same Clerk app/organization
- `CLERK_SECRET_KEY` environment variable
- Token validation middleware

**Frontend has:**
- `VITE_CLERK_PUBLISHABLE_KEY` in `.env.development`
- User is signed in

### 5. Common Error Codes

| Status | Meaning | Solution |
|--------|---------|----------|
| **404** | Endpoint not found | Check backend routes, verify `/api/devices` exists |
| **401** | Unauthorized | Check Clerk token, verify backend Clerk config |
| **403** | Forbidden | Check tenant_id, verify user permissions |
| **500** | Server error | Check backend logs |
| **CORS** | CORS error | Add `http://localhost:4001` to backend CORS |

## Debugging Steps

### Step 1: Verify Backend Routes

```bash
# If your backend has a route listing endpoint
curl http://localhost:3000/api/routes

# Or check backend source code for routes
# Look for: app.get('/api/devices', ...)
```

### Step 2: Check Frontend Network Tab

1. Open Chrome DevTools → Network tab
2. Reload page
3. Look for `/api/devices` request
4. Click on it and check:
   - **Request Headers:** Should have `Authorization: Bearer ...`
   - **Response:** What error message?
   - **Status:** What code?

### Step 3: Check Console Errors

Browser Console should show:
- WebSocket connection status
- Any API errors
- Clerk authentication status

### Step 4: Verify Clerk Token

```javascript
// In browser console:
const { getToken } = window.Clerk;
const token = await getToken();
console.log('Token:', token);

// Decode token (copy token and paste in jwt.io)
// Check: Does it have org_id/tenant_id?
```

## Common Issues & Fixes

### Issue: "Failed to fetch"

**Cause:** Backend not running or wrong port

**Fix:**
```bash
# Check backend is running
lsof -ti:3000

# Start backend if not running
```

### Issue: 404 Not Found

**Cause:** Backend routes are different

**Fix:** Check backend route definitions. Routes might be:
- `/devices` (no `/api` prefix)
- `/api/v1/devices`
- Something else

Update service files accordingly.

### Issue: 401 Unauthorized

**Cause:** Clerk token not sent or invalid

**Fix:**
1. Check user is signed in: `window.Clerk.user`
2. Check token is being sent in Authorization header
3. Verify backend Clerk secret key matches frontend publishable key

### Issue: CORS Error

**Cause:** Backend not allowing `http://localhost:4001`

**Fix:** Update backend CORS config:
```javascript
// Express example
app.use(cors({
  origin: ['http://localhost:4001', 'http://localhost:4000'],
  credentials: true
}));
```

### Issue: Empty Response `[]`

**Cause:** No devices in database for your tenant

**Fix:**
1. Check if you have devices in backend database
2. Verify tenant_id matches between frontend and backend
3. Try creating a device via API

## Testing Without Authentication

If you want to test API without Clerk first:

**1. Temporarily disable auth in backend**
```javascript
// Comment out auth middleware
// app.use('/api', authMiddleware);
app.use('/api', (req, res, next) => {
  req.tenant_id = 'test-tenant-id';
  next();
});
```

**2. Test endpoints**
```bash
curl http://localhost:3000/api/devices
```

**3. Re-enable auth when working**

## Verify Integration

### Frontend Checklist:
- [x] `VITE_API_URL=http://localhost:3000` in `.env.development`
- [x] Services call `/api/devices` (with `/api` prefix)
- [x] Axios interceptor adds `Authorization: Bearer` header
- [x] User is signed in with Clerk
- [x] Token synced via `setAuthToken()`

### Backend Checklist:
- [ ] Running on port 3000
- [ ] Routes defined at `/api/devices`, `/api/telemetry`, etc.
- [ ] CORS allows `http://localhost:4001`
- [ ] Clerk middleware validates tokens
- [ ] Extracts `tenant_id` from token
- [ ] Database queries filtered by `tenant_id`

## Still Not Working?

### Get More Info:

```bash
# Backend logs - what does backend show when you make request?

# Network tab - copy the request as cURL:
# Right-click on request → Copy → Copy as cURL

# Run it in terminal to see raw response
```

### Check Backend Logs

When you load the Vehicles page, backend should log:
```
GET /api/devices - 200 OK
Token: eyJ...
Tenant: 018d8b3a-0000-7000-8000-000000000001
Returned 5 devices
```

If backend shows nothing, request isn't reaching backend.

## Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

echo "Testing API Integration..."

# Test 1: Backend health
echo -e "\n1. Testing backend health..."
curl -s http://localhost:3000/health || echo "❌ Backend not responding"

# Test 2: Devices endpoint
echo -e "\n\n2. Testing devices endpoint..."
curl -s http://localhost:3000/api/devices || echo "❌ Devices endpoint failed"

# Test 3: CORS
echo -e "\n\n3. Testing CORS..."
curl -s -H "Origin: http://localhost:4001" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:3000/api/devices

echo -e "\n\nTests complete!"
```

Run with: `bash test-api.sh`

---

**Need Help?**

Share the following for debugging:
1. Status code from Network tab
2. Response body (if any)
3. Request headers (especially Authorization)
4. Backend logs when request is made
5. Browser console errors
