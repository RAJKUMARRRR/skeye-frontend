# Feature Flags System

This application uses a comprehensive feature flags system to control which features are visible and accessible to users. Feature flags can be configured via JSON configuration files and overridden with environment variables.

## Configuration Files

### `src/config/features.json`

Main configuration file that defines all available features and their default enabled/disabled state.

```json
{
  "$schema": "./features.schema.json",
  "features": {
    "dashboard": {
      "enabled": true,
      "name": "Dashboard",
      "description": "Main dashboard with KPIs and statistics"
    },
    "routes": {
      "enabled": true,
      "name": "Routes",
      "description": "Route planning and management",
      "subFeatures": {
        "routePlanner": {
          "enabled": true,
          "name": "Route Planner",
          "description": "Plan and optimize routes"
        },
        "liveMap": {
          "enabled": true,
          "name": "Live Map",
          "description": "Real-time route visualization"
        }
      }
    }
  }
}
```

### `src/config/features.schema.json`

JSON Schema that validates the feature flags configuration file. This ensures type safety and prevents configuration errors.

## Environment Variable Overrides

Environment variables can override JSON configuration. This is useful for:
- Enabling/disabling features per environment (dev, staging, production)
- Testing feature toggles without modifying code
- Customer-specific deployments with different feature sets

### Format

```bash
# Main features
VITE_FEATURE_<FEATURE_NAME>=true|false

# Sub-features
VITE_FEATURE_<FEATURE_NAME>_<SUB_FEATURE_NAME>=true|false
```

### Examples

```bash
# Disable dashboard feature
VITE_FEATURE_DASHBOARD=false

# Disable specific route sub-feature
VITE_FEATURE_ROUTES_ROUTE_PLANNER=false

# Disable alerts rules
VITE_FEATURE_ALERTS_RULES=false

# Enable analytics (if disabled in JSON)
VITE_FEATURE_ANALYTICS=true
```

## Available Features

### Main Features

| Feature Key | Name | Description |
|------------|------|-------------|
| `dashboard` | Dashboard | Main dashboard with KPIs and statistics |
| `liveTracking` | Live Tracking | Real-time vehicle tracking on map |
| `vehicles` | Vehicles | Vehicle management |
| `drivers` | Drivers | Driver management |
| `trips` | Trips | Trip history and management |
| `geofences` | Geofences | Geofence creation and management |
| `routes` | Routes | Route planning and management |
| `maintenance` | Maintenance | Vehicle maintenance scheduling and tracking |
| `fuel` | Fuel | Fuel consumption and cost tracking |
| `alerts` | Alerts | Alert management and notifications |
| `reports` | Reports | Generate and view reports |
| `analytics` | Analytics | Advanced analytics and insights |
| `settings` | Settings | Application settings |

### Sub-Features

#### Routes (`routes`)
- `routePlanner` - Route planning and optimization
- `liveMap` - Real-time route visualization
- `routeHistory` - Historical route data

#### Alerts (`alerts`)
- `alertsDashboard` - View all alerts
- `rules` - Configure alert rules
- `routing` - Alert routing configuration
- `escalation` - Alert escalation policies
- `history` - Historical alert data
- `muting` - Mute specific alerts
- `quietHours` - Configure quiet hours
- `notifications` - Notification preferences

#### Settings (`settings`)
- `organization` - Organization settings
- `users` - User management
- `notifications` - Notification settings
- `security` - Security settings
- `appearance` - Appearance customization
- `integrations` - Third-party integrations
- `whiteLabel` - White labeling options

## Usage in Code

### Hook: `useFeatureFlags()`

```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags'

function MyComponent() {
  const {
    isFeatureEnabled,
    isSubFeatureEnabled,
    getEnabledFeatures,
    getEnabledSubFeatures
  } = useFeatureFlags()

  // Check if a main feature is enabled
  if (!isFeatureEnabled('vehicles')) {
    return <div>Vehicles feature is disabled</div>
  }

  // Check if a sub-feature is enabled
  if (!isSubFeatureEnabled('routes', 'routePlanner')) {
    return <div>Route planner is disabled</div>
  }

  // Get all enabled features
  const enabledFeatures = getEnabledFeatures()

  // Get all enabled sub-features for a feature
  const enabledRouteFeatures = getEnabledSubFeatures('routes')

  return <div>Feature content...</div>
}
```

### Component: `<FeatureRoute>`

Protects routes based on feature flags. If a feature is disabled, users are redirected to the home page.

```typescript
import { FeatureRoute } from '@/components/FeatureRoute'

// Protect main feature
<FeatureRoute featureKey="vehicles">
  <Vehicles />
</FeatureRoute>

// Protect sub-feature
<FeatureRoute featureKey="routes" subFeatureKey="routePlanner">
  <RoutePlanner />
</FeatureRoute>

// Custom redirect
<FeatureRoute featureKey="analytics" redirectTo="/dashboard">
  <Analytics />
</FeatureRoute>
```

### Sidebar Integration

The sidebar automatically filters navigation items based on feature flags:

```typescript
// In Sidebar.tsx
const filteredNavigation = useMemo(() => {
  return navigation
    .filter((item) => {
      // Filter by feature flag
      if (item.featureKey && !isFeatureEnabled(item.featureKey)) {
        return false
      }
      return true
    })
    .map((item) => {
      // Filter sub-items
      if (item.subItems && item.featureKey) {
        const filteredSubItems = item.subItems.filter((subItem) => {
          if (!subItem.featureKey) return true
          return isSubFeatureEnabled(item.featureKey!, subItem.featureKey)
        })
        return { ...item, subItems: filteredSubItems }
      }
      return item
    })
}, [isFeatureEnabled, isSubFeatureEnabled])
```

