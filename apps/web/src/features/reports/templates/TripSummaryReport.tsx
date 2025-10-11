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
} from '@fleet/ui-web'
import { Download, FileText } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { exportToPDF } from '../../../lib/export/pdf-export'
import { exportToCSV, csvFormatters } from '../../../lib/export/csv-export'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Mock trip data
const mockTrips = [
  {
    id: 'T001',
    vehicleName: 'Truck-001',
    driverName: 'John Smith',
    startTime: '2024-01-15 08:00',
    endTime: '2024-01-15 16:30',
    distance: 245.5,
    duration: 510,
    fuelConsumed: 42.3,
    avgSpeed: 48.5,
    maxSpeed: 75.2,
    idleTime: 35,
    route: 'Chicago - Milwaukee',
  },
  {
    id: 'T002',
    vehicleName: 'Van-002',
    driverName: 'Sarah Johnson',
    startTime: '2024-01-15 09:30',
    endTime: '2024-01-15 14:15',
    distance: 128.3,
    duration: 285,
    fuelConsumed: 18.7,
    avgSpeed: 45.2,
    maxSpeed: 68.5,
    idleTime: 22,
    route: 'Madison - Green Bay',
  },
  {
    id: 'T003',
    vehicleName: 'Truck-001',
    driverName: 'Mike Davis',
    startTime: '2024-01-15 07:15',
    endTime: '2024-01-15 18:45',
    distance: 312.8,
    duration: 690,
    fuelConsumed: 58.9,
    avgSpeed: 45.6,
    maxSpeed: 72.3,
    idleTime: 48,
    route: 'Minneapolis - Des Moines',
  },
  {
    id: 'T004',
    vehicleName: 'Sedan-003',
    driverName: 'Emily Brown',
    startTime: '2024-01-15 10:00',
    endTime: '2024-01-15 15:30',
    distance: 95.6,
    duration: 330,
    fuelConsumed: 12.4,
    avgSpeed: 52.1,
    maxSpeed: 85.7,
    idleTime: 18,
    route: 'Springfield - Bloomington',
  },
  {
    id: 'T005',
    vehicleName: 'Van-002',
    driverName: 'David Wilson',
    startTime: '2024-01-15 11:30',
    endTime: '2024-01-15 17:00',
    distance: 167.2,
    duration: 330,
    fuelConsumed: 24.3,
    avgSpeed: 50.4,
    maxSpeed: 71.2,
    idleTime: 28,
    route: 'Peoria - Rockford',
  },
]

interface TripSummaryReportProps {
  dateRange?: string
  vehicles?: string[]
  drivers?: string[]
}

export function TripSummaryReport({ dateRange, vehicles, drivers }: TripSummaryReportProps) {
  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalDistance = mockTrips.reduce((sum, trip) => sum + trip.distance, 0)
    const totalDuration = mockTrips.reduce((sum, trip) => sum + trip.duration, 0)
    const totalFuel = mockTrips.reduce((sum, trip) => sum + trip.fuelConsumed, 0)
    const totalIdleTime = mockTrips.reduce((sum, trip) => sum + trip.idleTime, 0)
    const avgSpeed = totalDistance / (totalDuration / 60)

    return {
      totalTrips: mockTrips.length,
      totalDistance: totalDistance.toFixed(1),
      totalDuration: (totalDuration / 60).toFixed(1),
      totalFuel: totalFuel.toFixed(1),
      avgSpeed: avgSpeed.toFixed(1),
      avgFuelEfficiency: (totalDistance / totalFuel).toFixed(2),
      totalIdleTime: totalIdleTime,
      idlePercentage: ((totalIdleTime / totalDuration) * 100).toFixed(1),
    }
  }, [])

  // Distance by vehicle
  const distanceByVehicle = useMemo(() => {
    const vehicleMap = new Map<string, number>()
    mockTrips.forEach(trip => {
      const current = vehicleMap.get(trip.vehicleName) || 0
      vehicleMap.set(trip.vehicleName, current + trip.distance)
    })
    return Array.from(vehicleMap.entries()).map(([name, distance]) => ({
      name,
      distance: Number(distance.toFixed(1)),
    }))
  }, [])

  // Trips by driver
  const tripsByDriver = useMemo(() => {
    const driverMap = new Map<string, number>()
    mockTrips.forEach(trip => {
      const current = driverMap.get(trip.driverName) || 0
      driverMap.set(trip.driverName, current + 1)
    })
    return Array.from(driverMap.entries()).map(([name, count]) => ({
      name,
      trips: count,
    }))
  }, [])

  const handleExportPDF = () => {
    const columns = [
      { header: 'Trip ID', dataKey: 'id' },
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Driver', dataKey: 'driverName' },
      { header: 'Route', dataKey: 'route' },
      { header: 'Distance (km)', dataKey: 'distance' },
      { header: 'Duration (min)', dataKey: 'duration' },
      { header: 'Fuel (L)', dataKey: 'fuelConsumed' },
      { header: 'Avg Speed (km/h)', dataKey: 'avgSpeed' },
    ]

    exportToPDF({
      title: 'Trip Summary Report',
      subtitle: dateRange || 'Last 30 Days',
      data: mockTrips,
      columns,
      fileName: 'trip-summary-report.pdf',
      orientation: 'landscape',
      includeTimestamp: true,
    })
  }

  const handleExportCSV = () => {
    const columns = [
      { header: 'Trip ID', dataKey: 'id' },
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Driver', dataKey: 'driverName' },
      { header: 'Start Time', dataKey: 'startTime' },
      { header: 'End Time', dataKey: 'endTime' },
      { header: 'Route', dataKey: 'route' },
      { header: 'Distance (km)', dataKey: 'distance', format: (v) => csvFormatters.number(v, 1) },
      { header: 'Duration (min)', dataKey: 'duration' },
      { header: 'Fuel Consumed (L)', dataKey: 'fuelConsumed', format: (v) => csvFormatters.number(v, 1) },
      { header: 'Avg Speed (km/h)', dataKey: 'avgSpeed', format: (v) => csvFormatters.number(v, 1) },
      { header: 'Max Speed (km/h)', dataKey: 'maxSpeed', format: (v) => csvFormatters.number(v, 1) },
      { header: 'Idle Time (min)', dataKey: 'idleTime' },
    ]

    exportToCSV({
      data: mockTrips,
      columns,
      fileName: 'trip-summary-report.csv',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Trip Summary Report</h2>
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
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTrips}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalDistance} km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalFuel} L</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgFuelEfficiency} km/L</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distance by Vehicle</CardTitle>
            <CardDescription>Total kilometers traveled per vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distanceByVehicle}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="distance" fill="#8884d8" name="Distance (km)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trips by Driver</CardTitle>
            <CardDescription>Number of trips completed per driver</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tripsByDriver}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, trips }) => `${name}: ${trips}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="trips"
                >
                  {tripsByDriver.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trip Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>Detailed breakdown of all trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Fuel</TableHead>
                  <TableHead className="text-right">Avg Speed</TableHead>
                  <TableHead className="text-right">Idle Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">{trip.id}</TableCell>
                    <TableCell>{trip.vehicleName}</TableCell>
                    <TableCell>{trip.driverName}</TableCell>
                    <TableCell>{trip.route}</TableCell>
                    <TableCell className="text-right">{trip.distance} km</TableCell>
                    <TableCell className="text-right">{trip.duration} min</TableCell>
                    <TableCell className="text-right">{trip.fuelConsumed} L</TableCell>
                    <TableCell className="text-right">{trip.avgSpeed} km/h</TableCell>
                    <TableCell className="text-right">{trip.idleTime} min</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
