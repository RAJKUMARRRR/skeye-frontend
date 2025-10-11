import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fleet/ui-web'
import { DollarSign, Search, TrendingUp, TrendingDown, Calendar, Plus } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const mockExpenses = [
  {
    id: 'exp001',
    date: '2025-10-09',
    category: 'fuel',
    subcategory: 'Diesel',
    amount: 1250.00,
    vehicle: 'Truck-001',
    description: 'Fuel refill at Station A',
    paymentMethod: 'fleet_card',
  },
  {
    id: 'exp002',
    date: '2025-10-08',
    category: 'maintenance',
    subcategory: 'Oil Change',
    amount: 250.00,
    vehicle: 'Van-002',
    description: 'Routine oil change',
    paymentMethod: 'credit',
  },
  {
    id: 'exp003',
    date: '2025-10-08',
    category: 'repairs',
    subcategory: 'Brake Repair',
    amount: 850.00,
    vehicle: 'Truck-003',
    description: 'Brake pad replacement',
    paymentMethod: 'invoice',
  },
  {
    id: 'exp004',
    date: '2025-10-07',
    category: 'insurance',
    subcategory: 'Fleet Insurance',
    amount: 5000.00,
    vehicle: null,
    description: 'Monthly premium',
    paymentMethod: 'ach',
  },
  {
    id: 'exp005',
    date: '2025-10-06',
    category: 'fuel',
    subcategory: 'Gasoline',
    amount: 980.00,
    vehicle: 'Van-004',
    description: 'Fuel refill',
    paymentMethod: 'fleet_card',
  },
]

const monthlyData = [
  { month: 'May', fuel: 12500, maintenance: 3200, repairs: 4500, insurance: 5000, other: 1200 },
  { month: 'Jun', fuel: 13200, maintenance: 2800, repairs: 5200, insurance: 5000, other: 1500 },
  { month: 'Jul', fuel: 11800, maintenance: 4100, repairs: 3800, insurance: 5000, other: 1100 },
  { month: 'Aug', fuel: 13500, maintenance: 3500, repairs: 6200, insurance: 5000, other: 1800 },
  { month: 'Sep', fuel: 12900, maintenance: 3900, repairs: 4100, insurance: 5000, other: 1400 },
  { month: 'Oct', fuel: 14200, maintenance: 4200, repairs: 5500, insurance: 5000, other: 1600 },
]

const categoryData = [
  { name: 'Fuel', value: 14200, color: '#3b82f6' },
  { name: 'Maintenance', value: 4200, color: '#10b981' },
  { name: 'Repairs', value: 5500, color: '#f59e0b' },
  { name: 'Insurance', value: 5000, color: '#8b5cf6' },
  { name: 'Other', value: 1600, color: '#6b7280' },
]

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState(mockExpenses)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.vehicle && expense.vehicle.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [expenses, searchTerm, categoryFilter])

  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0)
  const previousMonthTotal = monthlyData[monthlyData.length - 2]
  const currentMonthTotal = monthlyData[monthlyData.length - 1]
  const changePercent = ((Object.values(currentMonthTotal).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0) -
    Object.values(previousMonthTotal).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0)) /
    Object.values(previousMonthTotal).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0)) * 100

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      fuel: { className: 'bg-blue-100 text-blue-800', label: 'Fuel' },
      maintenance: { className: 'bg-green-100 text-green-800', label: 'Maintenance' },
      repairs: { className: 'bg-orange-100 text-orange-800', label: 'Repairs' },
      insurance: { className: 'bg-purple-100 text-purple-800', label: 'Insurance' },
      other: { className: 'bg-gray-100 text-gray-800', label: 'Other' },
    }
    const config = variants[category] || variants.other
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
            {changePercent >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${changePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryData[0].name}</div>
            <p className="text-xs text-muted-foreground mt-1">${categoryData[0].value.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
            <CardDescription>Monthly expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fuel" fill="#3b82f6" stackId="a" />
                <Bar dataKey="maintenance" fill="#10b981" stackId="a" />
                <Bar dataKey="repairs" fill="#f59e0b" stackId="a" />
                <Bar dataKey="insurance" fill="#8b5cf6" stackId="a" />
                <Bar dataKey="other" fill="#6b7280" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Current month distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Track and manage all fleet expenses</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repairs">Repairs</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="text-sm">{expense.date}</TableCell>
                      <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">{expense.subcategory}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {expense.vehicle || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-sm capitalize">
                        {expense.paymentMethod.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
