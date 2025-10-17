import { AlertRouting as AlertRoutingComponent } from '../../features/alerts/components/AlertRouting'

export function AlertRouting() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alert Routing</h2>
        <p className="text-gray-600">Route alerts to specific teams or individuals</p>
      </div>
      <AlertRoutingComponent />
    </div>
  )
}
