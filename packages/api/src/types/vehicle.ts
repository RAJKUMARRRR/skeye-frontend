import type { Location, Telemetry } from './common'

export interface Vehicle {
  id: string
  organizationId: string
  deviceId: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  color?: string
  vehicleType: 'car' | 'truck' | 'van' | 'motorcycle' | 'other'
  odometer: number
  fuelLevel: number
  engineHours: number
  batteryVoltage: number
  status: 'active' | 'idle' | 'parked' | 'maintenance' | 'offline'
  location: Location
  telemetry: Telemetry
  assignedDriverId?: string
  groupIds: string[]
  metadata: VehicleMetadata
  createdAt: string
  updatedAt: string
}

export interface VehicleMetadata {
  fuelCapacity?: number
  fuelType?: string
  engineType?: string
  transmission?: string
  purchaseDate?: string
  purchasePrice?: number
  notes?: string
}

export interface VehicleFilters {
  status?: string[]
  groupIds?: string[]
  assignedDriverId?: string
  search?: string
}
