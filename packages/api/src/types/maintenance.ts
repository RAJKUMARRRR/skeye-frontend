export interface MaintenanceRecord {
  id: string
  organizationId: string
  vehicleId: string
  type: 'preventive' | 'corrective' | 'inspection' | 'other'
  category: string
  description: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledDate?: string
  completedDate?: string
  odometerReading: number
  cost?: number
  provider?: string
  technician?: string
  parts: MaintenancePart[]
  attachments: string[]
  notes?: string
  nextDueDate?: string
  nextDueOdometer?: number
  createdAt: string
  updatedAt: string
}

export interface MaintenancePart {
  name: string
  partNumber?: string
  quantity: number
  cost?: number
}

export interface MaintenanceSchedule {
  id: string
  organizationId: string
  vehicleId: string
  name: string
  description?: string
  type: 'time_based' | 'mileage_based' | 'engine_hours'
  intervalValue: number
  intervalUnit: string
  lastPerformed?: string
  lastOdometer?: number
  nextDue: string
  nextDueOdometer?: number
  reminderDays: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface PredictiveMaintenance {
  id: string
  vehicleId: string
  component: string
  issue: string
  severity: 'low' | 'medium' | 'high'
  confidence: number
  recommendation: string
  estimatedDate?: string
  detectedAt: string
}
