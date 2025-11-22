import { RouteObject } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
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
import { OrganizationSettings } from '../pages/settings/OrganizationSettings'
import { UserManagement } from '../pages/settings/UserManagement'
import { NotificationSettings } from '../pages/settings/NotificationSettings'
import { SecuritySettings } from '../pages/settings/SecuritySettings'
import { AppearanceSettings } from '../pages/settings/AppearanceSettings'
import { Integrations } from '../pages/settings/Integrations'
import { WhiteLabel } from '../pages/settings/WhiteLabel'

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
    path: '/sign-in/*',
    element: <SignInPage />,
  },
  {
    path: '/sign-up/*',
    element: <SignUpPage />,
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
        element: <Dashboard />,
      },
      {
        path: 'tracking',
        element: <LiveTracking />,
      },
      {
        path: 'vehicles',
        element: <Vehicles />,
      },
      {
        path: 'vehicles/new',
        element: <VehicleNew />,
      },
      {
        path: 'vehicles/import',
        element: <VehicleBulkImport />,
      },
      {
        path: 'vehicles/:id',
        element: <VehicleDetail />,
      },
      {
        path: 'vehicles/:id/edit',
        element: <VehicleEdit />,
      },
      {
        path: 'drivers',
        element: <Drivers />,
      },
      {
        path: 'drivers/:id',
        element: <DriverDetail />,
      },
      {
        path: 'trips',
        element: <TripHistory />,
      },
      {
        path: 'geofences',
        element: <Geofences />,
      },
      {
        path: 'geofences/new',
        element: <GeofenceNew />,
      },
      {
        path: 'maintenance',
        element: <Maintenance />,
      },
      {
        path: 'routes',
        element: <RoutesPage />,
      },
      {
        path: 'routes/planner',
        element: <RoutePlanner />,
      },
      {
        path: 'routes/map',
        element: <LiveMap />,
      },
      {
        path: 'routes/history',
        element: <RouteHistoryPage />,
      },
      {
        path: 'alerts',
        element: <Alerts />,
      },
      {
        path: 'alerts/rules',
        element: <AlertRules />,
      },
      {
        path: 'alerts/routing',
        element: <AlertRouting />,
      },
      {
        path: 'alerts/escalation',
        element: <AlertEscalation />,
      },
      {
        path: 'alerts/history',
        element: <AlertHistory />,
      },
      {
        path: 'alerts/muting',
        element: <AlertMuting />,
      },
      {
        path: 'alerts/quiet-hours',
        element: <AlertQuietHours />,
      },
      {
        path: 'alerts/notifications',
        element: <AlertNotifications />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'fuel',
        element: <Fuel />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'settings/organization',
        element: <OrganizationSettings />,
      },
      {
        path: 'settings/users',
        element: <UserManagement />,
      },
      {
        path: 'settings/notifications',
        element: <NotificationSettings />,
      },
      {
        path: 'settings/security',
        element: <SecuritySettings />,
      },
      {
        path: 'settings/appearance',
        element: <AppearanceSettings />,
      },
      {
        path: 'settings/integrations',
        element: <Integrations />,
      },
      {
        path: 'settings/white-label',
        element: <WhiteLabel />,
      },
    ],
  },
]
