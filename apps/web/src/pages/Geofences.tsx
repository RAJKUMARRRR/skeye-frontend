import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGeofences } from '../hooks/useGeofences'
import { Card, Button } from '@fleet/ui-web'
import { MapProvider } from '../components/map'
import { useGeofenceLayer } from '../components/map/GeofenceLayer'
import type { Geofence } from '../components/map/GeofenceLayer'

export function Geofences() {
  const navigate = useNavigate()
  const { data: geofences, isLoading } = useGeofences()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const mockGeofences: Geofence[] = (geofences || []).map(gf => ({
    id: gf.id,
    name: gf.name,
    type: gf.type as 'circle' | 'polygon',
    active: true,
    center: gf.center,
    radius: gf.radius,
    coordinates: gf.coordinates,
    color: gf.color || '#3b82f6',
  }))

  const { circles, polygons } = useGeofenceLayer({
    geofences: mockGeofences,
    onGeofenceClick: (geofence) => navigate(`/geofences/${geofence.id}`),
  })

  const geofenceCount = geofences?.length || 0
  const showWarning = geofenceCount >= 450

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading geofences...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Geofences</h2>
          <p className="text-gray-600">Create and manage geofences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}>
            {viewMode === 'list' ? '🗺️ Map View' : '📋 List View'}
          </Button>
          <Button variant="outline">Import</Button>
          <Button onClick={() => navigate('/geofences/new')}>
            Create Geofence
          </Button>
        </div>
      </div>

      {showWarning && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-900">Approaching Geofence Limit</p>
              <p className="text-sm text-yellow-800">
                You have {geofenceCount} of 500 geofences. Consider archiving unused geofences.
              </p>
            </div>
          </div>
        </Card>
      )}

      {viewMode === 'list' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {geofences && geofences.length > 0 ? (
            geofences.map((geofence) => (
              <Card
                key={geofence.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/geofences/${geofence.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{geofence.name}</h3>
                  <div
                    className="w-6 h-6 rounded-full border-2"
                    style={{ borderColor: geofence.color || '#3b82f6' }}
                  />
                </div>
                {geofence.description && (
                  <p className="text-sm text-gray-600 mb-3">{geofence.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 capitalize">{geofence.type}</span>
                  <span className="text-gray-500">
                    {geofence.assignedVehicleIds?.length || 0} vehicles
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full p-8 text-center">
              <p className="text-gray-600">No geofences created yet</p>
              <Button className="mt-4" onClick={() => navigate('/geofences/new')}>
                Create Your First Geofence
              </Button>
            </Card>
          )}
        </div>
      ) : (
        <Card className="h-[600px] overflow-hidden">
          <MapProvider
            center={{ lat: 28.6139, lng: 77.2090 }}
            zoom={10}
            circles={circles}
            polygons={polygons}
          />
        </Card>
      )}
    </div>
  )
}
