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
  Button,
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
} from '@fleet/ui-web'
import { Fuel as FuelIcon, TrendingUp, TrendingDown, DollarSign, Droplet, AlertTriangle } from 'lucide-react'
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Mock fuel data
const monthlyFuelData = [
  { month: 'Jan', consumption: 4250, cost: 6800, efficiency: 8.5, price: 1.60 },
  { month: 'Feb', consumption: 4580, cost: 7350, efficiency: 8.7, price: 1.61 },
  { month: 'Mar', consumption: 4820, cost: 7750, efficiency: 8.9, price: 1.61 },
  { month: 'Apr', consumption: 4690, cost: 7600, efficiency: 8.6, price: 1.62 },
  { month: 'May', consumption: 4950, cost: 8100, efficiency: 9.1, price: 1.64 },
  { month: 'Jun', consumption: 5080, cost: 8350, efficiency: 9.2, price: 1.64 },
]

const fuelByVehicle = [
  { vehicle: 'Truck-001', consumption: 850, cost: 1394, efficiency: 8.2, status: 'normal' },
  { vehicle: 'Van-002', consumption: 620, cost: 1017, efficiency: 9.5, status: 'good' },
  { vehicle: 'Sedan-003', consumption: 380, cost: 623, efficiency: 11.2, status: 'excellent' },
  { vehicle: 'Truck-004', consumption: 920, cost: 1509, efficiency: 7.8, status: 'warning' },
  { vehicle: 'Van-005', consumption: 680, cost: 1115, efficiency: 9.0, status: 'good' },
]

const fuelByType = [
  { type: 'Diesel', consumption: 3200, cost: 5248, vehicles: 18 },
  { type: 'Gasoline', consumption: 1680, cost: 2755, vehicles: 15 },
  { type: 'Electric', consumption: 200, cost: 347, vehicles: 9 },
]

const fuelPriceHistory = [
  { week: 'Week 1', diesel: 1.58, gasoline: 1.52, electric: 0.12 },
  { week: 'Week 2', diesel: 1.60, gasoline: 1.54, electric: 0.12 },
  { week: 'Week 3', diesel: 1.62, gasoline: 1.56, electric: 0.13 },
  { week: 'Week 4', diesel: 1.64, gasoline: 1.58, electric: 0.13 },
]

const fuelTransactions = [
  { id: 'F001', date: '2024-01-15', vehicle: 'Truck-001', amount: 85.5, cost: 140.22, station: 'Shell Station A', driver: 'John Smith' },
  { id: 'F002', date: '2024-01-15', vehicle: 'Van-002', amount: 62.3, cost: 102.17, station: 'BP Downtown', driver: 'Sarah Johnson' },
  { id: 'F003', date: '2024-01-14', vehicle: 'Truck-004', amount: 92.8, cost: 152.19, station: 'Exxon Highway', driver: 'Mike Davis' },
  { id: 'F004', date: '2024-01-14', vehicle: 'Sedan-003', amount: 38.2, cost: 62.66, station: 'Chevron Central', driver: 'Emily Brown' },
  { id: 'F005', date: '2024-01-13', vehicle: 'Van-005', amount: 68.5, cost: 112.34, station: 'Shell Station B', driver: 'David Wilson' },
]

const fuelStationPerformance = [
  { station: 'Shell Station A', transactions: 45, avgPrice: 1.64, totalCost: 2850, savings: 0 },
  { station: 'BP Downtown', transactions: 38, avgPrice: 1.63, totalCost: 2420, savings: 35 },
  { station: 'Exxon Highway', transactions: 42, avgPrice: 1.65, totalCost: 2680, savings: -28 },
  { station: 'Chevron Central', transactions: 35, avgPrice: 1.62, totalCost: 2150, savings: 58 },
]

