import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fleet/ui-web'
import {
  Wrench,
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
} from 'lucide-react'

const mockWorkOrders = [
  {
    id: 'wo001',
    vehicleId: 'Truck-001',
    title: 'Oil Change & Filter Replacement',
    type: 'preventive',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Mike Johnson',
    createdDate: '2025-10-08',
    dueDate: '2025-10-12',
    estimatedCost: 250,
    actualCost: null,
    description: 'Routine oil change and air filter replacement',
  },
  {
    id: 'wo002',
    vehicleId: 'Van-002',
    title: 'Brake System Repair',
    type: 'corrective',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    createdDate: '2025-10-09',
    dueDate: '2025-10-11',
    estimatedCost: 850,
    actualCost: null,
    description: 'Brake pads worn, requires immediate attention',
  },
  {
    id: 'wo003',
    vehicleId: 'Truck-003',
    title: 'Tire Rotation',
    type: 'preventive',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Sarah Martinez',
    createdDate: '2025-10-05',
    dueDate: '2025-10-07',
    estimatedCost: 120,
    actualCost: 120,
    description: 'Regular tire rotation and alignment check',
  },
  {
    id: 'wo004',
    vehicleId: 'Van-004',
    title: 'Engine Diagnostics',
    type: 'inspection',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Mike Johnson',
    createdDate: '2025-10-10',
    dueDate: '2025-10-10',
    estimatedCost: 450,
    actualCost: null,
    description: 'Check engine light on, diagnostic scan required',
  },
  {
    id: 'wo005',
    vehicleId: 'Truck-005',
    title: 'Annual Safety Inspection',
    type: 'inspection',
    priority: 'medium',
    status: 'scheduled',
    assignedTo: 'Sarah Martinez',
    createdDate: '2025-10-07',
    dueDate: '2025-10-15',
    estimatedCost: 200,
    actualCost: null,
    description: 'Mandatory annual vehicle safety inspection',
  },
]

export function WorkOrderList() {
  const [workOrders, setWorkOrders] = useState(mockWorkOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      const matchesSearch =
        wo.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wo.assignedTo && wo.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = typeFilter === 'all' || wo.type === typeFilter
      const matchesStatus = statusFilter === 'all' || wo.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || wo.priority === priorityFilter

      return matchesSearch && matchesType && matchesStatus && matchesPriority
    })
  }, [workOrders, searchTerm, typeFilter, statusFilter, priorityFilter])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string; icon: JSX.Element }> = {
      pending: {
        className: 'bg-gray-100 text-gray-800',
        label: 'Pending',
        icon: <Clock className="h-3 w-3" />,
      },
      scheduled: {
        className: 'bg-blue-100 text-blue-800',
        label: 'Scheduled',
        icon: <Clock className="h-3 w-3" />,
      },
      in_progress: {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'In Progress',
        icon: <Wrench className="h-3 w-3" />,
      },
      completed: {
        className: 'bg-green-100 text-green-800',
        label: 'Completed',
        icon: <CheckCircle className="h-3 w-3" />,
      },
    }
    const config = variants[status] || variants.pending
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      low: { className: 'bg-green-100 text-green-800', label: 'Low' },
      medium: { className: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      high: { className: 'bg-red-100 text-red-800', label: 'High' },
    }
    const config = variants[priority] || variants.low
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      preventive: 'Preventive',
      corrective: 'Corrective',
      inspection: 'Inspection',
    }
    return <Badge variant="outline">{labels[type] || type}</Badge>
  }

  const totalCost = workOrders.reduce((sum, wo) => sum + (wo.actualCost || wo.estimatedCost), 0)
  const pendingCount = workOrders.filter((wo) => wo.status === 'pending' || wo.status === 'scheduled').length
  const inProgressCount = workOrders.filter((wo) => wo.status === 'in_progress').length
  const completedCount = workOrders.filter((wo) => wo.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders</CardTitle>
          <CardDescription>Track and manage maintenance work orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Work Orders Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No work orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkOrders.map((wo) => (
                    <TableRow key={wo.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{wo.title}</div>
                          <div className="text-sm text-muted-foreground">ID: {wo.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(wo.type)}</TableCell>
                      <TableCell className="font-medium">{wo.vehicleId}</TableCell>
                      <TableCell>{getPriorityBadge(wo.priority)}</TableCell>
                      <TableCell className="text-sm">
                        {wo.assignedTo || <span className="text-muted-foreground">Unassigned</span>}
                      </TableCell>
                      <TableCell className="text-sm">{wo.dueDate}</TableCell>
                      <TableCell className="font-medium">
                        ${(wo.actualCost || wo.estimatedCost).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(wo.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
