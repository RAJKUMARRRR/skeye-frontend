import { useState } from 'react'
import { Button, Card, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'

const availableReports = [
  {
    id: 'trip-summary',
    name: 'Trip Summary Report',
    description: 'Detailed breakdown of all trips including distance, duration, and fuel consumption',
    category: 'Operations',
    icon: '🗺️',
  },
  {
    id: 'cost-analysis',
    name: 'Cost Analysis Report',
    description: 'Comprehensive cost breakdown including fuel and maintenance expenses',
    category: 'Financial',
    icon: '💰',
  },
  {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Hours-of-service compliance and regulation adherence tracking',
    category: 'Compliance',
    icon: '📋',
  },
  {
    id: 'driver-performance',
    name: 'Driver Performance Report',
    description: 'Comparative analysis of driver scores and behavior metrics',
    category: 'Performance',
    icon: '👨‍✈️',
  },
  {
    id: 'utilization',
    name: 'Vehicle Utilization Report',
    description: 'Analysis of vehicle usage, idle time, and efficiency metrics',
    category: 'Operations',
    icon: '🚗',
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level overview with key KPIs, trends, and actionable insights',
    category: 'Management',
    icon: '📊',
  },
]

const scheduledReports = [
  {
    id: 's1',
    reportName: 'Weekly Fleet Summary',
    reportType: 'executive-summary',
    schedule: 'Weekly - Every Monday 9:00 AM',
    recipients: ['admin@fleet.com', 'manager@fleet.com'],
    lastGenerated: '2025-10-03',
    status: 'active' as const,
  },
  {
    id: 's2',
    reportName: 'Monthly Cost Analysis',
    reportType: 'cost-analysis',
    schedule: 'Monthly - 1st of month 8:00 AM',
    recipients: ['finance@fleet.com'],
    lastGenerated: '2025-10-01',
    status: 'active' as const,
  },
  {
    id: 's3',
    reportName: 'Daily Compliance Check',
    reportType: 'compliance',
    schedule: 'Daily - 11:00 PM',
    recipients: ['compliance@fleet.com'],
    lastGenerated: '2025-10-09',
    status: 'active' as const,
  },
]

const recentReports = [
  {
    id: 'r1',
    name: 'Fleet Operations - Oct 2025',
    type: 'trip-summary',
    generatedAt: '2025-10-09 14:30',
    generatedBy: 'John Doe',
    size: '2.3 MB',
  },
  {
    id: 'r2',
    name: 'Cost Analysis - Q3 2025',
    type: 'cost-analysis',
    generatedAt: '2025-10-08 10:15',
    generatedBy: 'Jane Smith',
    size: '1.8 MB',
  },
  {
    id: 'r3',
    name: 'Driver Performance - September',
    type: 'driver-performance',
    generatedAt: '2025-10-05 09:00',
    generatedBy: 'Admin',
    size: '945 KB',
  },
]

export function Reports() {
  const [activeTab, setActiveTab] = useState('available')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-gray-600">Generate and schedule fleet reports</p>
        </div>
        <Button>Create Custom Report</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{availableReports.length}</div>
          <div className="text-sm text-gray-600">Available Templates</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{scheduledReports.length}</div>
          <div className="text-sm text-gray-600">Scheduled Reports</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{recentReports.length}</div>
          <div className="text-sm text-gray-600">Generated This Week</div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="available">Available Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableReports.map((report) => (
              <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{report.icon}</div>
                  <Badge variant="outline">{report.category}</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{report.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Generate
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Schedule
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {scheduledReports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{report.reportName}</h3>
                    <Badge variant={report.status === 'active' ? 'default' : 'outline'}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-medium">{report.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Recipients:</span>
                      <span className="font-medium">{report.recipients.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Last Generated:</span>
                      <span className="font-medium">
                        {new Date(report.lastGenerated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    Pause
                  </Button>
                  <Button size="sm" variant="outline">
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentReports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{report.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium capitalize">{report.type.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Generated:</span>
                      <p className="font-medium">{report.generatedAt}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">By:</span>
                      <p className="font-medium">{report.generatedBy}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Size:</span>
                      <p className="font-medium">{report.size}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
