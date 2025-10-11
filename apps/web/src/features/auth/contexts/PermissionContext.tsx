import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './AuthContext'

type Role = 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'

type Permission =
  | 'vehicles:read'
  | 'vehicles:write'
  | 'vehicles:delete'
  | 'drivers:read'
  | 'drivers:write'
  | 'drivers:delete'
  | 'trips:read'
  | 'reports:read'
  | 'reports:write'
  | 'alerts:read'
  | 'alerts:write'
  | 'settings:read'
  | 'settings:write'
  | 'users:read'
  | 'users:write'
  | 'users:delete'

const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 4,
  admin: 3,
  manager: 2,
  dispatcher: 1,
  driver: 0,
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'vehicles:read',
    'vehicles:write',
    'vehicles:delete',
    'drivers:read',
    'drivers:write',
    'drivers:delete',
    'trips:read',
    'reports:read',
    'reports:write',
    'alerts:read',
    'alerts:write',
    'settings:read',
    'settings:write',
    'users:read',
    'users:write',
    'users:delete',
  ],
  admin: [
    'vehicles:read',
    'vehicles:write',
    'vehicles:delete',
    'drivers:read',
    'drivers:write',
    'drivers:delete',
    'trips:read',
    'reports:read',
    'reports:write',
    'alerts:read',
    'alerts:write',
    'settings:read',
    'users:read',
    'users:write',
  ],
  manager: [
    'vehicles:read',
    'vehicles:write',
    'drivers:read',
    'drivers:write',
    'trips:read',
    'reports:read',
    'alerts:read',
    'alerts:write',
  ],
  dispatcher: [
    'vehicles:read',
    'drivers:read',
    'trips:read',
    'alerts:read',
  ],
  driver: [
    'vehicles:read',
    'trips:read',
  ],
}

interface PermissionContextValue {
  hasRole: (role: Role) => boolean
  hasPermission: (permission: Permission) => boolean
  hasAnyRole: (roles: Role[]) => boolean
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const hasRole = (role: Role): boolean => {
    if (!user) return false
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[role]
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return ROLE_PERMISSIONS[user.role].includes(permission)
  }

  const hasAnyRole = (roles: Role[]): boolean => {
    if (!user) return false
    return roles.some((role) => hasRole(role))
  }

  return (
    <PermissionContext.Provider
      value={{
        hasRole,
        hasPermission,
        hasAnyRole,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }
  return context
}
