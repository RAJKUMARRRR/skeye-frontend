import { http, HttpResponse } from 'msw'
import { mockDb } from '../data/database'

export const driverHandlers = [
  // Get all drivers
  http.get('/api/drivers', ({ request }) => {
    const url = new URL(request.url)
    const organizationId = url.searchParams.get('organizationId') || undefined
    const drivers = mockDb.getDrivers(organizationId)
    return HttpResponse.json(drivers)
  }),

  // Get driver by ID
  http.get('/api/drivers/:id', ({ params }) => {
    const driver = mockDb.getDriver(params.id as string)
    if (!driver) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(driver)
  }),
]
