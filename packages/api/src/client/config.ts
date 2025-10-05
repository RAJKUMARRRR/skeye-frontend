export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const WS_CONFIG = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
  reconnectDelay: 1000,
  reconnectDelayMax: 5000,
  reconnectAttempts: 5,
}

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'
