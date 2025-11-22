import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
  getDeviceTelemetry,
  getDeviceStats,
  type TelemetryData,
  type DeviceStats,
  type TelemetryQueryParams,
  wsClient,
  type TelemetryEvent,
  type NormalizedTelemetry,
} from '@fleet/api'
import { useAuth } from '../features/auth/contexts/AuthContext'

/**
 * Get telemetry history for a specific device
 */
export function useDeviceTelemetry(deviceId: string, params?: TelemetryQueryParams) {
  const { isAuthenticated, isLoading } = useAuth()

  return useQuery({
    queryKey: ['telemetry', deviceId, params],
    queryFn: () => getDeviceTelemetry(deviceId, params),
    enabled: !!deviceId && isAuthenticated && !isLoading, // Wait for auth and valid ID
  })
}

/**
 * Get device statistics
 */
export function useDeviceStats(deviceId: string, period: '24h' | '7d' | '30d' = '24h') {
  const { isAuthenticated, isLoading } = useAuth()

  return useQuery({
    queryKey: ['telemetry', deviceId, 'stats', period],
    queryFn: () => getDeviceStats(deviceId, period),
    enabled: !!deviceId && isAuthenticated && !isLoading, // Wait for auth and valid ID
  })
}

/**
 * Real-time telemetry updates via WebSocket
 * Returns latest telemetry for all devices with real-time updates
 *
 * Note: There's no REST API endpoint for getting all latest telemetry.
 * This hook relies solely on WebSocket updates from /ws endpoint.
 */
export function useRealtimeTelemetry() {
  const [telemetryMap, setTelemetryMap] = useState<Record<string, NormalizedTelemetry>>({})

  // Subscribe to WebSocket updates
  useEffect(() => {
    const handleTelemetryUpdate = (event: TelemetryEvent) => {
      console.log('[useRealtimeTelemetry] Received telemetry event:', event)

      // Normalize the WebSocket event format to match our expected structure
      // Handle both camelCase and snake_case from backend
      const rawData = event.data as any
      const deviceId = rawData.deviceId || rawData.device_id || event.deviceId
      const location = rawData.location || {}
      const lat = location.lat || location.latitude || rawData.location_lat || rawData.lat
      const lng = location.lng || location.longitude || rawData.location_lng || rawData.lng

      if (!deviceId) {
        console.warn('[useRealtimeTelemetry] Received event without device ID:', event)
        return
      }

      // Validate coordinates
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        console.warn('[useRealtimeTelemetry] Invalid coordinates for device:', deviceId, { lat, lng })
        return
      }

      const normalized: NormalizedTelemetry = {
        device_id: deviceId,
        time: rawData.timestamp || event.timestamp || new Date().toISOString(),
        location_lat: lat,
        location_lng: lng,
        altitude: rawData.telemetry?.altitude || rawData.altitude,
        battery: rawData.telemetry?.battery || rawData.battery,
        // Extract additional fields from rawData if available
        speed: rawData.speed || rawData.rawData?.V || rawData.rawData?.speed || 0,
        heading: rawData.heading || rawData.rawData?.Tr || rawData.rawData?.heading || 0,
        satellites: rawData.satellites || rawData.rawData?.satellites,
      }

      console.log('[useRealtimeTelemetry] Normalized telemetry:', normalized)

      setTelemetryMap(prev => {
        const updated = {
          ...prev,
          [normalized.device_id]: normalized,
        }
        console.log('[useRealtimeTelemetry] Updated telemetry map size:', Object.keys(updated).length)
        return updated
      })
    }

    console.log('[useRealtimeTelemetry] Subscribing to WebSocket')
    wsClient.subscribe(handleTelemetryUpdate)

    return () => {
      console.log('[useRealtimeTelemetry] Unsubscribing from WebSocket')
      wsClient.unsubscribe(handleTelemetryUpdate)
    }
  }, [])

  return {
    telemetry: telemetryMap,
    isConnected: wsClient.isConnected(),
  }
}

/**
 * Real-time telemetry for a specific device
 */
export function useRealtimeDeviceTelemetry(deviceId: string) {
  const [telemetry, setTelemetry] = useState<TelemetryEvent | null>(null)

  useEffect(() => {
    const handleTelemetryUpdate = (event: TelemetryEvent) => {
      const eventDeviceId = event.deviceId || (event as any).device_id
      if (eventDeviceId === deviceId) {
        setTelemetry(event)
      }
    }

    wsClient.subscribe(handleTelemetryUpdate)

    return () => {
      wsClient.unsubscribe(handleTelemetryUpdate)
    }
  }, [deviceId])

  return telemetry
}
