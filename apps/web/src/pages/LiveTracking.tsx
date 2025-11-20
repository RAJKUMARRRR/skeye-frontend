import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { MapProvider, MapMarker, MapViewport, MapPolyline } from '../components/map'
import { createVehicleIcon } from '../components/map/VehicleMarker'
import { VehicleTooltip } from '../components/map/VehicleTooltip'
import { useVehicles } from '../hooks/useVehicles'
import { useRealtimeTelemetry } from '../hooks/useTelemetry'
import { useMapClustering } from '../hooks/useMapClustering'
import { useFilterStore } from '../stores/filterStore'
import { Button, Card } from '@fleet/ui-web'
import { type Device, wsClient } from '@fleet/api'

// Extended type to combine device + telemetry
interface VehicleWithLocation extends Device {
  location?: {
    latitude: number
    longitude: number
    speed?: number
    heading?: number
    timestamp: string
  }
}

export function LiveTracking() {
  const { data: devices, isLoading } = useVehicles()
  const { telemetry } = useRealtimeTelemetry()
  const { vehicleStatus, vehicleSearch } = useFilterStore()

  // Combine devices with telemetry data
  const vehicles: VehicleWithLocation[] = useMemo(() => {
    if (!devices) return []

    console.log('[LiveTracking] Devices:', devices.length)
    console.log('[LiveTracking] Telemetry map keys:', Object.keys(telemetry))
    console.log('[LiveTracking] Sample device IDs:', devices.slice(0, 3).map(d => d.device_id))

    const vehiclesWithLocation = devices.map(device => {
      // Try matching by device_id (from backend telemetry)
      const telemetryData = telemetry[device.device_id]

      if (telemetryData) {
        console.log('[LiveTracking] ✓ Matched telemetry for device:', device.device_id, {
          lat: telemetryData.location_lat,
          lng: telemetryData.location_lng,
          speed: telemetryData.speed
        })
      }

      return {
        ...device,
        location: telemetryData ? {
          latitude: telemetryData.location_lat,
          longitude: telemetryData.location_lng,
          speed: telemetryData.speed,
          heading: telemetryData.heading,
          timestamp: telemetryData.time,
        } : undefined,
      }
    })

    const withLocation = vehiclesWithLocation.filter(v => v.location).length
    console.log('[LiveTracking] Vehicles with location data:', withLocation, '/', devices.length)

    return vehiclesWithLocation
  }, [devices, telemetry])

  const [viewport, setViewport] = useState<MapViewport>({
    center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
    zoom: 12,
  })

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [showClustering, setShowClustering] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showTrails, setShowTrails] = useState(false)
  const [trailDuration, setTrailDuration] = useState<number>(5) // minutes
  const [hoveredVehicleId, setHoveredVehicleId] = useState<string | null>(null)

  // Store vehicle position history for trails
  const vehicleTrails = useRef<Map<string, Array<{ lat: number; lng: number; timestamp: string }>>>(new Map())

  // Update trails when telemetry changes
  useEffect(() => {
    Object.values(vehicles).forEach(vehicle => {
      if (vehicle.location) {
        const trails = vehicleTrails.current
        const deviceTrail = trails.get(vehicle.device_id) || []

        // Check if this is a new position (avoid duplicates)
        const lastPos = deviceTrail[deviceTrail.length - 1]
        const isDifferent = !lastPos ||
          lastPos.lat !== vehicle.location.latitude ||
          lastPos.lng !== vehicle.location.longitude

        if (isDifferent) {
          const newTrail = [
            ...deviceTrail,
            {
              lat: vehicle.location.latitude,
              lng: vehicle.location.longitude,
              timestamp: vehicle.location.timestamp,
            }
          ]

          // Keep only positions from the last N minutes
          const cutoffTime = Date.now() - trailDuration * 60 * 1000
          const filteredTrail = newTrail.filter(pos =>
            new Date(pos.timestamp).getTime() > cutoffTime
          )

          trails.set(vehicle.device_id, filteredTrail)
        }
      }
    })
  }, [vehicles, trailDuration])

  // Memoize viewport change handler to prevent infinite loops
  const handleViewportChange = useCallback((newViewport: MapViewport) => {
    setViewport(newViewport)
  }, [])

  // Filter vehicles based on filter store
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return []

    return vehicles.filter((vehicle) => {
      // Status filter
      if (vehicleStatus.length > 0 && !vehicleStatus.includes(vehicle.status as any)) {
        return false
      }

      // Search filter - search by name or device_id
      if (vehicleSearch) {
        const searchLower = vehicleSearch.toLowerCase()
        const matchesName = vehicle.name.toLowerCase().includes(searchLower)
        const matchesDeviceId = vehicle.device_id.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesDeviceId) {
          return false
        }
      }

      return true
    })
  }, [vehicles, vehicleStatus, vehicleSearch])

  // Convert vehicles to map markers - ONLY include vehicles with valid location data
  const markers: MapMarker[] = useMemo(() => {
    const validMarkers = filteredVehicles
      .filter((vehicle) => {
        // Only include vehicles with valid location coordinates
        return vehicle.location &&
               typeof vehicle.location.latitude === 'number' &&
               typeof vehicle.location.longitude === 'number' &&
               !isNaN(vehicle.location.latitude) &&
               !isNaN(vehicle.location.longitude) &&
               vehicle.location.latitude !== 0 &&
               vehicle.location.longitude !== 0
      })
      .map((vehicle) => ({
        id: vehicle.id,
        position: {
          lat: vehicle.location!.latitude,
          lng: vehicle.location!.longitude,
        },
        icon: createVehicleIcon({
          name: vehicle.name,
          status: vehicle.status as 'active' | 'inactive' | 'maintenance' | 'offline',
          device_type: vehicle.device_type,
          location: vehicle.location,
        }),
        label: '',
        onClick: () => {
          setHoveredVehicleId(vehicle.id)
          setSelectedVehicleId(vehicle.id)
        },
        data: vehicle as any,
      }))

    console.log('[LiveTracking] Created markers:', validMarkers.length, '/', filteredVehicles.length)
    return validMarkers
  }, [filteredVehicles])

  // Convert vehicle trails to polylines for map
  const polylines: MapPolyline[] = useMemo(() => {
    if (!showTrails) return []

    const lines: MapPolyline[] = []
    vehicleTrails.current.forEach((positions, deviceId) => {
      if (positions.length >= 2) {
        const vehicle = filteredVehicles.find(v => v.device_id === deviceId)
        lines.push({
          id: `trail-${deviceId}`,
          positions: positions.map(p => ({ lat: p.lat, lng: p.lng })),
          color: vehicle?.status === 'active' ? '#3b82f6' : '#94a3b8',
          weight: 3,
          opacity: 0.6,
        })
      }
    })

    return lines
  }, [showTrails, filteredVehicles])

  // Map clustering
  useMapClustering({
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

  const hoveredVehicle = useMemo(() => {
    return filteredVehicles.find((v) => v.id === hoveredVehicleId)
  }, [filteredVehicles, hoveredVehicleId])

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
          </div>

          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowClustering(!showClustering)}
              className="w-full"
            >
              {showClustering ? 'Hide' : 'Show'} Clusters
            </Button>
            <Button
              size="sm"
              variant={showTrails ? 'default' : 'outline'}
              onClick={() => setShowTrails(!showTrails)}
              className="w-full"
            >
              {showTrails ? 'Hide' : 'Show'} Vehicle Trails
            </Button>
            {showTrails && (
              <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                Trail duration: {trailDuration} min
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={trailDuration}
                  onChange={(e) => setTrailDuration(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedVehicleId === vehicle.id ? 'bg-blue-50' : ''
              } ${!vehicle.location ? 'opacity-50' : ''}`}
              onClick={() => centerOnVehicle(vehicle.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{vehicle.name}</span>
                  {!vehicle.location && (
                    <span className="text-xs text-gray-400" title="No location data">📍</span>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    vehicle.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'inactive'
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
                <div>Type: {vehicle.device_type}</div>
                <div className="text-xs text-gray-500">ID: {vehicle.device_id}</div>
                {vehicle.location ? (
                  <div className="text-xs text-green-600 mt-1">
                    📍 {vehicle.location.latitude.toFixed(6)}, {vehicle.location.longitude.toFixed(6)}
                    {vehicle.location.speed && <span className="ml-2">{vehicle.location.speed} km/h</span>}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 mt-1">
                    No location data
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
          markers={markers}
          polylines={polylines}
          onViewportChange={handleViewportChange}
          onMarkerClick={handleMarkerClick}
          className="h-full w-full"
        />

        {/* Hovered Vehicle Tooltip */}
        {hoveredVehicle && hoveredVehicle.location && (
          <div
            className="absolute z-[1000] animate-in pointer-events-auto"
            style={{
              top: '50%',
              left: '47.8%',
              transform: 'translate(-50%, calc(-50% - 188px))'
            }}
          >
            <VehicleTooltip
              name={hoveredVehicle.name}
              status={hoveredVehicle.status as 'active' | 'inactive' | 'maintenance' | 'offline'}
              device_type={hoveredVehicle.device_type}
              location={hoveredVehicle.location}
              onClose={() => setHoveredVehicleId(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
