import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types - will be replaced with @fleet/api types
interface Trip {
  id: string
  vehicleId: string
  driverId: string
  startTime: string
  endTime?: string
  startLocation: { lat: number; lng: number; address: string }
  endLocation?: { lat: number; lng: number; address: string }
  distance: number
  duration: number
  status: 'ongoing' | 'completed' | 'cancelled'
  route: Array<{ lat: number; lng: number; timestamp: string }>
  maxSpeed: number
  avgSpeed: number
  idleTime: number
  fuelConsumed?: number
  createdAt: string
  updatedAt: string
}

export function useTrips(filters?: { vehicleId?: string; driverId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['trips', filters],
    queryFn: async (): Promise<Trip[]> => {
      // TODO: Replace with actual API call from @fleet/api
      return []
    },
  })
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: async (): Promise<Trip | null> => {
      // TODO: Replace with actual API call from @fleet/api
      return null
    },
    enabled: !!id,
  })
}

export function useTripRoute(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId, 'route'],
    queryFn: async (): Promise<Array<{ lat: number; lng: number; timestamp: string }>> => {
      // TODO: Replace with actual API call from @fleet/api
      return []
    },
    enabled: !!tripId,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Trip>): Promise<Trip> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })
}

export function useEndTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<Trip> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] })
    },
  })
}
