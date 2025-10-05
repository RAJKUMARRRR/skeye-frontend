import { http, HttpResponse } from 'msw'
import { db } from '../data/database'

const baseUrl = 'http://localhost:3000/api'

export const alertHandlers = [
  http.get(`${baseUrl}/alerts`, () => {
    const alerts = db.getAlerts()

    return HttpResponse.json({
      data: alerts,
      meta: {
        total: alerts.length,
      },
    })
  }),

  http.get(`${baseUrl}/alerts/:id`, ({ params }) => {
    const { id } = params
    const alert = db.getAlert(id as string)

    if (!alert) {
      return HttpResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: alert })
  }),

  http.patch(`${baseUrl}/alerts/:id/acknowledge`, ({ params }) => {
    const { id } = params
    const alert = db.acknowledgeAlert(id as string)

    if (!alert) {
      return HttpResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: alert })
  }),
]
