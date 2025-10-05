import { db } from '../data/database'
import { generateLocation } from '../data/generators'

export class MockWebSocketServer {
  private intervalId: NodeJS.Timeout | null = null

  start() {
    if (import.meta.env.VITE_USE_MOCK_API !== 'true') {
      return
    }

    console.log('🔶 Mock WebSocket server started')

    // Simulate location updates every 2 seconds
    this.intervalId = setInterval(() => {
      const vehicles = db.getVehicles({ status: 'active' })

      vehicles.forEach(vehicle => {
        const newLocation = generateLocation()

        // Update vehicle in database
        db.updateVehicle(vehicle.id, {
          location: newLocation,
          lastUpdate: new Date().toISOString(),
        })

        // Dispatch custom event for WebSocket simulation
        window.dispatchEvent(
          new CustomEvent('mock:vehicle:location', {
            detail: {
              vehicleId: vehicle.id,
              location: newLocation,
            },
          })
        )
      })
    }, 2000)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('🔶 Mock WebSocket server stopped')
    }
  }
}

export const mockWsServer = new MockWebSocketServer()
