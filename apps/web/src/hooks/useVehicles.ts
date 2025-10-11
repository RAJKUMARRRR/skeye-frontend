import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types - will be replaced with @fleet/api types when available
interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  vin?: string
  type: 'car' | 'truck' | 'van' | 'bus' | 'motorcycle'
  status: 'active' | 'idle' | 'parked' | 'maintenance' | 'offline'
  deviceId?: string
  organizationId: string
  currentLocation?: {
    lat: number
    lng: number
    timestamp: string
  }
  odometer: number
  fuelLevel?: number
  createdAt: string
  updatedAt: string
}

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async (): Promise<Vehicle[]> => {
      // TODO: Replace with actual API call from @fleet/api
      // const response = await apiClient.get<ApiResponse<Vehicle[]>>('/vehicles')
      // return response.data.data
      return []
    },
  })
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async (): Promise<Vehicle | null> => {
      // TODO: Replace with actual API call from @fleet/api
      return null
    },
    enabled: !!id,
  })
}

export function useVehicleLocation(vehicleId: string) {
  return useQuery({
    queryKey: ['vehicle', vehicleId, 'location'],
    queryFn: async (): Promise<{ lat: number; lng: number; timestamp: string } | null> => {
      // TODO: Replace with actual API call from @fleet/api
      return null
    },
    enabled: !!vehicleId,
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Vehicle>): Promise<Vehicle> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<Vehicle>
    }): Promise<Vehicle> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] })
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
