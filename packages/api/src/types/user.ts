export interface User {
  id: string
  organizationId: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
  photoUrl?: string
  phone?: string
  regionalAccess?: string[]
  permissions: string[]
  preferences: UserPreferences
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'system'
  notifications: NotificationPreferences
  dashboard: DashboardPreferences
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  alertTypes: string[]
}

export interface DashboardPreferences {
  widgets: string[]
  layout?: Record<string, unknown>
}
