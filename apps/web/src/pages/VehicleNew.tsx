import { useNavigate } from 'react-router-dom'
import { VehicleForm } from '../features/vehicles/components/VehicleForm'
import { Button } from '@fleet/ui-web'

export function VehicleNew() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate('/vehicles')}>
          ← Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Add New Vehicle</h2>
          <p className="text-gray-600">Create a new vehicle in your fleet</p>
        </div>
      </div>

      <VehicleForm />
    </div>
  )
}
