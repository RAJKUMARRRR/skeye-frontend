import { http, HttpResponse } from 'msw'
import { mockDb } from '../data/database'

export const vehicleHandlers = [
  // Get all vehicles
  http.get('/api/vehicles', ({ request }) => {
    const url = new URL(request.url)
    const organizationId = url.searchParams.get('organizationId') || undefined
    const vehicles = mockDb.getVehicles(organizationId)
    return HttpResponse.json(vehicles)
  }),

  // Get vehicle by ID
  http.get('/api/vehicles/:id', ({ params }) => {
    const vehicle = mockDb.getVehicle(params.id as string)
    if (!vehicle) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(vehicle)
  }),

  // Update vehicle
  http.patch('/api/vehicles/:id', async ({ params, request }) => {
    const data = await request.json()
    const updated = mockDb.updateVehicle(params.id as string, data)
    if (!updated) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(updated)
  }),
]
