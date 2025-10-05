export interface Alert {
  id: string
  organizationId: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  vehicleId?: string
  driverId?: string
  geofenceId?: string
  status: 'active' | 'acknowledged' | 'resolved' | 'muted'
  acknowledgedBy?: string
  acknowledgedAt?: string
  resolvedBy?: string
  resolvedAt?: string
  mutedUntil?: string
  metadata: AlertMetadata
  createdAt: string
  updatedAt: string
}

export interface AlertMetadata {
  location?: { lat: number; lng: number }
  speed?: number
  threshold?: number
  value?: number
  notes?: string
}

export interface AlertRule {
  id: string
  organizationId: string
  name: string
  description?: string
  type: string
  enabled: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  conditions: AlertCondition[]
  actions: AlertAction[]
  assignedVehicleIds: string[]
  assignedUserIds: string[]
  escalationRules?: EscalationRule[]
  createdAt: string
  updatedAt: string
}

export interface AlertCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
  value: number | string | boolean
}

export interface AlertAction {
  type: 'email' | 'sms' | 'webhook' | 'notification'
  config: Record<string, unknown>
}

export interface EscalationRule {
  delay: number
  userIds: string[]
}
