import { QuietHours } from '../../features/alerts/components/QuietHours'

export function AlertQuietHours() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Quiet Hours</h2>
        <p className="text-gray-600">Set quiet hours to suppress non-critical alerts</p>
      </div>
      <QuietHours />
    </div>
  )
}
