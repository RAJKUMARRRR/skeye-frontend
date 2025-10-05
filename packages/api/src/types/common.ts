export interface Location {
  lat: number
  lng: number
  timestamp: string
  speed?: number
  heading?: number
  accuracy?: number
}

export interface Telemetry {
  speed: number
  odometer: number
  fuelLevel: number
  engineHours: number
  batteryVoltage: number
  engineTemp?: number
  coolantLevel?: number
}
