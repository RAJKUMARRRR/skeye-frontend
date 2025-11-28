import { useState, useRef, useEffect } from 'react'
import { useOrganization, useUser } from '@clerk/clerk-react'
import {
  Building2,
  Users,
  Settings as SettingsIcon,
  Camera,
  Mail,
  UserPlus,
  Trash2,
  Shield,
  Crown,
  X,
  Link as LinkIcon,
  Globe,
  Lock,
  Unlock,
  Tag,
  FileText,
  Plus,
  Edit,
  Check,
  AlertTriangle,
} from 'lucide-react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { toast } from 'sonner'

type Tab = 'general' | 'members' | 'advanced' | 'settings'

export function OrganizationSettings() {
  const { organization, membership } = useOrganization()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<Tab>('general')

  // Redirect to personal if no organization selected
  if (!organization) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Please select an organization from the sidebar to manage organization settings.
          </p>
        </div>
      </div>
    )
  }

  const isAdmin = membership?.role === 'admin' || membership?.role === 'org:admin'

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your organization profile, members, and settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralTab organization={organization} membership={membership} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <MembersTab organization={organization} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <AdvancedTab organization={organization} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SecurityTab organization={organization} isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GeneralTab({ organization, membership, isAdmin }: { organization: any; membership: any; isAdmin: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [orgName, setOrgName] = useState(organization?.name || '')
  const [orgSlug, setOrgSlug] = useState(organization?.slug || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasLogo, setHasLogo] = useState(organization?.hasImage)

  const handleLogoClick = () => {
    if (!isAdmin) {
      toast.error('Only admins can update the organization logo')
      return
    }
    fileInputRef.current?.click()
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    try {
      await organization.setLogo({ file })
      setHasLogo(true)
      toast.success('Organization logo updated successfully')
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast.error('Failed to update logo')
    }
  }

  const handleRemoveLogo = async () => {
    if (!confirm('Are you sure you want to remove the organization logo?')) return

    try {
      await organization.setLogo({ file: null })
      setHasLogo(false)
      toast.success('Organization logo removed')
    } catch (error) {
      console.error('Error removing logo:', error)
      toast.error('Failed to remove logo')
    }
  }

  const handleSaveChanges = async () => {
    if (!isAdmin) {
      toast.error('Only admins can update organization settings')
      return
    }

    setIsUpdating(true)
    try {
      await organization.update({
        name: orgName,
        slug: orgSlug || undefined,
      })
      toast.success('Organization updated successfully')
    } catch (error: any) {
      console.error('Error updating organization:', error)
      toast.error(error?.errors?.[0]?.message || 'Failed to update organization')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setOrgName(organization.name)
    setOrgSlug(organization.slug || '')
    toast.info('Changes discarded')
  }

  const hasChanges = orgName !== organization.name || orgSlug !== (organization.slug || '')

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Organization Logo</h3>
        <div className="flex items-start gap-6">
          <div className="relative">
            {organization.imageUrl ? (
              <img
                src={organization.imageUrl}
                alt={organization.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white text-3xl font-medium border-2 border-gray-200">
                {organization.name.charAt(0).toUpperCase()}
              </div>
            )}
            {isAdmin && (
              <button
                onClick={handleLogoClick}
                className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-white hover:bg-accent-600 transition-colors shadow-md"
                title="Change logo"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{organization.name}</p>
            <p className="text-xs text-gray-600 mt-1">
              {organization.membersCount} {organization.membersCount === 1 ? 'member' : 'members'}
            </p>
            {isAdmin && hasLogo && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-error border-error hover:bg-error-50"
                onClick={handleRemoveLogo}
              >
                <Trash2 className="w-3 h-3 mr-1.5" />
                Remove Logo
              </Button>
            )}
            <p className="text-xs text-gray-500 mt-3">
              Recommended: Square image, at least 512x512px, max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Organization Information */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Organization Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={!isAdmin}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent ${
                !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
              }`}
              placeholder="Acme Corporation"
            />
            {!isAdmin && (
              <p className="text-xs text-gray-500 mt-1">Only admins can change organization name</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Organization Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">skeye.app/org/</span>
              <input
                type="text"
                value={orgSlug}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                  setOrgSlug(slug)
                }}
                disabled={!isAdmin}
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent ${
                  !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                }`}
                placeholder="acme-corp"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly identifier for your organization. Only lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization ID</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={organization.id}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(organization.id)
                  toast.success('Organization ID copied to clipboard')
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use this ID for API integrations and webhooks
            </p>
          </div>

          {isAdmin && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={handleCancel} disabled={isUpdating || !hasChanges}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveChanges}
                disabled={isUpdating || !hasChanges}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Organization Details */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Created</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(organization.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Your Role</p>
            <p className="text-sm font-semibold text-gray-900 capitalize flex items-center gap-2">
              {membership?.role === 'org:admin' && <Crown className="w-4 h-4 text-accent" />}
              {membership?.role?.replace('org:', '') || 'Member'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Total Members</p>
            <p className="text-sm font-semibold text-gray-900">{organization.membersCount}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">
              Pending Invitations
            </p>
            <p className="text-sm font-semibold text-gray-900">{organization.pendingInvitationsCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MembersTab({ organization, isAdmin }: { organization: any; isAdmin: boolean }) {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('org:member')
  const [isInviting, setIsInviting] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [newRole, setNewRole] = useState('')

  // Load members and invitations
  useEffect(() => {
    const loadData = async () => {
      try {
        const [membersData, invitationsData] = await Promise.all([
          organization.getMemberships(),
          organization.getInvitations(),
        ])
        setMembers(membersData.data || [])
        setInvitations(invitationsData.data || [])
      } catch (error) {
        console.error('Error loading members:', error)
        toast.error('Failed to load members')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    setIsInviting(true)
    try {
      await organization.inviteMember({
        emailAddress: inviteEmail,
        role: inviteRole,
      })
      toast.success('Invitation sent successfully')
      setShowInviteDialog(false)
      setInviteEmail('')
      setInviteRole('org:member')

      // Refresh invitations
      const invitationsData = await organization.getInvitations()
      setInvitations(invitationsData.data || [])
    } catch (error: any) {
      console.error('Error inviting member:', error)
      toast.error(error?.errors?.[0]?.message || 'Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await organization.updateMember({
        userId,
        role,
      })
      toast.success('Member role updated successfully')
      setEditingMember(null)

      // Refresh members
      const membersData = await organization.getMemberships()
      setMembers(membersData.data || [])
    } catch (error: any) {
      console.error('Error updating member role:', error)
      toast.error(error?.errors?.[0]?.message || 'Failed to update role')
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      await organization.removeMember(userId)
      toast.success('Member removed successfully')
      setMembers(members.filter((m) => m.publicUserData.userId !== userId))
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Failed to remove member')
    }
  }

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      await organization.revokeInvitation(invitationId)
      toast.success('Invitation revoked')
      setInvitations(invitations.filter((i) => i.id !== invitationId))
    } catch (error) {
      console.error('Error revoking invitation:', error)
      toast.error('Failed to revoke invitation')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Members */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Team Members</h3>
              <p className="text-xs text-gray-600 mt-1">
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </p>
            </div>
            {isAdmin && (
              <Button variant="default" size="sm" onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {member.publicUserData.imageUrl ? (
                    <img
                      src={member.publicUserData.imageUrl}
                      alt={member.publicUserData.firstName || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white text-sm font-medium">
                      {member.publicUserData.firstName?.[0] || member.publicUserData.identifier?.[0] || 'U'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {member.publicUserData.firstName && member.publicUserData.lastName
                        ? `${member.publicUserData.firstName} ${member.publicUserData.lastName}`
                        : member.publicUserData.identifier}
                    </p>
                    <p className="text-xs text-gray-600">{member.publicUserData.identifier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {editingMember === member.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                      >
                        <option value="org:member">Member</option>
                        <option value="org:admin">Admin</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateRole(member.publicUserData.userId, newRole)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMember(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md capitalize flex items-center gap-1">
                          {member.role === 'org:admin' && <Crown className="w-3 h-3 text-accent" />}
                          {member.role.replace('org:', '')}
                        </span>
                        {isAdmin && member.role !== 'org:admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingMember(member.id)
                              setNewRole(member.role)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      {isAdmin && member.role !== 'org:admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-error border-error hover:bg-error-50"
                          onClick={() => handleRemoveMember(member.publicUserData.userId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-base font-semibold text-gray-900">Pending Invitations</h4>
            <p className="text-xs text-gray-600 mt-1">
              {invitations.length} {invitations.length === 1 ? 'invitation' : 'invitations'} pending
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Mail className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invitation.emailAddress}</p>
                      <p className="text-xs text-gray-600">
                        Invited {new Date(invitation.createdAt).toLocaleDateString()} •{' '}
                        <span className="capitalize">{invitation.role.replace('org:', '')}</span>
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-error border-error hover:bg-error-50"
                      onClick={() => handleRevokeInvitation(invitation.id)}
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                >
                  <option value="org:member">Member</option>
                  <option value="org:admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Admin:</strong> Can manage organization settings, members, and all data
                  <br />
                  <strong>Member:</strong> Can view and manage assigned data only
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteDialog(false)
                    setInviteEmail('')
                    setInviteRole('org:member')
                  }}
                  disabled={isInviting}
                  type="button"
                >
                  Cancel
                </Button>
                <Button variant="default" type="submit" disabled={isInviting}>
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AdvancedTab({ organization, isAdmin }: { organization: any; isAdmin: boolean }) {
  const [metadata, setMetadata] = useState<Record<string, string>>(organization.publicMetadata || {})
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [maxMembers, setMaxMembers] = useState(organization.maxAllowedMemberships || 100)

  const handleAddMetadata = () => {
    if (!newKey.trim()) {
      toast.error('Please enter a key')
      return
    }
    setMetadata({ ...metadata, [newKey]: newValue })
    setNewKey('')
    setNewValue('')
  }

  const handleRemoveMetadata = (key: string) => {
    const newMetadata = { ...metadata }
    delete newMetadata[key]
    setMetadata(newMetadata)
  }

  const handleSaveMetadata = async () => {
    if (!isAdmin) {
      toast.error('Only admins can update metadata')
      return
    }

    setIsUpdating(true)
    try {
      await organization.update({
        publicMetadata: metadata,
      })
      toast.success('Metadata updated successfully')
    } catch (error: any) {
      console.error('Error updating metadata:', error)
      toast.error(error?.errors?.[0]?.message || 'Failed to update metadata')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveMaxMembers = async () => {
    if (!isAdmin) {
      toast.error('Only admins can update settings')
      return
    }

    setIsUpdating(true)
    try {
      await organization.update({
        maxAllowedMemberships: maxMembers,
      })
      toast.success('Maximum members limit updated')
    } catch (error: any) {
      console.error('Error updating max members:', error)
      toast.error(error?.errors?.[0]?.message || 'Failed to update limit')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Custom Metadata */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Custom Metadata
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Add custom fields to store additional organization information
          </p>
        </div>

        {/* Existing Metadata */}
        {Object.keys(metadata).length > 0 && (
          <div className="space-y-2 mb-4">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{key}</p>
                  <p className="text-xs text-gray-600">{value}</p>
                </div>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMetadata(key)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Metadata */}
        {isAdmin && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Key (e.g., industry)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent text-sm"
              />
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Value (e.g., Technology)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent text-sm"
              />
              <Button variant="outline" onClick={handleAddMetadata}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="default"
              onClick={handleSaveMetadata}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? 'Saving...' : 'Save Metadata'}
            </Button>
          </div>
        )}
      </div>

      {/* Member Limits */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Member Limits
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Control the maximum number of members allowed in this organization
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Members
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value) || 0)}
              disabled={!isAdmin}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent ${
                !isAdmin ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Current members: {organization.membersCount} / {maxMembers}
            </p>
          </div>

          {isAdmin && (
            <Button
              variant="default"
              onClick={handleSaveMaxMembers}
              disabled={isUpdating || maxMembers === organization.maxAllowedMemberships}
              className="w-full"
            >
              {isUpdating ? 'Saving...' : 'Update Limit'}
            </Button>
          )}
        </div>
      </div>

      {/* Organization Visibility */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Visibility Settings
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Control who can discover and join your organization
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Private Organization</p>
                <p className="text-xs text-gray-600 mt-1">Only invited members can join</p>
              </div>
            </div>
            <span className="text-xs font-medium text-accent bg-accent-50 px-2.5 py-1 rounded-md">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecurityTab({ organization, isAdmin }: { organization: any; isAdmin: boolean }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteOrganization = async () => {
    try {
      await organization.destroy()
      toast.success('Organization deleted successfully')
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting organization:', error)
      toast.error('Failed to delete organization')
    }
  }

  return (
    <div className="space-y-6">
      {/* Permissions */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissions & Access Control
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Manage organization permissions and access levels
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Member Invitations</p>
                <p className="text-xs text-gray-600 mt-1">Who can invite new members</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
              Admins only
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Settings Access</p>
                <p className="text-xs text-gray-600 mt-1">Who can modify organization settings</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
              Admins only
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Data Access</p>
                <p className="text-xs text-gray-600 mt-1">View all organization data</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
              All members
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Data Modification</p>
                <p className="text-xs text-gray-600 mt-1">Create, update, delete organization data</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
              Admins & Managers
            </span>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security Features
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Security settings and compliance features
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Verification Required</p>
                <p className="text-xs text-gray-600 mt-1">All members must verify their email</p>
              </div>
            </div>
            <span className="text-xs font-medium text-accent bg-accent-50 px-2.5 py-1 rounded-md">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-gray-900">Secure Authentication</p>
                <p className="text-xs text-gray-600 mt-1">Powered by Clerk authentication</p>
              </div>
            </div>
            <span className="text-xs font-medium text-accent bg-accent-50 px-2.5 py-1 rounded-md">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-gray-900">Data Encryption</p>
                <p className="text-xs text-gray-600 mt-1">All data encrypted in transit and at rest</p>
              </div>
            </div>
            <span className="text-xs font-medium text-accent bg-accent-50 px-2.5 py-1 rounded-md">
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      {isAdmin && (
        <div className="bg-white border border-error-200 rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-error flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-xs text-error-600 mt-1">
              Irreversible and destructive actions
            </p>
          </div>

          <div className="flex items-start justify-between p-4 bg-error-50 border border-error-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-error mt-0.5" />
              <div>
                <p className="text-sm font-medium text-error">Delete Organization</p>
                <p className="text-xs text-error-600 mt-1">
                  Permanently delete this organization and all associated data. This action cannot be undone.
                  All members will lose access immediately.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-error border-error hover:bg-error-50 whitespace-nowrap ml-4"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>

          {/* Delete Confirmation Dialog */}
          {showDeleteDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-error-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-error" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Organization</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Are you absolutely sure you want to delete <strong>{organization.name}</strong>?
                    </p>
                  </div>
                </div>

                <div className="bg-error-50 border border-error-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-error-800">
                    <strong>Warning:</strong> This action cannot be undone. This will:
                  </p>
                  <ul className="text-xs text-error-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Delete all organization data permanently</li>
                    <li>Remove all {organization.membersCount} members</li>
                    <li>Cancel any pending invitations</li>
                    <li>Revoke all API access</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className="bg-error hover:bg-error-600"
                    onClick={() => {
                      setShowDeleteDialog(false)
                      handleDeleteOrganization()
                    }}
                  >
                    Delete Organization
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
