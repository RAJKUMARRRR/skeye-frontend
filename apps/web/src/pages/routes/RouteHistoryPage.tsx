import { RouteHistory } from '../../features/routes/components/RouteHistory'

export function RouteHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Route History</h2>
        <p className="text-gray-600">View and analyze completed routes</p>
      </div>
      <RouteHistory />
    </div>
  )
}
