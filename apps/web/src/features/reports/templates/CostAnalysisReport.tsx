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
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { exportToPDF } from '../../../lib/export/pdf-export'
import { exportToCSV, csvFormatters } from '../../../lib/export/csv-export'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B']

// Mock cost data
const mockCostData = [
  {
    vehicleId: 'v1',
    vehicleName: 'Truck-001',
    fuelCost: 3250.50,
    maintenanceCost: 1850.00,
    insuranceCost: 420.00,
    registrationCost: 150.00,
    otherCosts: 280.00,
    totalCost: 5950.50,
    mileage: 4850,
    costPerKm: 1.23,
  },
  {
    vehicleId: 'v2',
    vehicleName: 'Van-002',
    fuelCost: 2180.75,
    maintenanceCost: 980.00,
    insuranceCost: 340.00,
    registrationCost: 120.00,
    otherCosts: 175.00,
    totalCost: 3795.75,
    mileage: 3420,
    costPerKm: 1.11,
  },
  {
    vehicleId: 'v3',
    vehicleName: 'Sedan-003',
    fuelCost: 1450.25,
    maintenanceCost: 520.00,
    insuranceCost: 280.00,
    registrationCost: 100.00,
    otherCosts: 120.00,
    totalCost: 2470.25,
    mileage: 2850,
    costPerKm: 0.87,
  },
  {
    vehicleId: 'v4',
    vehicleName: 'Truck-004',
    fuelCost: 3580.00,
    maintenanceCost: 2150.00,
    insuranceCost: 450.00,
    registrationCost: 150.00,
    otherCosts: 320.00,
    totalCost: 6650.00,
    mileage: 5120,
    costPerKm: 1.30,
  },
  {
    vehicleId: 'v5',
    vehicleName: 'Van-005',
    fuelCost: 2350.50,
    maintenanceCost: 1120.00,
    insuranceCost: 350.00,
    registrationCost: 120.00,
    otherCosts: 200.00,
    totalCost: 4140.50,
    mileage: 3680,
    costPerKm: 1.13,
  },
]

// Monthly trend data
const monthlyTrend = [
  { month: 'Jan', fuel: 12000, maintenance: 5500, other: 2800 },
  { month: 'Feb', fuel: 11500, maintenance: 4200, other: 2600 },
  { month: 'Mar', fuel: 13200, maintenance: 6800, other: 3100 },
  { month: 'Apr', fuel: 12800, maintenance: 5200, other: 2900 },
  { month: 'May', fuel: 13500, maintenance: 7500, other: 3200 },
  { month: 'Jun', fuel: 14200, maintenance: 6100, other: 3400 },
]

interface CostAnalysisReportProps {
  dateRange?: string
  vehicles?: string[]
}

