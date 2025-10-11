import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@fleet/ui-web'
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const performanceMetrics = [
  { metric: 'Safety', score: 87, target: 85, trend: 'up' },
  { metric: 'Efficiency', score: 92, target: 90, trend: 'up' },
  { metric: 'On-Time', score: 95, target: 90, trend: 'stable' },
  { metric: 'Customer Rating', score: 4.8, target: 4.5, trend: 'up' },
  { metric: 'Fuel Economy', score: 8.5, target: 8.0, trend: 'up' },
]

const monthlyScores = [
  { month: 'Jan', safety: 85, efficiency: 88, onTime: 92 },
  { month: 'Feb', safety: 86, efficiency: 90, onTime: 93 },
  { month: 'Mar', safety: 87, efficiency: 91, onTime: 94 },
  { month: 'Apr', safety: 88, efficiency: 91, onTime: 95 },
  { month: 'May', safety: 87, efficiency: 92, onTime: 95 },
  { month: 'Jun', safety: 89, efficiency: 92, onTime: 96 },
]

const skillComparison = [
  { skill: 'Driving', driverScore: 88, fleetAvg: 82 },
  { skill: 'Navigation', driverScore: 92, fleetAvg: 85 },
  { skill: 'Safety', driverScore: 87, fleetAvg: 83 },
  { skill: 'Efficiency', driverScore: 90, fleetAvg: 84 },
  { skill: 'Communication', driverScore: 85, fleetAvg: 80 },
]

interface DriverPerformanceProps {
  driverId?: string
}

export function DriverPerformance({ driverId }: DriverPerformanceProps) {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.metric === 'Customer Rating' ? metric.score : `${metric.score}%`}
              </div>
              <div className="flex items-center text-xs mt-1">
                {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600 mr-1" />}
                {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600 mr-1" />}
                <span className={metric.score >= metric.target ? 'text-green-600' : 'text-yellow-600'}>
                  Target: {metric.metric === 'Customer Rating' ? metric.target : `${metric.target}%`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>6-month performance history</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="safety" stroke="#ef4444" strokeWidth={2} name="Safety Score" />
              <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} name="Efficiency" />
              <Line type="monotone" dataKey="onTime" stroke="#22c55e" strokeWidth={2} name="On-Time %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skill Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill Assessment</CardTitle>
            <CardDescription>Driver vs fleet average</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillComparison}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Driver" dataKey="driverScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Radar name="Fleet Avg" dataKey="fleetAvg" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements & Awards</CardTitle>
            <CardDescription>Recognition and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-green-50">
                <Award className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-green-900">Top Performer</div>
                  <div className="text-sm text-green-700">Achieved in May 2024</div>
                </div>
                <Badge variant="secondary">Recent</Badge>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Award className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium">1000 Safe Miles</div>
                  <div className="text-sm text-muted-foreground">Achieved in March 2024</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Award className="h-8 w-8 text-purple-600" />
                <div className="flex-1">
                  <div className="font-medium">Customer Favorite</div>
                  <div className="text-sm text-muted-foreground">Achieved in January 2024</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Opportunities</CardTitle>
          <CardDescription>Recommendations for better performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-blue-50">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900">Fuel Efficiency Training</div>
              <div className="text-sm text-blue-700">
                Consider enrolling in eco-driving course to improve fuel economy by 10-15%
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-3 bg-yellow-50">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-900">Route Planning</div>
              <div className="text-sm text-yellow-700">
                Average idle time is 15% above fleet average. Focus on better route planning.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
