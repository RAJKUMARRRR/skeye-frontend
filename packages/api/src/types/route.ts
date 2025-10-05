export interface Route {
  id: string
  organizationId: string
  name: string
  description?: string
  status: 'draft' | 'planned' | 'in_progress' | 'completed' | 'cancelled'
  stops: RouteStop[]
  assignedVehicleId?: string
  assignedDriverId?: string
  scheduledDate?: string
  startTime?: string
  endTime?: string
  estimatedDistance: number
  actualDistance?: number
  estimatedDuration: number
  actualDuration?: number
  optimized: boolean
  metadata: RouteMetadata
  createdAt: string
  updatedAt: string
}

export interface RouteStop {
  id: string
  sequence: number
  address: string
  location: { lat: number; lng: number }
  type: 'pickup' | 'delivery' | 'service' | 'waypoint'
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  estimatedArrival?: string
  actualArrival?: string
  estimatedDeparture?: string
  actualDeparture?: string
  duration?: number
  notes?: string
  contact?: StopContact
}

export interface StopContact {
  name?: string
  phone?: string
  email?: string
}

export interface RouteMetadata {
  templateId?: string
  notes?: string
}

export interface RouteTemplate {
  id: string
  organizationId: string
  name: string
  description?: string
  stops: Omit<RouteStop, 'id' | 'status' | 'actualArrival' | 'actualDeparture'>[]
  createdAt: string
  updatedAt: string
}
