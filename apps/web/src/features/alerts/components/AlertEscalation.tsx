import { useState } from 'react'
import {
  Card,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@fleet/ui-web'

interface EscalationRule {
  id: string
  alertType: string
  severity: string[]
  escalationTime: number // minutes
  escalateTo: { type: 'user' | 'role'; id: string; name: string }[]
  enabled: boolean
}

export function AlertEscalation() {
  const [rules] = useState<EscalationRule[]>([
    {
      id: '1',
      alertType: 'Speed Violation',
      severity: ['critical', 'high'],
      escalationTime: 15,
      escalateTo: [{ type: 'role', id: 'admin', name: 'Administrators' }],
      enabled: true,
    },
    {
      id: '2',
      alertType: 'Geofence Exit',
      severity: ['critical'],
      escalationTime: 10,
      escalateTo: [
        { type: 'role', id: 'manager', name: 'Fleet Managers' },
        { type: 'user', id: 'user-1', name: 'John Doe (Admin)' },
      ],
      enabled: true,
    },
    {
      id: '3',
      alertType: 'All Alerts',
      severity: ['critical'],
      escalationTime: 20,
      escalateTo: [{ type: 'role', id: 'admin', name: 'Administrators' }],
      enabled: false,
    },
  ])

  const [alertType, setAlertType] = useState('')
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([])
  const [escalationTime, setEscalationTime] = useState(15)
  const [assignType, setAssignType] = useState<'user' | 'role'>('role')
  const [selectedAssignee, setSelectedAssignee] = useState('')

  const handleAddRule = () => {
    if (!alertType || selectedSeverities.length === 0 || !selectedAssignee) {
      alert('Please fill all required fields')
      return
    }

    console.log('Adding escalation rule:', {
      alertType,
      severities: selectedSeverities,
      escalationTime,
      assignType,
      assignee: selectedAssignee,
    })

    // Reset form
    setAlertType('')
    setSelectedSeverities([])
    setEscalationTime(15)
    setSelectedAssignee('')
  }

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="font-semibold text-blue-900">About Alert Escalation</h4>
            <p className="text-sm text-blue-800 mt-1">
              When an alert is not acknowledged within the specified time, it will be
              automatically escalated to the designated users or roles. This ensures critical
              alerts are never missed.
            </p>
          </div>
        </div>
      </Card>

      {/* Add Escalation Rule */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Escalation Rule</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Alert Type *</Label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="speed">Speed Violation</SelectItem>
                <SelectItem value="geofence">Geofence Violation</SelectItem>
                <SelectItem value="idle">Idle Time</SelectItem>
                <SelectItem value="fuel">Fuel Level</SelectItem>
                <SelectItem value="maintenance">Maintenance Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Severity Levels *</Label>
            <div className="flex gap-2 mt-2">
              {['critical', 'high', 'medium', 'low'].map((severity) => (
                <Button
                  key={severity}
                  size="sm"
                  variant={selectedSeverities.includes(severity) ? 'default' : 'outline'}
                  onClick={() => toggleSeverity(severity)}
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Escalation Time (minutes) *</Label>
            <Input
              type="number"
              value={escalationTime}
              onChange={(e) => setEscalationTime(parseInt(e.target.value))}
              min="1"
              max="120"
            />
            <p className="text-xs text-gray-600 mt-1">
              Escalate after this many minutes without acknowledgment
            </p>
          </div>

          <div>
            <Label>Escalate To *</Label>
            <div className="flex gap-2 mb-2">
              <Button
                size="sm"
                variant={assignType === 'role' ? 'default' : 'outline'}
                onClick={() => setAssignType('role')}
              >
                Role
              </Button>
              <Button
                size="sm"
                variant={assignType === 'user' ? 'default' : 'outline'}
                onClick={() => setAssignType('user')}
              >
                User
              </Button>
            </div>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${assignType}`} />
              </SelectTrigger>
              <SelectContent>
                {assignType === 'role' ? (
                  <>
                    <SelectItem value="admin">Administrators</SelectItem>
                    <SelectItem value="manager">Fleet Managers</SelectItem>
                    <SelectItem value="dispatcher">Dispatchers</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="user-1">John Doe (Admin)</SelectItem>
                    <SelectItem value="user-2">Jane Smith (Manager)</SelectItem>
                    <SelectItem value="user-3">Bob Wilson (Manager)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleAddRule}>Add Escalation Rule</Button>
      </Card>

      {/* Existing Escalation Rules */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Escalation Rules</h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Escalation Time</TableHead>
              <TableHead>Escalate To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.alertType}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {rule.severity.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{rule.escalationTime} min</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {rule.escalateTo.map((a, i) => (
                      <Badge key={i} variant="secondary">
                        {a.type === 'role' ? '👥 ' : '👤 '}
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.enabled ? 'default' : 'outline'}>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
