import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Progress,
  Badge,
} from '@fleet/ui-web'
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Save } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const mockBudgets = [
  {
    id: 'budget001',
    category: 'fuel',
    name: 'Fuel & Energy',
    budgeted: 15000,
    spent: 14200,
    forecast: 14800,
  },
  {
    id: 'budget002',
    category: 'maintenance',
    name: 'Maintenance',
    budgeted: 5000,
    spent: 4200,
    forecast: 4500,
  },
  {
    id: 'budget003',
    category: 'repairs',
    name: 'Repairs',
    budgeted: 4000,
    spent: 5500,
    forecast: 6200,
  },
  {
    id: 'budget004',
    category: 'insurance',
    name: 'Insurance & Registration',
    budgeted: 5000,
    spent: 5000,
    forecast: 5000,
  },
  {
    id: 'budget005',
    category: 'other',
    name: 'Other Expenses',
    budgeted: 2000,
    spent: 1600,
    forecast: 1800,
  },
]

const forecastData = [
  { month: 'Nov', actual: null, forecast: 32000, budget: 31000 },
  { month: 'Dec', actual: null, forecast: 33500, budget: 31000 },
  { month: 'Jan', actual: null, forecast: 31800, budget: 31000 },
  { month: 'Feb', actual: null, forecast: 30500, budget: 31000 },
  { month: 'Mar', actual: null, forecast: 32200, budget: 31000 },
  { month: 'Apr', actual: null, forecast: 31500, budget: 31000 },
]

export function BudgetPlanner() {
  const [budgets, setBudgets] = useState(mockBudgets)
  const [saved, setSaved] = useState(false)

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalForecast = budgets.reduce((sum, b) => sum + b.forecast, 0)
  const variance = totalSpent - totalBudgeted
  const variancePercent = (variance / totalBudgeted) * 100

  const getBudgetStatus = (spent: number, budgeted: number, forecast: number) => {
    const spentPercent = (spent / budgeted) * 100
    const forecastPercent = (forecast / budgeted) * 100

    if (forecastPercent > 100) {
      return {
        status: 'over',
        badge: 'destructive' as const,
        label: 'Over Budget',
        icon: <AlertTriangle className="h-4 w-4" />,
      }
    } else if (spentPercent > 90) {
      return {
        status: 'warning',
        badge: 'default' as const,
        label: 'At Risk',
        icon: <AlertTriangle className="h-4 w-4" />,
      }
    } else {
      return {
        status: 'on-track',
        badge: 'secondary' as const,
        label: 'On Track',
        icon: <CheckCircle className="h-4 w-4" />,
      }
    }
  }

  const handleBudgetChange = (id: string, value: number) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, budgeted: value } : b)))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalSpent / totalBudgeted) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalForecast.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">End of month projection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            {variance >= 0 ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {variancePercent >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Forecast</CardTitle>
          <CardDescription>Projected spending vs budget for next 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="budget" stroke="#10b981" name="Budget" />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#3b82f6"
                strokeDasharray="5 5"
                name="Forecast"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget Allocation</CardTitle>
              <CardDescription>Set and track category budgets</CardDescription>
            </div>
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Budget saved successfully
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {budgets.map((budget) => {
            const spentPercent = (budget.spent / budget.budgeted) * 100
            const forecastPercent = (budget.forecast / budget.budgeted) * 100
            const status = getBudgetStatus(budget.spent, budget.budgeted, budget.forecast)

            return (
              <div key={budget.id} className="space-y-4 pb-6 border-b last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{budget.name}</h3>
                    <Badge variant={status.badge} className="flex items-center gap-1">
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Budget</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">$</span>
                        <Input
                          type="number"
                          value={budget.budgeted}
                          onChange={(e) => handleBudgetChange(budget.id, Number(e.target.value))}
                          className="w-24 h-8 text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Spent: ${budget.spent.toLocaleString()}</span>
                    <span className="text-muted-foreground">{spentPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={spentPercent} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Forecast: ${budget.forecast.toLocaleString()} ({forecastPercent.toFixed(1)}%)
                    </span>
                    <span>
                      Remaining: ${(budget.budgeted - budget.spent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="flex items-center justify-end gap-2 pt-4">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
