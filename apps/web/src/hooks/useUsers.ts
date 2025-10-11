import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types - will be replaced with @fleet/api types
interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
  organizationId: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      // TODO: Replace with actual API call from @fleet/api
      return []
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<User | null> => {
      // TODO: Replace with actual API call from @fleet/api
      return null
    },
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<User>): Promise<User> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<User>
    }): Promise<User> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // TODO: Replace with actual API call from @fleet/api
      throw new Error('Not implemented')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
