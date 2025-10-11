import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { startMockServer } from '@fleet/api/mocks/browser' // TODO: Uncomment when @fleet/api package is implemented
import { AuthProvider } from './features/auth/contexts/AuthContext'
import { PermissionProvider } from './features/auth/contexts/PermissionContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './App'
import './index.css'

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
        <AuthProvider>
          <PermissionProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </PermissionProvider>
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}

init()
