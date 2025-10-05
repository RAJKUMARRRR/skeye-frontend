export interface Driver {
  id: string
  organizationId: string
  name: string
  email: string
  phone: string
  photoUrl?: string
  licenseNumber: string
  licenseExpiry: string
  licenseState: string
  licenseClass?: string
  status: 'active' | 'inactive' | 'suspended'
  assignedVehicleIds: string[]
  performanceScore: number
  totalTrips: number
  totalDistance: number
  totalDrivingHours: number
  behaviorMetrics: BehaviorMetrics
  groupIds: string[]
  metadata: DriverMetadata
  createdAt: string
  updatedAt: string
}

export interface BehaviorMetrics {
  harshBraking: number
  rapidAcceleration: number
  speeding: number
  idling: number
  score: number
  lastCalculated: string
}

export interface DriverMetadata {
  hireDate?: string
  dateOfBirth?: string
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
}

export interface DriverFilters {
  status?: string[]
  groupIds?: string[]
  licenseExpiring?: boolean
  search?: string
}
