import { useState } from 'react'
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
  Zap,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react'
import { usePermissions } from '../../features/auth/contexts/PermissionContext'

interface SubNavigationItem {
  name: string
  path: string
}

interface NavigationItem {
  name: string
  path: string
  icon: React.ElementType
  requiredRole?: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
  subItems?: SubNavigationItem[]
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Live Tracking', path: '/tracking', icon: MapPin },
  { name: 'Vehicles', path: '/vehicles', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Trips', path: '/trips', icon: Route },
  { name: 'Geofences', path: '/geofences', icon: MapPinned },
  {
    name: 'Routes',
    path: '/routes',
    icon: Navigation,
    subItems: [
      { name: 'Route Planner', path: '/routes/planner' },
      { name: 'Live Map', path: '/routes/map' },
      { name: 'Route History', path: '/routes/history' },
    ]
  },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Fuel', path: '/fuel', icon: Fuel },
  {
    name: 'Alerts',
    path: '/alerts',
    icon: Bell,
    subItems: [
      { name: 'Alerts', path: '/alerts' },
      { name: 'Rules', path: '/alerts/rules' },
      { name: 'Routing', path: '/alerts/routing' },
      { name: 'Escalation', path: '/alerts/escalation' },
      { name: 'History', path: '/alerts/history' },
      { name: 'Muting', path: '/alerts/muting' },
      { name: 'Quiet Hours', path: '/alerts/quiet-hours' },
      { name: 'Notifications', path: '/alerts/notifications' },
    ]
  },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings, requiredRole: 'manager' },
]

export function Sidebar() {
  const { hasRole } = usePermissions()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const filteredNavigation = navigation.filter((item) => {
    if (!item.requiredRole) return true
    return hasRole(item.requiredRole)
  })

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-accent/30">
            <Truck className="w-5 h-5 text-accent" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-sidebar-text font-display tracking-tight">
              Fleet<span className="text-accent font-bold">Hub</span>
            </h1>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-text-muted hover:text-white transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <div className="px-3 pt-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-sidebar-text-muted hover:text-white hover:bg-sidebar-hover transition-all"
            title="Expand sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.name)
          const hasSubItems = item.subItems && item.subItems.length > 0

          return (
            <div key={item.path}>
              {/* Main navigation item */}
              {hasSubItems && !isCollapsed ? (
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className="group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative text-sidebar-text-muted hover:text-white hover:bg-sidebar-hover w-full"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `group flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? 'bg-sidebar-active text-white'
                        : 'text-sidebar-text-muted hover:text-white hover:bg-sidebar-hover'
                    }`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                      )}
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'ml-1' : ''}`} />
                      {!isCollapsed && <span className="flex-1">{item.name}</span>}
                    </>
                  )}
                </NavLink>
              )}

              {/* Sub-items */}
              {hasSubItems && isExpanded && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-0.5 border-l border-sidebar-border pl-4">
                  {item.subItems!.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 rounded-md text-sm transition-colors relative overflow-hidden ${
                          isActive
                            ? 'text-white bg-sidebar-active'
                            : 'text-sidebar-text-muted hover:text-white hover:bg-sidebar-hover'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />
                          )}
                          <span className={isActive ? 'ml-1' : ''}>{subItem.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="bg-sidebar-dark rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <p className="text-xs font-medium text-sidebar-text">Online</p>
            </div>
            <p className="text-xs text-sidebar-text-muted mt-1">All systems operational</p>
          </div>
        </div>
      )}
    </aside>
  )
}
