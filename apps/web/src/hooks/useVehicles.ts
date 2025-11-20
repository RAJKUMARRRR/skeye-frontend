import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  type Device,
  type CreateDeviceDto,
  type UpdateDeviceDto,
} from '@fleet/api'
import { useAuth } from '../features/auth/contexts/AuthContext'

export function useVehicles() {
  const { isAuthenticated, isLoading } = useAuth()

  return useQuery({
    queryKey: ['vehicles'],
    queryFn: getDevices,
    enabled: isAuthenticated && !isLoading, // Wait for auth before querying
  })
}

export function useVehicle(id: string) {
  const { isAuthenticated, isLoading } = useAuth()

  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getDevice(id),
    enabled: !!id && isAuthenticated && !isLoading, // Wait for auth and valid ID
  })
}

export function useVehicleLocation(vehicleId: string) {
  const { isAuthenticated, isLoading } = useAuth()

  return useQuery({
    queryKey: ['vehicle', vehicleId, 'location'],
    queryFn: async (): Promise<{ lat: number; lng: number; timestamp: string } | null> => {
      // Get device telemetry for location
      const device = await getDevice(vehicleId)
      // Location will come from telemetry WebSocket updates
      return null
    },
    enabled: !!vehicleId && isAuthenticated && !isLoading, // Wait for auth and valid ID
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDeviceDto) => createDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateDeviceDto
    }) => updateDevice(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] })
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}
