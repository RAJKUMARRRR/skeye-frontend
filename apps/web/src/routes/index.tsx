import { RouteObject } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { FeatureRoute } from '../components/FeatureRoute'
import { Login } from '../pages/Login'
import { SignUp } from '../pages/SignUp'
import { ForgotPassword } from '../pages/ForgotPassword'
import { SSOCallback } from '../pages/SSOCallback'
import { SignInPage } from '../pages/auth/SignIn'
import { SignUpPage } from '../pages/auth/SignUp'
import { Profile } from '../pages/Profile'
import { Dashboard } from '../pages/Dashboard'
import { LiveTracking } from '../pages/LiveTracking'
import { Vehicles } from '../pages/Vehicles'
import { VehicleDetail } from '../pages/VehicleDetail'
import { VehicleNew } from '../pages/VehicleNew'
import { VehicleEdit } from '../pages/VehicleEdit'
import { VehicleBulkImport } from '../pages/VehicleBulkImport'
import { Drivers } from '../pages/Drivers'
import { DriverDetail } from '../pages/DriverDetail'
import { TripHistory } from '../pages/TripHistory'
import { Geofences } from '../pages/Geofences'
import { GeofenceNew } from '../pages/GeofenceNew'
import { Maintenance } from '../pages/Maintenance'
import { Routes as RoutesPage } from '../pages/Routes'
import { RoutePlanner } from '../pages/routes/RoutePlanner'
import { LiveMap } from '../pages/routes/LiveMap'
import { RouteHistoryPage } from '../pages/routes/RouteHistoryPage'
import { Alerts } from '../pages/Alerts'
import { AlertRules } from '../pages/alerts/AlertRules'
import { AlertRouting } from '../pages/alerts/AlertRouting'
import { AlertEscalation } from '../pages/alerts/AlertEscalation'
import { AlertHistory } from '../pages/alerts/AlertHistory'
import { AlertMuting } from '../pages/alerts/AlertMuting'
import { AlertQuietHours } from '../pages/alerts/AlertQuietHours'
import { AlertNotifications } from '../pages/alerts/AlertNotifications'
import { Reports } from '../pages/Reports'
import { Analytics } from '../pages/Analytics'
import { Fuel } from '../pages/Fuel'
import { Settings } from '../pages/Settings'
import { OrganizationSettings } from '../pages/settings/Organization'
import { UserManagement } from '../pages/settings/UserManagement'
import { NotificationSettings } from '../pages/settings/NotificationSettings'
import { SecuritySettings } from '../pages/settings/SecuritySettings'
import { AppearanceSettings } from '../pages/settings/AppearanceSettings'
import { Integrations } from '../pages/settings/Integrations'
import { WhiteLabel } from '../pages/settings/WhiteLabel'
import { DebugOrganizations } from '../pages/DebugOrganizations'
import { SelectOrganization } from '../pages/SelectOrganization'

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/sso-callback',
    element: <SSOCallback />,
  },
  {
    path: '/sign-in',
    element: <Login />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/select-organization',
    element: <SelectOrganization />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <FeatureRoute featureKey="dashboard">
            <Dashboard />
          </FeatureRoute>
        ),
      },
      {
        path: 'tracking',
        element: (
          <FeatureRoute featureKey="liveTracking">
            <LiveTracking />
          </FeatureRoute>
        ),
      },
      {
        path: 'vehicles',
        element: (
          <FeatureRoute featureKey="vehicles">
            <Vehicles />
          </FeatureRoute>
        ),
      },
      {
        path: 'vehicles/new',
        element: (
          <FeatureRoute featureKey="vehicles">
            <VehicleNew />
          </FeatureRoute>
        ),
      },
      {
        path: 'vehicles/import',
        element: (
          <FeatureRoute featureKey="vehicles">
            <VehicleBulkImport />
          </FeatureRoute>
        ),
      },
      {
        path: 'vehicles/:id',
        element: (
          <FeatureRoute featureKey="vehicles">
            <VehicleDetail />
          </FeatureRoute>
        ),
      },
      {
        path: 'vehicles/:id/edit',
        element: (
          <FeatureRoute featureKey="vehicles">
            <VehicleEdit />
          </FeatureRoute>
        ),
      },
      {
        path: 'drivers',
        element: (
          <FeatureRoute featureKey="drivers">
            <Drivers />
          </FeatureRoute>
        ),
      },
      {
        path: 'drivers/:id',
        element: (
          <FeatureRoute featureKey="drivers">
            <DriverDetail />
          </FeatureRoute>
        ),
      },
      {
        path: 'trips',
        element: (
          <FeatureRoute featureKey="trips">
            <TripHistory />
          </FeatureRoute>
        ),
      },
      {
        path: 'geofences',
        element: (
          <FeatureRoute featureKey="geofences">
            <Geofences />
          </FeatureRoute>
        ),
      },
      {
        path: 'geofences/new',
        element: (
          <FeatureRoute featureKey="geofences">
            <GeofenceNew />
          </FeatureRoute>
        ),
      },
      {
        path: 'maintenance',
        element: (
          <FeatureRoute featureKey="maintenance">
            <Maintenance />
          </FeatureRoute>
        ),
      },
      {
        path: 'routes',
        element: (
          <FeatureRoute featureKey="routes">
            <RoutesPage />
          </FeatureRoute>
        ),
      },
      {
        path: 'routes/planner',
        element: (
          <FeatureRoute featureKey="routes" subFeatureKey="routePlanner">
            <RoutePlanner />
          </FeatureRoute>
        ),
      },
      {
        path: 'routes/map',
        element: (
          <FeatureRoute featureKey="routes" subFeatureKey="liveMap">
            <LiveMap />
          </FeatureRoute>
        ),
      },
      {
        path: 'routes/history',
        element: (
          <FeatureRoute featureKey="routes" subFeatureKey="routeHistory">
            <RouteHistoryPage />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="alertsDashboard">
            <Alerts />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts/rules',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="rules">
            <AlertRules />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts/routing',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="routing">
            <AlertRouting />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts/escalation',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="escalation">
            <AlertEscalation />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts/history',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="history">
            <AlertHistory />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts/muting',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="muting">
            <AlertMuting />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts/quiet-hours',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="quietHours">
            <AlertQuietHours />
          </FeatureRoute>
        ),
      },
      {
        path: 'alerts/notifications',
        element: (
          <FeatureRoute featureKey="alerts" subFeatureKey="notifications">
            <AlertNotifications />
          </FeatureRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <FeatureRoute featureKey="reports">
            <Reports />
          </FeatureRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <FeatureRoute featureKey="analytics">
            <Analytics />
          </FeatureRoute>
        ),
      },
      {
        path: 'fuel',
        element: (
          <FeatureRoute featureKey="fuel">
            <Fuel />
          </FeatureRoute>
        ),
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: (
          <FeatureRoute featureKey="settings">
            <Settings />
          </FeatureRoute>
        ),
      },
      {
        path: 'settings/organization',
        element: (
          <FeatureRoute featureKey="settings" subFeatureKey="organization">
            <OrganizationSettings />
          </FeatureRoute>
        ),
      },
      {
        path: 'settings/users',
        element: (
          <FeatureRoute featureKey="settings" subFeatureKey="users">
            <UserManagement />
          </FeatureRoute>
        ),
      },
      {
        path: 'settings/notifications',
        element: (
          <FeatureRoute featureKey="settings" subFeatureKey="notifications">
            <NotificationSettings />
          </FeatureRoute>
        ),
      },
      {
        path: 'settings/security',
        element: (
          <FeatureRoute featureKey="settings" subFeatureKey="security">
            <SecuritySettings />
          </FeatureRoute>
        ),
      },
      {
        path: 'settings/appearance',
        element: (
          <FeatureRoute featureKey="settings" subFeatureKey="appearance">
            <AppearanceSettings />
          </FeatureRoute>
        ),
      },
      {
        path: 'settings/integrations',
        element: (
          <FeatureRoute featureKey="settings" subFeatureKey="integrations">
            <Integrations />
          </FeatureRoute>
        ),
      },
      {
        path: 'settings/white-label',
        element: (
          <FeatureRoute featureKey="settings" subFeatureKey="whiteLabel">
            <WhiteLabel />
          </FeatureRoute>
        ),
      },
      {
        path: 'debug/organizations',
        element: <DebugOrganizations />,
      },
    ],
  },
]