export function CostAnalysisReport({ dateRange, vehicles }: CostAnalysisReportProps) {
  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalFuel = mockCostData.reduce((sum, v) => sum + v.fuelCost, 0)
    const totalMaintenance = mockCostData.reduce((sum, v) => sum + v.maintenanceCost, 0)
    const totalInsurance = mockCostData.reduce((sum, v) => sum + v.insuranceCost, 0)
    const totalRegistration = mockCostData.reduce((sum, v) => sum + v.registrationCost, 0)
    const totalOther = mockCostData.reduce((sum, v) => sum + v.otherCosts, 0)
    const totalCost = totalFuel + totalMaintenance + totalInsurance + totalRegistration + totalOther
    const totalMileage = mockCostData.reduce((sum, v) => sum + v.mileage, 0)
    const avgCostPerKm = totalCost / totalMileage

    return {
      totalCost: totalCost.toFixed(2),
      totalFuel: totalFuel.toFixed(2),
      totalMaintenance: totalMaintenance.toFixed(2),
      totalInsurance: totalInsurance.toFixed(2),
      totalRegistration: totalRegistration.toFixed(2),
      totalOther: totalOther.toFixed(2),
      avgCostPerKm: avgCostPerKm.toFixed(2),
      fuelPercentage: ((totalFuel / totalCost) * 100).toFixed(1),
      maintenancePercentage: ((totalMaintenance / totalCost) * 100).toFixed(1),
    }
  }, [])

  // Cost breakdown for pie chart
  const costBreakdown = useMemo(() => [
    { name: 'Fuel', value: parseFloat(summary.totalFuel) },
    { name: 'Maintenance', value: parseFloat(summary.totalMaintenance) },
    { name: 'Insurance', value: parseFloat(summary.totalInsurance) },
    { name: 'Registration', value: parseFloat(summary.totalRegistration) },
    { name: 'Other', value: parseFloat(summary.totalOther) },
  ], [summary])

  // Cost per vehicle for bar chart
  const costByVehicle = useMemo(() => {
    return mockCostData.map(v => ({
      name: v.vehicleName,
      fuel: v.fuelCost,
      maintenance: v.maintenanceCost,
      other: v.insuranceCost + v.registrationCost + v.otherCosts,
    }))
  }, [])

  const handleExportPDF = () => {
    const columns = [
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Fuel Cost', dataKey: 'fuelCost' },
      { header: 'Maintenance', dataKey: 'maintenanceCost' },
      { header: 'Insurance', dataKey: 'insuranceCost' },
      { header: 'Registration', dataKey: 'registrationCost' },
      { header: 'Other', dataKey: 'otherCosts' },
      { header: 'Total Cost', dataKey: 'totalCost' },
      { header: 'Cost/km', dataKey: 'costPerKm' },
    ]

    exportToPDF({
      title: 'Cost Analysis Report',
      subtitle: dateRange || 'Last 30 Days',
      data: mockCostData,
      columns,
      fileName: 'cost-analysis-report.pdf',
      orientation: 'landscape',
      includeTimestamp: true,
    })
  }

  const handleExportCSV = () => {
    const columns = [
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Fuel Cost', dataKey: 'fuelCost', format: (v) => csvFormatters.currency(v) },
      { header: 'Maintenance Cost', dataKey: 'maintenanceCost', format: (v) => csvFormatters.currency(v) },
      { header: 'Insurance Cost', dataKey: 'insuranceCost', format: (v) => csvFormatters.currency(v) },
      { header: 'Registration Cost', dataKey: 'registrationCost', format: (v) => csvFormatters.currency(v) },
      { header: 'Other Costs', dataKey: 'otherCosts', format: (v) => csvFormatters.currency(v) },
      { header: 'Total Cost', dataKey: 'totalCost', format: (v) => csvFormatters.currency(v) },
      { header: 'Mileage (km)', dataKey: 'mileage' },
      { header: 'Cost per km', dataKey: 'costPerKm', format: (v) => csvFormatters.currency(v) },
    ]

    exportToCSV({
      data: mockCostData,
      columns,
      fileName: 'cost-analysis-report.csv',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Cost Analysis Report</h2>
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
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalCost}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All vehicles combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalFuel}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.fuelPercentage}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalMaintenance}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.maintenancePercentage}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/km</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.avgCostPerKm}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per kilometer traveled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Distribution of costs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Trend</CardTitle>
            <CardDescription>Monthly cost breakdown over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
                <Legend />
                <Line type="monotone" dataKey="fuel" stroke="#0088FE" name="Fuel" />
                <Line type="monotone" dataKey="maintenance" stroke="#00C49F" name="Maintenance" />
                <Line type="monotone" dataKey="other" stroke="#FFBB28" name="Other" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost by Vehicle */}
      <Card>
        <CardHeader>
          <CardTitle>Cost by Vehicle</CardTitle>
          <CardDescription>Breakdown of costs per vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costByVehicle}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="fuel" stackId="a" fill="#0088FE" name="Fuel" />
              <Bar dataKey="maintenance" stackId="a" fill="#00C49F" name="Maintenance" />
              <Bar dataKey="other" stackId="a" fill="#FFBB28" name="Other" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Cost Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Cost Breakdown</CardTitle>
          <CardDescription>Complete cost analysis per vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead className="text-right">Fuel</TableHead>
                  <TableHead className="text-right">Maintenance</TableHead>
                  <TableHead className="text-right">Insurance</TableHead>
                  <TableHead className="text-right">Registration</TableHead>
                  <TableHead className="text-right">Other</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Cost/km</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCostData.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell className="font-medium">{vehicle.vehicleName}</TableCell>
                    <TableCell className="text-right">${vehicle.fuelCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${vehicle.maintenanceCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${vehicle.insuranceCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${vehicle.registrationCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${vehicle.otherCosts.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold">${vehicle.totalCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${vehicle.costPerKm.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">${summary.totalFuel}</TableCell>
                  <TableCell className="text-right">${summary.totalMaintenance}</TableCell>
                  <TableCell className="text-right">${summary.totalInsurance}</TableCell>
                  <TableCell className="text-right">${summary.totalRegistration}</TableCell>
                  <TableCell className="text-right">${summary.totalOther}</TableCell>
                  <TableCell className="text-right">${summary.totalCost}</TableCell>
                  <TableCell className="text-right">${summary.avgCostPerKm}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
