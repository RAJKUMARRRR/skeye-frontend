export interface BehaviorEvent {
  id: string
  organizationId: string
  vehicleId: string
  driverId?: string
  tripId?: string
  type: 'harsh_braking' | 'rapid_acceleration' | 'speeding' | 'excessive_idling' | 'sharp_turn'
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  location: { lat: number; lng: number }
  speed: number
  speedLimit?: number
  gForce?: number
  duration?: number
  metadata: BehaviorEventMetadata
  createdAt: string
}

export interface BehaviorEventMetadata {
  roadType?: string
  weather?: string
  timeOfDay?: string
  notes?: string
}

export interface DriverScorecard {
  driverId: string
  period: {
    start: string
    end: string
  }
  overallScore: number
  metrics: {
    harshBraking: { count: number; score: number }
    rapidAcceleration: { count: number; score: number }
    speeding: { count: number; score: number }
    idling: { count: number; score: number }
    sharpTurns: { count: number; score: number }
  }
  totalTrips: number
  totalDistance: number
  totalDrivingTime: number
  rank?: number
  trend: 'improving' | 'stable' | 'declining'
  coachingSuggestions: string[]
}
