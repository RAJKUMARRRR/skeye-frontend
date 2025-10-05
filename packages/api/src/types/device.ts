export interface Device {
  id: string
  organizationId: string
  serialNumber: string
  imei?: string
  model: string
  firmwareVersion: string
  status: 'active' | 'inactive' | 'maintenance'
  connectionStatus: 'online' | 'offline'
  lastConnection?: string
  signalStrength?: number
  batteryLevel?: number
  assignedVehicleId?: string
  metadata: DeviceMetadata
  createdAt: string
  updatedAt: string
}

export interface DeviceMetadata {
  installationDate?: string
  installer?: string
  notes?: string
}
