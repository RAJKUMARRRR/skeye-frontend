import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export function SSOCallback() {
  const navigate = useNavigate()

  return (
    <AuthenticateWithRedirectCallback
      afterSignInUrl="/select-organization"
      afterSignUpUrl="/select-organization"
      redirectUrl="/select-organization"
      signInFallbackRedirectUrl="/select-organization"
      signUpFallbackRedirectUrl="/select-organization"
      continueSignUpUrl="/select-organization"
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent mb-4"></div>
          <p className="text-gray-600">Completing sign in...</p>
        </div>
      </div>
    </AuthenticateWithRedirectCallback>
  )
}
