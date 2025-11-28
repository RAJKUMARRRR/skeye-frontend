import { apiClient } from '../client/axios'
import type { Trip, TripFilters } from '../types/trip'

/**
 * Get all trips for the current tenant
 * @param filters Optional filters for trips
 */
export async function getTrips(filters?: TripFilters): Promise<Trip[]> {
  const params = new URLSearchParams()

  if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId)
  if (filters?.driverId) params.append('driverId', filters.driverId)
  if (filters?.routeId) params.append('routeId', filters.routeId)
  if (filters?.status?.length) {
    filters.status.forEach(status => params.append('status', status))
  }
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
  if (filters?.dateTo) params.append('dateTo', filters.dateTo)

  const queryString = params.toString()
  const url = queryString ? `/api/v1/trips?${queryString}` : '/api/v1/trips'

  const response = await apiClient.get(url)
  return response.data.data || response.data
}

/**
 * Get a single trip by ID
 * @param tripId The trip ID
 */
export async function getTrip(tripId: string): Promise<Trip> {
  const response = await apiClient.get(`/api/v1/trips/${tripId}`)
  return response.data.data || response.data
}

/**
 * Create a new trip
 * @param data Trip creation data
 */
export async function createTrip(data: Partial<Trip>): Promise<Trip> {
  const response = await apiClient.post('/api/v1/trips', data)
  return response.data.data || response.data
}

/**
 * Update an existing trip
 * @param tripId The trip ID
 * @param data Trip update data
 */
export async function updateTrip(tripId: string, data: Partial<Trip>): Promise<Trip> {
  const response = await apiClient.patch(`/api/v1/trips/${tripId}`, data)
  return response.data.data || response.data
}

/**
 * Delete a trip
 * @param tripId The trip ID
 */
export async function deleteTrip(tripId: string): Promise<void> {
  await apiClient.delete(`/api/v1/trips/${tripId}`)
}

/**
 * End an active trip
 * @param tripId The trip ID
 */
export async function endTrip(tripId: string): Promise<Trip> {
  const response = await apiClient.post(`/api/v1/trips/${tripId}/end`)
  return response.data.data || response.data
}

/**
 * Get trip statistics
 * @param filters Optional filters for statistics
 */
export async function getTripStats(filters?: TripFilters): Promise<{
  totalTrips: number
  totalDistance: number
  totalDuration: number
  avgSpeed: number
  totalFuelConsumed: number
}> {
  const params = new URLSearchParams()

  if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId)
  if (filters?.driverId) params.append('driverId', filters.driverId)
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
  if (filters?.dateTo) params.append('dateTo', filters.dateTo)

  const queryString = params.toString()
  const url = queryString ? `/api/v1/trips/stats?${queryString}` : '/api/v1/trips/stats'

  const response = await apiClient.get(url)
  return response.data.data || response.data
}
