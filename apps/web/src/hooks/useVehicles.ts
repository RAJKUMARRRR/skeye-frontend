import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@fleet/api'
import type { Vehicle, ApiResponse } from '@fleet/api'

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Vehicle[]>>('/vehicles')
      return response.data.data
    },
  })
}
