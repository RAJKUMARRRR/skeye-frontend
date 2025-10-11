import { useMemo, useState } from 'react'
import {
  Card,
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
} from '@fleet/ui-web'
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const mockCostData = [
  {
    month: 'Jan',
    oil_change: 2500,
    tire_service: 0,
    brake_service: 0,
    other: 1500,
  },
  {
    month: 'Feb',
    oil_change: 2500,
    tire_service: 0,
    brake_service: 8000,
    other: 2000,
  },
  {
    month: 'Mar',
    oil_change: 0,
    tire_service: 15000,
    brake_service: 0,
    other: 1000,
  },
  {
    month: 'Apr',
    oil_change: 2500,
    tire_service: 0,
    brake_service: 0,
    other: 3500,
  },
  {
    month: 'May',
    oil_change: 2500,
    tire_service: 0,
    brake_service: 0,
    other: 2500,
  },
  {
    month: 'Jun',
    oil_change: 0,
    tire_service: 0,
    brake_service: 8000,
    other: 1500,
  },
]

const mockVehicleCosts = [
  {
    vehicleId: '1',
    vehicleName: 'TN-01-AB-1234',
    totalCost: 45000,
    serviceCount: 8,
    avgCostPerService: 5625,
    lastService: '2024-10-01',
  },
  {
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    totalCost: 38000,
    serviceCount: 6,
    avgCostPerService: 6333,
    lastService: '2024-09-28',
  },
  {
    vehicleId: '3',
    vehicleName: 'TN-01-EF-9012',
    totalCost: 52000,
    serviceCount: 9,
    avgCostPerService: 5778,
    lastService: '2024-09-25',
  },
  {
    vehicleId: '4',
    vehicleName: 'TN-01-GH-3456',
    totalCost: 29000,
    serviceCount: 5,
    avgCostPerService: 5800,
    lastService: '2024-09-20',
  },
]

export function MaintenanceCosts() {
  const [timeRange, setTimeRange] = useState('6months')
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart')

  const totalCost = useMemo(() => {
    return mockCostData.reduce(
      (sum, month) =>
        sum + month.oil_change + month.tire_service + month.brake_service + month.other,
      0
    )
  }, [])

  const avgMonthlyCost = useMemo(() => {
    return totalCost / mockCostData.length
  }, [totalCost])

  const costByCategory = useMemo(() => {
    const categories = {
      oil_change: 0,
      tire_service: 0,
      brake_service: 0,
      other: 0,
    }

    mockCostData.forEach((month) => {
      categories.oil_change += month.oil_change
      categories.tire_service += month.tire_service
      categories.brake_service += month.brake_service
      categories.other += month.other
    })

    return [
      { category: 'Oil Change', cost: categories.oil_change },
      { category: 'Tire Service', cost: categories.tire_service },
      { category: 'Brake Service', cost: categories.brake_service },
      { category: 'Other', cost: categories.other },
    ]
  }, [])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">₹{totalCost.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Cost (6 months)</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">₹{Math.round(avgMonthlyCost).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Average Monthly Cost</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{mockVehicleCosts.reduce((s, v) => s + v.serviceCount, 0)}</div>
          <div className="text-sm text-gray-600">Total Services</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('chart')}
              className={`px-4 py-2 rounded-md ${
                viewType === 'chart'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chart View
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`px-4 py-2 rounded-md ${
                viewType === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </Card>

      {/* Cost Trend Chart */}
      {viewType === 'chart' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Maintenance Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="oil_change"
                stroke="#3b82f6"
                name="Oil Change"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="tire_service"
                stroke="#10b981"
                name="Tire Service"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="brake_service"
                stroke="#f59e0b"
                name="Brake Service"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="other"
                stroke="#6366f1"
                name="Other"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Cost by Category */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cost by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Cost by Vehicle */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cost by Vehicle</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Avg Cost/Service</TableHead>
              <TableHead>Last Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVehicleCosts.map((vehicle) => (
              <TableRow key={vehicle.vehicleId}>
                <TableCell className="font-medium">{vehicle.vehicleName}</TableCell>
                <TableCell>₹{vehicle.totalCost.toLocaleString()}</TableCell>
                <TableCell>{vehicle.serviceCount}</TableCell>
                <TableCell>₹{Math.round(vehicle.avgCostPerService).toLocaleString()}</TableCell>
                <TableCell>{new Date(vehicle.lastService).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-gray-50">
              <TableCell>Total</TableCell>
              <TableCell>
                ₹
                {mockVehicleCosts
                  .reduce((sum, v) => sum + v.totalCost, 0)
                  .toLocaleString()}
              </TableCell>
              <TableCell>
                {mockVehicleCosts.reduce((sum, v) => sum + v.serviceCount, 0)}
              </TableCell>
              <TableCell>
                ₹
                {Math.round(
                  mockVehicleCosts.reduce((sum, v) => sum + v.totalCost, 0) /
                    mockVehicleCosts.reduce((sum, v) => sum + v.serviceCount, 0)
                ).toLocaleString()}
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
