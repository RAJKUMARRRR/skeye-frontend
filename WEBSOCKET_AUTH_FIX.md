# WebSocket Authentication Fix

## Problem
WebSocket connection was failing because it wasn't sending the Clerk authentication token.

## Solution
Updated the WebSocket client to include the Clerk JWT token in the connection URL as a query parameter.

## Changes Made

### 1. Updated WebSocket Client ([packages/api/src/client/websocket.ts](packages/api/src/client/websocket.ts))

**Added Token Management:**
- Added `private authToken: string | null = null` field
- Added `setToken(token: string | null)` method to update the token
- Modified `connect()` to include token in WebSocket URL

**Connection URL Format:**
```
ws://localhost:3000/ws?token=${clerkToken}
```

**Key Changes:**
```typescript
class WebSocketClient {
  private authToken: string | null = null

  setToken(token: string | null): void {
    const tokenChanged = this.authToken !== token
    this.authToken = token

    if (tokenChanged) {
      console.log('[WebSocket] Token updated, reconnecting...')
      // Disconnect and reconnect with new token
      if (this.ws) {
        this.ws.close()
      }
      if (token) {
        this.connect()
      }
    }
  }

  connect(): void {
    if (!this.authToken) {
      console.warn('[WebSocket] No auth token, skipping connection')
      return
    }

    const wsUrl = config.wsUrl.replace('http://', 'ws://').replace('https://', 'wss://')
    const wsUrlWithToken = `${wsUrl}/ws?token=${this.authToken}`

    this.ws = new WebSocket(wsUrlWithToken)
    // ...
  }
}
```

**Removed Auto-Connect:**
- Removed automatic connection on module load
- Now waits for token to be set from AuthContext

### 2. Updated AuthContext ([apps/web/src/features/auth/contexts/AuthContext.tsx](apps/web/src/features/auth/contexts/AuthContext.tsx))

**Added WebSocket Token Sync:**
```typescript
import { wsClient } from '@fleet/api/client/websocket'

// When token is retrieved
if (token) {
  setAuthToken(token)
  wsClient.setToken(token) // ✅ Set token for WebSocket
} else {
  setAuthToken(null)
  wsClient.setToken(null)
}

// When user signs out
setUser(null)
setAuthToken(null)
wsClient.setToken(null) // ✅ Clear WebSocket token
```

## How It Works

1. **User Signs In**
   ```
   AuthContext → getToken() → Clerk JWT
                ↓
   setAuthToken(token) → API Client (axios)
                ↓
   wsClient.setToken(token) → WebSocket Client
                ↓
   WebSocket connects to: ws://localhost:3000/ws?token=eyJ...
   ```

2. **Token Auto-Reconnect**
   - When token changes, WebSocket automatically disconnects and reconnects with new token
   - If token is cleared, WebSocket disconnects and stays disconnected

3. **Backend Validation**
   - Backend extracts `token` from query parameter
   - Validates JWT token with Clerk
   - Extracts `tenant_id` from token
   - Only sends telemetry for devices belonging to that tenant

## Testing

### Check WebSocket Connection in Console:

You should see:
```
[Auth] ✓ Token retrieved: eyJhbGciOiJSUzI1NiIsImtp...
[API Client] Token updated: eyJhbGciOiJSUzI1NiI...
[WebSocket] Token updated, reconnecting...
[WebSocket] Connecting to: ws://localhost:3000/ws
[WebSocket] Connected
```

### Verify Connection URL:

Open browser DevTools → Network → WS tab:
- Look for connection to `ws://localhost:3000/ws?token=...`
- Should show status "101 Switching Protocols"
- Connection should stay open (green indicator)

### Test Real-time Updates:

1. Open Live Tracking page
2. Backend should send telemetry events via WebSocket
3. Map should update in real-time without refreshing

## Backend Requirements

Backend must:
1. Accept WebSocket connections at `/ws` endpoint
2. Extract `token` from query parameter
3. Validate JWT token with Clerk
4. Extract `tenant_id` from token claims
5. Only send telemetry for that tenant's devices

Example backend code:
```javascript
// WebSocket handler
wss.on('connection', async (ws, req) => {
  const url = new URL(req.url, 'http://localhost')
  const token = url.searchParams.get('token')

  if (!token) {
    ws.close(1008, 'Missing token')
    return
  }

  try {
    // Validate with Clerk
    const payload = await clerkClient.verifyToken(token)
    const tenantId = payload.org_id

    // Store tenant ID for filtering telemetry
    ws.tenantId = tenantId

    // Send telemetry only for this tenant
  } catch (error) {
    ws.close(1008, 'Invalid token')
  }
})
```

## Troubleshooting

### WebSocket Not Connecting
Check console for:
- `[WebSocket] No auth token, skipping connection` → Token not set yet, wait for Clerk to load
- `[WebSocket] Connecting to: ws://localhost:3000/ws` → Connection attempt
- `[WebSocket] Connected` → Success!

### Connection Closes Immediately
- Backend rejected the token
- Check backend logs for token validation errors
- Verify Clerk secret key matches

### No Telemetry Received
- Connection is open but no messages
- Check `tenant_id` extraction on backend
- Verify devices belong to the authenticated tenant
- Check backend is publishing telemetry events

## Related Files

- [packages/api/src/client/websocket.ts](packages/api/src/client/websocket.ts) - WebSocket client
- [packages/api/src/client/axios.ts](packages/api/src/client/axios.ts) - HTTP client with token
- [apps/web/src/features/auth/contexts/AuthContext.tsx](apps/web/src/features/auth/contexts/AuthContext.tsx) - Auth management
- [apps/web/src/hooks/useWebSocket.ts](apps/web/src/hooks/useWebSocket.ts) - WebSocket React hooks
