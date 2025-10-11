import { useNavigate } from 'react-router-dom'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleTable } from '../features/vehicles/components/VehicleTable'
import { Button } from '@fleet/ui-web'

export function Vehicles() {
  const navigate = useNavigate()
  const { data: vehicles, isLoading } = useVehicles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
          <p className="text-gray-600">Manage your fleet vehicles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/vehicles/import')}>
            Bulk Import
          </Button>
          <Button onClick={() => navigate('/vehicles/new')}>
            Add Vehicle
          </Button>
        </div>
      </div>

      <VehicleTable vehicles={vehicles || []} isLoading={isLoading} />
    </div>
  )
}
