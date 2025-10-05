export interface FuelTransaction {
  id: string
  organizationId: string
  vehicleId: string
  driverId?: string
  timestamp: string
  location?: { lat: number; lng: number }
  odometer: number
  volume: number
  volumeUnit: 'liters' | 'gallons'
  cost: number
  currency: string
  pricePerUnit: number
  fuelType: string
  station?: string
  paymentMethod?: string
  receiptUrl?: string
  isFull: boolean
  metadata: FuelTransactionMetadata
  createdAt: string
}

export interface FuelTransactionMetadata {
  invoiceNumber?: string
  cardLast4?: string
  notes?: string
}

export interface FuelAnalytics {
  vehicleId: string
  period: {
    start: string
    end: string
  }
  totalVolume: number
  totalCost: number
  totalDistance: number
  avgConsumption: number
  avgCostPerUnit: number
  transactions: number
  anomalies: FuelAnomaly[]
}

export interface FuelAnomaly {
  transactionId: string
  type: 'theft' | 'unusual_consumption' | 'price_spike'
  severity: 'low' | 'medium' | 'high'
  description: string
  detectedAt: string
}
