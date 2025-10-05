import { z } from 'zod'

export const driverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseExpiry: z.string().refine(date => {
    const expiryDate = new Date(date)
    return expiryDate > new Date()
  }, 'License has expired'),
  licenseState: z.string().min(2, 'License state is required'),
})

export type DriverInput = z.infer<typeof driverSchema>
