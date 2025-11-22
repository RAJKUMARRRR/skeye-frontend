// API Configuration
// Note: Backend uses /api/v1 prefix - added in service files

// Get environment variables (works in both Vite and other bundlers)
const getEnvVar = (key: string, fallback: string): string => {
  // Vite environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as any)[key] || fallback
  }
  // Fallback for non-Vite environments
  if (typeof process !== 'undefined' && process.env) {
    return (process.env as any)[key] || fallback
  }
  return fallback
}

export const config = {
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000'),
  wsUrl: getEnvVar('VITE_WS_URL', 'http://localhost:3000'),
  timeout: 10000,
}

console.log('[Config] API URL:', config.apiUrl)
console.log('[Config] WS URL:', config.wsUrl)

export default config
