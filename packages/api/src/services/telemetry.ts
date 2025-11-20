import { apiClient } from '../client/axios'

export interface TelemetryData {
  time: string
  device_id: string
  location_lat: number
  location_lng: number
  speed?: number
  heading?: number
  altitude?: number
  satellites?: number
  battery?: number
  metadata?: Record<string, any>
}

export interface DeviceStats {
  device_id: string
  period: string
  total_distance_km: number
  max_speed_kmh: number
  avg_speed_kmh: number
  total_time_hours: number
  idle_time_hours: number
  moving_time_hours: number
}

export interface TelemetryQueryParams {
  limit?: number
  start?: string // ISO 8601 timestamp
  end?: string // ISO 8601 timestamp
}

/**
 * Get latest telemetry for all devices
 *
 * NOTE: This endpoint doesn't exist in the current API spec.
 * Use WebSocket (/ws) for real-time telemetry updates instead.
 *
 * @deprecated Use WebSocket for real-time telemetry
 */
// export async function getLatestTelemetry(): Promise<Record<string, TelemetryData>> {
//   const response = await apiClient.get('/api/v1/telemetry/latest')
//   return response.data.data
// }

/**
 * Get telemetry history for a specific device
 */
export async function getDeviceTelemetry(
  deviceId: string,
  params?: TelemetryQueryParams
): Promise<TelemetryData[]> {
  const response = await apiClient.get(`/api/v1/telemetry/${deviceId}`, { params })
  return response.data.data
}

/**
 * Get device statistics
 */
export async function getDeviceStats(
  deviceId: string,
  period: '24h' | '7d' | '30d' = '24h'
): Promise<DeviceStats> {
  const response = await apiClient.get(`/api/v1/telemetry/${deviceId}/stats`, {
    params: { period }
  })
  return response.data.data
}
