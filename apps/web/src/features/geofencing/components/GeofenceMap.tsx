import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fleet/ui-web'
import {
  MapPin,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Truck,
} from 'lucide-react'

const mockGeofencesWithVehicles = [
  {
    id: 'gf001',
    name: 'Main Depot',
    type: 'circle',
    category: 'depot',
    address: '123 Main St, Chicago, IL',
    radius: 500,
    coordinates: { lat: 41.8781, lng: -87.6298 },
    status: 'active',
    color: 'bg-blue-500',
    vehicles: [
      { id: 'v001', name: 'Truck-001', status: 'inside' },
      { id: 'v002', name: 'Van-002', status: 'inside' },
      { id: 'v003', name: 'Truck-003', status: 'inside' },
    ],
  },
  {
    id: 'gf002',
    name: 'Customer Zone A',
    type: 'polygon',
    category: 'customer',
    address: 'Milwaukee, WI Area',
    coordinates: { lat: 43.0389, lng: -87.9065 },
    status: 'active',
    color: 'bg-green-500',
    vehicles: [
      { id: 'v004', name: 'Van-004', status: 'inside' },
      { id: 'v005', name: 'Truck-005', status: 'inside' },
    ],
  },
  {
    id: 'gf003',
    name: 'Restricted Area - Construction',
    type: 'circle',
    category: 'restricted',
    address: 'Downtown Chicago',
    radius: 1000,
    coordinates: { lat: 41.8789, lng: -87.6359 },
    status: 'active',
    color: 'bg-red-500',
    vehicles: [
      { id: 'v006', name: 'Van-006', status: 'violation' },
    ],
  },
  {
    id: 'gf004',
    name: 'Service Area - North',
    type: 'polygon',
    category: 'service_area',
    address: 'Northern Illinois',
    coordinates: { lat: 42.0, lng: -88.0 },
    status: 'active',
    color: 'bg-purple-500',
    vehicles: [
      { id: 'v007', name: 'Truck-007', status: 'inside' },
      { id: 'v008', name: 'Van-008', status: 'inside' },
      { id: 'v009', name: 'Truck-009', status: 'inside' },
    ],
  },
]

export function GeofenceMap() {
  const [selectedGeofence, setSelectedGeofence] = useState<string>(mockGeofencesWithVehicles[0].id)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showViolationsOnly, setShowViolationsOnly] = useState(false)

  const geofence = mockGeofencesWithVehicles.find((g) => g.id === selectedGeofence)

  if (!geofence) return null

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      depot: { className: 'bg-blue-100 text-blue-800', label: 'Depot' },
      customer: { className: 'bg-green-100 text-green-800', label: 'Customer' },
      restricted: { className: 'bg-red-100 text-red-800', label: 'Restricted' },
      service_area: { className: 'bg-purple-100 text-purple-800', label: 'Service Area' },
    }
    const config = variants[category] || { className: 'bg-gray-100 text-gray-800', label: 'Other' }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const violationsCount = mockGeofencesWithVehicles.reduce(
    (sum, gf) => sum + gf.vehicles.filter((v) => v.status === 'violation').length,
    0
  )

  const filteredGeofences = showViolationsOnly
    ? mockGeofencesWithVehicles.filter((gf) => gf.vehicles.some((v) => v.status === 'violation'))
    : mockGeofencesWithVehicles

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Geofences</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGeofencesWithVehicles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">On map</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Inside</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockGeofencesWithVehicles.reduce((sum, gf) => sum + gf.vehicles.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{violationsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                ((mockGeofencesWithVehicles.reduce((sum, gf) => sum + gf.vehicles.length, 0) -
                  violationsCount) /
                  mockGeofencesWithVehicles.reduce((sum, gf) => sum + gf.vehicles.length, 0)) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Card */}
      <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Geofence Map</CardTitle>
              <CardDescription>Real-time vehicle tracking within geofenced areas</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedGeofence} onValueChange={setSelectedGeofence}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select geofence" />
                </SelectTrigger>
                <SelectContent>
                  {filteredGeofences.map((gf) => (
                    <SelectItem key={gf.id} value={gf.id}>
                      {gf.name} - {gf.vehicles.length} vehicles
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowViolationsOnly(!showViolationsOnly)}
              >
                {showViolationsOnly ? 'Show All' : 'Violations Only'}
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Container */}
          <div
            className={`bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden ${isFullscreen ? 'h-[calc(100vh-12rem)]' : 'h-[600px]'}`}
          >
            {/* Simplified map visualization */}
            <div className="absolute inset-0 p-8">
              {/* Geofence boundary */}
              <div
                className={`absolute ${geofence.color} opacity-20 rounded-lg`}
                style={{
                  left: '20%',
                  top: '15%',
                  width: geofence.type === 'circle' ? '60%' : '65%',
                  height: geofence.type === 'circle' ? '60%' : '70%',
                  borderRadius: geofence.type === 'circle' ? '50%' : '12px',
                }}
              />

              {/* Geofence border */}
              <div
                className={`absolute ${geofence.color.replace('bg-', 'border-')} border-4 border-dashed rounded-lg`}
                style={{
                  left: '20%',
                  top: '15%',
                  width: geofence.type === 'circle' ? '60%' : '65%',
                  height: geofence.type === 'circle' ? '60%' : '70%',
                  borderRadius: geofence.type === 'circle' ? '50%' : '12px',
                }}
              />

              {/* Geofence label */}
              <div className="absolute left-1/2 top-8 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <MapPin className={`h-5 w-5 ${geofence.color.replace('bg-', 'text-')}`} />
                  <div>
                    <div className="font-semibold">{geofence.name}</div>
                    <div className="text-xs text-muted-foreground">{geofence.address}</div>
                  </div>
                  {getCategoryBadge(geofence.category)}
                </div>
              </div>

              {/* Vehicles inside geofence */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {geofence.vehicles.map((vehicle, idx) => (
                    <div
                      key={vehicle.id}
                      className={`bg-white p-3 rounded-lg shadow-lg ${
                        vehicle.status === 'violation' ? 'ring-2 ring-red-500 animate-pulse' : ''
                      }`}
                      style={{
                        transform: `translate(${(idx % 2) * 100 - 50}px, ${Math.floor(idx / 2) * 80 - 40}px)`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {vehicle.status === 'violation' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Navigation className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{vehicle.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {vehicle.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                <div className="text-xs font-semibold mb-2">Legend</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${geofence.color} rounded`} />
                    <span>Geofence Area</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3 h-3 text-green-600" />
                    <span>Vehicle (Inside)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    <span>Violation</span>
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
                <div className="text-xs font-semibold mb-2">Geofence Details</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{geofence.type}</span>
                  </div>
                  {geofence.radius && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Radius:</span>
                      <span className="font-medium">{geofence.radius}m</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicles Inside:</span>
                    <span className="font-medium">{geofence.vehicles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Violations:</span>
                    <span
                      className={`font-medium ${geofence.vehicles.some((v) => v.status === 'violation') ? 'text-red-600' : ''}`}
                    >
                      {geofence.vehicles.filter((v) => v.status === 'violation').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            This is a simplified visualization. In production, integrate with Mapbox, Leaflet, or Google Maps
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles in {geofence.name}</CardTitle>
          <CardDescription>Real-time status of vehicles within this geofence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {geofence.vehicles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No vehicles currently in this geofence
              </div>
            ) : (
              geofence.vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-4 rounded-lg border ${
                    vehicle.status === 'violation'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {vehicle.status === 'violation' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      <div>
                        <div className="font-medium">{vehicle.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {vehicle.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={vehicle.status === 'violation' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {vehicle.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Track
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
