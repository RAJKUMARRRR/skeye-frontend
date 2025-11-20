import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'
import { setAuthToken } from '@fleet/api/client/axios'
import { wsClient } from '@fleet/api/client/websocket'

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
  const { isSignedIn, isLoaded, signOut, getToken } = useClerkAuth()
  const { user: clerkUser } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [isTokenReady, setIsTokenReady] = useState(false)

  useEffect(() => {
    async function syncAuthToken() {
      console.log('[Auth] Sync triggered - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn)

      if (isLoaded && isSignedIn && clerkUser) {
        // Get Clerk JWT token and sync with API client
        try {
          console.log('[Auth] Fetching token from Clerk...')
          const token = await getToken()

          if (token) {
            console.log('[Auth] ✓ Token retrieved:', `${token.substring(0, 30)}...`)
            setAuthToken(token)
            wsClient.setToken(token) // Set token for WebSocket
            setIsTokenReady(true) // ✅ Mark token as ready
          } else {
            console.error('[Auth] ✗ Token is null/undefined!')
            setAuthToken(null)
            wsClient.setToken(null)
            setIsTokenReady(false)
          }
        } catch (error) {
          console.error('[Auth] ✗ Failed to get Clerk token:', error)
          setAuthToken(null)
          wsClient.setToken(null)
          setIsTokenReady(false)
        }

        // Map Clerk user to our User interface
        const mappedUser: User = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          role: 'admin', // Default role - you can customize this based on Clerk metadata
          organizationId: 'org-1', // Default org - you can customize this
        }
        setUser(mappedUser)
        console.log('[Auth] User mapped:', mappedUser.email)
      } else if (isLoaded && !isSignedIn) {
        console.log('[Auth] User not signed in, clearing token')
        setUser(null)
        setAuthToken(null)
        wsClient.setToken(null)
        setIsTokenReady(false)
      }
    }

    syncAuthToken()
  }, [isLoaded, isSignedIn, clerkUser, getToken])

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
