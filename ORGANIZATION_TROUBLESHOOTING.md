# Organization Feature Troubleshooting

## Issue: Can't see created organizations

If you're unable to see organizations in the switcher, follow these steps:

### 1. Check Clerk Dashboard Configuration

**MOST COMMON ISSUE**: Organizations feature not enabled in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Configure** → **Features**
4. Find **Organizations** section
5. **Enable Organizations feature**
6. Configure settings:
   - Enable "Allow users to create organizations"
   - Set default role (e.g., "Member")
   - Enable member invitations

### 2. Verify Organizations Are Created

Visit the debug page to see detailed organization information:

```
http://localhost:4001/debug/organizations
```

This page shows:
- Current user information
- Active organization
- Full list of organizations
- Ability to create a test organization
- Detailed error messages

### 3. Check Browser Console

Open browser developer tools (F12) and look for:

```javascript
[OrgSwitcher] Organizations loaded: X
[OrgSwitcher] Organization list: [...]
```

Common errors to look for:
- `Organizations feature is not enabled`
- `Missing permissions`
- `Invalid API key`

### 4. Restart Development Server

After enabling organizations in Clerk Dashboard:

```bash
# Stop the dev server (Ctrl+C)
yarn dev:web
```

### 5. Clear Browser Cache

Sometimes Clerk's cached data can cause issues:

1. Open DevTools (F12)
2. Go to Application tab
3. Clear Site Data
4. Refresh the page

### 6. Verify Environment Variables

Check `apps/web/.env.development`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Make sure:
- Key is not a placeholder
- Key starts with `pk_test_` (development) or `pk_live_` (production)
- No extra spaces or quotes

## Testing Organization Features

### Create an Organization

1. Click the organization switcher in the sidebar
2. Click "Create Organization"
3. Enter organization name
4. Click "Create"
5. Page will reload with new organization active

### Switch Organizations

1. Click the organization switcher
2. Select organization from dropdown
3. App refreshes with new organization context

### Manage Organization

1. Go to **Settings** → **Organization**
2. Tabs available:
   - **General**: Update name, logo, view details
   - **Members**: Invite members, manage roles, remove members
   - **Settings**: Permissions, delete organization

## Organization Switcher Location

The organization switcher appears in the **sidebar**, below the logo section.

## API Integration

All API requests automatically include:
1. **Authorization header**: `Bearer {JWT_TOKEN}` (contains org_id)
2. **X-Organization-Id header**: Explicit organization ID

Check browser Network tab to verify headers are being sent.

## Common Issues & Solutions

### Issue: "Please enable organizations in Clerk Dashboard"
**Solution**: Enable Organizations feature in Clerk Dashboard → Configure → Features

### Issue: Organizations not appearing after creation
**Solution**:
1. Check browser console for errors
2. Verify organization was created in Clerk Dashboard
3. Try refreshing the page
4. Check the debug page

### Issue: "Only admins can..." messages
**Solution**:
- Check your role in the organization
- You must be an admin to manage settings
- Organization creator is automatically an admin

### Issue: Members can't see organization
**Solution**:
- Verify member accepted the invitation
- Check member's role in Clerk Dashboard
- Ensure member is signed in to the correct account

## Clerk Dashboard Links

- **Main Dashboard**: https://dashboard.clerk.com
- **Organizations Settings**: Dashboard → Configure → Features → Organizations
- **View Organizations**: Dashboard → Organizations tab
- **View Members**: Dashboard → Organizations → Select Org → Members

## Need More Help?

1. Visit the debug page: `/debug/organizations`
2. Check browser console logs
3. Verify Clerk Dashboard settings
4. Check `CLERK_SETUP.md` for initial setup instructions

## Files Modified for Organizations

- `apps/web/src/components/OrganizationSwitcher.tsx` - Custom switcher UI
- `apps/web/src/pages/settings/Organization.tsx` - Organization management page
- `apps/web/src/features/auth/contexts/AuthContext.tsx` - Organization context
- `packages/api/src/client/axios.ts` - Organization ID in requests
- `apps/web/src/components/layouts/Sidebar.tsx` - Switcher in sidebar

## Debug Console Commands

Open browser console and run:

```javascript
// Check current organization
console.log(window.__clerk_organization)

// Check all organizations
console.log(window.__clerk_organizations)

// Force refresh organizations
window.location.reload()
```
