import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Switch,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@fleet/ui-web'
import {
  Shield,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  Users,
  Truck,
  MapPin,
  FileText,
  Settings,
  BarChart3,
} from 'lucide-react'

const roles = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    userCount: 2,
    color: 'bg-red-100 text-red-800',
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Manage fleet operations and oversee drivers',
    userCount: 4,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'dispatcher',
    name: 'Dispatcher',
    description: 'Manage routes and coordinate drivers',
    userCount: 3,
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 'driver',
    name: 'Driver',
    description: 'View assigned routes and update trip status',
    userCount: 25,
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to reports and analytics',
    userCount: 8,
    color: 'bg-gray-100 text-gray-800',
  },
]

const permissionModules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: BarChart3,
    permissions: [
      { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to main dashboard' },
      { id: 'dashboard.customize', name: 'Customize Dashboard', description: 'Customize dashboard widgets' },
    ],
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: Truck,
    permissions: [
      { id: 'vehicles.view', name: 'View Vehicles', description: 'View vehicle information' },
      { id: 'vehicles.create', name: 'Add Vehicles', description: 'Add new vehicles to fleet' },
      { id: 'vehicles.edit', name: 'Edit Vehicles', description: 'Modify vehicle information' },
      { id: 'vehicles.delete', name: 'Delete Vehicles', description: 'Remove vehicles from fleet' },
      { id: 'vehicles.maintain', name: 'Manage Maintenance', description: 'Schedule and track maintenance' },
    ],
  },
  {
    id: 'drivers',
    name: 'Drivers',
    icon: Users,
    permissions: [
      { id: 'drivers.view', name: 'View Drivers', description: 'View driver information' },
      { id: 'drivers.create', name: 'Add Drivers', description: 'Add new drivers' },
      { id: 'drivers.edit', name: 'Edit Drivers', description: 'Modify driver information' },
      { id: 'drivers.delete', name: 'Delete Drivers', description: 'Remove drivers' },
      { id: 'drivers.schedule', name: 'Manage Schedule', description: 'Create and modify driver schedules' },
      { id: 'drivers.performance', name: 'View Performance', description: 'Access driver performance metrics' },
    ],
  },
  {
    id: 'routes',
    name: 'Routes',
    icon: MapPin,
    permissions: [
      { id: 'routes.view', name: 'View Routes', description: 'View route information' },
      { id: 'routes.create', name: 'Create Routes', description: 'Create new routes' },
      { id: 'routes.edit', name: 'Edit Routes', description: 'Modify route information' },
      { id: 'routes.delete', name: 'Delete Routes', description: 'Remove routes' },
      { id: 'routes.optimize', name: 'Optimize Routes', description: 'Use route optimization tools' },
      { id: 'routes.assign', name: 'Assign Drivers', description: 'Assign drivers to routes' },
    ],
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: FileText,
    permissions: [
      { id: 'reports.view', name: 'View Reports', description: 'Access standard reports' },
      { id: 'reports.create', name: 'Create Reports', description: 'Generate custom reports' },
      { id: 'reports.export', name: 'Export Reports', description: 'Export reports to PDF/CSV' },
      { id: 'reports.schedule', name: 'Schedule Reports', description: 'Schedule automated reports' },
    ],
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    permissions: [
      { id: 'settings.view', name: 'View Settings', description: 'View system settings' },
      { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings' },
      { id: 'settings.users', name: 'Manage Users', description: 'Create and manage user accounts' },
      { id: 'settings.roles', name: 'Manage Roles', description: 'Configure roles and permissions' },
      { id: 'settings.integrations', name: 'Manage Integrations', description: 'Configure third-party integrations' },
    ],
  },
]

const defaultRolePermissions: Record<string, string[]> = {
  admin: [
    // All permissions
    ...permissionModules.flatMap((module) => module.permissions.map((p) => p.id)),
  ],
  manager: [
    'dashboard.view',
    'dashboard.customize',
    'vehicles.view',
    'vehicles.edit',
    'vehicles.maintain',
    'drivers.view',
    'drivers.edit',
    'drivers.schedule',
    'drivers.performance',
    'routes.view',
    'routes.create',
    'routes.edit',
    'routes.optimize',
    'routes.assign',
    'reports.view',
    'reports.create',
    'reports.export',
    'settings.view',
  ],
  dispatcher: [
    'dashboard.view',
    'vehicles.view',
    'drivers.view',
    'drivers.schedule',
    'routes.view',
    'routes.create',
    'routes.edit',
    'routes.optimize',
    'routes.assign',
    'reports.view',
  ],
  driver: [
    'dashboard.view',
    'vehicles.view',
    'routes.view',
  ],
  viewer: [
    'dashboard.view',
    'vehicles.view',
    'drivers.view',
    'routes.view',
    'reports.view',
  ],
}

