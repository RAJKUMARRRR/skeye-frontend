import { AlertEscalation as AlertEscalationComponent } from '../../features/alerts/components/AlertEscalation'

export function AlertEscalation() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alert Escalation</h2>
        <p className="text-gray-600">Configure escalation policies for unacknowledged alerts</p>
      </div>
      <AlertEscalationComponent />
    </div>
  )
}
