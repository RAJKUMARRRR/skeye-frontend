import { useState } from 'react'
import { Card, Badge, Button } from '@fleet/ui-web'
import { useNavigate } from 'react-router-dom'

interface MaintenancePrediction {
  id: string
  vehicleId: string
  vehicleName: string
  component: string
  prediction: string
  confidence: number
  estimatedDaysUntilFailure: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  indicators: string[]
  recommendedAction: string
  estimatedCost?: number
}

const mockPredictions: MaintenancePrediction[] = [
  {
    id: '1',
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    component: 'Brake Pads',
    prediction: 'Brake pads showing accelerated wear pattern',
    confidence: 87,
    estimatedDaysUntilFailure: 15,
    severity: 'high',
    indicators: [
      'Brake pad thickness below 4mm',
      'Increased braking distance detected',
      'Unusual vibration patterns during braking',
    ],
    recommendedAction: 'Schedule brake pad replacement within 2 weeks',
    estimatedCost: 8000,
  },
  {
    id: '2',
    vehicleId: '1',
    vehicleName: 'TN-01-AB-1234',
    component: 'Battery',
    prediction: 'Battery showing signs of degradation',
    confidence: 72,
    estimatedDaysUntilFailure: 30,
    severity: 'medium',
    indicators: [
      'Voltage drop below 12.4V when idle',
      'Slower cranking speed detected',
      'Battery age: 34 months',
    ],
    recommendedAction: 'Monitor battery health, plan replacement within 1 month',
    estimatedCost: 6500,
  },
  {
    id: '3',
    vehicleId: '3',
    vehicleName: 'TN-01-EF-9012',
    component: 'Transmission',
    prediction: 'Transmission fluid degradation detected',
    confidence: 65,
    estimatedDaysUntilFailure: 45,
    severity: 'medium',
    indicators: [
      'Transmission temperature 5°C above normal',
      'Minor shifting delays observed',
      'Fluid color analysis shows oxidation',
    ],
    recommendedAction: 'Schedule transmission fluid change',
    estimatedCost: 12000,
  },
  {
    id: '4',
    vehicleId: '4',
    vehicleName: 'TN-01-GH-3456',
    component: 'Engine Oil',
    prediction: 'Oil change interval approaching based on driving patterns',
    confidence: 92,
    estimatedDaysUntilFailure: 7,
    severity: 'high',
    indicators: [
      'Oil life indicator at 15%',
      'High-frequency short trips detected',
      'Engine hours exceed recommended interval',
    ],
    recommendedAction: 'Schedule oil change within 1 week',
    estimatedCost: 2500,
  },
  {
    id: '5',
    vehicleId: '2',
    vehicleName: 'TN-01-CD-5678',
    component: 'Air Filter',
    prediction: 'Air filter showing reduced efficiency',
    confidence: 58,
    estimatedDaysUntilFailure: 60,
    severity: 'low',
    indicators: [
      'Slight decrease in fuel efficiency',
      'Increased engine load',
      'High dust environment detected',
    ],
    recommendedAction: 'Consider air filter replacement at next service',
    estimatedCost: 800,
  },
]

export function PredictiveMaintenance() {
  const navigate = useNavigate()
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')

  const filteredPredictions = mockPredictions.filter(
    (p) => selectedSeverity === 'all' || p.severity === selectedSeverity
  )

  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-blue-100 text-blue-800 border-blue-300',
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getUrgencyText = (days: number) => {
    if (days <= 7) return 'Urgent'
    if (days <= 30) return 'Soon'
    return 'Monitor'
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'bg-red-100 text-red-800'
    if (days <= 30) return 'bg-orange-100 text-orange-800'
    return 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex gap-3">
          <span className="text-2xl">🔮</span>
          <div>
            <h4 className="font-semibold text-purple-900">AI-Powered Predictive Maintenance</h4>
            <p className="text-sm text-purple-800 mt-1">
              Our AI analyzes telemetry data, driving patterns, and historical maintenance records
              to predict potential component failures before they occur. Confidence levels indicate
              prediction accuracy based on available data.
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{mockPredictions.length}</div>
          <div className="text-sm text-gray-600">Active Predictions</div>
        </Card>
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="text-2xl font-bold text-orange-900">
            {mockPredictions.filter((p) => p.severity === 'high').length}
          </div>
          <div className="text-sm text-orange-700">High Priority</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {Math.round(
              mockPredictions.reduce((sum, p) => sum + p.confidence, 0) /
                mockPredictions.length
            )}
            %
          </div>
          <div className="text-sm text-gray-600">Avg Confidence</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            ₹
            {mockPredictions
              .reduce((sum, p) => sum + (p.estimatedCost || 0), 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Est. Total Cost</div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
          <Button
            key={severity}
            size="sm"
            variant={selectedSeverity === severity ? 'default' : 'outline'}
            onClick={() => setSelectedSeverity(severity)}
          >
            {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Button>
        ))}
      </div>

      {/* Predictions */}
      <div className="space-y-4">
        {filteredPredictions.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No predictions for selected severity level
          </Card>
        ) : (
          filteredPredictions.map((prediction) => (
            <Card key={prediction.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{prediction.component}</h3>
                      <Badge variant="outline" className={severityColors[prediction.severity]}>
                        {prediction.severity}
                      </Badge>
                      <Badge variant="outline" className={getUrgencyColor(prediction.estimatedDaysUntilFailure)}>
                        {getUrgencyText(prediction.estimatedDaysUntilFailure)}
                      </Badge>
                    </div>
                    <button
                      onClick={() => navigate(`/vehicles/${prediction.vehicleId}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {prediction.vehicleName}
                    </button>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}%
                    </div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                </div>

                {/* Prediction */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{prediction.prediction}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Indicators */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Key Indicators:</h4>
                    <ul className="space-y-1">
                      {prediction.indicators.map((indicator, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action & Cost */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Recommended Action:</h4>
                      <p className="text-sm text-gray-700">{prediction.recommendedAction}</p>
                    </div>
                    {prediction.estimatedCost && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Estimated Cost:</h4>
                        <p className="text-sm text-gray-700">
                          ₹{prediction.estimatedCost.toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Estimated Time Until Issue:</h4>
                      <p className="text-sm text-gray-700">
                        {prediction.estimatedDaysUntilFailure} days
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">Schedule Maintenance</Button>
                  <Button size="sm" variant="outline">
                    Dismiss
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <Card className="p-4 bg-gray-50">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Predictions are based on AI analysis of telemetry data and
          historical patterns. Actual maintenance requirements may vary. Always consult with
          qualified technicians for final assessment.
        </p>
      </Card>
    </div>
  )
}
