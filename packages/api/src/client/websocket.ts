import { io, Socket } from 'socket.io-client'
import { WS_CONFIG, USE_MOCK_API } from './config'

type EventCallback = (data: any) => void

class WebSocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private eventHandlers: Map<string, Set<EventCallback>> = new Map()
  private mockMode = USE_MOCK_API

  connect(token?: string): Socket {
    if (this.mockMode) {
      console.log('[WebSocket] Running in mock mode')
      return this.connectMock()
    }

    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(WS_CONFIG.url, {
      auth: token ? { token } : undefined,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: WS_CONFIG.reconnectDelay,
      reconnectionDelayMax: WS_CONFIG.reconnectDelayMax,
      reconnectionAttempts: WS_CONFIG.reconnectAttempts,
    })

    this.setupEventHandlers()
    return this.socket
  }

  private connectMock(): Socket {
    console.log('[WebSocket] Mock connection established')
    return {} as Socket
  }

  private setupEventHandlers() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected')
      this.reconnectAttempts = 0
      this.emit('connection:established', { connected: true })
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason)
      this.emit('connection:lost', { reason })
    })

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error.message)
      this.reconnectAttempts++

      if (this.reconnectAttempts >= WS_CONFIG.reconnectAttempts) {
        console.error('[WebSocket] Max reconnection attempts reached')
        this.emit('connection:failed', { error: error.message })
      }
    })
  }

  subscribe(channel: string, callback: EventCallback) {
    if (this.mockMode) {
      const handler = (e: CustomEvent) => callback(e.detail)
      window.addEventListener(\`mock:\${channel}\`, handler as EventListener)
      return
    }

    if (!this.socket) {
      console.error('[WebSocket] Not connected. Call connect() first.')
      return
    }

    this.socket.on(channel, callback)

    if (!this.eventHandlers.has(channel)) {
      this.eventHandlers.set(channel, new Set())
    }
    this.eventHandlers.get(channel)!.add(callback)
  }

  unsubscribe(channel: string, callback?: EventCallback) {
    if (this.mockMode) {
      if (callback) {
        const handler = (e: CustomEvent) => callback(e.detail)
        window.removeEventListener(\`mock:\${channel}\`, handler as EventListener)
      }
      return
    }

    if (!this.socket) return

    if (callback) {
      this.socket.off(channel, callback)
      this.eventHandlers.get(channel)?.delete(callback)
    } else {
      this.socket.off(channel)
      this.eventHandlers.delete(channel)
    }
  }

  emit(event: string, data?: any) {
    if (this.mockMode) {
      console.log(\`[WebSocket Mock] Emit: \${event}\`, data)
      return
    }

    if (!this.socket?.connected) {
      console.warn('[WebSocket] Cannot emit - not connected')
      return
    }

    this.socket.emit(event, data)
  }

  disconnect() {
    if (this.socket) {
      this.eventHandlers.forEach((_, channel) => {
        this.socket?.off(channel)
      })
      this.eventHandlers.clear()

      this.socket.disconnect()
      this.socket = null
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

export const wsClient = new WebSocketClient()

export default wsClient
