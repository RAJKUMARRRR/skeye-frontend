export interface Geofence {
  id: string
  organizationId: string
  name: string
  description?: string
  type: 'circle' | 'polygon'
  center?: { lat: number; lng: number }
  radius?: number
  coordinates?: Array<{ lat: number; lng: number }>
  color: string
  assignedVehicleIds: string[]
  rules: GeofenceRule[]
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface GeofenceRule {
  id: string
  eventType: 'entry' | 'exit'
  enabled: boolean
  alertUserIds: string[]
  alertSeverity: 'low' | 'medium' | 'high' | 'critical'
  timeRestriction?: {
    startTime: string
    endTime: string
    daysOfWeek: number[]
  }
  actions: GeofenceAction[]
}

export interface GeofenceAction {
  type: 'email' | 'sms' | 'webhook' | 'notification'
  config: Record<string, unknown>
}

export interface GeofenceEvent {
  id: string
  geofenceId: string
  vehicleId: string
  driverId?: string
  eventType: 'entry' | 'exit'
  timestamp: string
  location: { lat: number; lng: number }
}
