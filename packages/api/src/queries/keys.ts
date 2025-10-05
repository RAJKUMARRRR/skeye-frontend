import type { VehicleFilters, DriverFilters, TripFilters } from '../types'

export const queryKeys = {
  // Organizations
  organizations: ['organizations'] as const,
  organization: (id: string) => ['organization', id] as const,

  // Users
  users: (filters?: Record<string, unknown>) => ['users', filters] as const,
  user: (id: string) => ['user', id] as const,

  // Devices
  devices: (filters?: Record<string, unknown>) => ['devices', filters] as const,
  device: (id: string) => ['device', id] as const,
  deviceHealth: (id: string) => ['device-health', id] as const,

  // Vehicles
  vehicles: (filters?: VehicleFilters) => ['vehicles', filters] as const,
  vehicle: (id: string) => ['vehicle', id] as const,
  vehicleLocations: (ids?: string[]) => ['vehicle-locations', ids] as const,
  vehicleLocation: (id: string) => ['vehicle-location', id] as const,
  vehicleTelemetry: (id: string) => ['vehicle-telemetry', id] as const,
  vehicleTrips: (id: string) => ['vehicle-trips', id] as const,

  // Drivers
  drivers: (filters?: DriverFilters) => ['drivers', filters] as const,
  driver: (id: string) => ['driver', id] as const,
  driverScorecard: (id: string, period?: { start: string; end: string }) =>
    ['driver-scorecard', id, period] as const,
  driverBehaviorEvents: (id: string) => ['driver-behavior-events', id] as const,

  // Trips
  trips: (filters?: TripFilters) => ['trips', filters] as const,
  trip: (id: string) => ['trip', id] as const,
  tripPlayback: (id: string) => ['trip-playback', id] as const,

  // Geofences
  geofences: (filters?: Record<string, unknown>) => ['geofences', filters] as const,
  geofence: (id: string) => ['geofence', id] as const,
  geofenceEvents: (id: string) => ['geofence-events', id] as const,

  // Alerts
  alerts: (filters?: Record<string, unknown>) => ['alerts', filters] as const,
  alert: (id: string) => ['alert', id] as const,
  alertRules: ['alert-rules'] as const,
  alertRule: (id: string) => ['alert-rule', id] as const,

  // Maintenance
  maintenance: (filters?: Record<string, unknown>) => ['maintenance', filters] as const,
  maintenanceRecord: (id: string) => ['maintenance-record', id] as const,
  maintenanceSchedules: (vehicleId?: string) => ['maintenance-schedules', vehicleId] as const,
  predictiveMaintenance: (vehicleId?: string) =>
    ['predictive-maintenance', vehicleId] as const,

  // Routes
  routes: (filters?: Record<string, unknown>) => ['routes', filters] as const,
  route: (id: string) => ['route', id] as const,
  routeTemplates: ['route-templates'] as const,
  routeProgress: (id: string) => ['route-progress', id] as const,

  // Behavior Events
  behaviorEvents: (filters?: Record<string, unknown>) => ['behavior-events', filters] as const,
  behaviorEvent: (id: string) => ['behavior-event', id] as const,

  // Reports
  reports: (filters?: Record<string, unknown>) => ['reports', filters] as const,
  report: (id: string) => ['report', id] as const,
  reportSchedules: ['report-schedules'] as const,
  reportTemplates: ['report-templates'] as const,

  // Webhooks
  webhooks: ['webhooks'] as const,
  webhook: (id: string) => ['webhook', id] as const,
  webhookDeliveries: (webhookId: string) => ['webhook-deliveries', webhookId] as const,

  // Fuel
  fuelTransactions: (filters?: Record<string, unknown>) =>
    ['fuel-transactions', filters] as const,
  fuelTransaction: (id: string) => ['fuel-transaction', id] as const,
  fuelAnalytics: (vehicleId: string, period?: { start: string; end: string }) =>
    ['fuel-analytics', vehicleId, period] as const,

  // Checklists
  checklistTemplates: (filters?: Record<string, unknown>) =>
    ['checklist-templates', filters] as const,
  checklistTemplate: (id: string) => ['checklist-template', id] as const,
  checklistSubmissions: (filters?: Record<string, unknown>) =>
    ['checklist-submissions', filters] as const,
  checklistSubmission: (id: string) => ['checklist-submission', id] as const,

  // Analytics
  dashboard: (filters?: Record<string, unknown>) => ['dashboard', filters] as const,
  analytics: (type: string, filters?: Record<string, unknown>) =>
    ['analytics', type, filters] as const,
}

export default queryKeys
