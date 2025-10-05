import { http, HttpResponse } from 'msw'
import { vehicleHandlers } from './vehicles'
import { driverHandlers } from './drivers'
import { organizationHandlers } from './organizations'

export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  }),
  
  ...organizationHandlers,
  ...vehicleHandlers,
  ...driverHandlers,
]