export function Fuel() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('all')

  const summary = useMemo(() => {
    const currentMonth = monthlyFuelData[monthlyFuelData.length - 1]
    const previousMonth = monthlyFuelData[monthlyFuelData.length - 2]
    const totalConsumption = monthlyFuelData.reduce((sum, m) => sum + m.consumption, 0)
    const totalCost = monthlyFuelData.reduce((sum, m) => sum + m.cost, 0)
    const avgEfficiency = (monthlyFuelData.reduce((sum, m) => sum + m.efficiency, 0) / monthlyFuelData.length).toFixed(1)
    const costChange = (((currentMonth.cost - previousMonth.cost) / previousMonth.cost) * 100).toFixed(1)
    const efficiencyChange = (((currentMonth.efficiency - previousMonth.efficiency) / previousMonth.efficiency) * 100).toFixed(1)

    return {
      totalConsumption: currentMonth.consumption,
      totalCost: currentMonth.cost,
      avgEfficiency: currentMonth.efficiency,
      currentPrice: currentMonth.price,
      costChange,
      efficiencyChange,
      yearlyProjection: (totalCost / 6) * 12,
    }
  }, [])

  const filteredTransactions = useMemo(() => {
    return fuelTransactions.filter(transaction => {
      const matchesSearch =
        transaction.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.station.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesVehicle = vehicleFilter === 'all' || transaction.vehicle === vehicleFilter
      return matchesSearch && matchesVehicle
    })
  }, [searchTerm, vehicleFilter])

  const getEfficiencyBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      excellent: { variant: 'secondary', label: 'Excellent' },
      good: { variant: 'default', label: 'Good' },
      normal: { variant: 'default', label: 'Normal' },
      warning: { variant: 'destructive', label: 'Warning' },
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fuel Management Dashboard</h1>
          <p className="text-muted-foreground">Track fuel consumption, costs, and efficiency</p>
        </div>
        <Button>
          <Droplet className="mr-2 h-4 w-4" />
          Log Fuel Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalConsumption.toLocaleString()} L</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalCost.toLocaleString()}</div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{summary.costChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <FuelIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgEfficiency} km/L</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{summary.efficiencyChange}% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.currentPrice}/L</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average fuel price
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicles">By Vehicle</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fuel Consumption & Cost Trend</CardTitle>
                <CardDescription>Monthly fuel usage and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyFuelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="consumption" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} name="Consumption (L)" />
                    <Area yAxisId="right" type="monotone" dataKey="cost" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Cost ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fuel by Type</CardTitle>
                <CardDescription>Distribution across fuel types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fuelByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, consumption }) => `${type}: ${consumption}L`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="consumption"
                    >
                      {fuelByType.map((entry, index) => (
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
              <CardTitle>Fuel Efficiency Trend</CardTitle>
              <CardDescription>Average kilometers per liter over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyFuelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 12]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="efficiency" stroke="#22c55e" strokeWidth={2} name="Efficiency (km/L)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Vehicle Tab */}
        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Consumption by Vehicle</CardTitle>
              <CardDescription>Individual vehicle fuel usage and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fuelByVehicle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicle" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consumption" fill="#0088FE" name="Consumption (L)" />
                  <Bar dataKey="efficiency" fill="#22c55e" name="Efficiency (km/L)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Fuel Performance</CardTitle>
              <CardDescription>Detailed breakdown per vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead className="text-right">Consumption (L)</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Efficiency</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelByVehicle.map((vehicle) => (
                      <TableRow key={vehicle.vehicle}>
                        <TableCell className="font-medium">{vehicle.vehicle}</TableCell>
                        <TableCell className="text-right">{vehicle.consumption.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${vehicle.cost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{vehicle.efficiency} km/L</TableCell>
                        <TableCell>{getEfficiencyBadge(vehicle.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Transactions</CardTitle>
              <CardDescription>Complete history of fuel purchases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    {fuelByVehicle.map(v => (
                      <SelectItem key={v.vehicle} value={v.vehicle}>{v.vehicle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Station</TableHead>
                      <TableHead className="text-right">Amount (L)</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.vehicle}</TableCell>
                        <TableCell>{transaction.driver}</TableCell>
                        <TableCell>{transaction.station}</TableCell>
                        <TableCell className="text-right">{transaction.amount}</TableCell>
                        <TableCell className="text-right">${transaction.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stations Tab */}
        <TabsContent value="stations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Station Performance</CardTitle>
              <CardDescription>Compare pricing and savings across stations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">Avg Price</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead className="text-right">Savings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelStationPerformance.map((station) => (
                      <TableRow key={station.station}>
                        <TableCell className="font-medium">{station.station}</TableCell>
                        <TableCell className="text-right">{station.transactions}</TableCell>
                        <TableCell className="text-right">${station.avgPrice}</TableCell>
                        <TableCell className="text-right">${station.totalCost.toLocaleString()}</TableCell>
                        <TableCell className={`text-right font-bold ${station.savings > 0 ? 'text-green-600' : station.savings < 0 ? 'text-red-600' : ''}`}>
                          {station.savings > 0 ? '+' : ''}{station.savings === 0 ? '-' : `$${station.savings}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Price History</CardTitle>
              <CardDescription>Weekly price trends by fuel type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fuelPriceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="diesel" stroke="#0088FE" strokeWidth={2} name="Diesel ($/L)" />
                  <Line type="monotone" dataKey="gasoline" stroke="#00C49F" strokeWidth={2} name="Gasoline ($/L)" />
                  <Line type="monotone" dataKey="electric" stroke="#FFBB28" strokeWidth={2} name="Electric ($/kWh)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Projections</CardTitle>
              <CardDescription>Estimated annual fuel expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="font-medium">Annual Projection</div>
                    <div className="text-sm text-muted-foreground">Based on current trends</div>
                  </div>
                  <div className="text-2xl font-bold">${summary.yearlyProjection.toLocaleString()}</div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border p-3 bg-yellow-50">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-900">Price Increase Alert</div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Fuel prices have increased by {summary.costChange}% this month. Consider locking in rates with fuel cards or bulk purchasing agreements.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
