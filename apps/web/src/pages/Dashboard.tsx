import { useState, useMemo } from 'react'
import { useVehicles } from '../hooks/useVehicles'
import { KPICard, StatCard, Card, Button } from '@fleet/ui-web'
import { DashboardDateFilter } from '../components/dashboard/DashboardDateFilter'
import { DashboardExport } from '../components/dashboard/DashboardExport'
import { DashboardAutoRefresh } from '../components/dashboard/DashboardAutoRefresh'
import { DashboardCustomization } from '../components/dashboard/DashboardCustomization'
import { TrendChart } from '../components/dashboard/TrendChart'
import { ComparisonView } from '../components/dashboard/ComparisonView'
import { RealTimeAlertNotifications } from '../components/alerts/RealTimeAlertNotifications'
import { useDashboardStore } from '../stores/dashboardStore'

export function Dashboard() {
  const { data: vehicles, isLoading } = useVehicles()
  const { comparisonMode, toggleComparisonMode } = useDashboardStore()
  const [showCustomization, setShowCustomization] = useState(false)

  const stats = {
    total: vehicles?.length || 0,
    active: vehicles?.filter(v => v.status === 'active').length || 0,
    idle: vehicles?.filter(v => v.status === 'idle').length || 0,
    maintenance: vehicles?.filter(v => v.status === 'maintenance').length || 0,
    offline: vehicles?.filter(v => v.status === 'offline').length || 0,
  }

  // Mock data for KPIs
  const mockKPIs = {
    totalVehicles: stats.total,
    activeTrips: 23,
    totalAlerts: 5,
    fuelConsumed: '1,245L',
    distanceToday: '3,456 km'
  }

  // Mock trend data
  const vehicleTrendData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return {
        timestamp: date.toISOString(),
        value: Math.floor(Math.random() * 20) + 35,
      }
    })
  }, [])

  const tripsTrendData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      return {
        timestamp: date.toISOString(),
        value: Math.floor(Math.random() * 15) + 15,
      }
    })
  }, [])

  // Mock comparison metrics
  const comparisonMetrics = [
    {
      label: 'Total Vehicles',
      currentValue: stats.total,
      previousValue: stats.total - 5,
    },
    {
      label: 'Active Trips',
      currentValue: mockKPIs.activeTrips,
      previousValue: 18,
    },
    {
      label: 'Total Alerts',
      currentValue: mockKPIs.totalAlerts,
      previousValue: 8,
    },
  ]

  if (showCustomization) {
    return <DashboardCustomization onClose={() => setShowCustomization(false)} />
  }

  if (isLoading) {
    return <div className="text-gray-600">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Real-time alert notifications */}
      {/* TODO: Enable when WebSocket server is available */}
      {/* <RealTimeAlertNotifications enabled={true} /> */}

      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleComparisonMode}
          >
            {comparisonMode ? 'Hide' : 'Show'} Comparison
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCustomization(true)}
          >
            ⚙️ Customize
          </Button>
        </div>
      </div>

      {/* Dashboard Controls */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardDateFilter />
        <DashboardAutoRefresh />
        <DashboardExport />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Vehicles"
          value={mockKPIs.totalVehicles}
          icon={<span className="text-2xl">🚗</span>}
          trend={{ value: 12, isPositive: true }}
          description="Active fleet size"
        />
        <KPICard
          title="Active Trips"
          value={mockKPIs.activeTrips}
          icon={<span className="text-2xl">🗺️</span>}
          trend={{ value: 3, isPositive: false }}
          description="Currently in progress"
        />
        <KPICard
          title="Total Alerts"
          value={mockKPIs.totalAlerts}
          icon={<span className="text-2xl">🔔</span>}
          description="Requires attention"
        />
        <KPICard
          title="Distance Today"
          value={mockKPIs.distanceToday}
          icon={<span className="text-2xl">📍</span>}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Vehicle Status Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fleet Status</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Vehicles"
            value={stats.total}
            icon={<span>📊</span>}
            variant="default"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={<span>✅</span>}
            variant="success"
          />
          <StatCard
            label="Idle"
            value={stats.idle}
            icon={<span>⏸️</span>}
            variant="warning"
          />
          <StatCard
            label="Maintenance"
            value={stats.maintenance}
            icon={<span>🔧</span>}
            variant="warning"
          />
          <StatCard
            label="Offline"
            value={stats.offline}
            icon={<span>⚫</span>}
            variant="danger"
          />
        </div>
      </div>

      {/* Comparison View */}
      {comparisonMode && (
        <ComparisonView metrics={comparisonMetrics} />
      )}

      {/* Trend Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <TrendChart
          title="Vehicle Utilization Trend"
          data={vehicleTrendData}
          chartType="area"
          color="#3b82f6"
        />
        <TrendChart
          title="Daily Trips Trend"
          data={tripsTrendData}
          chartType="line"
          color="#10b981"
        />
      </div>

      {/* Additional Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <p className="text-sm text-muted-foreground">Alerts list coming soon...</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
          <p className="text-sm text-muted-foreground">Trips list coming soon...</p>
        </Card>
      </div>
    </div>
  )
}
