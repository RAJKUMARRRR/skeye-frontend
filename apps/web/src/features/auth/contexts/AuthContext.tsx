import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
  organizationId: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token on mount
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in production this would call the API
    // Mock credentials for testing:
    // admin@fleet.com / admin123
    // manager@fleet.com / manager123
    // dispatcher@fleet.com / dispatcher123

    const mockUsers: Record<string, { user: User; password: string }> = {
      'admin@fleet.com': {
        password: 'admin123',
        user: {
          id: '1',
          email: 'admin@fleet.com',
          name: 'Admin User',
          role: 'admin',
          organizationId: 'org-1',
        },
      },
      'manager@fleet.com': {
        password: 'manager123',
        user: {
          id: '2',
          email: 'manager@fleet.com',
          name: 'Manager User',
          role: 'manager',
          organizationId: 'org-1',
        },
      },
      'dispatcher@fleet.com': {
        password: 'dispatcher123',
        user: {
          id: '3',
          email: 'dispatcher@fleet.com',
          name: 'Dispatcher User',
          role: 'dispatcher',
          organizationId: 'org-1',
        },
      },
    }

    const mockAccount = mockUsers[email]

    if (!mockAccount || mockAccount.password !== password) {
      throw new Error('Invalid credentials')
    }

    setUser(mockAccount.user)
    localStorage.setItem('auth_user', JSON.stringify(mockAccount.user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
