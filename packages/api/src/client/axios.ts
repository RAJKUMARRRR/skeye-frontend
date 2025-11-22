import axios from 'axios'
import { config } from '../config'

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.timeout,
})

// Token setter function to be called from Clerk auth hook
let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    console.log('[API Client] Token updated:', `${token.substring(0, 20)}...`)
  } else {
    console.log('[API Client] Token cleared')
  }
}

export const getAuthToken = () => authToken

apiClient.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
    console.log('[API Client] Request to:', config.url, '- Auth header set ✓')
  } else {
    console.error('[API Client] ⚠️ Request to:', config.url, '- NO AUTH TOKEN!')
    console.error('[API Client] Token value is:', authToken)
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid - Clerk will handle redirect
      authToken = null
    }
    return Promise.reject(error)
  }
)
