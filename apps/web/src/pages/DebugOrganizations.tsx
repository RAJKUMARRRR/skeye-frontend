import { useOrganization, useOrganizationList, useUser } from '@clerk/clerk-react'
import { Card } from '@fleet/ui-web'

export function DebugOrganizations() {
  const { user } = useUser()
  const { organization, membership } = useOrganization()
  const {
    userMemberships,
    isLoaded,
    setActive,
    createOrganization
  } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  // Map userMemberships to organizationList for compatibility
  const organizationList = userMemberships?.data

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Debug</h1>
        <p className="text-gray-600">Debug information for Clerk Organizations</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>
        <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto">
          {JSON.stringify({ id: user?.id, email: user?.primaryEmailAddress?.emailAddress }, null, 2)}
        </pre>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Current Organization</h2>
        <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            {
              id: organization?.id,
              name: organization?.name,
              membersCount: organization?.membersCount,
              role: membership?.role,
            },
            null,
            2
          )}
        </pre>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Organization List</h2>
        <div className="space-y-2 mb-4">
          <p>
            <strong>Is Loaded:</strong> {isLoaded ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Count:</strong> {organizationList?.length || 0}
          </p>
        </div>
        <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(
            organizationList?.map((org) => ({
              id: org.organization.id,
              name: org.organization.name,
              role: org.membership.role,
              createdAt: org.organization.createdAt,
            })),
            null,
            2
          )}
        </pre>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="space-y-4">
          <button
            onClick={async () => {
              try {
                console.log('[Debug] Creating test organization...')
                const timestamp = Date.now()

                if (!createOrganization) {
                  alert('Organization creation not available. Check Clerk settings.')
                  return
                }

                const newOrg = await createOrganization({
                  name: `Test Organization ${timestamp}`,
                  slug: `test-org-${timestamp}`,
                })
                console.log('[Debug] Organization created:', newOrg)
                console.log('[Debug] Organization ID:', newOrg?.id)
                console.log('[Debug] Organization Name:', newOrg?.name)
                console.log('[Debug] Organization Slug:', newOrg?.slug)
                alert(
                  `Organization created!\n\nID: ${newOrg?.id}\nName: ${newOrg?.name}\nSlug: ${newOrg?.slug}\n\nCheck console for full details.`
                )

                // Reload to refresh the list
                setTimeout(() => window.location.reload(), 1000)
              } catch (error: any) {
                console.error('[Debug] Error creating organization:', error)
                console.error('[Debug] Error details:', {
                  message: error?.message,
                  errors: error?.errors,
                  status: error?.status,
                  clerkTraceId: error?.clerkTraceId,
                })
                alert(
                  `Error: ${error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error.message}\n\nCheck console for full details.`
                )
              }
            }}
            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-600"
          >
            Create Test Organization
          </button>

          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Note:</strong> If organization creation appears successful but organizations don't appear:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Check if Organizations feature is enabled in Clerk Dashboard</li>
              <li>Verify the API response includes an organization ID</li>
              <li>Check browser console for detailed logs</li>
              <li>Try refreshing the page after creation</li>
              <li>Check Clerk Dashboard → Organizations to see if it was created there</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <h2 className="text-lg font-semibold mb-2">Important Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Organizations must be enabled in your Clerk Dashboard</li>
          <li>Go to: Clerk Dashboard → Configure → Features → Organizations</li>
          <li>Enable "Organizations" feature</li>
          <li>After enabling, you may need to restart your dev server</li>
          <li>Check browser console for any Clerk errors</li>
        </ul>
      </Card>
    </div>
  )
}
