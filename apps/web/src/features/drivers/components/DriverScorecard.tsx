import { Card, StatCard } from '@fleet/ui-web'

interface DriverScorecardProps {
  driverId: string
}

export function DriverScorecard({ driverId }: DriverScorecardProps) {
  // TODO: Fetch driver performance data
  const mockScore = {
    overall: 85,
    harshBraking: 92,
    speeding: 78,
    idling: 88,
    acceleration: 90,
    trends: {
      overall: { value: 5, isPositive: true },
      harshBraking: { value: 3, isPositive: true },
      speeding: { value: 2, isPositive: false },
    },
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Performance Score</h3>
          <div className="text-5xl font-bold text-blue-600">{mockScore.overall}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">↑ {mockScore.trends.overall.value}%</span>
          <span className="text-gray-600 text-sm">from last month</span>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Harsh Braking"
          value={mockScore.harshBraking}
          icon={<span>🚨</span>}
          variant={mockScore.harshBraking > 85 ? 'success' : 'warning'}
        />
        <StatCard
          label="Speeding"
          value={mockScore.speeding}
          icon={<span>⚡</span>}
          variant={mockScore.speeding > 85 ? 'success' : 'warning'}
        />
        <StatCard
          label="Idling"
          value={mockScore.idling}
          icon={<span>⏸️</span>}
          variant={mockScore.idling > 85 ? 'success' : 'warning'}
        />
        <StatCard
          label="Acceleration"
          value={mockScore.acceleration}
          icon={<span>💨</span>}
          variant={mockScore.acceleration > 85 ? 'success' : 'warning'}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance History</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-600">Performance chart will be displayed here</p>
        </div>
      </Card>
    </div>
  )
}
