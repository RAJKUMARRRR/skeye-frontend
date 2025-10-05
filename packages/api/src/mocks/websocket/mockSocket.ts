import { mockDb } from '../data/database'

export function startMockWebSocket() {
  if (typeof window === 'undefined') return

  // Simulate vehicle location updates every 10 seconds
  setInterval(() => {
    const vehicles = mockDb.getVehicles()
    
    vehicles.slice(0, 50).forEach(vehicle => {
      // Slight random movement
      const newLat = vehicle.location.lat + (Math.random() - 0.5) * 0.001
      const newLng = vehicle.location.lng + (Math.random() - 0.5) * 0.001
      
      mockDb.updateVehicle(vehicle.id, {
        location: {
          ...vehicle.location,
          lat: newLat,
          lng: newLng,
          timestamp: new Date().toISOString(),
        },
      })

      // Broadcast update via custom event
      window.dispatchEvent(
        new CustomEvent(`mock:vehicle:location:${vehicle.id}`, {
          detail: { lat: newLat, lng: newLng, timestamp: new Date().toISOString() },
        })
      )
    })
  }, 10000)

  console.log('[Mock WebSocket] Started broadcasting location updates every 10 seconds')
}
