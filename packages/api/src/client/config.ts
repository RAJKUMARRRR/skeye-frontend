// Helper to get environment variables that works across different environments
const getEnvVar = (key: string, fallback: string): string => {
  // Vite environment (web app)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as any)[key] || fallback
  }
  // Next.js environment (marketing site)
  if (typeof process !== 'undefined' && process.env) {
    return (process.env as any)[key] || fallback
  }
  return fallback
}

export const API_CONFIG = {
  baseURL: getEnvVar('VITE_API_URL', 'http://localhost:3000'),
  timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000'), 10),
  headers: {
    'Content-Type': 'application/json',
  },
}

export const WS_CONFIG = {
  url: getEnvVar('VITE_WS_URL', 'ws://localhost:3000'),
  reconnectDelay: 1000,
  reconnectDelayMax: 5000,
  reconnectAttempts: 5,
}

export const USE_MOCK_API = getEnvVar('VITE_USE_MOCK_API', 'false') === 'true'
