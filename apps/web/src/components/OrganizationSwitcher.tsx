import { useState, useRef, useEffect } from 'react'
import { useOrganization, useOrganizationList, useUser } from '@clerk/clerk-react'
import { Building2, ChevronDown, Plus, Check, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export function OrganizationSwitcher() {
  const { organization } = useOrganization()
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
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgSlug, setNewOrgSlug] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isCreatingOrg, setIsCreatingOrg] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Map userMemberships to organizationList for compatibility
  const organizationList = userMemberships?.data

  // Debug: Log organization list
  useEffect(() => {
    if (isLoaded) {
      console.log('[OrgSwitcher] Organizations loaded:', organizationList?.length || 0)
      console.log('[OrgSwitcher] Organization list:', organizationList)
      console.log('[OrgSwitcher] User memberships:', userMemberships)
      console.log('[OrgSwitcher] createOrganization function available:', !!createOrganization)
    }
  }, [isLoaded, organizationList, userMemberships, createOrganization])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (2MB max as per Clerk recommendation)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo size must be less than 2MB')
      return
    }

    setLogoFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setNewOrgName('')
    setNewOrgSlug('')
    setLogoFile(null)
    setLogoPreview(null)
    setShowCreateModal(false)
  }

  const handleSwitchOrganization = async (orgId: string) => {
    try {
      console.log('[OrgSwitcher] Switching to organization:', orgId || 'Personal')
      await setActive?.({ organization: orgId })
      toast.success('Switched organization')
      setIsOpen(false)

      // Reload the app to refresh organization context
      console.log('[OrgSwitcher] Reloading app to refresh organization context')
      setTimeout(() => {
        window.location.reload()
      }, 300)
    } catch (error) {
      console.error('[OrgSwitcher] Error switching organization:', error)
      toast.error('Failed to switch organization')
    }
  }

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) {
      toast.error('Please enter an organization name')
      return
    }

    setIsCreatingOrg(true)

    try {
      console.log('[OrgSwitcher] Attempting to create organization with name:', newOrgName)
      console.log('[OrgSwitcher] Slug:', newOrgSlug || 'auto-generated')
      console.log('[OrgSwitcher] Has logo:', !!logoFile)

      if (!createOrganization) {
        toast.error('Organization creation not available. Please check Clerk settings.')
        console.error('[OrgSwitcher] createOrganization function is not available')
        setIsCreatingOrg(false)
        return
      }

      // Create organization with slug if provided
      const orgData: any = { name: newOrgName }
      if (newOrgSlug.trim()) {
        orgData.slug = newOrgSlug.trim().toLowerCase()
      }

      console.log('[OrgSwitcher] Calling createOrganization with:', orgData)
      const newOrg = await createOrganization(orgData)

      console.log('[OrgSwitcher] Organization created response:', newOrg)
      console.log('[OrgSwitcher] New organization ID:', newOrg?.id)
      console.log('[OrgSwitcher] New organization name:', newOrg?.name)

      if (!newOrg || !newOrg.id) {
        console.error('[OrgSwitcher] Organization created but no ID returned')
        toast.error('Organization created but unable to activate it')
        setIsCreatingOrg(false)
        return
      }

      // Upload logo if provided
      if (logoFile) {
        try {
          console.log('[OrgSwitcher] Uploading logo...')
          await newOrg.setLogo({ file: logoFile })
          console.log('[OrgSwitcher] Logo uploaded successfully')
        } catch (logoError) {
          console.error('[OrgSwitcher] Error uploading logo:', logoError)
          // Don't fail the whole process if logo upload fails
          toast.warning('Organization created but logo upload failed')
        }
      }

      toast.success('Organization created successfully')

      // Switch to the new organization
      console.log('[OrgSwitcher] Switching to new organization:', newOrg.id)
      if (setActive) {
        await setActive({ organization: newOrg.id })
        console.log('[OrgSwitcher] Organization activated')
      }

      resetForm()
      setIsOpen(false)

      // Force page reload to ensure organization context is updated
      console.log('[OrgSwitcher] Reloading page to refresh context')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error: any) {
      console.error('[OrgSwitcher] Error creating organization:', error)
      console.error('[OrgSwitcher] Error details:', {
        message: error?.message,
        errors: error?.errors,
        status: error?.status,
      })

      const errorMessage = error?.errors?.[0]?.longMessage ||
                          error?.errors?.[0]?.message ||
                          error?.message ||
                          'Failed to create organization'

      toast.error(errorMessage)
      setIsCreatingOrg(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sidebar-text group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {organization?.name || 'Personal'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">Switch Organization</div>

            {/* Personal Account */}
            <button
              onClick={() => handleSwitchOrganization('')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                !organization ? 'bg-accent-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white text-sm font-medium">
                  P
                </div>
                <span className="text-sm font-medium text-gray-900">Personal</span>
              </div>
              {!organization && <Check className="h-4 w-4 text-accent" />}
            </button>

            {/* Organization List */}
            {!isLoaded && (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                Loading organizations...
              </div>
            )}
            {isLoaded && organizationList && organizationList.length > 0 ? (
              organizationList.map((membership) => (
                <button
                  key={membership.organization.id}
                  onClick={() => handleSwitchOrganization(membership.organization.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                    organization?.id === membership.organization.id ? 'bg-accent-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {membership.organization.imageUrl ? (
                      <img
                        src={membership.organization.imageUrl}
                        alt={membership.organization.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white text-sm font-medium">
                        {membership.organization.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{membership.organization.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{membership.role?.replace('org:', '') || 'member'}</div>
                    </div>
                  </div>
                  {organization?.id === membership.organization.id && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))
            ) : isLoaded && (!organizationList || organizationList.length === 0) ? (
              <div className="px-3 py-2 text-xs text-gray-500">
                No organizations yet. Create one below!
              </div>
            ) : null}
          </div>

          <div className="border-t border-gray-200 p-2">
            <button
              onClick={() => {
                setShowCreateModal(true)
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Create Organization
            </button>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create organization</h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateOrganization} className="p-6 space-y-5">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Logo
                </label>
                <p className="text-xs text-gray-500 mb-3">Recommended size 1:1, up to 2MB.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload image
                </button>
                {logoPreview && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null)
                        setLogoPreview(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Enter a name for your organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                  disabled={isCreatingOrg}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Slug <span className="text-gray-500 text-xs font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={newOrgSlug}
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    setNewOrgSlug(slug)
                  }}
                  placeholder="Enter a slug for your organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent"
                  disabled={isCreatingOrg}
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly identifier (auto-generated if empty)
                </p>
              </div>

              {/* Assign creator - Info only */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Assign creator <span className="text-gray-500 text-xs font-normal">Optional</span>
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center gap-2">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={user.fullName || ''} className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs">
                        {user?.firstName?.[0] || 'U'}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">
                      {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'You'}
                      <span className="text-xs text-gray-500 ml-2">(Creator)</span>
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You will be automatically assigned as the admin
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isCreatingOrg}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newOrgName.trim() || isCreatingOrg}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingOrg ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for sidebar
export function OrganizationSwitcherCompact() {
  return (
    <div className="px-3 py-2">
      <OrganizationSwitcher />
    </div>
  )
}
