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
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { exportToPDF } from '../../../lib/export/pdf-export'
import { exportToCSV, csvFormatters } from '../../../lib/export/csv-export'

// Mock driver performance data
const mockDriverData = [
  {
    id: 'd1',
    name: 'John Smith',
    totalTrips: 42,
    totalDistance: 3250,
    totalDuration: 156,
    fuelEfficiency: 8.5,
    safetyScore: 87,
    speedingEvents: 3,
    harshBraking: 2,
    harshAcceleration: 1,
    idleTime: 145,
    onTimeDelivery: 95,
    rating: 'good',
  },
  {
    id: 'd2',
    name: 'Sarah Johnson',
    totalTrips: 38,
    totalDistance: 2850,
    totalDuration: 142,
    fuelEfficiency: 9.2,
    safetyScore: 92,
    speedingEvents: 1,
    harshBraking: 1,
    harshAcceleration: 0,
    idleTime: 98,
    onTimeDelivery: 97,
    rating: 'excellent',
  },
  {
    id: 'd3',
    name: 'Mike Davis',
    totalTrips: 45,
    totalDistance: 3680,
    totalDuration: 178,
    fuelEfficiency: 8.1,
    safetyScore: 78,
    speedingEvents: 7,
    harshBraking: 5,
    harshAcceleration: 4,
    idleTime: 215,
    onTimeDelivery: 88,
    rating: 'needs-improvement',
  },
  {
    id: 'd4',
    name: 'Emily Brown',
    totalTrips: 36,
    totalDistance: 2950,
    totalDuration: 138,
    fuelEfficiency: 9.5,
    safetyScore: 95,
    speedingEvents: 0,
    harshBraking: 0,
    harshAcceleration: 0,
    idleTime: 82,
    onTimeDelivery: 99,
    rating: 'excellent',
  },
  {
    id: 'd5',
    name: 'David Wilson',
    totalTrips: 40,
    totalDistance: 3120,
    totalDuration: 152,
    fuelEfficiency: 8.8,
    safetyScore: 85,
    speedingEvents: 2,
    harshBraking: 3,
    harshAcceleration: 2,
    idleTime: 168,
    onTimeDelivery: 93,
    rating: 'good',
  },
]

interface DriverPerformanceReportProps {
  dateRange?: string
  drivers?: string[]
}

