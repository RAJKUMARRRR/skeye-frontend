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
import {
  Truck,
  Route,
  Bell,
  MapPin,
  BarChart3,
  CheckCircle,
  PauseCircle,
  Wrench,
  Circle,
  Settings
} from 'lucide-react'

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
            <Settings className="w-4 h-4 mr-1.5" />
            Customize
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
          icon={<Truck className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
          description="Active fleet size"
        />
        <KPICard
          title="Active Trips"
          value={mockKPIs.activeTrips}
          icon={<Route className="w-6 h-6" />}
          trend={{ value: 3, isPositive: false }}
          description="Currently in progress"
        />
        <KPICard
          title="Total Alerts"
          value={mockKPIs.totalAlerts}
          icon={<Bell className="w-6 h-6" />}
          description="Requires attention"
        />
        <KPICard
          title="Distance Today"
          value={mockKPIs.distanceToday}
          icon={<MapPin className="w-6 h-6" />}
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
            icon={<BarChart3 className="w-5 h-5" />}
            variant="default"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            label="Idle"
            value={stats.idle}
            icon={<PauseCircle className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            label="Maintenance"
            value={stats.maintenance}
            icon={<Wrench className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            label="Offline"
            value={stats.offline}
            icon={<Circle className="w-5 h-5" />}
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
          color="#14b8a6"
        />
        <TrendChart
          title="Daily Trips Trend"
          data={tripsTrendData}
          chartType="line"
          color="#0d9488"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {[
              { type: 'Speed Violation', vehicle: 'TN-01-AB-1234', severity: 'high', time: '15 mins ago' },
              { type: 'Geofence Exit', vehicle: 'TN-01-CD-5678', severity: 'critical', time: '30 mins ago' },
              { type: 'Idle Time', vehicle: 'TN-01-EF-9012', severity: 'medium', time: '45 mins ago' },
              { type: 'Maintenance Due', vehicle: 'TN-01-AB-1234', severity: 'medium', time: '2 hours ago' },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-600' :
                    alert.severity === 'high' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{alert.type}</p>
                    <p className="text-xs text-gray-500">{alert.vehicle}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {[
              { driver: 'John Smith', route: 'Chicago → Milwaukee', status: 'In Progress', distance: '145 km' },
              { driver: 'Jane Doe', route: 'Detroit → Cleveland', status: 'Completed', distance: '268 km' },
              { driver: 'Mike Johnson', route: 'Indianapolis → Columbus', status: 'In Progress', distance: '289 km' },
              { driver: 'Sarah Williams', route: 'Madison → Green Bay', status: 'Completed', distance: '198 km' },
            ].map((trip, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{trip.driver}</p>
                  <p className="text-xs text-gray-500">{trip.route}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${
                    trip.status === 'In Progress' ? 'text-accent' : 'text-green-600'
                  }`}>{trip.status}</p>
                  <p className="text-xs text-gray-500">{trip.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
