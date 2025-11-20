import { config } from '../config'

// WebSocket telemetry event structure (actual format from backend)
export interface TelemetryEvent {
  type: 'telemetry'
  deviceId: string
  timestamp: string
  data: {
    deviceId: string
    timestamp: string
    location: {
      lat: number
      lng: number
    }
    telemetry: {
      altitude?: number
      battery?: number
    }
    rawData: any
  }
}

// Normalized telemetry data for easier use
export interface NormalizedTelemetry {
  device_id: string
  time: string
  location_lat: number
  location_lng: number
  speed?: number
  heading?: number
  altitude?: number
  satellites?: number
  battery?: number
}

type EventCallback = (data: TelemetryEvent) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectDelay = 30000 // 30 seconds
  private reconnectTimeout: NodeJS.Timeout | null = null
  private eventHandlers: Set<EventCallback> = new Set()
  private isConnecting = false
  private authToken: string | null = null

  setToken(token: string | null): void {
    const tokenChanged = this.authToken !== token
    this.authToken = token

    if (tokenChanged) {
      console.log('[WebSocket] Token updated, reconnecting...')
      // Disconnect and reconnect with new token
      if (this.ws) {
        this.ws.close()
      }
      if (token) {
        this.connect()
      }
    }
  }

  connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    if (!this.authToken) {
      console.warn('[WebSocket] No auth token, skipping connection')
      return
    }

    this.isConnecting = true
    const wsUrl = config.wsUrl.replace('http://', 'ws://').replace('https://', 'wss://')
    const wsUrlWithToken = `${wsUrl}/ws?token=${this.authToken}`

    try {
      console.log('[WebSocket] Connecting to:', wsUrl + '/ws')
      this.ws = new WebSocket(wsUrlWithToken)
      this.setupEventHandlers()
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('[WebSocket] Connected')
      this.reconnectAttempts = 0
      this.isConnecting = false
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as TelemetryEvent

        if (data.type === 'telemetry') {
          // Notify all event handlers
          this.eventHandlers.forEach(handler => handler(data))
        }
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('[WebSocket] Error:', error)
      this.isConnecting = false
    }

    this.ws.onclose = () => {
      console.log('[WebSocket] Disconnected')
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    )
    this.reconnectAttempts++

    console.log(`[WebSocket] Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`)

    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, delay)
  }

  subscribe(callback: EventCallback) {
    this.eventHandlers.add(callback)
  }

  unsubscribe(callback: EventCallback) {
    this.eventHandlers.delete(callback)
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.isConnecting = false
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const wsClient = new WebSocketClient()

// Note: Don't auto-connect here - wait for token to be set from AuthContext

export default wsClient
