import { z } from 'zod'

const latLngSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

const circleGeofenceSchema = z.object({
  type: z.literal('circle'),
  center: latLngSchema,
  radius: z.number().min(10).max(100000), // 10m to 100km
  coordinates: z.undefined().optional(),
})

const polygonGeofenceSchema = z.object({
  type: z.literal('polygon'),
  coordinates: z.array(latLngSchema).min(3, 'Polygon must have at least 3 points'),
  center: z.undefined().optional(),
  radius: z.undefined().optional(),
})

export const geofenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  geometry: z.discriminatedUnion('type', [circleGeofenceSchema, polygonGeofenceSchema]),
})

export type GeofenceInput = z.infer<typeof geofenceSchema>
