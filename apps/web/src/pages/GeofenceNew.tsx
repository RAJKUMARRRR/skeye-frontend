import { useNavigate } from 'react-router-dom'
import { GeofenceDrawing } from '../features/geofencing/components/GeofenceDrawing'
import { useCreateGeofence } from '../hooks/useGeofences'
import { Button } from '@fleet/ui-web'

export function GeofenceNew() {
  const navigate = useNavigate()
  const createGeofence = useCreateGeofence()

  const handleSave = async (geofenceData: any) => {
    try {
      await createGeofence.mutateAsync({
        ...geofenceData,
        organizationId: 'org-1', // TODO: Get from auth context
        assignedVehicleIds: [],
        rules: [],
      })
      navigate('/geofences')
    } catch (error) {
      console.error('Failed to create geofence:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate('/geofences')}>
          ← Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Create Geofence</h2>
          <p className="text-gray-600">Draw a geofence on the map</p>
        </div>
      </div>

      <GeofenceDrawing
        onSave={handleSave}
        onCancel={() => navigate('/geofences')}
      />
    </div>
  )
}
