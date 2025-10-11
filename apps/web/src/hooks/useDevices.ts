import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types - will be replaced with @fleet/api types
interface Device {
  id: string
  deviceId: string
  imei: string
  type: 'gps_tracker' | 'obd' | 'dashcam'
  model: string
  manufacturer: string
  status: 'active' | 'inactive' | 'maintenance'
  vehicleId?: string
  createdAt: string
  updatedAt: string
}

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: async (): Promise<Device[]> => {
      // TODO: Replace with actual API call from @fleet/api
      return []
    },
  })
}

export function useDevice(id: string) {
  return useQuery({
    queryKey: ['device', id],
    queryFn: async (): Promise<Device | null> => {
      // TODO: Replace with actual API call from @fleet/api
      return null
    },
    enabled: !!id,
  })
}

export function useCreateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Device>): Promise<Device> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<Device>
    }): Promise<Device> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      queryClient.invalidateQueries({ queryKey: ['device', variables.id] })
    },
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}
