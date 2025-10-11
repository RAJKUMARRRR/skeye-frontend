import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types - will be replaced with @fleet/api types
interface Organization {
  id: string
  name: string
  type: 'enterprise' | 'fleet_operator' | 'individual'
  settings: {
    timezone: string
    currency: string
    distanceUnit: 'km' | 'mi'
  }
  whiteLabel?: {
    logoUrl: string
    primaryColor: string
    secondaryColor: string
  }
  createdAt: string
  updatedAt: string
}

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async (): Promise<Organization[]> => {
      // TODO: Replace with actual API call from @fleet/api
      return []
    },
  })
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: async (): Promise<Organization | null> => {
      // TODO: Replace with actual API call from @fleet/api
      return null
    },
    enabled: !!id,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Organization>): Promise<Organization> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<Organization>
    }): Promise<Organization> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
      queryClient.invalidateQueries({ queryKey: ['organization', variables.id] })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}