export function RolePermissions() {
  const [activeRole, setActiveRole] = useState('admin')
  const [rolePermissions, setRolePermissions] = useState(defaultRolePermissions)
  const [saved, setSaved] = useState(false)

  const hasPermission = (permissionId: string) => {
    return rolePermissions[activeRole]?.includes(permissionId) || false
  }

  const togglePermission = (permissionId: string) => {
    setRolePermissions((prev) => {
      const current = prev[activeRole] || []
      if (current.includes(permissionId)) {
        return {
          ...prev,
          [activeRole]: current.filter((p) => p !== permissionId),
        }
      } else {
        return {
          ...prev,
          [activeRole]: [...current, permissionId],
        }
      }
    })
  }

  const toggleModulePermissions = (moduleId: string, enable: boolean) => {
    const module = permissionModules.find((m) => m.id === moduleId)
    if (!module) return

    const permissionIds = module.permissions.map((p) => p.id)
    setRolePermissions((prev) => {
      const current = prev[activeRole] || []
      if (enable) {
        const newPermissions = [...new Set([...current, ...permissionIds])]
        return {
          ...prev,
          [activeRole]: newPermissions,
        }
      } else {
        return {
          ...prev,
          [activeRole]: current.filter((p) => !permissionIds.includes(p)),
        }
      }
    })
  }

  const getModulePermissionCount = (moduleId: string) => {
    const module = permissionModules.find((m) => m.id === moduleId)
    if (!module) return { enabled: 0, total: 0 }

    const total = module.permissions.length
    const enabled = module.permissions.filter((p) => hasPermission(p.id)).length
    return { enabled, total }
  }

  const handleSave = () => {
    // In production, this would save to the backend
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const getTotalPermissions = () => {
    return rolePermissions[activeRole]?.length || 0
  }

  const getPermissionIcon = (type: string) => {
    if (type.includes('view')) return <Eye className="h-4 w-4" />
    if (type.includes('create') || type.includes('add')) return <CheckCircle className="h-4 w-4" />
    if (type.includes('edit') || type.includes('modify')) return <Edit className="h-4 w-4" />
    if (type.includes('delete') || type.includes('remove')) return <Trash2 className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Role Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all ${
              activeRole === role.id ? 'ring-2 ring-blue-600' : ''
            }`}
            onClick={() => setActiveRole(role.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <Badge className={role.color}>{role.userCount}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-1">{role.name}</h3>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {roles.find((r) => r.id === activeRole)?.name} Permissions
              </CardTitle>
              <CardDescription>
                Configure what {roles.find((r) => r.id === activeRole)?.name}s can access and do
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {getTotalPermissions()} permissions enabled
              </div>
              {saved && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </div>
              )}
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {permissionModules.map((module) => {
              const { enabled, total } = getModulePermissionCount(module.id)
              const Icon = module.icon
              const allEnabled = enabled === total

              return (
                <div key={module.id} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{module.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {enabled} of {total} permissions enabled
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`module-${module.id}`} className="text-sm">
                        {allEnabled ? 'Disable All' : 'Enable All'}
                      </Label>
                      <Switch
                        id={`module-${module.id}`}
                        checked={allEnabled}
                        onCheckedChange={(checked) => toggleModulePermissions(module.id, checked)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 pl-8">
                    {module.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {getPermissionIcon(permission.id)}
                          <div>
                            <div className="font-medium text-sm">{permission.name}</div>
                            <div className="text-xs text-muted-foreground">{permission.description}</div>
                          </div>
                        </div>
                        <Switch
                          checked={hasPermission(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Permission Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Summary</CardTitle>
          <CardDescription>Overview of permissions across all roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {roles.map((role) => {
              const permissionCount = rolePermissions[role.id]?.length || 0
              const totalPermissions = permissionModules.reduce(
                (sum, module) => sum + module.permissions.length,
                0
              )
              const percentage = Math.round((permissionCount / totalPermissions) * 100)

              return (
                <div key={role.id} className="flex items-center gap-4">
                  <div className="w-32">
                    <Badge className={role.color}>{role.name}</Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {permissionCount} of {totalPermissions} permissions
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
