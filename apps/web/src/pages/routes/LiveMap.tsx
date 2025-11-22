import { RouteMap } from '../../features/routes/components/RouteMap'

export function LiveMap() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Live Route Map</h2>
        <p className="text-gray-600">Track active routes in real-time</p>
      </div>
      <RouteMap />
    </div>
  )
}
