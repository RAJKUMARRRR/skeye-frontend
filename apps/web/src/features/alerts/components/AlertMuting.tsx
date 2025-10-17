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
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@fleet/ui-web'
import { AlertTriangle } from 'lucide-react'

interface MutedAlert {
  id: string
  alertType: string
  vehicleId?: string
  vehicleName?: string
  mutedUntil: string
  mutedBy: string
  reason: string
}

export function AlertMuting() {
  const [mutedAlerts] = useState<MutedAlert[]>([
    {
      id: '1',
      alertType: 'Speed Violation',
      vehicleId: '1',
      vehicleName: 'TN-01-AB-1234',
      mutedUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      mutedBy: 'John Doe',
      reason: 'Vehicle undergoing speed calibration testing',
    },
    {
      id: '2',
      alertType: 'Idle Time',
      vehicleId: '3',
      vehicleName: 'TN-01-EF-9012',
      mutedUntil: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      mutedBy: 'Jane Smith',
      reason: 'Vehicle parked at maintenance facility',
    },
  ])

  const [alertType, setAlertType] = useState('')
  const [vehicleId, setVehicleId] = useState('all')
  const [duration, setDuration] = useState('1')
  const [reason, setReason] = useState('')

  const handleMute = () => {
    if (!alertType || !duration || !reason.trim()) {
      alert('Please fill all required fields')
      return
    }

    console.log('Muting alert:', {
      alertType,
      vehicleId: vehicleId === 'all' ? null : vehicleId,
      duration,
      reason,
    })

    // Reset form
    setAlertType('')
    setVehicleId('all')
    setDuration('1')
    setReason('')
  }

  const handleUnmute = (id: string) => {
    console.log('Unmuting alert:', id)
  }

  const getRemainingTime = (mutedUntil: string) => {
    const now = new Date()
    const until = new Date(mutedUntil)
    const diffMs = until.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24)
      return `${days} day${days > 1 ? 's' : ''}`
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    } else {
      return `${diffMinutes}m`
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">Important: Alert Muting</h4>
            <p className="text-sm text-amber-800 mt-1">
              Muting alerts temporarily disables notifications. Use this feature carefully as it may prevent you from receiving important alerts. Muted alerts will automatically unmute after the specified duration.
            </p>
          </div>
        </div>
      </Card>

      {/* Mute Alert Form */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Mute Alert</h3>

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
            <Label>Vehicle (Optional)</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger>
                <SelectValue placeholder="All vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="1">TN-01-AB-1234</SelectItem>
                <SelectItem value="2">TN-01-CD-5678</SelectItem>
                <SelectItem value="3">TN-01-EF-9012</SelectItem>
                <SelectItem value="4">TN-01-GH-3456</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600 mt-1">
              Leave empty to mute for all vehicles
            </p>
          </div>

          <div>
            <Label>Duration *</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">1 day</SelectItem>
                <SelectItem value="48">2 days</SelectItem>
                <SelectItem value="72">3 days</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reason *</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Vehicle in maintenance"
            />
          </div>
        </div>

        <Button onClick={handleMute}>Mute Alert</Button>
      </Card>

      {/* Currently Muted Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Currently Muted Alerts</h3>

        {mutedAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No muted alerts
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert Type</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Remaining Time</TableHead>
                <TableHead>Muted Until</TableHead>
                <TableHead>Muted By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mutedAlerts.map((muted) => (
                <TableRow key={muted.id}>
                  <TableCell className="font-medium">{muted.alertType}</TableCell>
                  <TableCell>
                    {muted.vehicleName || (
                      <Badge variant="outline">All Vehicles</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getRemainingTime(muted.mutedUntil)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(muted.mutedUntil).toLocaleString()}
                  </TableCell>
                  <TableCell>{muted.mutedBy}</TableCell>
                  <TableCell className="max-w-xs truncate">{muted.reason}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnmute(muted.id)}
                    >
                      Unmute
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
