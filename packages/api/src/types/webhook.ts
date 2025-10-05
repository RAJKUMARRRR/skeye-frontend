export interface Webhook {
  id: string
  organizationId: string
  name: string
  description?: string
  url: string
  secret?: string
  enabled: boolean
  events: string[]
  headers?: Record<string, string>
  retryConfig: WebhookRetryConfig
  lastTriggered?: string
  totalDeliveries: number
  successfulDeliveries: number
  failedDeliveries: number
  createdAt: string
  updatedAt: string
}

export interface WebhookRetryConfig {
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
}

export interface WebhookDelivery {
  id: string
  webhookId: string
  event: string
  payload: Record<string, unknown>
  status: 'pending' | 'success' | 'failed'
  attempts: number
  responseStatus?: number
  responseBody?: string
  error?: string
  deliveredAt?: string
  createdAt: string
}

export interface WebhookEvent {
  event: string
  timestamp: string
  data: Record<string, unknown>
}
