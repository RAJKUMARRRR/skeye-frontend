# Organization Invitation Flow

## How It Works

### Scenario 1: Inviting an Existing Clerk User

1. **Admin invites user** via Organization Settings → Members → "Invite Member"
2. **User receives email** with invitation link
3. **User clicks link** → Clerk recognizes existing account
4. **Redirects to sign-in** → User signs in
5. **Auto-added to organization** → Clerk automatically adds them
6. **Redirects to `/select-organization`** → Shows all their organizations
7. **Auto-selects if only one org** → If they only have one organization, automatically selects it and redirects to `/dashboard`

### Scenario 2: Inviting a Non-Existing User (No Clerk Account)

1. **Admin invites user** via Organization Settings → Members → "Invite Member"
2. **User receives email** with invitation link
3. **User clicks link** → Clerk detects no account exists
4. **Redirects to sign-up** → User creates account with Google/Email
5. **Account created** → Clerk creates new user account
6. **Auto-added to organization** → Clerk automatically adds them to the invited organization
7. **Redirects to `/select-organization`** → Shows their organization(s)
8. **Auto-selects if only one org** → Since they were invited to one org, automatically selects it and redirects to `/dashboard`

## Auto-Selection Logic

In `SelectOrganization.tsx` (lines 29-34):

```typescript
useEffect(() => {
  if (isLoaded && organizationList && organizationList.length === 1) {
    // Auto-select if only one organization
    handleSelectOrganization(organizationList[0].organization.id)
  }
}, [isLoaded, organizationList])
```

**This ensures:**
- ✅ New users invited to an organization don't see a selection screen
- ✅ They're automatically put into their organization
- ✅ Redirected directly to the dashboard
- ✅ Seamless onboarding experience

## User Scenarios

### New User Flow (Invited, No Account):
```
Invitation Email
  ↓
Click Link → Clerk Sign-Up Page
  ↓
Create Account (Google/Email)
  ↓
[Clerk auto-adds to organization]
  ↓
/select-organization (auto-selects since only 1 org)
  ↓
/dashboard (in organization context)
```

### Existing User Flow (Invited, Has Account):
```
Invitation Email
  ↓
Click Link → Clerk Sign-In Page
  ↓
Sign In
  ↓
[Clerk auto-adds to organization]
  ↓
/select-organization (shows all orgs, may auto-select if only 1)
  ↓
User selects organization OR auto-redirect
  ↓
/dashboard (in organization context)
```

### User with Multiple Organizations:
```
/select-organization
  ↓
Shows:
  - Personal Account
  - Organization A (admin)
  - Organization B (member)
  - [+ Create new organization]
  ↓
User manually selects
  ↓
/dashboard
```

## Required Clerk Dashboard Configuration

### 1. Paths Settings
Go to: Clerk Dashboard → Paths

Set these URLs:
```
Sign-in URL: http://localhost:4001/sign-in
Sign-up URL: http://localhost:4001/sign-up
After sign-in URL: http://localhost:4001/select-organization
After sign-up URL: http://localhost:4001/select-organization
Home URL: http://localhost:4001
```

### 2. Organizations Settings
Go to: Clerk Dashboard → Organizations → Settings

Ensure enabled:
- ✅ Organizations feature
- ✅ Allow users to create organizations
- ✅ Allow users to join organizations via invitation

### 3. Domains
Go to: Clerk Dashboard → Domains

Add:
- `localhost:4001` (development)
- Your production domain (when deploying)

## Testing the Flow

### Test Case 1: Invite Existing User
1. Create an organization
2. Invite a user who already has a Clerk account (use a different email you control)
3. Check their email and click invitation link
4. Verify they're redirected to sign-in
5. Sign in and verify they land in the organization dashboard

### Test Case 2: Invite Non-Existing User
1. Create an organization
2. Invite a user who **doesn't** have a Clerk account (use a new email)
3. Check their email and click invitation link
4. Verify they're redirected to sign-up
5. Complete sign-up with Google or email
6. Verify they're automatically added to organization and land in dashboard

### Test Case 3: User with Multiple Organizations
1. Create two organizations
2. Invite the same user to both organizations
3. User signs in
4. Verify `/select-organization` page shows both organizations
5. Verify user can switch between them

## Troubleshooting

### Issue: User gets "default-redirect" error
**Cause:** Clerk Dashboard redirect URLs not configured
**Solution:** Follow "Required Clerk Dashboard Configuration" above

### Issue: User not auto-added to organization
**Cause:** Organizations feature not enabled
**Solution:** Go to Clerk Dashboard → Organizations → Enable feature

### Issue: User sees blank organization list
**Cause:** Invitation not accepted or data not loaded
**Solution:**
1. Check Clerk Dashboard → Organizations → Members → Pending Invitations
2. Ensure user clicked the invitation link
3. Check browser console for errors

### Issue: Auto-selection not working
**Cause:** User has multiple organizations or personal account
**Solution:** This is expected behavior - user should manually select

## Production Deployment

When deploying to production, update these URLs in Clerk Dashboard:

```
Sign-in URL: https://app.yourdomain.com/sign-in
Sign-up URL: https://app.yourdomain.com/sign-up
After sign-in URL: https://app.yourdomain.com/select-organization
After sign-up URL: https://app.yourdomain.com/select-organization
Home URL: https://app.yourdomain.com
```

Add production domain to allowed domains list.

## Security Notes

- ✅ Clerk validates invitation tokens automatically
- ✅ Users can only join organizations they're invited to
- ✅ Organization admins control member permissions
- ✅ Invitations can be revoked before acceptance
- ✅ All redirects are validated by Clerk

## Support

If issues persist:
1. Check browser console for errors (look for `[OrgSelect]` logs)
2. Verify Clerk Dashboard configuration
3. Check Clerk Dashboard → Organizations → Members to see invitation status
4. Ensure Organizations feature is fully enabled
