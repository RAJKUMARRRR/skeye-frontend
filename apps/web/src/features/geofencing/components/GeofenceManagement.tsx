import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@fleet/ui-web'
import {
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const geofenceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(['circle', 'polygon']),
  address: z.string().min(5, 'Address is required'),
  radius: z.number().min(50, 'Radius must be at least 50 meters').optional(),
  category: z.enum(['depot', 'customer', 'restricted', 'service_area', 'other']),
  notifications: z.boolean(),
  status: z.enum(['active', 'inactive']),
})

type GeofenceFormData = z.infer<typeof geofenceSchema>

const mockGeofences = [
  {
    id: 'gf001',
    name: 'Main Depot',
    type: 'circle',
    category: 'depot',
    address: '123 Main St, Chicago, IL',
    radius: 500,
    coordinates: { lat: 41.8781, lng: -87.6298 },
    status: 'active',
    notifications: true,
    vehicles: 15,
    violations: 0,
    lastActivity: '2025-10-10 09:30',
  },
  {
    id: 'gf002',
    name: 'Customer Zone A',
    type: 'polygon',
    category: 'customer',
    address: 'Milwaukee, WI Area',
    radius: null,
    coordinates: { lat: 43.0389, lng: -87.9065 },
    status: 'active',
    notifications: true,
    vehicles: 8,
    violations: 2,
    lastActivity: '2025-10-10 08:15',
  },
  {
    id: 'gf003',
    name: 'Restricted Area - Construction',
    type: 'circle',
    category: 'restricted',
    address: 'Downtown Chicago',
    radius: 1000,
    coordinates: { lat: 41.8789, lng: -87.6359 },
    status: 'active',
    notifications: true,
    vehicles: 0,
    violations: 3,
    lastActivity: '2025-10-09 14:20',
  },
  {
    id: 'gf004',
    name: 'Service Area - North',
    type: 'polygon',
    category: 'service_area',
    address: 'Northern Illinois',
    radius: null,
    coordinates: { lat: 42.0, lng: -88.0 },
    status: 'active',
    notifications: false,
    vehicles: 22,
    violations: 0,
    lastActivity: '2025-10-10 07:45',
  },
  {
    id: 'gf005',
    name: 'Old Warehouse',
    type: 'circle',
    category: 'depot',
    address: '456 Oak Ave, Rockford, IL',
    radius: 300,
    coordinates: { lat: 42.2711, lng: -89.0940 },
    status: 'inactive',
    notifications: false,
    vehicles: 0,
    violations: 0,
    lastActivity: '2025-09-15 10:00',
  },
]

