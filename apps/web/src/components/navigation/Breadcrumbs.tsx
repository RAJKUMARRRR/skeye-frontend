import { Link, useLocation } from 'react-router-dom'

interface Breadcrumb {
  label: string
  path: string
}

const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  tracking: 'Live Tracking',
  vehicles: 'Vehicles',
  drivers: 'Drivers',
  trips: 'Trip History',
  geofences: 'Geofences',
  maintenance: 'Maintenance',
  routes: 'Routes',
  alerts: 'Alerts',
  reports: 'Reports',
  analytics: 'Analytics',
  fuel: 'Fuel Management',
  settings: 'Settings',
  organization: 'Organization',
  users: 'Users',
  integrations: 'Integrations',
  'white-label': 'White-Label',
}

export function Breadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs: Breadcrumb[] = []
  let currentPath = ''

  // Always add Dashboard as root
  breadcrumbs.push({ label: 'Dashboard', path: '/' })

  // Build breadcrumbs from path segments
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Check if segment is a UUID (vehicle/driver detail pages)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)

    if (isUUID) {
      breadcrumbs.push({
        label: 'Detail',
        path: currentPath,
      })
    } else {
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({
        label,
        path: currentPath,
      })
    }
  })

  // Don't show breadcrumbs on dashboard
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-sm font-medium text-gray-700">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
