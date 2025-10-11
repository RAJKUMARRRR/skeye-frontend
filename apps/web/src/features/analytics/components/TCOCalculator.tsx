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
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface VehicleTCO {
  vehicleId: string
  vehicleName: string
  purchasePrice: number
  age: number // months
  totalMileage: number
  depreciation: number
  maintenance: number
  fuel: number
  insurance: number
  registration: number
  other: number
}

const mockVehicleTCO: VehicleTCO[] = [
  {
    vehicleId: '1',
    vehicleName: 'TN-01-AB-1234',
    purchasePrice: 800000,
    age: 24,
    totalMileage: 45000,
    depreciation: 160000,
    maintenance: 45000,
    fuel: 180000,
    insurance: 48000,
    registration: 12000,
    other: 15000,
  },
  {
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    purchasePrice: 1200000,
    age: 18,
    totalMileage: 32000,
    depreciation: 180000,
    maintenance: 38000,
    fuel: 128000,
    insurance: 54000,
    registration: 15000,
    other: 12000,
  },
  {
    vehicleId: '3',
    vehicleName: 'TN-01-EF-9012',
    purchasePrice: 950000,
    age: 30,
    totalMileage: 68000,
    depreciation: 237500,
    maintenance: 52000,
    fuel: 272000,
    insurance: 57000,
    registration: 14000,
    other: 18000,
  },
  {
    vehicleId: '4',
    vehicleName: 'TN-01-GH-3456',
    purchasePrice: 750000,
    age: 12,
    totalMileage: 22000,
    depreciation: 75000,
    maintenance: 29000,
    fuel: 88000,
    insurance: 36000,
    registration: 11000,
    other: 8000,
  },
]

export function TCOCalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<'total' | 'monthly' | 'yearly'>('total')

  const filteredData = useMemo(() => {
    if (selectedVehicle === 'all') {
      return mockVehicleTCO
    }
    return mockVehicleTCO.filter((v) => v.vehicleId === selectedVehicle)
  }, [selectedVehicle])

  const totalTCO = useMemo(() => {
    return filteredData.reduce((sum, vehicle) => {
      return (
        sum +
        vehicle.depreciation +
        vehicle.maintenance +
        vehicle.fuel +
        vehicle.insurance +
        vehicle.registration +
        vehicle.other
      )
    }, 0)
  }, [filteredData])

  const costBreakdown = useMemo(() => {
    const breakdown = {
      depreciation: 0,
      maintenance: 0,
      fuel: 0,
      insurance: 0,
      registration: 0,
      other: 0,
    }

    filteredData.forEach((vehicle) => {
      breakdown.depreciation += vehicle.depreciation
      breakdown.maintenance += vehicle.maintenance
      breakdown.fuel += vehicle.fuel
      breakdown.insurance += vehicle.insurance
      breakdown.registration += vehicle.registration
      breakdown.other += vehicle.other
    })

    return [
      { category: 'Depreciation', cost: breakdown.depreciation, percentage: (breakdown.depreciation / totalTCO) * 100 },
      { category: 'Fuel', cost: breakdown.fuel, percentage: (breakdown.fuel / totalTCO) * 100 },
      { category: 'Maintenance', cost: breakdown.maintenance, percentage: (breakdown.maintenance / totalTCO) * 100 },
      { category: 'Insurance', cost: breakdown.insurance, percentage: (breakdown.insurance / totalTCO) * 100 },
      { category: 'Registration', cost: breakdown.registration, percentage: (breakdown.registration / totalTCO) * 100 },
      { category: 'Other', cost: breakdown.other, percentage: (breakdown.other / totalTCO) * 100 },
    ]
  }, [filteredData, totalTCO])

  const getAdjustedValue = (value: number, age: number) => {
    if (timeframe === 'monthly') {
      return value / age
    } else if (timeframe === 'yearly') {
      return (value / age) * 12
    }
    return value
  }

  const avgCostPerKm = useMemo(() => {
    const totalMileage = filteredData.reduce((sum, v) => sum + v.totalMileage, 0)
    return totalMileage > 0 ? totalTCO / totalMileage : 0
  }, [filteredData, totalTCO])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <h4 className="font-semibold text-blue-900">Total Cost of Ownership (TCO)</h4>
            <p className="text-sm text-blue-800 mt-1">
              Comprehensive analysis of all costs associated with vehicle ownership including
              depreciation, fuel, maintenance, insurance, and more.
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">Vehicle</label>
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {mockVehicleTCO.map((vehicle) => (
                <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                  {vehicle.vehicleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">View</label>
          <Select value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total Cost</SelectItem>
              <SelectItem value="monthly">Average Monthly</SelectItem>
              <SelectItem value="yearly">Average Yearly</SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">₹{Math.round(totalTCO).toLocaleString()}</div>
          <div className="text-sm text-gray-600">
            {timeframe === 'total' && 'Total Cost of Ownership'}
            {timeframe === 'monthly' && 'Average Monthly TCO'}
            {timeframe === 'yearly' && 'Average Yearly TCO'}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">₹{Math.round(avgCostPerKm).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Cost per Kilometer</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {filteredData.reduce((sum, v) => sum + v.totalMileage, 0).toLocaleString()} km
          </div>
          <div className="text-sm text-gray-600">Total Distance</div>
        </Card>
      </div>

      {/* Cost Breakdown Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costBreakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cost Category Breakdown</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costBreakdown
              .sort((a, b) => b.cost - a.cost)
              .map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>₹{Math.round(item.cost).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm">{item.percentage.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      {/* Vehicle-wise TCO */}
      {selectedVehicle === 'all' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">TCO by Vehicle</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Total TCO</TableHead>
                <TableHead>Cost/km</TableHead>
                <TableHead>Monthly Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicleTCO.map((vehicle) => {
                const vehicleTCO =
                  vehicle.depreciation +
                  vehicle.maintenance +
                  vehicle.fuel +
                  vehicle.insurance +
                  vehicle.registration +
                  vehicle.other
                const costPerKm = vehicleTCO / vehicle.totalMileage
                const monthlyAvg = vehicleTCO / vehicle.age

                return (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell className="font-medium">{vehicle.vehicleName}</TableCell>
                    <TableCell>{vehicle.age} months</TableCell>
                    <TableCell>{vehicle.totalMileage.toLocaleString()} km</TableCell>
                    <TableCell>₹{Math.round(vehicleTCO).toLocaleString()}</TableCell>
                    <TableCell>₹{costPerKm.toFixed(2)}</TableCell>
                    <TableCell>₹{Math.round(monthlyAvg).toLocaleString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
