import { useParams, useNavigate } from 'react-router-dom'
import { useVehicle } from '../hooks/useVehicles'
import { Card, Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { MapProvider } from '../components/map'
import { VehicleTelemetry } from '../components/telemetry/VehicleTelemetry'

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: vehicle, isLoading } = useVehicle(id!)

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading vehicle...</div>
  }

  if (!vehicle) {
    return <div className="p-6 text-gray-600">Vehicle not found</div>
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      idle: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-orange-100 text-orange-800',
      offline: 'bg-gray-100 text-gray-800',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.offline}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/vehicles')}>
              ← Back
            </Button>
            <h2 className="text-3xl font-bold">{vehicle.licensePlate}</h2>
            {getStatusBadge(vehicle.status)}
          </div>
          <p className="text-gray-600 mt-1">
            {vehicle.make} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/vehicles/${id}/edit`)}>
            Edit Vehicle
          </Button>
          <Button variant="outline">Assign Driver</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Vehicle Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">VIN</dt>
                  <dd className="font-medium">{vehicle.vin || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Make</dt>
                  <dd className="font-medium">{vehicle.make}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Model</dt>
                  <dd className="font-medium">{vehicle.model}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Year</dt>
                  <dd className="font-medium">{vehicle.year || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-medium">{vehicle.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Odometer</dt>
                  <dd className="font-medium">{vehicle.odometer?.toLocaleString() || 0} km</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Device ID</dt>
                  <dd className="font-medium">{vehicle.deviceId || 'Not assigned'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Assigned Driver</dt>
                  <dd className="font-medium">{vehicle.assignedDriverId || 'Not assigned'}</dd>
                </div>
              </dl>
            </Card>

            {/* Current Location Map */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Current Location</h3>
              {vehicle.location ? (
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapProvider
                    center={{
                      lat: vehicle.location.latitude,
                      lng: vehicle.location.longitude,
                    }}
                    zoom={15}
                    markers={[
                      {
                        id: vehicle.id,
                        position: {
                          lat: vehicle.location.latitude,
                          lng: vehicle.location.longitude,
                        },
                        label: vehicle.licensePlate,
                      },
                    ]}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No location data available</p>
                </div>
              )}
            </Card>
          </div>

          {/* Telemetry */}
          {vehicle.location && (
            <VehicleTelemetry
              data={{
                speed: vehicle.location.speed || 0,
                heading: vehicle.location.heading || 0,
                altitude: vehicle.location.altitude,
                odometer: vehicle.odometer,
              }}
            />
          )}
        </TabsContent>

        {/* Trip History Tab */}
        <TabsContent value="trips">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trip History</h3>
            <p className="text-gray-600">Trip history will be displayed here</p>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Maintenance Records</h3>
            <p className="text-gray-600">Maintenance records will be displayed here</p>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Alerts</h3>
            <p className="text-gray-600">Alert history will be displayed here</p>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <p className="text-gray-600">Vehicle documents will be displayed here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
