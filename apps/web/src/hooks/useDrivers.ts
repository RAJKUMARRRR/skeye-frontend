import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types - will be replaced with @fleet/api types
interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiry: string
  status: 'active' | 'inactive' | 'on_duty' | 'off_duty'
  organizationId: string
  currentVehicleId?: string
  createdAt: string
  updatedAt: string
}

export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async (): Promise<Driver[]> => {
      // TODO: Replace with actual API call from @fleet/api
      return []
    },
  })
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: async (): Promise<Driver | null> => {
      // TODO: Replace with actual API call from @fleet/api
      return null
    },
    enabled: !!id,
  })
}

export function useDriverTrips(driverId: string) {
  return useQuery({
    queryKey: ['driver', driverId, 'trips'],
    queryFn: async (): Promise<any[]> => {
      // TODO: Replace with actual API call from @fleet/api
      return []
    },
    enabled: !!driverId,
  })
}

export function useCreateDriver() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Driver>): Promise<Driver> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}

export function useUpdateDriver() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<Driver>
    }): Promise<Driver> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['driver', variables.id] })
    },
  })
}

export function useDeleteDriver() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
    },
  })
}