## Hierarchical Feature Flags

Sub-features require their parent feature to be enabled:

```typescript
// Even if routePlanner is enabled in config,
// it will be disabled if routes is disabled
isSubFeatureEnabled('routes', 'routePlanner')
// Returns false if routes.enabled = false
// Returns routes.subFeatures.routePlanner.enabled if routes.enabled = true
```

## Best Practices

### 1. Default to Enabled in Development

In `features.json`, keep most features enabled by default. Disable via environment variables for specific environments.

```json
{
  "features": {
    "newFeature": {
      "enabled": true,  // Enabled in dev
      "name": "New Feature",
      "description": "..."
    }
  }
}
```

```bash
# Production .env
VITE_FEATURE_NEW_FEATURE=false  # Disabled in prod
```

### 2. Use Descriptive Names

Feature keys should be camelCase and descriptive:
- ✅ `routePlanner`, `liveTracking`, `alertsDashboard`
- ❌ `rp`, `track`, `alerts1`

### 3. Add Documentation

Always include `name` and `description` in feature config:

```json
{
  "maintenance": {
    "enabled": true,
    "name": "Maintenance",  // User-friendly name
    "description": "Vehicle maintenance scheduling and tracking"  // What it does
  }
}
```

### 4. Test Both States

When developing a feature, test with the feature both enabled and disabled:

```bash
# Test with feature disabled
VITE_FEATURE_MY_FEATURE=false yarn dev

# Test with feature enabled
VITE_FEATURE_MY_FEATURE=true yarn dev
```

### 5. Gradual Rollout

Use feature flags for gradual rollouts:

```bash
# Staging: Enable new feature
VITE_FEATURE_NEW_ANALYTICS=true

# Production: Keep disabled until testing complete
VITE_FEATURE_NEW_ANALYTICS=false
```

## Deployment Strategies

### Customer-Specific Deployments

Different customers can have different features enabled:

```bash
# Customer A - Full feature set
VITE_FEATURE_WHITE_LABEL=true
VITE_FEATURE_INTEGRATIONS=true

# Customer B - Basic feature set
VITE_FEATURE_WHITE_LABEL=false
VITE_FEATURE_INTEGRATIONS=false
```

### A/B Testing

Enable features for specific user groups:

```typescript
// In your feature component
const { user } = useUser()
const { isFeatureEnabled } = useFeatureFlags()

const shouldShowNewUI = isFeatureEnabled('newAnalytics') && user.betaTester

if (shouldShowNewUI) {
  return <NewAnalyticsDashboard />
}
return <OldAnalyticsDashboard />
```

### Progressive Enhancement

Enable features as they're completed:

```json
{
  "features": {
    "advancedReporting": {
      "enabled": true,
      "subFeatures": {
        "customReports": { "enabled": true },      // ✅ Complete
        "scheduledReports": { "enabled": true },   // ✅ Complete
        "exportToPDF": { "enabled": false },       // 🚧 In progress
        "aiInsights": { "enabled": false }         // 📋 Planned
      }
    }
  }
}
```

## Troubleshooting

### Feature not appearing in sidebar

1. Check JSON config: `src/config/features.json`
2. Check environment variables: `.env.local`
3. Verify feature key matches exactly (case-sensitive)
4. Check parent feature is enabled (for sub-features)
5. Clear browser cache and restart dev server

### Environment variable not working

1. Verify format: `VITE_FEATURE_<NAME>=true`
2. Restart dev server (environment variables are loaded at build time)
3. Check `.env.local` file exists and is in correct location
4. Verify no typos in feature name (case-sensitive)

### Route redirecting when it shouldn't

1. Check `FeatureRoute` has correct `featureKey` prop
2. Verify parent feature is enabled (for sub-features)
3. Check environment variables aren't overriding JSON config
4. Use `getEnabledFeatures()` to debug which features are enabled

## Migration Guide

If you have existing code without feature flags:

1. Add feature key to sidebar navigation item:
```typescript
// Before
{ name: 'Reports', path: '/reports', icon: FileText }

// After
{ name: 'Reports', path: '/reports', icon: FileText, featureKey: 'reports' }
```

2. Wrap route with `FeatureRoute`:
```typescript
// Before
<Route path="reports" element={<Reports />} />

// After
<Route
  path="reports"
  element={
    <FeatureRoute featureKey="reports">
      <Reports />
    </FeatureRoute>
  }
/>
```

3. Add feature to `features.json`:
```json
{
  "reports": {
    "enabled": true,
    "name": "Reports",
    "description": "Generate and view reports"
  }
}
```

## Type Safety

The feature flags system is fully type-safe:

```typescript
import type { FeatureKey } from '@/types/features'

// ✅ Valid feature keys (autocomplete works!)
const key: FeatureKey = 'dashboard'
const key: FeatureKey = 'routes'

// ❌ TypeScript error - invalid key
const key: FeatureKey = 'invalid'

// ✅ Type-safe hook usage
const { isFeatureEnabled } = useFeatureFlags()
isFeatureEnabled('dashboard')  // ✅ Valid
isFeatureEnabled('invalid')    // ❌ TypeScript error
```
