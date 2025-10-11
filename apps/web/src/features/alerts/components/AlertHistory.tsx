import { useMemo, useState } from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@fleet/ui-web'
import { useNavigate } from 'react-router-dom'

interface HistoricalAlert {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  vehicleId: string
  vehicleName: string
  message: string
  timestamp: string
  status: 'resolved' | 'dismissed' | 'auto-resolved'
  acknowledgedBy?: string
  acknowledgedAt?: string
  resolvedBy?: string
  resolvedAt?: string
  notes?: string
}

const mockHistory: HistoricalAlert[] = [
  {
    id: '1',
    type: 'Speed Violation',
    severity: 'high',
    vehicleId: '1',
    vehicleName: 'TN-01-AB-1234',
    message: 'Vehicle exceeded 80 km/h limit',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'resolved',
    acknowledgedBy: 'John Doe',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    resolvedBy: 'John Doe',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    notes: 'Driver warned, speed reduced immediately',
  },
  {
    id: '2',
    type: 'Geofence Exit',
    severity: 'critical',
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    message: 'Exited Downtown Area',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'resolved',
    acknowledgedBy: 'Jane Smith',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    resolvedBy: 'Jane Smith',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
    notes: 'Authorized route deviation for customer pickup',
  },
  {
    id: '3',
    type: 'Idle Time',
    severity: 'medium',
    vehicleId: '3',
    vehicleName: 'TN-01-EF-9012',
    message: 'Idle for 25 minutes',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: 'auto-resolved',
    notes: 'Auto-resolved: Vehicle resumed movement',
  },
  {
    id: '4',
    type: 'Fuel Level Low',
    severity: 'low',
    vehicleId: '1',
    vehicleName: 'TN-01-AB-1234',
    message: 'Fuel below 20%',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: 'resolved',
    acknowledgedBy: 'Bob Wilson',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 95).toISOString(),
    resolvedBy: 'Bob Wilson',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 94).toISOString(),
    notes: 'Vehicle refueled at nearest station',
  },
  {
    id: '5',
    type: 'Maintenance Due',
    severity: 'medium',
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    message: '15,000 km service due',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    status: 'dismissed',
    acknowledgedBy: 'Jane Smith',
    acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60 * 119).toISOString(),
    notes: 'Service scheduled for next week',
  },
]

export function AlertHistory() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filteredHistory = useMemo(() => {
    return mockHistory.filter((alert) => {
      const matchesSearch =
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
      return matchesSearch && matchesStatus && matchesSeverity
    })
  }, [searchTerm, statusFilter, severityFilter])

  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-blue-100 text-blue-800 border-blue-300',
  }

  const statusColors = {
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-800',
    'auto-resolved': 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-50">
        <p className="text-sm text-gray-700">
          View historical alerts from the past 30 days. Older records are archived automatically.
        </p>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
            <SelectItem value="auto-resolved">Auto-Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* History Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Occurred</TableHead>
              <TableHead>Resolved</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No historical alerts found
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((alert) => (
                <>
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge variant="outline" className={severityColors[alert.severity]}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/vehicles/${alert.vehicleId}`)}
                        className="text-blue-600 hover:underline"
                      >
                        {alert.vehicleName}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-sm truncate">{alert.message}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[alert.status]}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(alert.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {alert.resolvedAt
                        ? new Date(alert.resolvedAt).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedRow(expandedRow === alert.id ? null : alert.id)
                        }
                      >
                        {expandedRow === alert.id ? 'Hide' : 'Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRow === alert.id && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-gray-50">
                        <div className="p-4 space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            {alert.acknowledgedBy && (
                              <div>
                                <span className="text-sm font-semibold">Acknowledged By:</span>
                                <p className="text-sm">{alert.acknowledgedBy}</p>
                                <p className="text-xs text-gray-600">
                                  {alert.acknowledgedAt
                                    ? new Date(alert.acknowledgedAt).toLocaleString()
                                    : ''}
                                </p>
                              </div>
                            )}
                            {alert.resolvedBy && (
                              <div>
                                <span className="text-sm font-semibold">Resolved By:</span>
                                <p className="text-sm">{alert.resolvedBy}</p>
                                <p className="text-xs text-gray-600">
                                  {alert.resolvedAt
                                    ? new Date(alert.resolvedAt).toLocaleString()
                                    : ''}
                                </p>
                              </div>
                            )}
                          </div>
                          {alert.notes && (
                            <div>
                              <span className="text-sm font-semibold">Notes:</span>
                              <p className="text-sm mt-1">{alert.notes}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="text-sm text-gray-600">
        Showing {filteredHistory.length} of {mockHistory.length} historical alerts
      </div>
    </div>
  )
}
