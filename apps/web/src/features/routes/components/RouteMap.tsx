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
import { MapPin, Navigation, Clock, TrendingUp, Maximize2, Minimize2, RefreshCw } from 'lucide-react'

const mockRoutes = [
  {
    id: 'r001',
    name: 'Chicago to Milwaukee',
    status: 'active',
    driver: 'John Smith',
    vehicle: 'Truck-001',
    origin: { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    destination: { name: 'Milwaukee, WI', lat: 43.0389, lng: -87.9065 },
    waypoints: [
      { name: 'Gurnee, IL', lat: 42.3703, lng: -87.9390, eta: '10:45 AM' },
      { name: 'Kenosha, WI', lat: 42.5847, lng: -87.8212, eta: '11:15 AM' },
    ],
    progress: 65,
    currentLocation: { lat: 42.5847, lng: -87.8212 },
    distance: 145,
    estimatedTime: 138,
    actualTime: 95,
  },
  {
    id: 'r002',
    name: 'Madison to Green Bay',
    status: 'completed',
    driver: 'Sarah Johnson',
    vehicle: 'Van-002',
    origin: { name: 'Madison, WI', lat: 43.0731, lng: -89.4012 },
    destination: { name: 'Green Bay, WI', lat: 44.5133, lng: -88.0133 },
    waypoints: [
      { name: 'Fond du Lac, WI', lat: 43.7730, lng: -88.4470, eta: 'Arrived' },
      { name: 'Appleton, WI', lat: 44.2619, lng: -88.4154, eta: 'Arrived' },
    ],
    progress: 100,
    currentLocation: { lat: 44.5133, lng: -88.0133 },
    distance: 185,
    estimatedTime: 195,
    actualTime: 195,
  },
  {
    id: 'r003',
    name: 'Rockford to Springfield',
    status: 'pending',
    driver: 'Mike Davis',
    vehicle: 'Truck-003',
    origin: { name: 'Rockford, IL', lat: 42.2711, lng: -89.0940 },
    destination: { name: 'Springfield, IL', lat: 39.7817, lng: -89.6501 },
    waypoints: [
      { name: 'Peru, IL', lat: 41.3273, lng: -89.1290, eta: '2:30 PM' },
      { name: 'Peoria, IL', lat: 40.6936, lng: -89.5890, eta: '3:45 PM' },
    ],
    progress: 0,
    currentLocation: { lat: 42.2711, lng: -89.0940 },
    distance: 220,
    estimatedTime: 225,
    actualTime: 0,
  },
]

export function RouteMap() {
  const [selectedRoute, setSelectedRoute] = useState<string>(mockRoutes[0].id)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const route = mockRoutes.find((r) => r.id === selectedRoute)

  if (!route) return null

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      active: { variant: 'default', label: 'Active' },
      completed: { variant: 'secondary', label: 'Completed' },
      pending: { variant: 'destructive', label: 'Pending' },
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Route Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Route Map</CardTitle>
              <CardDescription>Real-time route tracking and visualization</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoutes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} - {r.driver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      </Card>

      {/* Route Details */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Route Status</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(route.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-bold">{route.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${route.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance & Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Distance</span>
                <span className="font-bold">{route.distance} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated Time</span>
                <span className="font-medium">{route.estimatedTime} min</span>
              </div>
              {route.status === 'active' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Elapsed Time</span>
                  <span className="font-medium">{route.actualTime} min</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Driver & Vehicle</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Driver</span>
                <span className="font-bold">{route.driver}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vehicle</span>
                <span className="font-medium">{route.vehicle}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Visualization */}
      <Card className={isFullscreen ? 'fixed inset-4 z-50' : ''}>
        <CardHeader>
          <CardTitle>Route Visualization</CardTitle>
          <CardDescription>
            From {route.origin.name} to {route.destination.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Map Container - In production, this would be a real map component */}
          <div className={`bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden ${isFullscreen ? 'h-[calc(100vh-12rem)]' : 'h-96'}`}>
            {/* Simplified map representation */}
            <div className="absolute inset-0 p-8">
              {/* Route line */}
              <div className="relative h-full flex flex-col justify-between">
                {/* Origin */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-lg w-fit">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{route.origin.name}</div>
                    <div className="text-xs text-muted-foreground">Origin</div>
                  </div>
                </div>

                {/* Waypoints */}
                <div className="flex-1 flex flex-col justify-evenly ml-12">
                  {route.waypoints.map((waypoint, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg shadow w-fit">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{waypoint.name}</div>
                        <div className="text-xs text-muted-foreground">ETA: {waypoint.eta}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Location (for active routes) */}
                {route.status === 'active' && (
                  <div className="absolute left-12 top-1/2 flex items-center gap-3 bg-blue-600 text-white p-3 rounded-lg shadow-lg animate-pulse">
                    <Navigation className="h-5 w-5" />
                    <div>
                      <div className="font-semibold text-sm">Current Location</div>
                      <div className="text-xs opacity-90">{route.progress}% complete</div>
                    </div>
                  </div>
                )}

                {/* Destination */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-lg w-fit self-end">
                  <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{route.destination.name}</div>
                    <div className="text-xs text-muted-foreground">Destination</div>
                  </div>
                </div>
              </div>

              {/* Map legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                <div className="text-xs font-semibold mb-2">Legend</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Origin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Waypoint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Destination</span>
                  </div>
                  {route.status === 'active' && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3 h-3 text-blue-600" />
                      <span>Current Position</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info overlay */}
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
                <div className="text-xs font-semibold mb-2">Route Information</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Waypoints:</span>
                    <span className="font-medium">{route.waypoints.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distance Remaining:</span>
                    <span className="font-medium">
                      {Math.round(route.distance * (1 - route.progress / 100))} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Remaining:</span>
                    <span className="font-medium">
                      {Math.round((route.estimatedTime - route.actualTime) * (1 - route.progress / 100))} min
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
    </div>
  )
}
