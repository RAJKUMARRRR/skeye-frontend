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
  Switch,
} from '@fleet/ui-web'

type RuleType = 'speed' | 'geofence' | 'idle' | 'fuel' | 'maintenance'

interface AlertRule {
  id: string
  name: string
  type: RuleType
  enabled: boolean
  severity: 'critical' | 'high' | 'medium' | 'low'
  conditions: Record<string, any>
  actions: string[]
}

interface AlertRuleBuilderProps {
  rule?: AlertRule
  onSave: (rule: Omit<AlertRule, 'id'>) => void
  onCancel: () => void
}

export function AlertRuleBuilder({ rule, onSave, onCancel }: AlertRuleBuilderProps) {
  const [name, setName] = useState(rule?.name || '')
  const [type, setType] = useState<RuleType>(rule?.type || 'speed')
  const [enabled, setEnabled] = useState(rule?.enabled ?? true)
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>(
    rule?.severity || 'medium'
  )

  // Condition states
  const [speedThreshold, setSpeedThreshold] = useState(rule?.conditions?.speedThreshold || 80)
  const [geofenceId, setGeofenceId] = useState(rule?.conditions?.geofenceId || '')
  const [geofenceAction, setGeofenceAction] = useState(rule?.conditions?.action || 'exit')
  const [idleMinutes, setIdleMinutes] = useState(rule?.conditions?.minutes || 15)
  const [fuelPercentage, setFuelPercentage] = useState(rule?.conditions?.percentage || 20)
  const [maintenanceDays, setMaintenanceDays] = useState(rule?.conditions?.days || 7)

  const handleSave = () => {
    if (!name) {
      alert('Please enter a rule name')
      return
    }

    let conditions: Record<string, any> = {}

    switch (type) {
      case 'speed':
        conditions = { speedThreshold }
        break
      case 'geofence':
        conditions = { geofenceId, action: geofenceAction }
        break
      case 'idle':
        conditions = { minutes: idleMinutes }
        break
      case 'fuel':
        conditions = { percentage: fuelPercentage }
        break
      case 'maintenance':
        conditions = { days: maintenanceDays }
        break
    }

    onSave({
      name,
      type,
      enabled,
      severity,
      conditions,
      actions: ['notify', 'log'],
    })
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {rule ? 'Edit Alert Rule' : 'Create Alert Rule'}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Rule Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., High Speed Alert"
          />
        </div>

        <div>
          <Label>Rule Type *</Label>
          <Select value={type} onValueChange={(v) => setType(v as RuleType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="speed">Speed Threshold</SelectItem>
              <SelectItem value="geofence">Geofence Violation</SelectItem>
              <SelectItem value="idle">Idle Time</SelectItem>
              <SelectItem value="fuel">Fuel Level</SelectItem>
              <SelectItem value="maintenance">Maintenance Due</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Severity *</Label>
          <Select
            value={severity}
            onValueChange={(v) => setSeverity(v as 'critical' | 'high' | 'medium' | 'low')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition Fields */}
        {type === 'speed' && (
          <div>
            <Label>Speed Threshold (km/h) *</Label>
            <Input
              type="number"
              value={speedThreshold}
              onChange={(e) => setSpeedThreshold(parseInt(e.target.value))}
              min="0"
              max="200"
            />
            <p className="text-xs text-gray-600 mt-1">
              Alert when vehicle exceeds this speed
            </p>
          </div>
        )}

        {type === 'geofence' && (
          <>
            <div>
              <Label>Geofence *</Label>
              <Select value={geofenceId} onValueChange={setGeofenceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select geofence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geo-1">Downtown Area</SelectItem>
                  <SelectItem value="geo-2">Warehouse Zone</SelectItem>
                  <SelectItem value="geo-3">Service Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Action *</Label>
              <Select value={geofenceAction} onValueChange={setGeofenceAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enter">Enter</SelectItem>
                  <SelectItem value="exit">Exit</SelectItem>
                  <SelectItem value="both">Enter or Exit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {type === 'idle' && (
          <div>
            <Label>Idle Duration (minutes) *</Label>
            <Input
              type="number"
              value={idleMinutes}
              onChange={(e) => setIdleMinutes(parseInt(e.target.value))}
              min="1"
              max="120"
            />
            <p className="text-xs text-gray-600 mt-1">
              Alert when vehicle is idle for this long
            </p>
          </div>
        )}

        {type === 'fuel' && (
          <div>
            <Label>Fuel Level Threshold (%) *</Label>
            <Input
              type="number"
              value={fuelPercentage}
              onChange={(e) => setFuelPercentage(parseInt(e.target.value))}
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-600 mt-1">
              Alert when fuel level drops below this percentage
            </p>
          </div>
        )}

        {type === 'maintenance' && (
          <div>
            <Label>Days Before Due *</Label>
            <Input
              type="number"
              value={maintenanceDays}
              onChange={(e) => setMaintenanceDays(parseInt(e.target.value))}
              min="1"
              max="30"
            />
            <p className="text-xs text-gray-600 mt-1">
              Alert this many days before maintenance is due
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <Label>Enable Rule</Label>
          </div>
          <p className="text-xs text-gray-600">
            {enabled ? 'Rule is active' : 'Rule is disabled'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          {rule ? 'Update Rule' : 'Create Rule'}
        </Button>
      </div>
    </Card>
  )
}
