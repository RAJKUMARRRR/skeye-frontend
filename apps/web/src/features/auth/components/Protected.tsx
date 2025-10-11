import { ReactNode } from 'react'
import { usePermissions } from '../contexts/PermissionContext'

type Role = 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'

interface ProtectedProps {
  children: ReactNode
  requiredRole?: Role
  requiredRoles?: Role[]
  fallback?: ReactNode
}

export function Protected({ children, requiredRole, requiredRoles, fallback = null }: ProtectedProps) {
  const { hasRole, hasAnyRole } = usePermissions()

  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
