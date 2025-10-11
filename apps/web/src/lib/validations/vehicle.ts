import { z } from 'zod'

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, 'License plate is required'),
  vin: z.string().optional(),
  type: z.enum(['car', 'truck', 'van', 'bus', 'motorcycle']),
  status: z.enum(['active', 'idle', 'parked', 'maintenance', 'offline']).default('active'),
  deviceId: z.string().optional(),
})

export type VehicleFormData = z.infer<typeof vehicleSchema>
