import { useEffect, useRef, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

type WebSocketMessage = {
  type: 'location_update' | 'alert' | 'trip_start' | 'trip_end' | 'status_change'
  data: any
}

interface UseWebSocketOptions {
  url?: string
  onMessage?: (message: WebSocketMessage) => void
  onError?: (error: Event) => void
  reconnectInterval?: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = 'ws://localhost:8080/ws', // TODO: Use env variable
    onMessage,
    onError,
    reconnectInterval = 5000,
  } = options

  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const queryClient = useQueryClient()
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          onMessage?.(message)

          // Auto-invalidate queries based on message type
          switch (message.type) {
            case 'location_update':
              queryClient.invalidateQueries({ queryKey: ['vehicles'] })
              if (message.data.vehicleId) {
                queryClient.invalidateQueries({
                  queryKey: ['vehicle', message.data.vehicleId, 'location']
                })
              }
              break
            case 'alert':
              queryClient.invalidateQueries({ queryKey: ['alerts'] })
              break
            case 'trip_start':
            case 'trip_end':
              queryClient.invalidateQueries({ queryKey: ['trips'] })
              break
            case 'status_change':
              if (message.data.vehicleId) {
                queryClient.invalidateQueries({
                  queryKey: ['vehicle', message.data.vehicleId]
                })
              }
              break
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        onError?.(error)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        wsRef.current = null

        // Attempt to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...')
          connect()
        }, reconnectInterval)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
  }, [url, onMessage, onError, reconnectInterval, queryClient])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect,
  }
}

// Specialized hook for vehicle location updates
export function useVehicleLocationUpdates(vehicleIds?: string[]) {
  const [locations, setLocations] = useState<Record<string, { lat: number; lng: number; timestamp: string }>>({})

  useWebSocket({
    onMessage: (message) => {
      if (message.type === 'location_update') {
        const { vehicleId, lat, lng, timestamp } = message.data
        if (!vehicleIds || vehicleIds.includes(vehicleId)) {
          setLocations((prev) => ({
            ...prev,
            [vehicleId]: { lat, lng, timestamp },
          }))
        }
      }
    },
  })

  return locations
}
