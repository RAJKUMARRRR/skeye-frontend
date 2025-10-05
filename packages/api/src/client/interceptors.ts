import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

/**
 * Request interceptor to add auth token
 */
export function setupRequestInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (or your auth store)
      const token = localStorage.getItem('auth_token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add organization ID if available
      const orgId = localStorage.getItem('organization_id')
      if (orgId) {
        config.headers['X-Organization-ID'] = orgId
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

/**
 * Response interceptor for error handling
 */
export function setupResponseInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && originalRequest) {
        // Clear auth state
        localStorage.removeItem('auth_token')
        localStorage.removeItem('organization_id')

        // Redirect to login (or emit event for app to handle)
        window.dispatchEvent(new CustomEvent('auth:logout'))

        return Promise.reject(error)
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        window.dispatchEvent(
          new CustomEvent('auth:forbidden', {
            detail: error.response.data,
          })
        )
      }

      // Handle 429 Rate Limit
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after']
        console.warn(`Rate limited. Retry after ${retryAfter} seconds`)
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network error:', error.message)
        window.dispatchEvent(
          new CustomEvent('network:error', {
            detail: error.message,
          })
        )
      }

      return Promise.reject(error)
    }
  )
}
