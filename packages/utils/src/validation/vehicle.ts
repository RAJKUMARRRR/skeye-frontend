import { z } from 'zod'

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  vin: z
    .string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format (must be 17 characters)'),
  licensePlate: z.string().min(1, 'License plate is required'),
  odometer: z.number().min(0, 'Odometer cannot be negative').optional(),
  deviceId: z.string().optional(),
})

export type VehicleInput = z.infer<typeof vehicleSchema>
