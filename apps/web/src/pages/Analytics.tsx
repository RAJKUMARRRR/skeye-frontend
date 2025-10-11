import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fleet/ui-web'
import { TrendingUp, TrendingDown, Activity, DollarSign, Gauge, MapPin } from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B']

// Mock analytics data
const fleetPerformanceData = [
  { month: 'Jan', distance: 42500, revenue: 245000, costs: 175000, efficiency: 8.5 },
  { month: 'Feb', distance: 45800, revenue: 258000, costs: 182000, efficiency: 8.7 },
  { month: 'Mar', distance: 48200, revenue: 272000, costs: 189000, efficiency: 8.9 },
  { month: 'Apr', distance: 46900, revenue: 268000, costs: 192000, efficiency: 8.6 },
  { month: 'May', distance: 49500, revenue: 282000, costs: 195000, efficiency: 9.1 },
  { month: 'Jun', distance: 50800, revenue: 285000, costs: 198500, efficiency: 9.2 },
]

const vehicleTypeDistribution = [
  { name: 'Trucks', value: 18, utilization: 82 },
  { name: 'Vans', value: 15, utilization: 74 },
  { name: 'Sedans', value: 9, utilization: 68 },
]

const driverPerformanceComparison = [
  { metric: 'Safety', topPerformer: 95, average: 85, lowPerformer: 72 },
  { metric: 'Efficiency', topPerformer: 92, average: 82, lowPerformer: 68 },
  { metric: 'On-Time', topPerformer: 98, average: 88, lowPerformer: 75 },
  { metric: 'Compliance', topPerformer: 96, average: 86, lowPerformer: 78 },
  { metric: 'Customer Satisfaction', topPerformer: 94, average: 84, lowPerformer: 70 },
]

const regionPerformance = [
  { region: 'North', trips: 320, revenue: 78000, costs: 52000, satisfaction: 4.5 },
  { region: 'South', trips: 280, revenue: 68000, costs: 48000, satisfaction: 4.3 },
  { region: 'East', trips: 310, revenue: 72000, costs: 51000, satisfaction: 4.4 },
  { region: 'West', trips: 335, revenue: 82000, costs: 54000, satisfaction: 4.6 },
]

const timeOfDayAnalysis = [
  { hour: '6-9', trips: 145, revenue: 28500, avgSpeed: 45 },
  { hour: '9-12', trips: 280, revenue: 52000, avgSpeed: 52 },
  { hour: '12-15', trips: 320, revenue: 58000, avgSpeed: 48 },
  { hour: '15-18', trips: 285, revenue: 54000, avgSpeed: 42 },
  { hour: '18-21', trips: 180, revenue: 35000, avgSpeed: 50 },
  { hour: '21-24', trips: 35, revenue: 8500, avgSpeed: 55 },
]

const predictiveInsights = [
  {
    category: 'Maintenance',
    prediction: 'High',
    vehicles: 3,
    message: '3 vehicles predicted to need maintenance in next 7 days',
    severity: 'warning',
  },
  {
    category: 'Fuel Costs',
    prediction: 'Increasing',
    change: '+8%',
    message: 'Fuel costs expected to increase by 8% next month',
    severity: 'info',
  },
  {
    category: 'Revenue',
    prediction: 'Growth',
    change: '+12%',
    message: 'Revenue projected to grow 12% based on current trends',
    severity: 'success',
  },
  {
    category: 'Safety Risk',
    prediction: 'Low',
    drivers: 2,
    message: '2 drivers showing concerning behavior patterns',
    severity: 'warning',
  },
]

