import { AlertMuting as AlertMutingComponent } from '../../features/alerts/components/AlertMuting'

export function AlertMuting() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alert Muting</h2>
        <p className="text-gray-600">Temporarily mute specific alerts or alert types</p>
      </div>
      <AlertMutingComponent />
    </div>
  )
}
