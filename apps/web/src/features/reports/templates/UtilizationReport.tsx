import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@fleet/ui-web'
import { Download, FileText, TrendingUp } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { exportToPDF } from '../../../lib/export/pdf-export'
import { exportToCSV, csvFormatters } from '../../../lib/export/csv-export'

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6']

// Mock utilization data
const mockUtilizationData = [
  {
    vehicleId: 'v1',
    vehicleName: 'Truck-001',
    type: 'Truck',
    totalHours: 720,
    activeHours: 580,
    idleHours: 85,
    offlineHours: 55,
    utilization: 80.6,
    avgTripsPerDay: 3.2,
    revenue: 12500,
    costPerHour: 45,
    status: 'optimal',
  },
  {
    vehicleId: 'v2',
    vehicleName: 'Van-002',
    type: 'Van',
    totalHours: 720,
    activeHours: 520,
    idleHours: 120,
    offlineHours: 80,
    utilization: 72.2,
    avgTripsPerDay: 2.8,
    revenue: 9800,
    costPerHour: 38,
    status: 'good',
  },
  {
    vehicleId: 'v3',
    vehicleName: 'Sedan-003',
    type: 'Sedan',
    totalHours: 720,
    activeHours: 420,
    idleHours: 95,
    offlineHours: 205,
    utilization: 58.3,
    avgTripsPerDay: 2.1,
    revenue: 6500,
    costPerHour: 28,
    status: 'underutilized',
  },
  {
    vehicleId: 'v4',
    vehicleName: 'Truck-004',
    type: 'Truck',
    totalHours: 720,
    activeHours: 650,
    idleHours: 45,
    offlineHours: 25,
    utilization: 90.3,
    avgTripsPerDay: 3.8,
    revenue: 15200,
    costPerHour: 45,
    status: 'optimal',
  },
  {
    vehicleId: 'v5',
    vehicleName: 'Van-005',
    type: 'Van',
    totalHours: 720,
    activeHours: 480,
    idleHours: 150,
    offlineHours: 90,
    utilization: 66.7,
    avgTripsPerDay: 2.5,
    revenue: 8900,
    costPerHour: 38,
    status: 'good',
  },
]

// Daily utilization trend
const dailyTrend = [
  { day: 'Mon', utilization: 78, active: 540, idle: 120 },
  { day: 'Tue', utilization: 82, active: 590, idle: 95 },
  { day: 'Wed', utilization: 75, active: 510, idle: 140 },
  { day: 'Thu', utilization: 85, active: 610, idle: 80 },
  { day: 'Fri', utilization: 88, active: 630, idle: 65 },
  { day: 'Sat', utilization: 62, active: 450, idle: 180 },
  { day: 'Sun', utilization: 45, active: 320, idle: 220 },
]

interface UtilizationReportProps {
  dateRange?: string
  vehicles?: string[]
}

