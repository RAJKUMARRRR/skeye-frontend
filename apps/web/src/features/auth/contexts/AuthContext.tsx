import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'

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
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth()
  const { user: clerkUser } = useUser()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      // Map Clerk user to our User interface
      const mappedUser: User = {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        role: 'admin', // Default role - you can customize this based on Clerk metadata
        organizationId: 'org-1', // Default org - you can customize this
      }
      setUser(mappedUser)
    } else if (isLoaded && !isSignedIn) {
      setUser(null)
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const login = async (email: string, password: string) => {
    // Clerk handles authentication - this is kept for compatibility
    // Redirect to custom login page
    window.location.href = '/login'
  }

  const logout = async () => {
    // Call Clerk's signOut method
    await signOut()
    // Redirect to custom login page
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isSignedIn || false,
        isLoading: !isLoaded,
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
