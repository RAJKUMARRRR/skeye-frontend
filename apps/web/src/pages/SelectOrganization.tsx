import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrganizationList, useAuth, useUser } from '@clerk/clerk-react'
import { Building2, Plus, ArrowRight, Zap, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export function SelectOrganization() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { user } = useUser()
  const {
    userMemberships,
    setActive,
    isLoaded,
    createOrganization
  } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  const [isCreating, setIsCreating] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgSlug, setNewOrgSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [wasRemovedFromOrg, setWasRemovedFromOrg] = useState(false)

  // Map userMemberships to organizationList for compatibility
  const organizationList = userMemberships?.data

  // Check if user was removed from all organizations
  useEffect(() => {
    const checkForRemovedUser = async () => {
      if (!isLoaded) return

      const hasNoOrgs = !organizationList || organizationList.length === 0

      // Check if there's a session with pending tasks (like choose-organization)
      // This indicates the user had organizations before but was removed
      if (hasNoOrgs && user) {
        console.log('[SelectOrg] User has no organizations')

        // Check URL params for any indication of removal
        const urlParams = new URLSearchParams(window.location.search)
        const fromTask = urlParams.get('from_task')

        // If coming from Clerk's organization task, user was likely removed
        if (fromTask === 'choose-organization') {
          console.log('[SelectOrg] User appears to have been removed from organization')
          setWasRemovedFromOrg(true)

          // Automatically sign out to clear the pending session
          console.log('[SelectOrg] Automatically signing out to clear pending session')
          toast.info('Signing you out to clear your session...', { duration: 3000 })

          setTimeout(async () => {
            await signOut()
            window.location.href = '/sign-in?message=removed'
          }, 3000)
        }
      }
    }

    checkForRemovedUser()
  }, [isLoaded, organizationList, user, signOut])

  // Auto-select last selected organization or if only one organization exists
  useEffect(() => {
    if (!isLoaded || !user) return

    // Get last selected organization from localStorage
    const lastOrgId = localStorage.getItem(`lastOrg_${user.id}`)

    if (lastOrgId) {
      // Check if user still has access to this organization
      const hasAccess = lastOrgId === 'personal' ||
                       organizationList?.some(m => m.organization.id === lastOrgId)

      if (hasAccess) {
        console.log('[SelectOrg] Auto-selecting last organization:', lastOrgId)
        const orgId = lastOrgId === 'personal' ? null : lastOrgId
        handleSelectOrganization(orgId)
        return
      } else {
        // User no longer has access to last org, clear it
        console.log('[SelectOrg] User no longer has access to last organization, clearing')
        localStorage.removeItem(`lastOrg_${user.id}`)
      }
    }

    // If no last org or lost access, auto-select if only one organization
    if (organizationList && organizationList.length === 1) {
      console.log('[SelectOrg] Auto-selecting only organization')
      handleSelectOrganization(organizationList[0].organization.id)
    }
  }, [isLoaded, organizationList, user])

  const handleSelectOrganization = async (orgId: string | null) => {
    setIsLoading(true)
    try {
      console.log('[OrgSelect] Selecting organization:', orgId || 'Personal')
      await setActive?.({ organization: orgId || null })

      // Save last selected organization to localStorage for auto-selection next time
      if (user) {
        const orgToSave = orgId || 'personal'
        localStorage.setItem(`lastOrg_${user.id}`, orgToSave)
        console.log('[OrgSelect] Saved last organization to localStorage:', orgToSave)
      }

      toast.success('Organization selected')

      // Wait a bit for Clerk to update the session, then reload to refresh context
      console.log('[OrgSelect] Reloading to refresh organization context')
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      console.error('[OrgSelect] Error selecting organization:', error)
      toast.error('Failed to select organization')
      setIsLoading(false)
    }
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) {
      toast.error('Please enter an organization name')
      return
    }

    setIsLoading(true)
    try {
      const orgData: any = { name: newOrgName }
      if (newOrgSlug.trim()) {
        orgData.slug = newOrgSlug.trim().toLowerCase()
      }

      const newOrg = await createOrganization?.(orgData)
      if (!newOrg || !newOrg.id) {
        throw new Error('Organization created but no ID returned')
      }

      toast.success('Organization created')

      // Select the new organization
      await setActive?.({ organization: newOrg.id })

      // Save newly created organization to localStorage
      if (user) {
        localStorage.setItem(`lastOrg_${user.id}`, newOrg.id)
        console.log('[OrgSelect] Saved newly created organization to localStorage:', newOrg.id)
      }

      // Wait for Clerk to update, then reload to refresh context
      console.log('[OrgSelect] Reloading to refresh organization context after creation')
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error: any) {
      console.error('[OrgSelect] Error creating organization:', error)
      toast.error(error?.errors?.[0]?.message || 'Failed to create organization')
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-accent/30">
              <Zap className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-accent font-bold">Skeye</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose an organization</h2>
          <p className="text-gray-600">Join an existing organization or create a new one</p>
        </div>

        {/* Warning if user was removed from organization */}
        {wasRemovedFromOrg && isLoaded && (!organizationList || organizationList.length === 0) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-900">Access Removed</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  You've been removed from your organization. You can continue using your personal account or create a new organization.
                </p>
                <button
                  onClick={async () => {
                    await signOut()
                    window.location.href = '/sign-in'
                  }}
                  className="mt-3 text-sm font-medium text-yellow-900 underline hover:text-yellow-700"
                >
                  Sign out and sign in again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Organization List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
          {/* Personal Account */}
          <button
            onClick={() => handleSelectOrganization(null)}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-accent hover:bg-accent-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white text-lg font-medium">
                P
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Personal Account</div>
                <div className="text-sm text-gray-600">Use your personal workspace</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
          </button>

          {/* Organizations */}
          {organizationList && organizationList.length > 0 && (
            <>
              <div className="py-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizations
                </div>
              </div>
              {organizationList.map((membership) => (
                <button
                  key={membership.organization.id}
                  onClick={() => handleSelectOrganization(membership.organization.id)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-accent hover:bg-accent-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    {membership.organization.imageUrl ? (
                      <img
                        src={membership.organization.imageUrl}
                        alt={membership.organization.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white text-lg font-medium">
                        {membership.organization.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{membership.organization.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{membership.role?.replace('org:', '') || 'member'}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                </button>
              ))}
            </>
          )}

          {/* Create Organization Section */}
          <div className="pt-3 border-t border-gray-200">
            {isCreating ? (
              <form onSubmit={handleCreateOrganization} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                    autoFocus
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (optional)
                  </label>
                  <input
                    type="text"
                    value={newOrgSlug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      setNewOrgSlug(slug)
                    }}
                    placeholder="acme-inc"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly identifier (auto-generated if empty)
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false)
                      setNewOrgName('')
                      setNewOrgSlug('')
                    }}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newOrgName.trim() || isLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-accent hover:bg-accent-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-accent transition-colors">
                  Create new organization
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Sign Out Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          Secured by Clerk • Development mode
        </div>
      </div>
    </div>
  )
}
