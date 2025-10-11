import { useState, useMemo, useCallback } from 'react'
import { MapProvider, MapMarker, MapViewport } from '../components/map'
import { useVehicles } from '../hooks/useVehicles'
import { useVehicleLocationUpdates } from '../hooks/useWebSocket'
import { useMapClustering } from '../hooks/useMapClustering'
import { useFilterStore } from '../stores/filterStore'
import { Button, Card } from '@fleet/ui-web'

export function LiveTracking() {
  const { data: vehicles, isLoading } = useVehicles()
  const { vehicleStatus, vehicleSearch } = useFilterStore()

  // Enable real-time location updates
  // TODO: Uncomment when WebSocket server is available
  // useVehicleLocationUpdates()

  const [viewport, setViewport] = useState<MapViewport>({
    center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
    zoom: 12,
  })

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [showClustering, setShowClustering] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filter vehicles based on filter store
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return []

    return vehicles.filter((vehicle) => {
      // Status filter
      if (vehicleStatus.length > 0 && !vehicleStatus.includes(vehicle.status)) {
        return false
      }

      // Search filter
      if (vehicleSearch && !vehicle.licensePlate.toLowerCase().includes(vehicleSearch.toLowerCase())) {
        return false
      }

      return true
    })
  }, [vehicles, vehicleStatus, vehicleSearch])

  // Convert vehicles to map markers
  const markers: MapMarker[] = useMemo(() => {
    return filteredVehicles.map((vehicle) => ({
      id: vehicle.id,
      position: {
        lat: vehicle.location?.latitude || 0,
        lng: vehicle.location?.longitude || 0,
      },
      label: `${vehicle.licensePlate} - ${vehicle.status}`,
      onClick: () => setSelectedVehicleId(vehicle.id),
      data: vehicle,
    }))
  }, [filteredVehicles])

  // Map clustering
  const { clusters } = useMapClustering({
    markers,
    bounds: undefined, // TODO: Calculate from viewport
    zoom: viewport.zoom,
    options: {
      radius: 60,
      maxZoom: 16,
      minPoints: 3,
    },
  })

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedVehicleId(marker.id)
  }, [])

  const selectedVehicle = useMemo(() => {
    return filteredVehicles.find((v) => v.id === selectedVehicleId)
  }, [filteredVehicles, selectedVehicleId])

  // Center map on selected vehicle
  const centerOnVehicle = useCallback((vehicleId: string) => {
    const vehicle = filteredVehicles.find((v) => v.id === vehicleId)
    if (vehicle?.location) {
      setViewport({
        center: {
          lat: vehicle.location.latitude,
          lng: vehicle.location.longitude,
        },
        zoom: 16,
      })
      setSelectedVehicleId(vehicleId)
    }
  }, [filteredVehicles])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading vehicles...</div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Vehicle List Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-0' : 'w-80'
        } overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Vehicles ({filteredVehicles.length})
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowClustering(!showClustering)}
            >
              {showClustering ? 'Hide' : 'Show'} Clusters
            </Button>
          </div>

          {/* TODO: Add filter controls here */}
        </div>

        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedVehicleId === vehicle.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => centerOnVehicle(vehicle.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{vehicle.licensePlate}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    vehicle.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'idle'
                      ? 'bg-yellow-100 text-yellow-800'
                      : vehicle.status === 'maintenance'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Type: {vehicle.type}</div>
                {vehicle.location && (
                  <div className="text-xs text-gray-500 mt-1">
                    {vehicle.location.latitude.toFixed(6)}, {vehicle.location.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse/Expand Sidebar Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute left-0 top-4 z-[1000] bg-white border border-gray-200 rounded-r-md px-2 py-4 shadow-md hover:bg-gray-50 transition-all"
        style={{ left: sidebarCollapsed ? 0 : '20rem' }}
      >
        <span className="text-gray-600">
          {sidebarCollapsed ? '→' : '←'}
        </span>
      </button>

      {/* Map */}
      <div className="flex-1 relative">
        <MapProvider
          center={viewport.center}
          zoom={viewport.zoom}
          markers={showClustering ? [] : markers} // TODO: Use clustered markers
          onViewportChange={setViewport}
          onMarkerClick={handleMarkerClick}
          className="h-full w-full"
        />

        {/* Selected Vehicle Info Panel */}
        {selectedVehicle && (
          <Card className="absolute top-4 right-4 w-80 p-4 shadow-lg z-[1000]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedVehicle.licensePlate}</h3>
              <button
                onClick={() => setSelectedVehicleId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    selectedVehicle.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : selectedVehicle.status === 'idle'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedVehicle.status === 'maintenance'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>

              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <span className="ml-2 text-sm">{selectedVehicle.type}</span>
              </div>

              {selectedVehicle.location && (
                <>
                  <div>
                    <span className="text-sm text-gray-600">Speed:</span>
                    <span className="ml-2 text-sm">{selectedVehicle.location.speed || 0} km/h</span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Heading:</span>
                    <span className="ml-2 text-sm">{selectedVehicle.location.heading || 0}°</span>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600">Last Update:</span>
                    <span className="ml-2 text-sm">
                      {new Date(selectedVehicle.location.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </>
              )}

              {/* TODO: Add telemetry display component */}
              {/* TODO: Add trip playback button */}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
