import { RouteOptimizer } from '../../features/routes/components/RouteOptimizer'

export function RoutePlanner() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Route Planner</h2>
        <p className="text-gray-600">Optimize delivery routes for maximum efficiency</p>
      </div>
      <RouteOptimizer />
    </div>
  )
}
