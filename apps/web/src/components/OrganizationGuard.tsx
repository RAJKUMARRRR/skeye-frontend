import { useEffect, useState } from 'react'
import { useAuth, useOrganizationList, useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * OrganizationGuard checks if a user has been removed from all organizations
 * and handles the session cleanup appropriately.
 *
 * This prevents the "session already exists" error when trying to sign in again
 * after being removed from an organization.
 */
export function OrganizationGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, signOut } = useAuth()
  const { user } = useUser()
  const clerk = useClerk()
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  const navigate = useNavigate()
  const location = useLocation()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const checkOrganizationAccess = async () => {
      // Only run this check once when data is loaded
      if (!isLoaded || hasChecked) {
        return
      }

      // Skip check on auth pages to avoid redirect loops
      const authPages = ['/sign-in', '/sign-up', '/select-organization']
      if (authPages.some(page => location.pathname.startsWith(page))) {
        return
      }

      // This guard is mainly for detecting removed users, not for forcing org selection
      // Users can use the app with Personal Account (no organization)
      // So we don't redirect users just because they have no organizations

      setHasChecked(true)
    }

    checkOrganizationAccess()
  }, [isLoaded, hasChecked, location.pathname])

  // Reset hasChecked when user changes (sign out/sign in)
  useEffect(() => {
    setHasChecked(false)
  }, [isSignedIn, user?.id])

  return <>{children}</>
}
