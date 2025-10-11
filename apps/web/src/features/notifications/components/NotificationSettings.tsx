import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Switch,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Badge,
} from '@fleet/ui-web'
import { Bell, Mail, Smartphone, Save, CheckCircle } from 'lucide-react'

const notificationCategories = [
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Vehicle maintenance and service reminders',
    email: true,
    push: true,
    sms: false,
  },
  {
    id: 'driver',
    name: 'Driver Alerts',
    description: 'Driver hours, performance, and compliance',
    email: true,
    push: true,
    sms: true,
  },
  {
    id: 'route',
    name: 'Route Updates',
    description: 'Route completion, delays, and changes',
    email: false,
    push: true,
    sms: false,
  },
  {
    id: 'fuel',
    name: 'Fuel Management',
    description: 'Fuel consumption, costs, and anomalies',
    email: true,
    push: false,
    sms: false,
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Inspections, certifications, and regulations',
    email: true,
    push: true,
    sms: true,
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Fleet efficiency and performance metrics',
    email: true,
    push: false,
    sms: false,
  },
  {
    id: 'system',
    name: 'System',
    description: 'System updates and maintenance',
    email: true,
    push: false,
    sms: false,
  },
]

export function NotificationSettings() {
  const [categories, setCategories] = useState(notificationCategories)
  const [globalSettings, setGlobalSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: true,
    digestFrequency: 'daily',
    quietHours: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  })
  const [contacts, setContacts] = useState({
    email: 'admin@fleet.com',
    phone: '+1 (555) 123-4567',
  })
  const [saved, setSaved] = useState(false)

  const updateCategoryNotification = (categoryId: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, [channel]: value } : cat))
    )
  }

  const handleSave = () => {
    // In production, this would save to the backend
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const getTotalEnabled = (channel: 'email' | 'push' | 'sms') => {
    return categories.filter((cat) => cat[channel]).length
  }

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Notification Settings</CardTitle>
          <CardDescription>Configure master notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-global">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email-global"
                checked={globalSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setGlobalSettings((prev) => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-global">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in the app</p>
              </div>
              <Switch
                id="push-global"
                checked={globalSettings.pushNotifications}
                onCheckedChange={(checked) =>
                  setGlobalSettings((prev) => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-global">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
              </div>
              <Switch
                id="sms-global"
                checked={globalSettings.smsNotifications}
                onCheckedChange={(checked) =>
                  setGlobalSettings((prev) => ({ ...prev, smsNotifications: checked }))
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="space-y-2">
              <Label htmlFor="digest-frequency">Digest Frequency</Label>
              <Select
                value={globalSettings.digestFrequency}
                onValueChange={(value) => setGlobalSettings((prev) => ({ ...prev, digestFrequency: value }))}
              >
                <SelectTrigger id="digest-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How often to receive notification summaries
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-hours">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Disable notifications during specific hours</p>
              </div>
              <Switch
                id="quiet-hours"
                checked={globalSettings.quietHours}
                onCheckedChange={(checked) =>
                  setGlobalSettings((prev) => ({ ...prev, quietHours: checked }))
                }
              />
            </div>

            {globalSettings.quietHours && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={globalSettings.quietHoursStart}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({ ...prev, quietHoursStart: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={globalSettings.quietHoursEnd}
                    onChange={(e) =>
                      setGlobalSettings((prev) => ({ ...prev, quietHoursEnd: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Where to send notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="contact-email"
                type="email"
                placeholder="email@example.com"
                value={contacts.email}
                onChange={(e) => setContacts((prev) => ({ ...prev, email: e.target.value }))}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone Number</Label>
            <div className="relative">
              <Smartphone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="contact-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={contacts.phone}
                onChange={(e) => setContacts((prev) => ({ ...prev, phone: e.target.value }))}
                className="pl-8"
              />
            </div>
            <p className="text-sm text-muted-foreground">Used for SMS notifications and emergency alerts</p>
          </div>
        </CardContent>
      </Card>

      {/* Category Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notification Categories</CardTitle>
              <CardDescription>Customize notifications by category</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{getTotalEnabled('email')} enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>{getTotalEnabled('push')} enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>{getTotalEnabled('sms')} enabled</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="pb-6 border-b last:border-b-0 last:pb-0">
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <Switch
                      checked={category.email && globalSettings.emailNotifications}
                      disabled={!globalSettings.emailNotifications}
                      onCheckedChange={(checked) => updateCategoryNotification(category.id, 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Push</span>
                    </div>
                    <Switch
                      checked={category.push && globalSettings.pushNotifications}
                      disabled={!globalSettings.pushNotifications}
                      onCheckedChange={(checked) => updateCategoryNotification(category.id, 'push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">SMS</span>
                    </div>
                    <Switch
                      checked={category.sms && globalSettings.smsNotifications}
                      disabled={!globalSettings.smsNotifications}
                      onCheckedChange={(checked) => updateCategoryNotification(category.id, 'sms', checked)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Settings saved successfully
          </div>
        )}
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
