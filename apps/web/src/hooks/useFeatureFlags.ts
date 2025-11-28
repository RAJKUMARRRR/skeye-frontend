import { useMemo } from 'react'
import featuresConfig from '../config/features.json'
import type { FeaturesConfig, FeatureKey, SubFeatureKey } from '../types/features'

/**
 * Hook to access feature flags
 *
 * Features can be controlled via:
 * 1. JSON configuration file (apps/web/src/config/features.json)
 * 2. Environment variables (overrides JSON config)
 *
 * Environment variable format:
 * - VITE_FEATURE_<FEATURE_NAME>=true|false
 * - VITE_FEATURE_<FEATURE_NAME>_<SUB_FEATURE_NAME>=true|false
 *
 * Examples:
 * - VITE_FEATURE_DASHBOARD=false
 * - VITE_FEATURE_ROUTES_ROUTE_PLANNER=false
 * - VITE_FEATURE_ALERTS_RULES=true
 */
export function useFeatureFlags() {
  const config = featuresConfig as FeaturesConfig

  /**
   * Get environment variable value for a feature
   */
  const getEnvValue = (featureKey: string, subFeatureKey?: string): boolean | undefined => {
    const envKey = subFeatureKey
      ? `VITE_FEATURE_${featureKey.toUpperCase()}_${subFeatureKey.toUpperCase()}`
      : `VITE_FEATURE_${featureKey.toUpperCase()}`

    const envValue = import.meta.env[envKey]

    if (envValue === undefined || envValue === '') {
      return undefined
    }

    return envValue === 'true' || envValue === '1'
  }

  /**
   * Check if a main feature is enabled
   * Environment variables override JSON config
   */
  const isFeatureEnabled = (featureKey: FeatureKey): boolean => {
    const envValue = getEnvValue(featureKey)
    if (envValue !== undefined) {
      return envValue
    }

    return config.features[featureKey]?.enabled ?? false
  }

  /**
   * Check if a sub-feature is enabled
   * Requires both the main feature and sub-feature to be enabled
   * Environment variables override JSON config
   */
  const isSubFeatureEnabled = <T extends FeatureKey>(
    featureKey: T,
    subFeatureKey: string
  ): boolean => {
    // First check if main feature is enabled
    if (!isFeatureEnabled(featureKey)) {
      return false
    }

    // Check environment variable for sub-feature
    const envValue = getEnvValue(featureKey, subFeatureKey)
    if (envValue !== undefined) {
      return envValue
    }

    // Check JSON config
    const feature = config.features[featureKey]
    if (!feature.subFeatures) {
      return false
    }

    return feature.subFeatures[subFeatureKey]?.enabled ?? false
  }

  /**
   * Get all enabled sub-features for a feature
   */
  const getEnabledSubFeatures = <T extends FeatureKey>(featureKey: T): string[] => {
    if (!isFeatureEnabled(featureKey)) {
      return []
    }

    const feature = config.features[featureKey]
    if (!feature.subFeatures) {
      return []
    }

    return Object.keys(feature.subFeatures).filter((subKey) =>
      isSubFeatureEnabled(featureKey, subKey)
    )
  }

  /**
   * Get all enabled features
   */
  const getEnabledFeatures = (): FeatureKey[] => {
    return Object.keys(config.features).filter((key) =>
      isFeatureEnabled(key as FeatureKey)
    ) as FeatureKey[]
  }

  /**
   * Get feature metadata (name, description)
   */
  const getFeatureMetadata = (featureKey: FeatureKey) => {
    const feature = config.features[featureKey]
    return {
      name: feature?.name,
      description: feature?.description,
      enabled: isFeatureEnabled(featureKey),
    }
  }

  /**
   * Get sub-feature metadata
   */
  const getSubFeatureMetadata = <T extends FeatureKey>(
    featureKey: T,
    subFeatureKey: string
  ) => {
    const feature = config.features[featureKey]
    const subFeature = feature?.subFeatures?.[subFeatureKey]

    return {
      name: subFeature?.name,
      description: subFeature?.description,
      enabled: isSubFeatureEnabled(featureKey, subFeatureKey),
    }
  }

  return useMemo(
    () => ({
      isFeatureEnabled,
      isSubFeatureEnabled,
      getEnabledSubFeatures,
      getEnabledFeatures,
      getFeatureMetadata,
      getSubFeatureMetadata,
      config,
    }),
    [] // Config is static, no dependencies needed
  )
}