export function UtilizationReport({ dateRange, vehicles }: UtilizationReportProps) {
  // Calculate fleet statistics
  const fleetStats = useMemo(() => {
    const totalVehicles = mockUtilizationData.length
    const totalActiveHours = mockUtilizationData.reduce((sum, v) => sum + v.activeHours, 0)
    const totalIdleHours = mockUtilizationData.reduce((sum, v) => sum + v.idleHours, 0)
    const totalOfflineHours = mockUtilizationData.reduce((sum, v) => sum + v.offlineHours, 0)
    const totalPossibleHours = mockUtilizationData.reduce((sum, v) => sum + v.totalHours, 0)
    const avgUtilization = (mockUtilizationData.reduce((sum, v) => sum + v.utilization, 0) / totalVehicles).toFixed(1)
    const totalRevenue = mockUtilizationData.reduce((sum, v) => sum + v.revenue, 0)
    const optimalVehicles = mockUtilizationData.filter(v => v.status === 'optimal').length
    const underutilizedVehicles = mockUtilizationData.filter(v => v.status === 'underutilized').length

    return {
      avgUtilization,
      totalActiveHours,
      totalIdleHours,
      totalOfflineHours,
      totalRevenue: totalRevenue.toFixed(0),
      optimalVehicles,
      underutilizedVehicles,
      idlePercentage: ((totalIdleHours / totalPossibleHours) * 100).toFixed(1),
    }
  }, [])

  // Utilization by vehicle type
  const utilizationByType = useMemo(() => {
    const typeMap = new Map<string, { totalHours: number; activeHours: number; count: number }>()
    mockUtilizationData.forEach(v => {
      const current = typeMap.get(v.type) || { totalHours: 0, activeHours: 0, count: 0 }
      typeMap.set(v.type, {
        totalHours: current.totalHours + v.totalHours,
        activeHours: current.activeHours + v.activeHours,
        count: current.count + 1,
      })
    })
    return Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      utilization: ((data.activeHours / data.totalHours) * 100).toFixed(1),
    }))
  }, [])

  // Time distribution for pie chart
  const timeDistribution = useMemo(() => {
    return [
      { name: 'Active', value: fleetStats.totalActiveHours },
      { name: 'Idle', value: fleetStats.totalIdleHours },
      { name: 'Offline', value: fleetStats.totalOfflineHours },
    ]
  }, [fleetStats])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      optimal: { variant: 'secondary', label: 'Optimal' },
      good: { variant: 'default', label: 'Good' },
      underutilized: { variant: 'destructive', label: 'Underutilized' },
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleExportPDF = () => {
    const columns = [
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Type', dataKey: 'type' },
      { header: 'Active Hours', dataKey: 'activeHours' },
      { header: 'Idle Hours', dataKey: 'idleHours' },
      { header: 'Utilization %', dataKey: 'utilization' },
      { header: 'Avg Trips/Day', dataKey: 'avgTripsPerDay' },
      { header: 'Revenue', dataKey: 'revenue' },
    ]

    exportToPDF({
      title: 'Vehicle Utilization Report',
      subtitle: dateRange || 'Last 30 Days',
      data: mockUtilizationData,
      columns,
      fileName: 'utilization-report.pdf',
      orientation: 'landscape',
      includeTimestamp: true,
    })
  }

  const handleExportCSV = () => {
    const columns = [
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Type', dataKey: 'type' },
      { header: 'Total Hours', dataKey: 'totalHours' },
      { header: 'Active Hours', dataKey: 'activeHours' },
      { header: 'Idle Hours', dataKey: 'idleHours' },
      { header: 'Offline Hours', dataKey: 'offlineHours' },
      { header: 'Utilization %', dataKey: 'utilization', format: (v) => csvFormatters.percentage(v, 1) },
      { header: 'Avg Trips/Day', dataKey: 'avgTripsPerDay', format: (v) => csvFormatters.number(v, 1) },
      { header: 'Revenue', dataKey: 'revenue', format: (v) => csvFormatters.currency(v) },
      { header: 'Cost/Hour', dataKey: 'costPerHour', format: (v) => csvFormatters.currency(v) },
      { header: 'Status', dataKey: 'status' },
    ]

    exportToCSV({
      data: mockUtilizationData,
      columns,
      fileName: 'utilization-report.csv',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Vehicle Utilization Report</h2>
          <p className="text-muted-foreground">{dateRange || 'Last 30 Days'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.avgUtilization}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fleet average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.totalActiveHours}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total productive time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idle Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.idlePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {fleetStats.totalIdleHours} hours wasted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${fleetStats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All vehicles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Status Overview</CardTitle>
          <CardDescription>Distribution of vehicle utilization status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Optimal Performance</div>
              <div className="text-2xl font-bold text-green-600">{fleetStats.optimalVehicles}</div>
              <div className="text-xs text-muted-foreground">80%+ utilization</div>
            </div>
            <div className="flex-1 rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Good Performance</div>
              <div className="text-2xl font-bold text-blue-600">
                {mockUtilizationData.filter(v => v.status === 'good').length}
              </div>
              <div className="text-xs text-muted-foreground">60-80% utilization</div>
            </div>
            <div className="flex-1 rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Underutilized</div>
              <div className="text-2xl font-bold text-red-600">{fleetStats.underutilizedVehicles}</div>
              <div className="text-xs text-muted-foreground">&lt;60% utilization</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Utilization Trend</CardTitle>
            <CardDescription>Average utilization by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="utilization" stroke="#8884d8" name="Utilization %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>Breakdown of vehicle hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value}h (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Utilization by Vehicle Type */}
      <Card>
        <CardHeader>
          <CardTitle>Utilization by Vehicle Type</CardTitle>
          <CardDescription>Average utilization per vehicle category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Utilization Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Utilization Details</CardTitle>
          <CardDescription>Complete breakdown by vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Active</TableHead>
                  <TableHead className="text-right">Idle</TableHead>
                  <TableHead className="text-right">Offline</TableHead>
                  <TableHead className="text-right">Utilization</TableHead>
                  <TableHead className="text-right">Trips/Day</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUtilizationData.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell className="font-medium">{vehicle.vehicleName}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell className="text-right">{vehicle.activeHours}h</TableCell>
                    <TableCell className="text-right">{vehicle.idleHours}h</TableCell>
                    <TableCell className="text-right">{vehicle.offlineHours}h</TableCell>
                    <TableCell className="text-right font-bold">{vehicle.utilization}%</TableCell>
                    <TableCell className="text-right">{vehicle.avgTripsPerDay}</TableCell>
                    <TableCell className="text-right">${vehicle.revenue.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
          <CardDescription>Actions to improve fleet utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fleetStats.underutilizedVehicles > 0 && (
              <div className="flex items-start gap-3 rounded-lg border p-3 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium text-red-900">
                    {fleetStats.underutilizedVehicles} vehicle(s) underutilized
                  </div>
                  <div className="text-sm text-red-700">
                    Consider reassigning routes or evaluating if these vehicles are necessary
                  </div>
                </div>
              </div>
            )}
            {parseFloat(fleetStats.idlePercentage) > 15 && (
              <div className="flex items-start gap-3 rounded-lg border p-3 bg-yellow-50">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-900">
                    High idle time detected ({fleetStats.idlePercentage}%)
                  </div>
                  <div className="text-sm text-yellow-700">
                    Implement anti-idling policies and driver training to reduce fuel waste
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-lg border p-3 bg-blue-50">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">
                  {fleetStats.optimalVehicles} vehicle(s) performing optimally
                </div>
                <div className="text-sm text-blue-700">
                  Analyze usage patterns of high-performing vehicles to optimize the rest of the fleet
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
