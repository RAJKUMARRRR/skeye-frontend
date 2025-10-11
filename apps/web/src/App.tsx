import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { Toaster } from './components/Toast'

function AppRoutes() {
  return useRoutes(routes)
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  )
}

export default App
