import { NavLink } from 'react-router-dom'
import { usePermissions } from '../../features/auth/contexts/PermissionContext'

interface NavigationItem {
  name: string
  path: string
  icon: string
  requiredRole?: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Live Tracking', path: '/tracking', icon: '📍' },
  { name: 'Vehicles', path: '/vehicles', icon: '🚗' },
  { name: 'Drivers', path: '/drivers', icon: '👤' },
  { name: 'Trips', path: '/trips', icon: '🗺️' },
  { name: 'Geofences', path: '/geofences', icon: '⬛' },
  { name: 'Routes', path: '/routes', icon: '🛣️' },
  { name: 'Maintenance', path: '/maintenance', icon: '🔧' },
  { name: 'Fuel', path: '/fuel', icon: '⛽' },
  { name: 'Alerts', path: '/alerts', icon: '🔔' },
  { name: 'Reports', path: '/reports', icon: '📈' },
  { name: 'Analytics', path: '/analytics', icon: '📉' },
  { name: 'Settings', path: '/settings', icon: '⚙️', requiredRole: 'manager' },
]

export function Sidebar() {
  const { hasRole } = usePermissions()

  const filteredNavigation = navigation.filter((item) => {
    if (!item.requiredRole) return true
    return hasRole(item.requiredRole)
  })

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Fleet Manager</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
