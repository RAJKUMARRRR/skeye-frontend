import type { Location } from './common'

export interface Trip {
  id: string
  organizationId: string
  vehicleId: string
  driverId?: string
  routeId?: string
  status: 'in_progress' | 'completed' | 'cancelled'
  startTime: string
  endTime?: string
  startLocation: Location
  endLocation?: Location
  route: Location[]
  distance: number
  duration: number
  avgSpeed: number
  maxSpeed: number
  fuelConsumed: number
  idleTime: number
  stops: TripStop[]
  behaviorEvents: string[]
  metadata: TripMetadata
  createdAt: string
  updatedAt: string
}

export interface TripStop {
  id: string
  location: Location
  startTime: string
  endTime?: string
  duration: number
  type: 'planned' | 'unplanned'
  notes?: string
}

export interface TripMetadata {
  purpose?: string
  notes?: string
}

export interface TripFilters {
  vehicleId?: string
  driverId?: string
  routeId?: string
  status?: string[]
  dateFrom?: string
  dateTo?: string
}
