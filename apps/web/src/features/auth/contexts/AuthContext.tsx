import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth as useClerkAuth, useUser, useOrganization } from '@clerk/clerk-react'
import { setAuthToken, setOrganizationId } from '@fleet/api/client/axios'
import { wsClient } from '@fleet/api/client/websocket'

interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
  organizationId: string | null
  organizationName: string | null
  organizationRole: string | null
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  organizationId: string | null
  organizationName: string | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, signOut, getToken, orgId, orgRole } = useClerkAuth()
  const { user: clerkUser } = useUser()
  const { organization } = useOrganization()
  const [user, setUser] = useState<User | null>(null)
  const [isTokenReady, setIsTokenReady] = useState(false)

  useEffect(() => {
    async function syncAuthToken() {
      console.log('[Auth] Sync triggered - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn)
      console.log('[Auth] Organization ID:', orgId)
      console.log('[Auth] Organization:', organization?.name)

      if (isLoaded && isSignedIn && clerkUser) {
        // Get Clerk JWT token and sync with API client
        try {
          console.log('[Auth] Fetching token from Clerk...')
          const token = await getToken()

          if (token) {
            console.log('[Auth] ✓ Token retrieved:', `${token.substring(0, 30)}...`)
            setAuthToken(token)
            setOrganizationId(orgId || null) // Set organization ID for API requests
            wsClient.setToken(token) // Set token for WebSocket
            setIsTokenReady(true) // ✅ Mark token as ready
          } else {
            console.error('[Auth] ✗ Token is null/undefined!')
            setAuthToken(null)
            setOrganizationId(null)
            wsClient.setToken(null)
            setIsTokenReady(false)
          }
        } catch (error) {
          console.error('[Auth] ✗ Failed to get Clerk token:', error)
          setAuthToken(null)
          setOrganizationId(null)
          wsClient.setToken(null)
          setIsTokenReady(false)
        }

        // Map organization role to our role system
        const mapOrgRoleToAppRole = (clerkRole: string | null | undefined): User['role'] => {
          if (!clerkRole) return 'driver'
          const role = clerkRole.toLowerCase()
          if (role.includes('admin')) return 'admin'
          if (role.includes('manager')) return 'manager'
          if (role.includes('dispatcher')) return 'dispatcher'
          return 'driver'
        }

        // Map Clerk user to our User interface
        const mappedUser: User = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          role: mapOrgRoleToAppRole(orgRole),
          organizationId: orgId || null,
          organizationName: organization?.name || null,
          organizationRole: orgRole || null,
        }
        setUser(mappedUser)
        console.log('[Auth] User mapped:', mappedUser.email, 'Org:', mappedUser.organizationName, 'Role:', mappedUser.role)
      } else if (isLoaded && !isSignedIn) {
        console.log('[Auth] User not signed in, clearing token')
        setUser(null)
        setAuthToken(null)
        setOrganizationId(null)
        wsClient.setToken(null)
        setIsTokenReady(false)
      }
    }

    syncAuthToken()
  }, [isLoaded, isSignedIn, clerkUser, getToken, orgId, orgRole, organization])

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
        isAuthenticated: isTokenReady, // ✅ Only true when token is actually ready
        isLoading: !isLoaded || (isSignedIn && !isTokenReady), // ✅ Loading until token is ready
        login,
        logout,
        organizationId: orgId || null,
        organizationName: organization?.name || null,
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
