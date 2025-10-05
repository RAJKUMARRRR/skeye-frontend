export interface ChecklistTemplate {
  id: string
  organizationId: string
  name: string
  description?: string
  type: 'pre_trip' | 'post_trip' | 'maintenance' | 'safety' | 'custom'
  items: ChecklistItem[]
  requiredForTrip: boolean
  enabled: boolean
  assignedVehicleIds: string[]
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  type: 'checkbox' | 'text' | 'number' | 'photo' | 'signature'
  required: boolean
  options?: string[]
  order: number
}

export interface ChecklistSubmission {
  id: string
  organizationId: string
  templateId: string
  vehicleId: string
  driverId: string
  tripId?: string
  status: 'in_progress' | 'completed'
  responses: ChecklistResponse[]
  location?: { lat: number; lng: number }
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ChecklistResponse {
  itemId: string
  value: string | number | boolean
  photoUrls?: string[]
  signatureUrl?: string
  notes?: string
}
