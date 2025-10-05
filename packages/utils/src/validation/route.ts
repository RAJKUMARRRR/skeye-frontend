import { z } from 'zod'

const stopSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  sequence: z.number().min(0),
  estimatedArrival: z.string().optional(),
  notes: z.string().optional(),
})

export const routeSchema = z.object({
  name: z.string().min(1, 'Route name is required'),
  description: z.string().optional(),
  stops: z.array(stopSchema).min(2, 'Route must have at least 2 stops'),
  assignedVehicleId: z.string().optional(),
  assignedDriverId: z.string().optional(),
  scheduledDate: z.string().optional(),
})

export type RouteInput = z.infer<typeof routeSchema>
export type StopInput = z.infer<typeof stopSchema>
