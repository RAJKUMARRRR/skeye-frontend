import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { wsClient, type TelemetryEvent } from '@fleet/api'

/**
 * Hook to automatically update vehicle locations from WebSocket telemetry
 * Updates the vehicles query cache in real-time
 */
export function useVehicleLocationUpdates() {
  const queryClient = useQueryClient()
  const [isConnected, setIsConnected] = useState(wsClient.isConnected())

  useEffect(() => {
    const handleTelemetryUpdate = (event: TelemetryEvent) => {
      // Update vehicles query cache with new location data
      queryClient.setQueryData(['vehicles'], (oldData: any) => {
        if (!oldData) return oldData

        return oldData.map((vehicle: any) => {
          if (vehicle.device_id === event.device_id) {
            return {
              ...vehicle,
              location: {
                latitude: event.location_lat,
                longitude: event.location_lng,
                timestamp: event.time,
              },
              speed: event.speed,
              heading: event.heading,
              battery: event.battery,
              last_seen: event.time,
              status: 'active', // Device is active if sending telemetry
            }
          }
          return vehicle
        })
      })

      // Also update individual vehicle query if it exists
      queryClient.setQueryData(['vehicle', event.device_id], (oldData: any) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          location: {
            latitude: event.location_lat,
            longitude: event.location_lng,
            timestamp: event.time,
          },
          speed: event.speed,
          heading: event.heading,
          battery: event.battery,
          last_seen: event.time,
          status: 'active',
        }
      })
    }

    // Subscribe to WebSocket telemetry updates
    wsClient.subscribe(handleTelemetryUpdate)

    // Update connection status
    const checkConnection = setInterval(() => {
      setIsConnected(wsClient.isConnected())
    }, 1000)

    // Cleanup on unmount
    return () => {
      wsClient.unsubscribe(handleTelemetryUpdate)
      clearInterval(checkConnection)
    }
  }, [queryClient])

  return isConnected
}

/**
 * Get real-time locations for multiple vehicles
 * Returns a map of vehicle ID to location data
 */
export function useVehicleLocations(vehicleIds?: string[]) {
  const [locations, setLocations] = useState<Record<string, {
    lat: number
    lng: number
    timestamp: string
    speed?: number
    heading?: number
  }>>({})

  useEffect(() => {
    const handleTelemetryUpdate = (event: TelemetryEvent) => {
      // Filter by vehicle IDs if specified
      if (vehicleIds && !vehicleIds.includes(event.device_id)) {
        return
      }

      setLocations(prev => ({
        ...prev,
        [event.device_id]: {
          lat: event.location_lat,
          lng: event.location_lng,
          timestamp: event.time,
          speed: event.speed,
          heading: event.heading,
        },
      }))
    }

    wsClient.subscribe(handleTelemetryUpdate)

    return () => {
      wsClient.unsubscribe(handleTelemetryUpdate)
    }
  }, [vehicleIds])

  return locations
}

/**
 * Get WebSocket connection status
 */
export function useWebSocketStatus() {
  const [isConnected, setIsConnected] = useState(wsClient.isConnected())

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(wsClient.isConnected())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return isConnected
}
