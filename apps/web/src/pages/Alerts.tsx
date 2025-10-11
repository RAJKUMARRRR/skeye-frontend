import { useState } from 'react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { AlertTable } from '../features/alerts/components/AlertTable'
import { AlertRuleBuilder } from '../features/alerts/components/AlertRuleBuilder'
import { AlertRouting } from '../features/alerts/components/AlertRouting'
import { AlertEscalation } from '../features/alerts/components/AlertEscalation'
import { AlertHistory } from '../features/alerts/components/AlertHistory'
import { AlertMuting } from '../features/alerts/components/AlertMuting'
import { QuietHours } from '../features/alerts/components/QuietHours'
import { NotificationPreferences } from '../features/settings/components/NotificationPreferences'

// Mock data
const mockAlerts = [
  {
    id: '1',
    type: 'Speed Violation',
    severity: 'high' as const,
    vehicleId: '1',
    vehicleName: 'TN-01-AB-1234',
    message: 'Vehicle exceeded speed limit of 80 km/h, current speed: 95 km/h',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'active' as const,
  },
  {
    id: '2',
    type: 'Geofence Exit',
    severity: 'critical' as const,
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    message: 'Vehicle exited authorized zone: Downtown Area',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'active' as const,
  },
  {
    id: '3',
    type: 'Idle Time',
    severity: 'medium' as const,
    vehicleId: '3',
    vehicleName: 'TN-01-EF-9012',
    message: 'Vehicle has been idling for 25 minutes',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'acknowledged' as const,
    acknowledgedBy: 'John Doe',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: '4',
    type: 'Maintenance Due',
    severity: 'medium' as const,
    vehicleId: '1',
    vehicleName: 'TN-01-AB-1234',
    message: 'Scheduled maintenance due in 2 days (15,000 km service)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'active' as const,
  },
  {
    id: '5',
    type: 'Fuel Level Low',
    severity: 'low' as const,
    vehicleId: '4',
    vehicleName: 'TN-01-GH-3456',
    message: 'Fuel level below 20%',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'resolved' as const,
    acknowledgedBy: 'Jane Smith',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: '6',
    type: 'Harsh Braking',
    severity: 'medium' as const,
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    message: 'Driver performed harsh braking event',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'resolved' as const,
    acknowledgedBy: 'John Doe',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
]

export function Alerts() {
  const [activeTab, setActiveTab] = useState('alerts')
  const [alertsView, setAlertsView] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all')

  const activeAlerts = mockAlerts.filter((a) => a.status === 'active')
  const acknowledgedAlerts = mockAlerts.filter((a) => a.status === 'acknowledged')
  const resolvedAlerts = mockAlerts.filter((a) => a.status === 'resolved')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h2>
          <p className="text-gray-600">Monitor and manage fleet alerts</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg bg-red-50 border-red-200">
          <div className="text-2xl font-bold text-red-900">{activeAlerts.length}</div>
          <div className="text-sm text-red-700">Active Alerts</div>
        </div>
        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
          <div className="text-2xl font-bold text-yellow-900">{acknowledgedAlerts.length}</div>
          <div className="text-sm text-yellow-700">Acknowledged</div>
        </div>
        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
          <div className="text-2xl font-bold text-green-900">{resolvedAlerts.length}</div>
          <div className="text-sm text-green-700">Resolved Today</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold">{mockAlerts.length}</div>
          <div className="text-sm text-gray-600">Total Alerts</div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
          <TabsTrigger value="escalation">Escalation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="muting">Muting</TabsTrigger>
          <TabsTrigger value="quiet-hours">Quiet Hours</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Tabs value={alertsView} onValueChange={setAlertsView}>
            <TabsList>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <AlertTable alerts={mockAlerts} />
            </TabsContent>

            <TabsContent value="active">
              <AlertTable alerts={activeAlerts} />
            </TabsContent>

            <TabsContent value="acknowledged">
              <AlertTable alerts={acknowledgedAlerts} />
            </TabsContent>

            <TabsContent value="resolved">
              <AlertTable alerts={resolvedAlerts} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="rules">
          <AlertRuleBuilder
            onSave={(rule) => console.log('Save rule:', rule)}
            onCancel={() => setActiveTab('alerts')}
          />
        </TabsContent>

        <TabsContent value="routing">
          <AlertRouting />
        </TabsContent>

        <TabsContent value="escalation">
          <AlertEscalation />
        </TabsContent>

        <TabsContent value="history">
          <AlertHistory />
        </TabsContent>

        <TabsContent value="muting">
          <AlertMuting />
        </TabsContent>

        <TabsContent value="quiet-hours">
          <QuietHours />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  )
}
