import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Card,
} from '@fleet/ui-web'
import { useCreateVehicle, useUpdateVehicle } from '../../../hooks/useVehicles'
import type { Vehicle } from '../../../types/vehicle'

const vehicleSchema = z.object({
  name: z.string().min(1, 'Vehicle name is required'),
  device_id: z.string().min(1, 'Device ID is required'),
  licensePlate: z.string().optional(),
  vin: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  type: z.enum(['sedan', 'suv', 'truck', 'van', 'motorcycle', 'other']).optional(),
  odometer: z.number().int().min(0).optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface VehicleFormProps {
  vehicle?: Vehicle
  onSuccess?: () => void
}

export function VehicleForm({ vehicle, onSuccess }: VehicleFormProps) {
  const navigate = useNavigate()
  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: vehicle?.name || '',
      device_id: vehicle?.device_id || '',
      licensePlate: vehicle?.licensePlate || '',
      vin: vehicle?.vin || '',
      make: vehicle?.make || '',
      model: vehicle?.model || '',
      year: vehicle?.year,
      type: vehicle?.type || 'sedan',
      odometer: vehicle?.odometer,
    },
  })

  const onSubmit = async (data: VehicleFormData) => {
    try {
      if (vehicle) {
        // For update - only name and status per OpenAPI spec
        console.log('[VehicleForm] Updating device:', vehicle.id, data)
        await updateVehicle.mutateAsync({
          id: vehicle.id,
          data: {
            name: data.name,
          },
        })
        console.log('[VehicleForm] Device updated successfully')
      } else {
        // For create - only device_id, name, and device_type per OpenAPI spec
        const payload = {
          device_id: data.device_id,
          name: data.name,
          device_type: 'gps_tracker', // Optional, defaults to this on backend
        }
        console.log('[VehicleForm] Creating device with payload:', payload)
        const result = await createVehicle.mutateAsync(payload)
        console.log('[VehicleForm] Device created successfully:', result)
      }
      onSuccess?.()
      navigate('/vehicles')
    } catch (error: any) {
      console.error('[VehicleForm] Failed to save vehicle:', error)
      console.error('[VehicleForm] Error response:', error.response?.data)
      console.error('[VehicleForm] Error status:', error.response?.status)
      // TODO: Show error toast to user
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Vehicle Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Fleet Vehicle 001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Device ID */}
            <FormField
              control={form.control}
              name="device_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="866897055939956" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* License Plate */}
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Plate</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* VIN */}
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input placeholder="1HGBH41JXMN109186" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Make */}
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Camry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2024"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="van">Van</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Odometer */}
            <FormField
              control={form.control}
              name="odometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/vehicles')}>
              Cancel
            </Button>
            <Button type="submit" disabled={createVehicle.isPending || updateVehicle.isPending}>
              {vehicle ? 'Update Vehicle' : 'Create Vehicle'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
