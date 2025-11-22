import { AlertRuleBuilder } from '../../features/alerts/components/AlertRuleBuilder'

export function AlertRules() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alert Rules</h2>
        <p className="text-gray-600">Configure and manage alert rules for your fleet</p>
      </div>
      <AlertRuleBuilder />
    </div>
  )
}
