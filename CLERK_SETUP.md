# Clerk Authentication & Organizations Setup

## The Error You're Seeing

```
@clerk/clerk-react: The publishableKey passed to Clerk is invalid.
```

This means your Clerk API keys are not configured yet.

---

## Quick Fix (5 minutes)

### Step 1: Get Your Clerk Keys

1. **Go to** [Clerk Dashboard](https://dashboard.clerk.com)
2. **Sign in** or create a free account
3. **Create a new application** (if you don't have one)
4. **Copy your API keys** from the API Keys section:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

### Step 2: Enable Organizations (Required)

1. In Clerk Dashboard, go to **Settings** → **Features**
2. Enable **Organizations** feature
3. Configure organization settings:
   - Set default role (e.g., "Member")
   - Enable member invitations
   - Configure role permissions:
     - **Admin** - Full access to organization and settings
     - **Manager** - Manage vehicles, drivers, trips
     - **Dispatcher** - View and manage trips, alerts
     - **Driver** - View assigned trips only

### Step 3: Update Environment Variables

**For Web App:**

Edit `apps/web/.env.development`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
yarn dev:web
```

✅ **Done!**

---

## Full Setup Guide

See the instructions in `apps/web/.env.development` for detailed setup steps.

---

## Organization Features

The application now includes full Clerk Organizations support:

### Organization Switcher
- **Location**: Sidebar (top section)
- **Features**: Switch between organizations, create new organizations
- **Access**: All authenticated users

### Organization Settings
- **Location**: Settings → Organization
- **Path**: `/settings/organization`
- **Features**:
  - Update organization profile
  - Manage members and invitations
  - Configure roles and permissions
  - View organization billing (if enabled)

### Role-Based Access Control
The app automatically maps Clerk organization roles to application roles:
- **Admin** → Full admin access
- **Manager** → Manager role (can access settings)
- **Dispatcher** → Dispatcher role
- **Member/Driver** → Driver role

### Organization ID in API Requests
All API requests automatically include:
1. **JWT Token** (Authorization header) - Contains `org_id` claim
2. **X-Organization-Id** header - Explicit organization context

This ensures all data is scoped to the current organization.

---

## Alternative: Use Mock API

If you want to develop without Clerk for now:

Edit `apps/web/.env.development`:
```env
VITE_USE_MOCK_API=true
```

This will bypass authentication during development.

---

## Testing Organizations

### Create a Test Organization
1. Sign in to your app
2. Click the organization switcher in the sidebar
3. Click "Create Organization"
4. Enter organization name and create

### Invite Team Members
1. Go to Settings → Organization
2. Click "Members" tab
3. Click "Invite Member"
4. Enter email and select role
5. Member receives invitation email

### Switch Organizations
1. Click organization switcher in sidebar
2. Select different organization from dropdown
3. App automatically refreshes with new organization context
