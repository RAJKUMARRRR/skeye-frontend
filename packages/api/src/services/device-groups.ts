import { apiClient } from '../client/axios'

export interface DeviceGroup {
  id: string
  tenant_id?: string
  name: string
  description?: string
  device_count?: number
  created_at?: string
}

export interface CreateDeviceGroupDto {
  name: string
  description?: string
}

export interface UpdateDeviceGroupDto {
  name?: string
  description?: string
}

/**
 * Get all device groups for the current tenant
 */
export async function getDeviceGroups(): Promise<DeviceGroup[]> {
  const response = await apiClient.get('/api/v1/device-groups')
  return response.data.data
}

/**
 * Get a single device group by ID
 */
export async function getDeviceGroup(groupId: string): Promise<DeviceGroup> {
  const response = await apiClient.get(`/api/v1/device-groups/${groupId}`)
  return response.data.data
}

/**
 * Create a new device group
 */
export async function createDeviceGroup(
  data: CreateDeviceGroupDto
): Promise<DeviceGroup> {
  const response = await apiClient.post('/api/v1/device-groups', data)
  return response.data.data
}

/**
 * Update an existing device group
 */
export async function updateDeviceGroup(
  groupId: string,
  data: UpdateDeviceGroupDto
): Promise<DeviceGroup> {
  const response = await apiClient.patch(`/api/v1/device-groups/${groupId}`, data)
  return response.data.data
}

/**
 * Delete a device group
 */
export async function deleteDeviceGroup(groupId: string): Promise<void> {
  await apiClient.delete(`/api/v1/device-groups/${groupId}`)
}
