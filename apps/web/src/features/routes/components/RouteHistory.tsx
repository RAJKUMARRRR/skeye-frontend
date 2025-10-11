import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
} from '@fleet/ui-web'
import { Search, Download, MapPin, Clock, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const mockRouteHistory = [
  {
    id: 'r001',
    date: '2024-01-15',
    driver: 'John Smith',
    vehicle: 'Truck-001',
    origin: 'Chicago, IL',
    destination: 'Milwaukee, WI',
    distance: 145,
    duration: 138,
    fuelUsed: 28.5,
    fuelCost: 46.80,
    avgSpeed: 63,
    status: 'completed',
    efficiency: 92,
  },
  {
    id: 'r002',
    date: '2024-01-15',
    driver: 'Sarah Johnson',
    vehicle: 'Van-002',
    origin: 'Madison, WI',
    destination: 'Green Bay, WI',
    distance: 185,
    duration: 195,
    fuelUsed: 32.8,
    fuelCost: 53.85,
    avgSpeed: 57,
    status: 'completed',
    efficiency: 88,
  },
  {
    id: 'r003',
    date: '2024-01-14',
    driver: 'Mike Davis',
    vehicle: 'Truck-003',
    origin: 'Rockford, IL',
    destination: 'Springfield, IL',
    distance: 220,
    duration: 225,
    fuelUsed: 42.1,
    fuelCost: 69.15,
    avgSpeed: 59,
    status: 'completed',
    efficiency: 85,
  },
  {
    id: 'r004',
    date: '2024-01-14',
    driver: 'Emily Brown',
    vehicle: 'Sedan-003',
    origin: 'Peoria, IL',
    destination: 'Bloomington, IL',
    distance: 95,
    duration: 105,
    fuelUsed: 15.2,
    fuelCost: 24.95,
    avgSpeed: 54,
    status: 'completed',
    efficiency: 95,
  },
  {
    id: 'r005',
    date: '2024-01-13',
    driver: 'David Wilson',
    vehicle: 'Van-005',
    origin: 'Champaign, IL',
    destination: 'Decatur, IL',
    distance: 68,
    duration: 78,
    fuelUsed: 11.8,
    fuelCost: 19.40,
    avgSpeed: 52,
    status: 'completed',
    efficiency: 90,
  },
]

const weeklyStats = [
  { day: 'Mon', routes: 28, distance: 3250, efficiency: 88 },
  { day: 'Tue', routes: 32, distance: 3680, efficiency: 90 },
  { day: 'Wed', routes: 30, distance: 3420, efficiency: 87 },
  { day: 'Thu', routes: 35, distance: 3890, efficiency: 91 },
  { day: 'Fri', routes: 33, distance: 3750, efficiency: 89 },
  { day: 'Sat', routes: 22, distance: 2580, efficiency: 86 },
  { day: 'Sun', routes: 18, distance: 2150, efficiency: 85 },
]

export function RouteHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [driverFilter, setDriverFilter] = useState('all')

  const filteredRoutes = useMemo(() => {
    return mockRouteHistory.filter((route) => {
      const matchesSearch =
        route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.vehicle.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || route.status === statusFilter
      const matchesDriver = driverFilter === 'all' || route.driver === driverFilter

      return matchesSearch && matchesStatus && matchesDriver
    })
  }, [searchTerm, statusFilter, driverFilter])

  const summary = useMemo(() => {
    return {
      totalRoutes: mockRouteHistory.length,
      totalDistance: mockRouteHistory.reduce((sum, r) => sum + r.distance, 0),
      totalFuelCost: mockRouteHistory.reduce((sum, r) => sum + r.fuelCost, 0),
      avgEfficiency: (mockRouteHistory.reduce((sum, r) => sum + r.efficiency, 0) / mockRouteHistory.length).toFixed(1),
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      completed: { variant: 'secondary', label: 'Completed' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 90) return <Badge variant="secondary">{efficiency}%</Badge>
    if (efficiency >= 80) return <Badge variant="default">{efficiency}%</Badge>
    return <Badge variant="destructive">{efficiency}%</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRoutes}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalDistance.toLocaleString()} km</div>
            <p className="text-xs text-muted-foreground mt-1">Traveled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalFuelCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgEfficiency}%</div>
            <p className="text-xs text-green-600 mt-1">Good performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Route Volume</CardTitle>
            <CardDescription>Number of routes completed each day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="routes" fill="#3b82f6" name="Routes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Trend</CardTitle>
            <CardDescription>Route efficiency by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#22c55e" strokeWidth={2} name="Efficiency %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Route History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Route History</CardTitle>
              <CardDescription>Complete history of all routes</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={driverFilter} onValueChange={setDriverFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                <SelectItem value="John Smith">John Smith</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                <SelectItem value="David Wilson">David Wilson</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Fuel Cost</TableHead>
                  <TableHead className="text-right">Efficiency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoutes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No routes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>{route.date}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{route.driver}</div>
                          <div className="text-xs text-muted-foreground">{route.vehicle}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm">{route.origin} → {route.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{route.distance} km</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {route.duration} min
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${route.fuelCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{getEfficiencyBadge(route.efficiency)}</TableCell>
                      <TableCell>{getStatusBadge(route.status)}</TableCell>
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
