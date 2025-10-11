import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@fleet/ui-web'
import { Download, FileText, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { exportToPDF } from '../../../lib/export/pdf-export'
import { exportToCSV, csvFormatters } from '../../../lib/export/csv-export'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Mock executive data
const mockExecutiveData = {
  fleet: {
    totalVehicles: 42,
    activeVehicles: 38,
    utilizationRate: 76.5,
    avgAge: 3.2,
  },
  operations: {
    totalTrips: 1245,
    totalDistance: 48500,
    totalHours: 2850,
    avgTripDistance: 38.9,
  },
  financial: {
    totalRevenue: 285000,
    totalCosts: 198500,
    profit: 86500,
    profitMargin: 30.4,
    costPerKm: 4.09,
    revenuePerKm: 5.88,
  },
  safety: {
    avgSafetyScore: 86.5,
    totalIncidents: 8,
    criticalIncidents: 2,
    complianceRate: 94.2,
  },
  efficiency: {
    avgFuelEfficiency: 8.9,
    totalFuelCost: 67200,
    maintenanceCost: 42300,
    idleTimePercentage: 12.5,
  },
}

// Monthly trends
const monthlyTrends = [
  { month: 'Jan', revenue: 245000, costs: 175000, trips: 1050, safety: 84 },
  { month: 'Feb', revenue: 258000, costs: 182000, trips: 1120, safety: 85 },
  { month: 'Mar', revenue: 272000, costs: 189000, trips: 1180, safety: 87 },
  { month: 'Apr', revenue: 268000, costs: 192000, trips: 1210, safety: 86 },
  { month: 'May', revenue: 282000, costs: 195000, trips: 1235, safety: 88 },
  { month: 'Jun', revenue: 285000, costs: 198500, trips: 1245, safety: 87 },
]

// Cost breakdown
const costBreakdown = [
  { name: 'Fuel', value: 67200, percentage: 33.8 },
  { name: 'Maintenance', value: 42300, percentage: 21.3 },
  { name: 'Insurance', value: 35000, percentage: 17.6 },
  { name: 'Labor', value: 38000, percentage: 19.1 },
  { name: 'Other', value: 16000, percentage: 8.1 },
]

// Performance by vehicle type
const performanceByType = [
  { type: 'Trucks', count: 18, utilization: 82, revenue: 142000 },
  { type: 'Vans', count: 15, utilization: 74, revenue: 98000 },
  { type: 'Sedans', count: 9, utilization: 68, revenue: 45000 },
]

interface ExecutiveSummaryProps {
  dateRange?: string
}

export function ExecutiveSummary({ dateRange }: ExecutiveSummaryProps) {
  const trends = useMemo(() => {
    const currentMonth = monthlyTrends[monthlyTrends.length - 1]
    const previousMonth = monthlyTrends[monthlyTrends.length - 2]

    return {
      revenueChange: (((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1),
      costsChange: (((currentMonth.costs - previousMonth.costs) / previousMonth.costs) * 100).toFixed(1),
      tripsChange: (((currentMonth.trips - previousMonth.trips) / previousMonth.trips) * 100).toFixed(1),
      safetyChange: (((currentMonth.safety - previousMonth.safety) / previousMonth.safety) * 100).toFixed(1),
    }
  }, [])

  const handleExportPDF = () => {
    const summaryData = [
      {
        metric: 'Total Revenue',
        value: `$${mockExecutiveData.financial.totalRevenue.toLocaleString()}`,
        change: `+${trends.revenueChange}%`,
      },
      {
        metric: 'Profit Margin',
        value: `${mockExecutiveData.financial.profitMargin}%`,
        change: '-',
      },
      {
        metric: 'Fleet Utilization',
        value: `${mockExecutiveData.fleet.utilizationRate}%`,
        change: '-',
      },
      {
        metric: 'Safety Score',
        value: `${mockExecutiveData.safety.avgSafetyScore}/100`,
        change: `+${trends.safetyChange}%`,
      },
    ]

    const columns = [
      { header: 'Metric', dataKey: 'metric' },
      { header: 'Value', dataKey: 'value' },
      { header: 'Change', dataKey: 'change' },
    ]

    exportToPDF({
      title: 'Executive Summary',
      subtitle: dateRange || 'Last 30 Days',
      data: summaryData,
      columns,
      fileName: 'executive-summary.pdf',
      orientation: 'portrait',
      includeTimestamp: true,
    })
  }

  const handleExportCSV = () => {
    const summaryData = [
      { category: 'Revenue', metric: 'Total Revenue', value: mockExecutiveData.financial.totalRevenue },
      { category: 'Revenue', metric: 'Total Costs', value: mockExecutiveData.financial.totalCosts },
      { category: 'Revenue', metric: 'Profit', value: mockExecutiveData.financial.profit },
      { category: 'Revenue', metric: 'Profit Margin %', value: mockExecutiveData.financial.profitMargin },
      { category: 'Fleet', metric: 'Total Vehicles', value: mockExecutiveData.fleet.totalVehicles },
      { category: 'Fleet', metric: 'Active Vehicles', value: mockExecutiveData.fleet.activeVehicles },
      { category: 'Fleet', metric: 'Utilization Rate %', value: mockExecutiveData.fleet.utilizationRate },
      { category: 'Operations', metric: 'Total Trips', value: mockExecutiveData.operations.totalTrips },
      { category: 'Operations', metric: 'Total Distance (km)', value: mockExecutiveData.operations.totalDistance },
      { category: 'Safety', metric: 'Safety Score', value: mockExecutiveData.safety.avgSafetyScore },
      { category: 'Safety', metric: 'Compliance Rate %', value: mockExecutiveData.safety.complianceRate },
    ]

    const columns = [
      { header: 'Category', dataKey: 'category' },
      { header: 'Metric', dataKey: 'metric' },
      { header: 'Value', dataKey: 'value' },
    ]

    exportToCSV({
      data: summaryData,
      columns,
      fileName: 'executive-summary.csv',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Executive Summary</h2>
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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockExecutiveData.financial.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{trends.revenueChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockExecutiveData.financial.profitMargin}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              ${mockExecutiveData.financial.profit.toLocaleString()} profit
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockExecutiveData.fleet.utilizationRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {mockExecutiveData.fleet.activeVehicles}/{mockExecutiveData.fleet.totalVehicles} vehicles active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockExecutiveData.safety.avgSafetyScore}/100</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{trends.safetyChange}% improvement
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Performance</CardTitle>
          <CardDescription>Revenue and cost trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} name="Costs" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Operational Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Distribution of operational costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Vehicle Type</CardTitle>
            <CardDescription>Revenue generation by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Operational KPIs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Trips</span>
              <span className="font-bold">{mockExecutiveData.operations.totalTrips.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Distance</span>
              <span className="font-bold">{mockExecutiveData.operations.totalDistance.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Trip Distance</span>
              <span className="font-bold">{mockExecutiveData.operations.avgTripDistance} km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Hours</span>
              <span className="font-bold">{mockExecutiveData.operations.totalHours.toLocaleString()} hrs</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial KPIs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue per km</span>
              <span className="font-bold">${mockExecutiveData.financial.revenuePerKm}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cost per km</span>
              <span className="font-bold">${mockExecutiveData.financial.costPerKm}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Fuel Cost</span>
              <span className="font-bold">${mockExecutiveData.efficiency.totalFuelCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Maintenance Cost</span>
              <span className="font-bold">${mockExecutiveData.efficiency.maintenanceCost.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Safety Score</span>
              <span className="font-bold">{mockExecutiveData.safety.avgSafetyScore}/100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Compliance Rate</span>
              <span className="font-bold">{mockExecutiveData.safety.complianceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Incidents</span>
              <span className="font-bold">{mockExecutiveData.safety.totalIncidents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Critical Incidents</span>
              <span className="font-bold text-red-600">{mockExecutiveData.safety.criticalIncidents}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Insights & Recommendations</CardTitle>
          <CardDescription>Key findings and action items for leadership</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 bg-green-50">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900">Strong Revenue Growth</div>
                <div className="text-sm text-green-700 mt-1">
                  Revenue increased by {trends.revenueChange}% month-over-month. Continue expanding high-performing routes and vehicle types.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-blue-50">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Healthy Profit Margins</div>
                <div className="text-sm text-blue-700 mt-1">
                  30.4% profit margin indicates efficient operations. Focus on maintaining cost controls while scaling.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-yellow-50">
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900">Fleet Utilization Opportunity</div>
                <div className="text-sm text-yellow-700 mt-1">
                  At 76.5% utilization, there's room for improvement. Consider route optimization and better scheduling to increase utilization to 85%+.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-purple-50">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-purple-900">Safety Performance Improving</div>
                <div className="text-sm text-purple-700 mt-1">
                  Safety scores improved by {trends.safetyChange}%. Continue driver training programs and safety initiatives.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