export function Analytics() {
  const [dateRange, setDateRange] = useState('last-6-months')
  const [activeTab, setActiveTab] = useState('overview')

  const kpis = useMemo(() => {
    const currentMonth = fleetPerformanceData[fleetPerformanceData.length - 1]
    const previousMonth = fleetPerformanceData[fleetPerformanceData.length - 2]

    return {
      totalRevenue: currentMonth.revenue,
      revenueGrowth: (((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1),
      totalDistance: currentMonth.distance,
      distanceGrowth: (((currentMonth.distance - previousMonth.distance) / previousMonth.distance) * 100).toFixed(1),
      avgEfficiency: currentMonth.efficiency,
      efficiencyGrowth: (((currentMonth.efficiency - previousMonth.efficiency) / previousMonth.efficiency) * 100).toFixed(1),
      profitMargin: (((currentMonth.revenue - currentMonth.costs) / currentMonth.revenue) * 100).toFixed(1),
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Advanced fleet performance insights and predictions</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 Days</SelectItem>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="last-6-months">Last 6 Months</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${kpis.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{kpis.revenueGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalDistance.toLocaleString()} km</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{kpis.distanceGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgEfficiency} km/L</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{kpis.efficiencyGrowth}% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.profitMargin}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Healthy margin maintained
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different analytics views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="temporal">Temporal</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Cost Trend</CardTitle>
                <CardDescription>6-month financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={fleetPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Revenue" />
                    <Area type="monotone" dataKey="costs" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Costs" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fleet Composition</CardTitle>
                <CardDescription>Vehicle distribution and utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehicleTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, utilization }) => `${name}: ${value} (${utilization}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vehicleTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distance & Efficiency Correlation</CardTitle>
              <CardDescription>Relationship between distance traveled and fuel efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fleetPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="distance" stroke="#3b82f6" strokeWidth={2} name="Distance (km)" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#22c55e" strokeWidth={2} name="Efficiency (km/L)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Driver Performance Comparison</CardTitle>
              <CardDescription>Top vs average vs low performers across key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={driverPerformanceComparison}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Top Performer" dataKey="topPerformer" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                  <Radar name="Fleet Average" dataKey="average" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Low Performer" dataKey="lowPerformer" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Regional Revenue</CardTitle>
                <CardDescription>Revenue by operational region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                    <Bar dataKey="costs" fill="#ef4444" name="Costs" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Trips & Satisfaction</CardTitle>
                <CardDescription>Trip volume and customer ratings by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="trips" fill="#3b82f6" name="Trips" />
                    <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#eab308" strokeWidth={2} name="Satisfaction (★)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Temporal Tab */}
        <TabsContent value="temporal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time of Day Analysis</CardTitle>
              <CardDescription>Trip patterns and performance by time period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={timeOfDayAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="trips" fill="#3b82f6" name="Trips" />
                  <Bar yAxisId="left" dataKey="revenue" fill="#22c55e" name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="avgSpeed" stroke="#ef4444" strokeWidth={2} name="Avg Speed (km/h)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Insights</CardTitle>
              <CardDescription>AI-powered predictions and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictiveInsights.map((insight, index) => {
                const bgColors = {
                  success: 'bg-green-50 border-green-200',
                  warning: 'bg-yellow-50 border-yellow-200',
                  info: 'bg-blue-50 border-blue-200',
                  error: 'bg-red-50 border-red-200',
                }
                const textColors = {
                  success: 'text-green-900',
                  warning: 'text-yellow-900',
                  info: 'text-blue-900',
                  error: 'text-red-900',
                }
                const iconColors = {
                  success: 'text-green-600',
                  warning: 'text-yellow-600',
                  info: 'text-blue-600',
                  error: 'text-red-600',
                }

                return (
                  <div key={index} className={`rounded-lg border p-4 ${bgColors[insight.severity as keyof typeof bgColors]}`}>
                    <div className="flex items-start gap-3">
                      {insight.severity === 'success' && <TrendingUp className={`h-5 w-5 mt-0.5 ${iconColors[insight.severity]}`} />}
                      {insight.severity === 'warning' && <TrendingDown className={`h-5 w-5 mt-0.5 ${iconColors[insight.severity]}`} />}
                      {insight.severity === 'info' && <Activity className={`h-5 w-5 mt-0.5 ${iconColors[insight.severity]}`} />}
                      <div className="flex-1">
                        <div className={`font-medium ${textColors[insight.severity as keyof typeof textColors]}`}>
                          {insight.category}: {insight.prediction}
                          {insight.change && <span className="ml-2 font-bold">{insight.change}</span>}
                        </div>
                        <div className={`text-sm mt-1 ${textColors[insight.severity as keyof typeof textColors]}`}>
                          {insight.message}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forecasted Metrics</CardTitle>
              <CardDescription>30-day projection based on historical trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[...fleetPerformanceData, { month: 'Jul (Proj)', revenue: 295000, distance: 52500, efficiency: 9.3 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Revenue (Projected)" />
                  <Line type="monotone" dataKey="distance" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Distance (Projected)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