export function DriverPerformanceReport({ dateRange, drivers }: DriverPerformanceReportProps) {
  // Calculate fleet averages
  const fleetAverages = useMemo(() => {
    const count = mockDriverData.length
    return {
      avgSafetyScore: (mockDriverData.reduce((sum, d) => sum + d.safetyScore, 0) / count).toFixed(1),
      avgFuelEfficiency: (mockDriverData.reduce((sum, d) => sum + d.fuelEfficiency, 0) / count).toFixed(1),
      avgOnTimeDelivery: (mockDriverData.reduce((sum, d) => sum + d.onTimeDelivery, 0) / count).toFixed(1),
      totalTrips: mockDriverData.reduce((sum, d) => sum + d.totalTrips, 0),
    }
  }, [])

  // Performance comparison data for radar chart
  const performanceComparison = useMemo(() => {
    return mockDriverData.map(driver => ({
      name: driver.name,
      safety: driver.safetyScore,
      efficiency: driver.fuelEfficiency * 10, // Scale for better visualization
      onTime: driver.onTimeDelivery,
    }))
  }, [])

  // Top performers
  const topPerformers = useMemo(() => {
    return [...mockDriverData]
      .sort((a, b) => b.safetyScore - a.safetyScore)
      .slice(0, 3)
  }, [])

  const getRatingBadge = (rating: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      excellent: { variant: 'secondary', label: 'Excellent' },
      good: { variant: 'default', label: 'Good' },
      'needs-improvement': { variant: 'destructive', label: 'Needs Improvement' },
    }
    const config = variants[rating] || { variant: 'default', label: rating }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleExportPDF = () => {
    const columns = [
      { header: 'Driver', dataKey: 'name' },
      { header: 'Trips', dataKey: 'totalTrips' },
      { header: 'Distance (km)', dataKey: 'totalDistance' },
      { header: 'Safety Score', dataKey: 'safetyScore' },
      { header: 'Fuel Efficiency', dataKey: 'fuelEfficiency' },
      { header: 'On-Time %', dataKey: 'onTimeDelivery' },
      { header: 'Rating', dataKey: 'rating' },
    ]

    exportToPDF({
      title: 'Driver Performance Report',
      subtitle: dateRange || 'Last 30 Days',
      data: mockDriverData,
      columns,
      fileName: 'driver-performance-report.pdf',
      orientation: 'landscape',
      includeTimestamp: true,
    })
  }

  const handleExportCSV = () => {
    const columns = [
      { header: 'Driver Name', dataKey: 'name' },
      { header: 'Total Trips', dataKey: 'totalTrips' },
      { header: 'Total Distance (km)', dataKey: 'totalDistance' },
      { header: 'Total Duration (hrs)', dataKey: 'totalDuration' },
      { header: 'Fuel Efficiency (km/L)', dataKey: 'fuelEfficiency', format: (v) => csvFormatters.number(v, 1) },
      { header: 'Safety Score', dataKey: 'safetyScore' },
      { header: 'Speeding Events', dataKey: 'speedingEvents' },
      { header: 'Harsh Braking', dataKey: 'harshBraking' },
      { header: 'Harsh Acceleration', dataKey: 'harshAcceleration' },
      { header: 'Idle Time (min)', dataKey: 'idleTime' },
      { header: 'On-Time Delivery %', dataKey: 'onTimeDelivery', format: (v) => csvFormatters.percentage(v, 0) },
      { header: 'Rating', dataKey: 'rating' },
    ]

    exportToCSV({
      data: mockDriverData,
      columns,
      fileName: 'driver-performance-report.csv',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Driver Performance Report</h2>
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
            <CardTitle className="text-sm font-medium">Avg Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetAverages.avgSafetyScore}/100</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fleet average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetAverages.avgFuelEfficiency} km/L</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fuel economy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetAverages.avgOnTimeDelivery}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetAverages.totalTrips}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All drivers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Highest safety scores this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((driver, index) => (
              <div key={driver.id} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <div className="font-medium">{driver.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {driver.totalTrips} trips • {driver.totalDistance} km
                  </div>
                </div>
                <div className="text-2xl font-bold">{driver.safetyScore}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Safety Scores</CardTitle>
            <CardDescription>Safety performance by driver</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDriverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="safetyScore" fill="#22c55e" name="Safety Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuel Efficiency</CardTitle>
            <CardDescription>Fuel economy comparison (km/L)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDriverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fuelEfficiency" fill="#0088FE" name="Efficiency (km/L)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>Complete breakdown of driver performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead className="text-right">Trips</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead className="text-right">Safety</TableHead>
                  <TableHead className="text-right">Efficiency</TableHead>
                  <TableHead className="text-right">Speeding</TableHead>
                  <TableHead className="text-right">Harsh Events</TableHead>
                  <TableHead className="text-right">On-Time %</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDriverData.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell className="text-right">{driver.totalTrips}</TableCell>
                    <TableCell className="text-right">{driver.totalDistance} km</TableCell>
                    <TableCell className="text-right">{driver.safetyScore}/100</TableCell>
                    <TableCell className="text-right">{driver.fuelEfficiency} km/L</TableCell>
                    <TableCell className="text-right">{driver.speedingEvents}</TableCell>
                    <TableCell className="text-right">
                      {driver.harshBraking + driver.harshAcceleration}
                    </TableCell>
                    <TableCell className="text-right">{driver.onTimeDelivery}%</TableCell>
                    <TableCell>{getRatingBadge(driver.rating)}</TableCell>
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
