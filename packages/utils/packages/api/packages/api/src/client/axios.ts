import axios from 'axios'
import { API_CONFIG } from './config'
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors'

/**
 * Create Axios instance with base configuration
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
})

// Setup interceptors
setupRequestInterceptor(apiClient)
setupResponseInterceptor(apiClient)

/**
 * Generic GET request
 */
export async function get<T>(url: string, config = {}) {
  const response = await apiClient.get<T>(url, config)
  return response.data
}

/**
 * Generic POST request
 */
export async function post<T>(url: string, data?: unknown, config = {}) {
  const response = await apiClient.post<T>(url, data, config)
  return response.data
}

/**
 * Generic PUT request
 */
export async function put<T>(url: string, data?: unknown, config = {}) {
  const response = await apiClient.put<T>(url, data, config)
  return response.data
}

/**
 * Generic PATCH request
 */
export async function patch<T>(url: string, data?: unknown, config = {}) {
  const response = await apiClient.patch<T>(url, data, config)
  return response.data
}

/**
 * Generic DELETE request
 */
export async function del<T>(url: string, config = {}) {
  const response = await apiClient.delete<T>(url, config)
  return response.data
}

export default apiClient
