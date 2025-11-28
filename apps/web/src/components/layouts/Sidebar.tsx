import { useState, useMemo, useCallback } from 'react'
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
import { OrganizationSwitcherCompact } from '../OrganizationSwitcher'
import { useFeatureFlags } from '../../hooks/useFeatureFlags'
import type { FeatureKey } from '../../types/features'

interface SubNavigationItem {
  name: string
  path: string
  featureKey?: string // Sub-feature key (e.g., 'routePlanner', 'rules')
}

interface NavigationItem {
  name: string
  path: string
  icon: React.ElementType
  requiredRole?: 'super_admin' | 'admin' | 'manager' | 'dispatcher' | 'driver'
  featureKey?: FeatureKey // Feature flag key
  subItems?: SubNavigationItem[]
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, featureKey: 'dashboard' },
  { name: 'Live Tracking', path: '/tracking', icon: MapPin, featureKey: 'liveTracking' },
  { name: 'Vehicles', path: '/vehicles', icon: Truck, featureKey: 'vehicles' },
  { name: 'Drivers', path: '/drivers', icon: Users, featureKey: 'drivers' },
  { name: 'Trips', path: '/trips', icon: Route, featureKey: 'trips' },
  { name: 'Geofences', path: '/geofences', icon: MapPinned, featureKey: 'geofences' },
  {
    name: 'Routes',
    path: '/routes',
    icon: Navigation,
    featureKey: 'routes',
    subItems: [
      { name: 'Route Planner', path: '/routes/planner', featureKey: 'routePlanner' },
      { name: 'Live Map', path: '/routes/map', featureKey: 'liveMap' },
      { name: 'Route History', path: '/routes/history', featureKey: 'routeHistory' },
    ]
  },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench, featureKey: 'maintenance' },
  { name: 'Fuel', path: '/fuel', icon: Fuel, featureKey: 'fuel' },
  {
    name: 'Alerts',
    path: '/alerts',
    icon: Bell,
    featureKey: 'alerts',
    subItems: [
      { name: 'Alerts', path: '/alerts', featureKey: 'alertsDashboard' },
      { name: 'Rules', path: '/alerts/rules', featureKey: 'rules' },
      { name: 'Routing', path: '/alerts/routing', featureKey: 'routing' },
      { name: 'Escalation', path: '/alerts/escalation', featureKey: 'escalation' },
      { name: 'History', path: '/alerts/history', featureKey: 'history' },
      { name: 'Muting', path: '/alerts/muting', featureKey: 'muting' },
      { name: 'Quiet Hours', path: '/alerts/quiet-hours', featureKey: 'quietHours' },
      { name: 'Notifications', path: '/alerts/notifications', featureKey: 'notifications' },
    ]
  },
  { name: 'Reports', path: '/reports', icon: FileText, featureKey: 'reports' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, featureKey: 'analytics' },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    requiredRole: 'manager',
    featureKey: 'settings',
    subItems: [
      { name: 'Organization', path: '/settings/organization', featureKey: 'organization' },
      { name: 'Users', path: '/settings/users', featureKey: 'users' },
      { name: 'Notifications', path: '/settings/notifications', featureKey: 'notifications' },
      { name: 'Security', path: '/settings/security', featureKey: 'security' },
      { name: 'Appearance', path: '/settings/appearance', featureKey: 'appearance' },
      { name: 'Integrations', path: '/settings/integrations', featureKey: 'integrations' },
      { name: 'White Label', path: '/settings/white-label', featureKey: 'whiteLabel' },
    ]
  },
]

export function Sidebar() {
  const { hasRole } = usePermissions()
  const { isFeatureEnabled, isSubFeatureEnabled } = useFeatureFlags()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const filteredNavigation = useMemo(() => {
    return navigation
      .filter((item) => {
        // Filter by role
        if (item.requiredRole && !hasRole(item.requiredRole)) {
          return false
        }

        // Filter by feature flag
        if (item.featureKey && !isFeatureEnabled(item.featureKey)) {
          return false
        }

        return true
      })
      .map((item) => {
        // Filter sub-items by feature flags
        if (item.subItems && item.featureKey) {
          const filteredSubItems = item.subItems.filter((subItem) => {
            if (!subItem.featureKey) return true
            return isSubFeatureEnabled(item.featureKey!, subItem.featureKey)
          })

          return {
            ...item,
            subItems: filteredSubItems.length > 0 ? filteredSubItems : undefined,
          }
        }

        return item
      })
  }, [hasRole, isFeatureEnabled, isSubFeatureEnabled])

  const toggleExpanded = useCallback((itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    )
  }, [])

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col transition-[width] duration-300 will-change-[width]`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-accent/30">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-sidebar-text font-display tracking-tight">
              <span className="text-accent font-bold">Skeye</span>
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
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-sidebar-text-muted hover:text-white hover:bg-sidebar-hover transition-colors"
            title="Expand sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Organization Switcher */}
      {!isCollapsed && (
        <div className="px-3 pt-4 pb-2 border-b border-sidebar-border">
          <OrganizationSwitcherCompact />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-premium">
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
                  className="group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative text-sidebar-text-muted hover:text-white hover:bg-sidebar-hover w-full"
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
                    `group flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative overflow-hidden ${
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
