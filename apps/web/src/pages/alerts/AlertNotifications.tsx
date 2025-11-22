import { NotificationPreferences } from '../../features/settings/components/NotificationPreferences'

export function AlertNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notification Settings</h2>
        <p className="text-gray-600">Configure how and when you receive alert notifications</p>
      </div>
      <NotificationPreferences />
    </div>
  )
}
