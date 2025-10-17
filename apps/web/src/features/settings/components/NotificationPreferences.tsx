import { useState } from 'react'
import {
  Card,
  Button,
  Label,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@fleet/ui-web'
import { Bell, Mail, MessageSquare, Info } from 'lucide-react'

interface NotificationChannel {
  email: boolean
  sms: boolean
  push: boolean
}

interface AlertTypePreference {
  alertType: string
  enabled: boolean
  channels: NotificationChannel
  severity: string[]
}

const ALERT_TYPES = [
  'Speed Violation',
  'Geofence Violation',
  'Idle Time',
  'Fuel Level',
  'Maintenance Due',
  'Harsh Braking',
  'Vehicle Fault',
  'Driver Behavior',
]

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<AlertTypePreference[]>([
    {
      alertType: 'Speed Violation',
      enabled: true,
      channels: { email: true, sms: true, push: true },
      severity: ['critical', 'high'],
    },
    {
      alertType: 'Geofence Violation',
      enabled: true,
      channels: { email: true, sms: false, push: true },
      severity: ['critical', 'high', 'medium'],
    },
    {
      alertType: 'Idle Time',
      enabled: true,
      channels: { email: true, sms: false, push: false },
      severity: ['medium'],
    },
    {
      alertType: 'Fuel Level',
      enabled: true,
      channels: { email: true, sms: false, push: true },
      severity: ['low'],
    },
    {
      alertType: 'Maintenance Due',
      enabled: true,
      channels: { email: true, sms: false, push: false },
      severity: ['medium', 'low'],
    },
    {
      alertType: 'Harsh Braking',
      enabled: false,
      channels: { email: false, sms: false, push: false },
      severity: [],
    },
    {
      alertType: 'Vehicle Fault',
      enabled: true,
      channels: { email: true, sms: true, push: true },
      severity: ['critical', 'high'],
    },
    {
      alertType: 'Driver Behavior',
      enabled: true,
      channels: { email: true, sms: false, push: false },
      severity: ['medium', 'low'],
    },
  ])

  const [globalEmail, setGlobalEmail] = useState(true)
  const [globalSms, setGlobalSms] = useState(false)
  const [globalPush, setGlobalPush] = useState(true)

  const toggleAlertEnabled = (alertType: string) => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.alertType === alertType ? { ...p, enabled: !p.enabled } : p
      )
    )
  }

  const toggleChannel = (alertType: string, channel: keyof NotificationChannel) => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.alertType === alertType
          ? {
              ...p,
              channels: {
                ...p.channels,
                [channel]: !p.channels[channel],
              },
            }
          : p
      )
    )
  }

  const handleSave = () => {
    console.log('Saving preferences:', preferences)
    alert('Notification preferences saved successfully')
  }

  const enableAllChannels = () => {
    setPreferences((prev) =>
      prev.map((p) => ({
        ...p,
        channels: { email: true, sms: true, push: true },
      }))
    )
  }

  const disableAllChannels = () => {
    setPreferences((prev) =>
      prev.map((p) => ({
        ...p,
        channels: { email: false, sms: false, push: false },
      }))
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Notification Preferences</h4>
            <p className="text-sm text-gray-600 mt-1">
              Configure how you receive notifications for each alert type. You can enable/disable
              specific channels (Email, SMS, Push) for different alert types and severities.
            </p>
          </div>
        </div>
      </Card>

      {/* Global Settings */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Global Notification Channels</h3>
        <p className="text-sm text-gray-600">
          Master switches to enable/disable notification channels globally
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-600">Receive alerts via email</p>
              </div>
            </div>
            <Switch checked={globalEmail} onCheckedChange={setGlobalEmail} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <p className="text-xs text-gray-600">Receive alerts via SMS</p>
              </div>
            </div>
            <Switch checked={globalSms} onCheckedChange={setGlobalSms} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-gray-600">Receive push notifications</p>
              </div>
            </div>
            <Switch checked={globalPush} onCheckedChange={setGlobalPush} />
          </div>
        </div>
      </Card>

      {/* Per-Alert Type Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Alert Type Preferences</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={enableAllChannels}>
              Enable All Channels
            </Button>
            <Button size="sm" variant="outline" onClick={disableAllChannels}>
              Disable All Channels
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert Type</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SMS</TableHead>
              <TableHead>Push</TableHead>
              <TableHead>Severities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preferences.map((pref) => (
              <TableRow key={pref.alertType}>
                <TableCell className="font-medium">{pref.alertType}</TableCell>
                <TableCell>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={() => toggleAlertEnabled(pref.alertType)}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={pref.channels.email && pref.enabled && globalEmail}
                    onCheckedChange={() => toggleChannel(pref.alertType, 'email')}
                    disabled={!pref.enabled || !globalEmail}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={pref.channels.sms && pref.enabled && globalSms}
                    onCheckedChange={() => toggleChannel(pref.alertType, 'sms')}
                    disabled={!pref.enabled || !globalSms}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={pref.channels.push && pref.enabled && globalPush}
                    onCheckedChange={() => toggleChannel(pref.alertType, 'push')}
                    disabled={!pref.enabled || !globalPush}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pref.severity.length > 0 ? (
                      pref.severity.map((s) => (
                        <Badge key={s} variant="outline">
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  )
}
