import { useState } from 'react'
import { Card, Button, Input } from '@fleet/ui-web'
import { MapProvider, LatLng, MapMarker } from '../../../components/map'

interface RouteStop {
  id: string
  address: string
  location: LatLng
  sequence: number
  notes?: string
}

interface RoutePlannerProps {
  onSave: (route: {
    name: string
    stops: RouteStop[]
    optimized: boolean
  }) => void
  onCancel: () => void
}

export function RoutePlanner({ onSave, onCancel }: RoutePlannerProps) {
  const [routeName, setRouteName] = useState('')
  const [stops, setStops] = useState<RouteStop[]>([])
  const [newAddress, setNewAddress] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)

  const addStop = () => {
    if (!newAddress) return

    const newStop: RouteStop = {
      id: `stop-${Date.now()}`,
      address: newAddress,
      location: {
        lat: 28.6139 + (Math.random() - 0.5) * 0.1,
        lng: 77.2090 + (Math.random() - 0.5) * 0.1,
      },
      sequence: stops.length,
    }

    setStops([...stops, newStop])
    setNewAddress('')
  }

  const removeStop = (stopId: string) => {
    setStops(stops.filter(s => s.id !== stopId).map((s, i) => ({ ...s, sequence: i })))
  }

  const moveStop = (stopId: string, direction: 'up' | 'down') => {
    const index = stops.findIndex(s => s.id === stopId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === stops.length - 1) return

    const newStops = [...stops]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newStops[index], newStops[targetIndex]] = [newStops[targetIndex], newStops[index]]

    setStops(newStops.map((s, i) => ({ ...s, sequence: i })))
  }

  const optimizeRoute = async () => {
    setIsOptimizing(true)
    // TODO: Call actual optimization API
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock optimization - just reverse the order
    const optimized = [...stops].reverse().map((s, i) => ({ ...s, sequence: i }))
    setStops(optimized)
    setIsOptimizing(false)
  }

  const handleSave = () => {
    if (!routeName) {
      alert('Please enter a route name')
      return
    }
    if (stops.length < 2) {
      alert('Please add at least 2 stops')
      return
    }

    onSave({
      name: routeName,
      stops,
      optimized: false,
    })
  }

  const markers: MapMarker[] = stops.map((stop, index) => ({
    id: stop.id,
    position: stop.location,
    label: `${index + 1}. ${stop.address}`,
  }))

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Stop List */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Route Details</h3>

        <div>
          <label className="block text-sm font-medium mb-1">Route Name *</label>
          <Input
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="e.g., Morning Deliveries"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Add Stop</label>
          <div className="flex gap-2">
            <Input
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter address"
              onKeyPress={(e) => e.key === 'Enter' && addStop()}
            />
            <Button onClick={addStop}>Add</Button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {stops.map((stop, index) => (
            <div key={stop.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-medium">Stop {index + 1}</div>
                  <div className="text-sm text-gray-600">{stop.address}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveStop(stop.id, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveStop(stop.id, 'down')}
                    disabled={index === stops.length - 1}
                    className="px-2 py-1 text-xs hover:bg-gray-200 rounded disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeStop(stop.id)}
                    className="px-2 py-1 text-xs hover:bg-red-100 text-red-600 rounded"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stops.length >= 2 && (
          <Button
            variant="outline"
            onClick={optimizeRoute}
            disabled={isOptimizing}
            className="w-full"
          >
            {isOptimizing ? 'Optimizing...' : '⚡ Optimize Route'}
          </Button>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={stops.length < 2} className="flex-1">
            Save Route
          </Button>
        </div>
      </Card>

      {/* Map */}
      <Card className="md:col-span-2 h-[600px] overflow-hidden">
        <MapProvider
          center={stops.length > 0 ? stops[0].location : { lat: 28.6139, lng: 77.2090 }}
          zoom={12}
          markers={markers}
          polylines={
            stops.length >= 2
              ? [
                  {
                    id: 'route',
                    positions: stops.map(s => s.location),
                    color: '#3b82f6',
                    weight: 3,
                  },
                ]
              : []
          }
        />
      </Card>
    </div>
  )
}
