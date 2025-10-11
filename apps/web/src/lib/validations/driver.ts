import { z } from 'zod'

export const driverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseExpiry: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'License expiry must be in the future',
  }),
  status: z.enum(['active', 'inactive', 'on_duty', 'off_duty']).default('active'),
})

export type DriverFormData = z.infer<typeof driverSchema>
