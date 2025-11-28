import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  endTrip,
  getTripStats,
  type Trip,
  type TripFilters,
} from '@fleet/api'

export function useTrips(filters?: TripFilters) {
  return useQuery({
    queryKey: ['trips', filters],
    queryFn: () => getTrips(filters),
    staleTime: 30000, // 30 seconds
  })
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => getTrip(id),
    enabled: !!id,
    staleTime: 30000,
  })
}

export function useTripRoute(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId, 'route'],
    queryFn: async () => {
      const trip = await getTrip(tripId)
      return trip.route
    },
    enabled: !!tripId,
    staleTime: 30000,
  })
}

export function useTripStats(filters?: TripFilters) {
  return useQuery({
    queryKey: ['trips', 'stats', filters],
    queryFn: () => getTripStats(filters),
    staleTime: 60000, // 1 minute
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Trip>) => createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trips', 'stats'] })
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trip> }) => updateTrip(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip', id] })
      queryClient.invalidateQueries({ queryKey: ['trips', 'stats'] })
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trips', 'stats'] })
    },
  })
}

export function useEndTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => endTrip(id),
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] })
      queryClient.invalidateQueries({ queryKey: ['trips', 'stats'] })
    },
  })
}
