import { useParams, useNavigate } from 'react-router-dom'
import { useVehicle } from '../hooks/useVehicles'
import { VehicleForm } from '../features/vehicles/components/VehicleForm'
import { Button } from '@fleet/ui-web'

export function VehicleEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: vehicle, isLoading } = useVehicle(id!)

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading vehicle...</div>
  }

  if (!vehicle) {
    return <div className="p-6 text-gray-600">Vehicle not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(`/vehicles/${id}`)}>
          ← Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Edit Vehicle</h2>
          <p className="text-gray-600">{vehicle.licensePlate}</p>
        </div>
      </div>

      <VehicleForm vehicle={vehicle} />
    </div>
  )
}
