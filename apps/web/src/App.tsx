import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Vehicles } from './pages/Vehicles'
import { LiveTracking } from './pages/LiveTracking'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="live-tracking" element={<LiveTracking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