export function GeofenceManagement() {
  const [geofences, setGeofences] = useState(mockGeofences)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGeofence, setEditingGeofence] = useState<typeof mockGeofences[0] | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<GeofenceFormData>({
    resolver: zodResolver(geofenceSchema),
    defaultValues: {
      status: 'active',
      notifications: true,
      type: 'circle',
    },
  })

  const geofenceType = watch('type')

  const filteredGeofences = useMemo(() => {
    return geofences.filter((geofence) => {
      const matchesSearch =
        geofence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        geofence.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || geofence.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || geofence.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [geofences, searchTerm, categoryFilter, statusFilter])

  const activeCount = geofences.filter((g) => g.status === 'active').length
  const totalVehicles = geofences.reduce((sum, g) => sum + g.vehicles, 0)
  const totalViolations = geofences.reduce((sum, g) => sum + g.violations, 0)

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      depot: { className: 'bg-blue-100 text-blue-800', label: 'Depot' },
      customer: { className: 'bg-green-100 text-green-800', label: 'Customer' },
      restricted: { className: 'bg-red-100 text-red-800', label: 'Restricted' },
      service_area: { className: 'bg-purple-100 text-purple-800', label: 'Service Area' },
      other: { className: 'bg-gray-100 text-gray-800', label: 'Other' },
    }
    const config = variants[category] || variants.other
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400" />
    )
  }

  const handleAddGeofence = () => {
    setEditingGeofence(null)
    reset({
      name: '',
      type: 'circle',
      address: '',
      radius: 500,
      category: 'other',
      notifications: true,
      status: 'active',
    })
    setIsDialogOpen(true)
  }

  const handleEditGeofence = (geofence: typeof mockGeofences[0]) => {
    setEditingGeofence(geofence)
    setValue('name', geofence.name)
    setValue('type', geofence.type as any)
    setValue('address', geofence.address)
    if (geofence.radius) setValue('radius', geofence.radius)
    setValue('category', geofence.category as any)
    setValue('notifications', geofence.notifications)
    setValue('status', geofence.status as any)
    setIsDialogOpen(true)
  }

  const handleDeleteGeofence = (geofenceId: string) => {
    setGeofences((prev) => prev.filter((g) => g.id !== geofenceId))
  }

  const onSubmit = (data: GeofenceFormData) => {
    if (editingGeofence) {
      // Update existing geofence
      setGeofences((prev) =>
        prev.map((g) =>
          g.id === editingGeofence.id
            ? {
                ...g,
                ...data,
                radius: data.type === 'circle' ? data.radius || 500 : null,
              }
            : g
        )
      )
    } else {
      // Add new geofence
      const newGeofence = {
        id: `gf${String(geofences.length + 1).padStart(3, '0')}`,
        ...data,
        radius: data.type === 'circle' ? data.radius || 500 : null,
        coordinates: { lat: 41.8781, lng: -87.6298 }, // Mock coordinates
        vehicles: 0,
        violations: 0,
        lastActivity: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }
      setGeofences((prev) => [...prev, newGeofence])
    }
    setIsDialogOpen(false)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geofences</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{geofences.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeCount} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Tracked</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalViolations}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {geofences.filter((g) => g.notifications).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Alerts enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Geofence Management</CardTitle>
              <CardDescription>Create and manage geofenced areas</CardDescription>
            </div>
            <Button onClick={handleAddGeofence}>
              <Plus className="mr-2 h-4 w-4" />
              Add Geofence
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search geofences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="depot">Depot</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="service_area">Service Area</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Geofences Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Violations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGeofences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No geofences found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGeofences.map((geofence) => (
                    <TableRow key={geofence.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{geofence.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {geofence.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(geofence.category)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {geofence.type}
                          {geofence.radius && ` (${geofence.radius}m)`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{geofence.address}</TableCell>
                      <TableCell>
                        <span className="font-medium">{geofence.vehicles}</span>
                      </TableCell>
                      <TableCell>
                        <span className={geofence.violations > 0 ? 'text-red-600 font-medium' : ''}>
                          {geofence.violations}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(geofence.status)}
                          <span className="capitalize text-sm">{geofence.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditGeofence(geofence)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGeofence(geofence.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Geofence Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingGeofence ? 'Edit Geofence' : 'Add New Geofence'}</DialogTitle>
            <DialogDescription>
              {editingGeofence
                ? 'Update geofence information and settings'
                : 'Create a new geofenced area for tracking'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Geofence Name</Label>
                <Input id="name" {...register('name')} placeholder="Main Depot" />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    onValueChange={(value) => setValue('type', value as any)}
                    defaultValue={editingGeofence?.type || 'circle'}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) => setValue('category', value as any)}
                    defaultValue={editingGeofence?.category || 'other'}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="depot">Depot</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="service_area">Service Area</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="123 Main St, Chicago, IL"
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
              </div>

              {geofenceType === 'circle' && (
                <div className="space-y-2">
                  <Label htmlFor="radius">Radius (meters)</Label>
                  <Input
                    id="radius"
                    type="number"
                    {...register('radius', { valueAsNumber: true })}
                    placeholder="500"
                  />
                  {errors.radius && <p className="text-sm text-red-600">{errors.radius.message}</p>}
                </div>
              )}

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when vehicles enter/exit
                  </p>
                </div>
                <Switch
                  id="notifications"
                  defaultChecked={editingGeofence?.notifications ?? true}
                  onCheckedChange={(checked) => setValue('notifications', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue('status', value as any)}
                  defaultValue={editingGeofence?.status || 'active'}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingGeofence ? 'Update Geofence' : 'Add Geofence'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
