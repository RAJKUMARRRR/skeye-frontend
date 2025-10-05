import { http, HttpResponse } from 'msw'
import { mockDb } from '../data/database'

export const organizationHandlers = [
  // Get all organizations
  http.get('/api/organizations', () => {
    const organizations = mockDb.getOrganizations()
    return HttpResponse.json(organizations)
  }),
]
