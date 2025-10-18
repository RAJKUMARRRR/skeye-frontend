import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { Toaster } from 'sonner'
// import { startMockServer } from '@fleet/api/mocks/browser' // TODO: Uncomment when @fleet/api package is implemented
import { AuthProvider } from './features/auth/contexts/AuthContext'
import { PermissionProvider } from './features/auth/contexts/PermissionContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
})

async function init() {
  // TODO: Uncomment when @fleet/api package is implemented
  // try {
  //   await startMockServer()
  // } catch (error) {
  //   console.error('Failed to start mock server:', error)
  // }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AuthProvider>
            <PermissionProvider>
              <QueryClientProvider client={queryClient}>
                <App />
                <Toaster position="top-right" richColors />
              </QueryClientProvider>
            </PermissionProvider>
          </AuthProvider>
        </ClerkProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}

init()
