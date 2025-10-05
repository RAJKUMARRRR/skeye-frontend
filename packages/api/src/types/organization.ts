export interface Organization {
  id: string
  name: string
  logo?: string
  subscriptionTier: 'trial' | 'basic' | 'pro' | 'enterprise'
  maxVehicles: number
  maxUsers: number
  features: string[]
  settings: OrganizationSettings
  createdAt: string
  updatedAt: string
}

export interface OrganizationSettings {
  timezone: string
  dateFormat: string
  distanceUnit: 'km' | 'mi'
  speedUnit: 'kmh' | 'mph'
  currency: string
  locale: string
  theme?: Record<string, string>
}
