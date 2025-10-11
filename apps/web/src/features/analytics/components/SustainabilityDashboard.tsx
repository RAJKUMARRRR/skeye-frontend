import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@fleet/ui-web'
import { Leaf, TrendingDown, TrendingUp } from 'lucide-react'
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444']

// Mock sustainability data
const monthlyEmissions = [
  { month: 'Jan', co2: 12500, saved: 850, target: 11000 },
  { month: 'Feb', co2: 12200, saved: 920, target: 11000 },
  { month: 'Mar', co2: 11800, saved: 1100, target: 11000 },
  { month: 'Apr', co2: 11500, saved: 1250, target: 11000 },
  { month: 'May', co2: 11200, saved: 1450, target: 11000 },
  { month: 'Jun', co2: 10800, saved: 1680, target: 11000 },
]

const emissionsByVehicleType = [
  { type: 'Trucks', co2: 6800, percentage: 63 },
  { type: 'Vans', co2: 2850, percentage: 26 },
  { type: 'Sedans', co2: 1150, percentage: 11 },
]

const sustainabilityMetrics = [
  { metric: 'Fuel Efficiency', current: 9.2, target: 10, improvement: 15 },
  { metric: 'Idle Time Reduction', current: 12, target: 8, improvement: 25 },
  { metric: 'Route Optimization', current: 87, target: 95, improvement: 12 },
  { metric: 'Electric Vehicle %', current: 8, target: 20, improvement: 60 },
]

const carbonOffsetInitiatives = [
  { name: 'Tree Planting', impact: 2800, cost: 8500, trees: 560 },
  { name: 'Renewable Energy Credits', impact: 1200, cost: 4200, kwh: 12000 },
  { name: 'Carbon Capture', impact: 850, cost: 3800, tons: 8.5 },
  { name: 'Electric Fleet Investment', impact: 1650, cost: 125000, vehicles: 3 },
]

const ecoScoreByDriver = [
  { name: 'Emily Brown', score: 95, co2: 180 },
  { name: 'Sarah Johnson', score: 92, co2: 195 },
  { name: 'David Wilson', score: 85, co2: 240 },
  { name: 'John Smith', score: 82, co2: 265 },
  { name: 'Mike Davis', score: 75, co2: 320 },
]

interface SustainabilityDashboardProps {
  dateRange?: string
}

export function SustainabilityDashboard({ dateRange }: SustainabilityDashboardProps) {
  const summary = useMemo(() => {
    const currentMonth = monthlyEmissions[monthlyEmissions.length - 1]
    const previousMonth = monthlyEmissions[monthlyEmissions.length - 2]
    const totalCO2 = monthlyEmissions.reduce((sum, m) => sum + m.co2, 0)
    const totalSaved = monthlyEmissions.reduce((sum, m) => sum + m.saved, 0)
    const reduction = (((previousMonth.co2 - currentMonth.co2) / previousMonth.co2) * 100).toFixed(1)
    const treesEquivalent = Math.floor(totalCO2 / 20) // ~20kg CO2 per tree/year

    return {
      currentCO2: currentMonth.co2,
      totalCO2,
      totalSaved,
      reduction,
      treesEquivalent,
      targetProgress: ((currentMonth.co2 / currentMonth.target) * 100).toFixed(0),
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CO₂ Emissions</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentCO2.toLocaleString()} kg</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              {summary.reduction}% reduction
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalSaved.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground mt-1">
              Through optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.targetProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Of monthly target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trees Equivalent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.treesEquivalent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              To offset emissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Emissions Trend</CardTitle>
            <CardDescription>Monthly carbon emissions vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyEmissions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="co2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="CO₂ Emissions (kg)" />
                <Area type="monotone" dataKey="target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Target (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions by Vehicle Type</CardTitle>
            <CardDescription>Carbon footprint distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emissionsByVehicleType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="co2"
                >
                  {emissionsByVehicleType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg CO₂`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sustainability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Metrics Progress</CardTitle>
          <CardDescription>Key environmental performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sustainabilityMetrics.map((metric, index) => {
              const progress = (metric.current / metric.target) * 100
              const isOnTrack = progress >= 80

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.metric}</span>
                      {isOnTrack ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metric.current} / {metric.target}
                    </div>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${isOnTrack ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.improvement}% improvement from baseline
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Eco Score by Driver */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Eco Scores</CardTitle>
          <CardDescription>Environmental performance ranking</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ecoScoreByDriver} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#22c55e" name="Eco Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Carbon Offset Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Offset Initiatives</CardTitle>
          <CardDescription>Programs to neutralize fleet emissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {carbonOffsetInitiatives.map((initiative, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <div className="font-medium">{initiative.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Impact: {initiative.impact.toLocaleString()} kg CO₂ offset
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {initiative.trees && `${initiative.trees} trees planted`}
                    {initiative.kwh && `${initiative.kwh.toLocaleString()} kWh renewable energy`}
                    {initiative.tons && `${initiative.tons} tons captured`}
                    {initiative.vehicles && `${initiative.vehicles} electric vehicles`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${initiative.cost.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ${(initiative.cost / initiative.impact).toFixed(2)}/kg CO₂
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Recommendations</CardTitle>
          <CardDescription>Actions to improve environmental impact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-green-50">
            <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-green-900">Route Optimization Success</div>
              <div className="text-sm text-green-700 mt-1">
                Continue current route optimization strategies. You've reduced emissions by {summary.reduction}% this month.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-3 bg-blue-50">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Electrify High-Emission Routes</div>
              <div className="text-sm text-blue-700 mt-1">
                Trucks account for 63% of emissions. Consider replacing 2-3 trucks on short urban routes with electric vehicles.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-3 bg-yellow-50">
            <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-900">Driver Training Opportunity</div>
              <div className="text-sm text-yellow-700 mt-1">
                Focus eco-driving training on bottom 40% of drivers. Potential to save an additional 800kg CO₂/month.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-3 bg-purple-50">
            <Leaf className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <div className="font-medium text-purple-900">Carbon Offset Program</div>
              <div className="text-sm text-purple-700 mt-1">
                At current rates, planting {summary.treesEquivalent} trees annually would offset your entire fleet's emissions for ~$
                {(summary.treesEquivalent * 15).toLocaleString()}.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
