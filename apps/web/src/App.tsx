import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { Toaster } from './components/Toast'
import { OrganizationGuard } from './components/OrganizationGuard'

function AppRoutes() {
  return useRoutes(routes)
}

function App() {
  return (
    <BrowserRouter>
      <OrganizationGuard>
        <AppRoutes />
        <Toaster />
      </OrganizationGuard>
    </BrowserRouter>
  )
}

export default App
