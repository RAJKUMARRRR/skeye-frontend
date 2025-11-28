import { Navigate } from 'react-router-dom'
import { useFeatureFlags } from '../hooks/useFeatureFlags'
import type { FeatureKey } from '../types/features'

interface FeatureRouteProps {
  children: React.ReactNode
  featureKey?: FeatureKey
  subFeatureKey?: string
  redirectTo?: string
}

/**
 * Wrapper component that conditionally renders routes based on feature flags
 *
 * Usage:
 * <FeatureRoute featureKey="vehicles">
 *   <Vehicles />
 * </FeatureRoute>
 *
 * <FeatureRoute featureKey="routes" subFeatureKey="routePlanner">
 *   <RoutePlanner />
 * </FeatureRoute>
 */
export function FeatureRoute({
  children,
  featureKey,
  subFeatureKey,
  redirectTo = '/',
}: FeatureRouteProps) {
  const { isFeatureEnabled, isSubFeatureEnabled } = useFeatureFlags()

  // If no feature key, render children (backward compatibility)
  if (!featureKey) {
    return <>{children}</>
  }

  // Check sub-feature if provided
  if (subFeatureKey) {
    if (!isSubFeatureEnabled(featureKey, subFeatureKey)) {
      return <Navigate to={redirectTo} replace />
    }
  }
  // Check main feature
  else {
    if (!isFeatureEnabled(featureKey)) {
      return <Navigate to={redirectTo} replace />
    }
  }

  return <>{children}</>
}
