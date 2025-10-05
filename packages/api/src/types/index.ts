export interface Location {
  lat: number
  lng: number
  speed?: number
  heading?: number
  timestamp: string
}

export interface Vehicle {
  id: string
  licensePlate: string
  make: string
  model: string
  year: number
  vin: string
  status: 'active' | 'idle' | 'maintenance' | 'offline'
  fuelLevel: number
  odometer: number
  location: Location
  driverId?: string
  lastUpdate: string
}

export interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  status: 'available' | 'on-trip' | 'off-duty'
  currentVehicleId?: string
}

export interface Alert {
  id: string
  vehicleId: string
  type: 'speeding' | 'harsh-braking' | 'low-fuel' | 'maintenance' | 'geofence'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  acknowledged: boolean
}

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  startTime: string
  endTime?: string
  startLocation: Location
  endLocation?: Location
  distance: number
  duration: number
  status: 'in-progress' | 'completed' | 'cancelled'
}

export interface VehicleFilters {
  status?: Vehicle['status']
  search?: string
  driverId?: string
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    pageSize: number
  }
}
