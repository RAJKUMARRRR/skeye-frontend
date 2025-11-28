/**
 * Feature flags type definitions
 */

export interface SubFeature {
  enabled: boolean
  name: string
  description?: string
}

export interface Feature {
  enabled: boolean
  name: string
  description?: string
  subFeatures?: Record<string, SubFeature>
}

export interface FeaturesConfig {
  $schema?: string
  features: {
    dashboard: Feature
    liveTracking: Feature
    vehicles: Feature
    drivers: Feature
    trips: Feature
    geofences: Feature
    routes: Feature
    maintenance: Feature
    fuel: Feature
    alerts: Feature
    reports: Feature
    analytics: Feature
    settings: Feature
  }
}

export type FeatureKey = keyof FeaturesConfig['features']
export type SubFeatureKey<T extends FeatureKey> = FeaturesConfig['features'][T] extends { subFeatures: infer S }
  ? S extends Record<string, SubFeature>
    ? keyof S
    : never
  : never
