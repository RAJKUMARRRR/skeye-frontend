import { SignIn } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export function SignInPage() {
  const [removedMessage, setRemovedMessage] = useState(false)

  useEffect(() => {
    // Check if user was redirected after being removed
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('message') === 'removed') {
      setRemovedMessage(true)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back to Skeye
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your fleet operations
          </p>
        </div>

        {removedMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Session Cleared</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Your previous session has been cleared. Please sign in again to continue.
                </p>
              </div>
            </div>
          </div>
        )}

        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/select-organization"
          forceRedirectUrl="/select-organization"
        />
      </div>
    </div>
  )
}
