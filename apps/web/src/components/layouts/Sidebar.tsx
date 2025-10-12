import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Truck,
  Users,
  Route,
  MapPinned,
  Navigation,
  Wrench,
  Fuel,
  Bell,
  FileText,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react'
import { usePermissions } from '../../features/auth/contexts/PermissionContext'

interface NavigationItem {
  name: string
  path: string
  icon: React.ElementType
  requiredRole?: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Live Tracking', path: '/tracking', icon: MapPin },
  { name: 'Vehicles', path: '/vehicles', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Trips', path: '/trips', icon: Route },
  { name: 'Geofences', path: '/geofences', icon: MapPinned },
  { name: 'Routes', path: '/routes', icon: Navigation },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Fuel', path: '/fuel', icon: Fuel },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings, requiredRole: 'manager' },
]

export function Sidebar() {
  const { hasRole } = usePermissions()

  const filteredNavigation = navigation.filter((item) => {
    if (!item.requiredRole) return true
    return hasRole(item.requiredRole)
  })

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-accent/30">
            <Truck className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-text font-display tracking-tight">
            Fleet<span className="text-accent font-bold">Hub</span>
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-sidebar-text-muted hover:text-white hover:bg-sidebar-hover border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent' : ''}`} />
                  <span className="flex-1">{item.name}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-dark rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-xs font-medium text-sidebar-text">Online</p>
          </div>
          <p className="text-xs text-sidebar-text-muted mt-1">All systems operational</p>
        </div>
      </div>
    </aside>
  )
}
