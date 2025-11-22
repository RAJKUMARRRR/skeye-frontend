import { AlertHistory as AlertHistoryComponent } from '../../features/alerts/components/AlertHistory'

export function AlertHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alert History</h2>
        <p className="text-gray-600">View and analyze historical alert data</p>
      </div>
      <AlertHistoryComponent />
    </div>
  )
}
