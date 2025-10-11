import { useState } from 'react'
import {
  Card,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@fleet/ui-web'

interface AlertRoute {
  id: string
  alertType: string
  severity: string[]
  assignedTo: { type: 'user' | 'role'; id: string; name: string }[]
  channels: string[]
}

export function AlertRouting() {
  const [routes] = useState<AlertRoute[]>([
    {
      id: '1',
      alertType: 'Speed Violation',
      severity: ['high', 'critical'],
      assignedTo: [
        { type: 'role', id: 'manager', name: 'Fleet Managers' },
        { type: 'user', id: 'user-1', name: 'John Doe' },
      ],
      channels: ['email', 'sms', 'push'],
    },
    {
      id: '2',
      alertType: 'Geofence Exit',
      severity: ['critical'],
      assignedTo: [{ type: 'role', id: 'dispatcher', name: 'Dispatchers' }],
      channels: ['email', 'push'],
    },
    {
      id: '3',
      alertType: 'Maintenance Due',
      severity: ['medium', 'low'],
      assignedTo: [{ type: 'user', id: 'user-2', name: 'Jane Smith' }],
      channels: ['email'],
    },
  ])

  const [alertType, setAlertType] = useState('')
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([])
  const [assignType, setAssignType] = useState<'user' | 'role'>('role')
  const [selectedAssignee, setSelectedAssignee] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  const handleAddRoute = () => {
    if (!alertType || selectedSeverities.length === 0 || !selectedAssignee) {
      alert('Please fill all required fields')
      return
    }

    console.log('Adding route:', {
      alertType,
      severities: selectedSeverities,
      assignType,
      assignee: selectedAssignee,
      channels: selectedChannels,
    })

    // Reset form
    setAlertType('')
    setSelectedSeverities([])
    setSelectedAssignee('')
    setSelectedChannels([])
  }

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
    )
  }

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Route */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Alert Route</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Alert Type *</Label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger>
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="speed">Speed Violation</SelectItem>
                <SelectItem value="geofence">Geofence Violation</SelectItem>
                <SelectItem value="idle">Idle Time</SelectItem>
                <SelectItem value="fuel">Fuel Level</SelectItem>
                <SelectItem value="maintenance">Maintenance Due</SelectItem>
                <SelectItem value="harsh_braking">Harsh Braking</SelectItem>
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
            <Label>Assign To *</Label>
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
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Fleet Manager</SelectItem>
                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="user-1">John Doe</SelectItem>
                    <SelectItem value="user-2">Jane Smith</SelectItem>
                    <SelectItem value="user-3">Bob Wilson</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notification Channels</Label>
            <div className="flex gap-2 mt-2">
              {['email', 'sms', 'push'].map((channel) => (
                <Button
                  key={channel}
                  size="sm"
                  variant={selectedChannels.includes(channel) ? 'default' : 'outline'}
                  onClick={() => toggleChannel(channel)}
                >
                  {channel}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleAddRoute}>Add Route</Button>
      </Card>

      {/* Existing Routes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Alert Routes</h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.alertType}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {route.severity.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {route.assignedTo.map((a, i) => (
                      <Badge key={i} variant="secondary">
                        {a.type === 'role' ? '👥 ' : '👤 '}
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {route.channels.map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
