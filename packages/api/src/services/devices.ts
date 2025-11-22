import { apiClient } from '../client/axios'

// Device interface matching OpenAPI spec exactly
export interface Device {
  id: string // UUID
  tenant_id: string // From Clerk org_id
  device_id: string // IMEI or unique device identifier
  name: string
  device_type: string // e.g., "gps_tracker"
  protocol_type?: string // e.g., "mqtt"
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned'
  created_at: string // ISO 8601 datetime
  updated_at: string // ISO 8601 datetime
}

// CreateDeviceDto matching OpenAPI spec
export interface CreateDeviceDto {
  device_id: string // Required: IMEI, serial number, etc.
  name: string // Required: Human-readable name
  device_type?: string // Optional: defaults to "gps_tracker" on backend
}

// UpdateDeviceDto - fields that can be updated
export interface UpdateDeviceDto {
  name?: string
  status?: 'active' | 'inactive' | 'maintenance' | 'decommissioned'
}

/**
 * Get all devices for the current tenant
 */
export async function getDevices(): Promise<Device[]> {
  const response = await apiClient.get('/api/v1/devices')
  return response.data.data
}

/**
 * Get a single device by ID
 */
export async function getDevice(deviceId: string): Promise<Device> {
  const response = await apiClient.get(`/api/v1/devices/${deviceId}`)
  return response.data.data
}

/**
 * Create a new device
 */
export async function createDevice(data: CreateDeviceDto): Promise<Device> {
  const response = await apiClient.post('/api/v1/devices', data)
  return response.data.data
}

/**
 * Update an existing device
 */
export async function updateDevice(
  deviceId: string,
  data: UpdateDeviceDto
): Promise<Device> {
  const response = await apiClient.patch(`/api/v1/devices/${deviceId}`, data)
  return response.data.data
}

/**
 * Delete a device
 */
export async function deleteDevice(deviceId: string): Promise<void> {
  await apiClient.delete(`/api/v1/devices/${deviceId}`)
}
