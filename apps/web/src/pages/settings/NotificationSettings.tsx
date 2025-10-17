import { NotificationSettings as NotificationSettingsComponent } from '../../features/notifications/components/NotificationSettings'

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notification Settings</h2>
        <p className="text-gray-600">Configure notification preferences and delivery methods</p>
      </div>
      <NotificationSettingsComponent />
    </div>
  )
}
