export interface Report {
  id: string
  organizationId: string
  name: string
  description?: string
  type: string
  format: 'pdf' | 'csv' | 'xlsx' | 'json'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  parameters: ReportParameters
  fileUrl?: string
  fileSize?: number
  generatedBy: string
  generatedAt?: string
  expiresAt?: string
  createdAt: string
}

export interface ReportParameters {
  dateFrom: string
  dateTo: string
  vehicleIds?: string[]
  driverIds?: string[]
  groupIds?: string[]
  metrics?: string[]
  filters?: Record<string, unknown>
}

export interface ReportSchedule {
  id: string
  organizationId: string
  name: string
  reportType: string
  format: 'pdf' | 'csv' | 'xlsx'
  frequency: 'daily' | 'weekly' | 'monthly'
  schedule: ScheduleConfig
  parameters: ReportParameters
  recipients: string[]
  enabled: boolean
  lastRun?: string
  nextRun: string
  createdAt: string
  updatedAt: string
}

export interface ScheduleConfig {
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
  timezone: string
}

export interface ReportTemplate {
  id: string
  organizationId: string
  name: string
  description?: string
  type: string
  parameters: Record<string, unknown>
  createdAt: string
  updatedAt: string
}
