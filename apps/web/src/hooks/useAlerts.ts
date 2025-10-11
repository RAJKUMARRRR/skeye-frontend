import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Alert {
  id: string
  type: 'speeding' | 'geofence_entry' | 'geofence_exit' | 'idle' | 'maintenance' | 'low_fuel' | 'harsh_braking'
  severity: 'low' | 'medium' | 'high' | 'critical'
  vehicleId: string
  driverId?: string
  message: string
  isRead: boolean
  timestamp: string
}

export function useAlerts(filters?: { vehicleId?: string; isRead?: boolean }) {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: async (): Promise<Alert[]> => [],
  })
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: async (): Promise<Alert | null> => null,
    enabled: !!id,
  })
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      throw new Error('Not implemented')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  })
}

export function useDeleteAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      throw new Error('Not implemented')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  })
}
