import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fleet/ui-web'

interface Alert {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  vehicleId: string
  vehicleName: string
  message: string
  timestamp: string
  status: 'active' | 'acknowledged' | 'resolved'
  acknowledgedBy?: string
  acknowledgedAt?: string
}

interface AlertTableProps {
  alerts: Alert[]
  isLoading?: boolean
}

const getSeverityVariant = (severity: Alert['severity']) => {
  switch (severity) {
    case 'critical':
      return 'error' as const
    case 'high':
      return 'destructive' as const
    case 'medium':
      return 'warning' as const
    case 'low':
      return 'info' as const
    default:
      return 'secondary' as const
  }
}

const getStatusVariant = (status: Alert['status']) => {
  switch (status) {
    case 'active':
      return 'error' as const
    case 'acknowledged':
      return 'warning' as const
    case 'resolved':
      return 'success' as const
    default:
      return 'secondary' as const
  }
}

export function AlertTable({ alerts, isLoading }: AlertTableProps) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
      const matchesType = typeFilter === 'all' || alert.type === typeFilter
      return matchesSearch && matchesSeverity && matchesStatus && matchesType
    })
  }, [alerts, searchTerm, severityFilter, statusFilter, typeFilter])

  const alertTypes = useMemo(() => {
    const types = new Set(alerts.map((a) => a.type))
    return Array.from(types)
  }, [alerts])

  if (isLoading) {
    return <div className="text-center py-8">Loading alerts...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {alertTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No alerts found
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge variant={getSeverityVariant(alert.severity)} className="capitalize">
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.type}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/vehicles/${alert.vehicleId}`)}
                      className="text-accent hover:text-accent-600 font-medium hover:underline"
                    >
                      {alert.vehicleName}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-md text-gray-700">{alert.message}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(alert.status)} className="capitalize">
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(alert.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {alert.status === 'active' && (
                      <Button size="sm" variant="outline">
                        Acknowledge
                      </Button>
                    )}
                    {alert.status === 'acknowledged' && (
                      <Button size="sm" variant="outline">
                        Resolve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredAlerts.length} of {alerts.length} alerts
      </div>
    </div>
  )
}
