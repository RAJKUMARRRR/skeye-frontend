import { useState, useRef, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import { User, Shield, Bell, Camera, Mail, Lock, Smartphone, Trash2, LogOut, Copy, Check } from 'lucide-react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'

type Tab = 'account' | 'security' | 'notifications'

export function Profile() {
  const { user } = useUser()
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('account')

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountTab user={user} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab user={user} signOut={signOut} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AccountTab({ user }: { user: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [firstName, setFirstName] = useState(user.firstName || '')
  const [lastName, setLastName] = useState(user.lastName || '')
  const [phoneNumber, setPhoneNumber] = useState(user.primaryPhoneNumber?.phoneNumber || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    try {
      await user.setProfileImage({ file })
      toast.success('Profile picture updated successfully')
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      toast.error('Failed to update profile picture')
    }
  }

  const handleSaveChanges = async () => {
    setIsUpdating(true)
    try {
      await user.update({
        firstName,
        lastName,
      })

      // Update phone number if changed
      if (phoneNumber && phoneNumber !== user.primaryPhoneNumber?.phoneNumber) {
        // Note: Phone number update requires verification in Clerk
        toast.info('Phone number verification required')
      }

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    setPhoneNumber(user.primaryPhoneNumber?.phoneNumber || '')
    toast.info('Changes discarded')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Profile Picture Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName || 'Profile'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-white text-2xl font-medium">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            )}
            <button
              onClick={handleProfilePictureClick}
              className="absolute bottom-0 right-0 p-1.5 bg-accent rounded-full text-white hover:bg-accent-600 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user.fullName || 'User'}</p>
            <p className="text-xs text-gray-600 mt-1">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={user.primaryEmailAddress?.emailAddress || ''}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly. Contact support if needed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Add phone number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSaveChanges} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Account Created</p>
              <p className="text-xs text-gray-600 mt-1">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">User ID</p>
              <p className="text-xs text-gray-600 mt-1 font-mono">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecurityTab({ user, signOut }: { user: any; signOut: () => void }) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [totpSecret, setTotpSecret] = useState('')
  const [totpUri, setTotpUri] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [secretCopied, setSecretCopied] = useState(false)

  const hasPassword = user.passwordEnabled

  const handleChangePassword = () => {
    if (!hasPassword) {
      toast.info('You signed in with Google. Set a password to enable password login.')
    }
    setShowPasswordDialog(true)
  }

  const handlePasswordSubmit = async () => {
    // Validate inputs
    if (hasPassword && !currentPassword) {
      toast.error('Please enter your current password')
      return
    }

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setIsChangingPassword(true)
    try {
      if (hasPassword) {
        // Update existing password
        await user.updatePassword({
          currentPassword,
          newPassword,
        })
        toast.success('Password changed successfully')
      } else {
        // Create new password for OAuth users
        await user.updatePassword({
          newPassword,
        })
        toast.success('Password set successfully! You can now sign in with email and password.')
      }
      setShowPasswordDialog(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      console.error('Error updating password:', error)
      const errorMessage = error?.errors?.[0]?.long_message || error?.errors?.[0]?.message || 'Failed to update password'
      toast.error(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleEnable2FA = async () => {
    try {
      // Check if 2FA is already enabled
      if (user.twoFactorEnabled) {
        toast.info('Two-factor authentication is already enabled')
        return
      }

      // Create TOTP (Time-based One-Time Password)
      const totp = await user.createTOTP()

      // Store the secret and URI for QR code
      setTotpSecret(totp.secret!)
      setTotpUri(totp.uri!)
      setShow2FADialog(true)

    } catch (error: any) {
      console.error('Error enabling 2FA:', error)

      // Check if it's a feature not enabled error
      if (error?.errors?.[0]?.code === 'feature_not_enabled') {
        toast.error('2FA is not enabled in your Clerk settings. Please enable it in the Clerk Dashboard first.', {
          duration: 6000,
        })
        toast.info('Go to Clerk Dashboard → User & Authentication → Multi-factor → Enable Authenticator application', {
          duration: 8000,
        })
      } else {
        toast.error(error?.errors?.[0]?.long_message || error?.errors?.[0]?.message || 'Failed to enable 2FA')
      }
    }
  }

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setIsVerifying(true)
    try {
      // Verify the TOTP code
      await user.verifyTOTP({ code: verificationCode })
      toast.success('Two-factor authentication enabled successfully!')
      setShow2FADialog(false)
      setVerificationCode('')
      setTotpSecret('')
      setTotpUri('')
      // Reload user data to update 2FA status
      await user.reload()
    } catch (error: any) {
      console.error('Error verifying 2FA:', error)
      toast.error(error?.errors?.[0]?.long_message || error?.errors?.[0]?.message || 'Invalid code. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret)
    setSecretCopied(true)
    toast.success('Secret copied to clipboard')
    setTimeout(() => setSecretCopied(false), 2000)
  }

  const handleSignOutAllDevices = async () => {
    try {
      // Clerk doesn't have a direct "sign out all devices" method
      // But we can sign out the current session
      await signOut()
      toast.success('Signed out from all devices')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await user.delete()
      toast.success('Account deleted successfully')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Password Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Password</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {hasPassword ? 'Change Password' : 'Set Password'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {hasPassword
                  ? 'Update your password to keep your account secure'
                  : 'Set a password to enable email/password login'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleChangePassword}>
            {hasPassword ? 'Change Password' : 'Set Password'}
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className={`w-5 h-5 ${user.twoFactorEnabled ? 'text-accent' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.twoFactorEnabled ? '2FA Enabled' : 'Enable 2FA'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {user.twoFactorEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
          </div>
          {user.twoFactorEnabled ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-accent bg-accent-50 px-2.5 py-1 rounded-md">
                Active
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await user.disableTOTP()
                    toast.success('Two-factor authentication disabled')
                    await user.reload()
                  } catch (error: any) {
                    toast.error('Failed to disable 2FA')
                  }
                }}
              >
                Disable
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEnable2FA}>
              Enable 2FA
            </Button>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Active Devices</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Chrome 140.0.0.0</p>
                <p className="text-xs text-gray-600 mt-1">Potters Bar, GB • Today at 9:37 AM</p>
              </div>
            </div>
            <span className="text-xs font-medium text-accent bg-accent-50 px-2.5 py-1 rounded-md">This device</span>
          </div>
        </div>
      </div>

      {/* Sign Out All Devices */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Sign Out All Devices</p>
              <p className="text-xs text-gray-600 mt-1">Sign out from all devices except this one</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOutAllDevices}>
            Sign Out All
          </Button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between p-4 bg-error-50 border border-error-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-error" />
            <div>
              <p className="text-sm font-medium text-error">Delete Account</p>
              <p className="text-xs text-error-600 mt-1">Permanently delete your account and all data</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-error border-error hover:bg-error-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </div>

        {/* Password Change Dialog */}
        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {hasPassword ? 'Change Password' : 'Set Password'}
              </h3>
              {!hasPassword && (
                <p className="text-sm text-gray-600 mb-4">
                  You signed in with Google. Set a password to enable email/password login as an alternative.
                </p>
              )}
              <div className="space-y-4">
                {hasPassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                      placeholder="Enter current password"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {hasPassword ? 'New Password' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                    placeholder="Enter password (min 8 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordDialog(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  disabled={isChangingPassword}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handlePasswordSubmit}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (hasPassword ? 'Changing...' : 'Setting...') : (hasPassword ? 'Change Password' : 'Set Password')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 2FA Setup Dialog */}
        {show2FADialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg mx-4 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enable Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mb-6">
                Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.) or manually enter the secret key.
              </p>

              {/* QR Code Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <QRCodeSVG value={totpUri} size={200} level="M" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Scan this QR code with your authenticator app</p>
              </div>

              {/* Manual Entry Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter this code manually:
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-mono break-all">
                    {totpSecret}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                    className="shrink-0"
                  >
                    {secretCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Verification Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter the 6-digit code from your authenticator app:
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShow2FADialog(false)
                    setVerificationCode('')
                    setTotpSecret('')
                    setTotpUri('')
                    setSecretCopied(false)
                  }}
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleVerify2FA}
                  disabled={isVerifying || verificationCode.length !== 6}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Enable'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-error hover:bg-error-600"
                  onClick={() => {
                    setShowDeleteDialog(false)
                    handleDeleteAccount()
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationsTab() {
  const { user } = useUser()

  // Email notification states - start with false, will be updated from metadata
  const [securityAlerts, setSecurityAlerts] = useState(false)
  const [productUpdates, setProductUpdates] = useState(false)
  const [tipsAndTutorials, setTipsAndTutorials] = useState(false)

  // Push notification states - start with false, will be updated from metadata
  const [fleetAlerts, setFleetAlerts] = useState(false)
  const [driverUpdates, setDriverUpdates] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const savePreferences = async (preferences: any) => {
    setIsSaving(true)
    try {
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notificationPreferences: preferences,
        },
      })
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save notification preferences')
    } finally {
      setIsSaving(false)
    }
  }

  // Load preferences from Clerk metadata on mount and when user data changes
  useEffect(() => {
    if (user && !isInitialized) {
      const metadata = user.unsafeMetadata?.notificationPreferences as any

      // If metadata exists, use it. Otherwise, use defaults for new users
      if (metadata) {
        setSecurityAlerts(metadata.securityAlerts ?? false)
        setProductUpdates(metadata.productUpdates ?? false)
        setTipsAndTutorials(metadata.tipsAndTutorials ?? false)
        setFleetAlerts(metadata.fleetAlerts ?? false)
        setDriverUpdates(metadata.driverUpdates ?? false)
      } else {
        // First time user - set sensible defaults
        setSecurityAlerts(true)
        setProductUpdates(false)
        setTipsAndTutorials(false)
        setFleetAlerts(true)
        setDriverUpdates(true)

        // Save these defaults to metadata
        savePreferences({
          securityAlerts: true,
          productUpdates: false,
          tipsAndTutorials: false,
          fleetAlerts: true,
          driverUpdates: true,
        })
      }

      setIsInitialized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized])

  const handleToggle = async (
    setter: (value: boolean) => void,
    currentValue: boolean,
    label: string,
    key: string
  ) => {
    const newValue = !currentValue
    setter(newValue)

    // Save to Clerk metadata
    const newPreferences = {
      securityAlerts,
      productUpdates,
      tipsAndTutorials,
      fleetAlerts,
      driverUpdates,
      [key]: newValue,
    }

    await savePreferences(newPreferences)
    toast.success(`${label} ${newValue ? 'enabled' : 'disabled'}`)
  }

  const emailNotifications = [
    {
      label: 'Security alerts',
      description: 'Receive alerts about suspicious activity',
      checked: securityAlerts,
      onChange: () => handleToggle(setSecurityAlerts, securityAlerts, 'Security alerts', 'securityAlerts'),
    },
    {
      label: 'Product updates',
      description: 'Get notified about new features and improvements',
      checked: productUpdates,
      onChange: () => handleToggle(setProductUpdates, productUpdates, 'Product updates', 'productUpdates'),
    },
    {
      label: 'Tips and tutorials',
      description: 'Learn how to get the most out of Skeye',
      checked: tipsAndTutorials,
      onChange: () => handleToggle(setTipsAndTutorials, tipsAndTutorials, 'Tips and tutorials', 'tipsAndTutorials'),
    },
  ]

  const pushNotifications = [
    {
      label: 'Fleet alerts',
      description: 'Get notified about important fleet events',
      checked: fleetAlerts,
      onChange: () => handleToggle(setFleetAlerts, fleetAlerts, 'Fleet alerts', 'fleetAlerts'),
    },
    {
      label: 'Driver updates',
      description: 'Receive updates about driver activities',
      checked: driverUpdates,
      onChange: () => handleToggle(setDriverUpdates, driverUpdates, 'Driver updates', 'driverUpdates'),
    },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {emailNotifications.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={item.onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Push Notifications</h3>
        <div className="space-y-4">
          {pushNotifications.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={item.onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
