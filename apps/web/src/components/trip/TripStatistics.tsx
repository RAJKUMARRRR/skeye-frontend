import { Card } from '@fleet/ui-web'

interface TripStatisticsProps {
  statistics: {
    duration: number // in seconds
    distance: number // in km
    averageSpeed: number // in km/h
    maxSpeed: number // in km/h
    idleTime: number // in seconds
    fuelConsumed?: number // in liters
    startTime: string
    endTime: string
    stops?: number
    hardBrakes?: number
    hardAccelerations?: number
  }
  className?: string
}

export function TripStatistics({ statistics, className }: TripStatisticsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const stats = [
    {
      label: 'Duration',
      value: formatDuration(statistics.duration),
      icon: '⏱️',
    },
    {
      label: 'Distance',
      value: `${statistics.distance.toFixed(2)} km`,
      icon: '📍',
    },
    {
      label: 'Avg Speed',
      value: `${statistics.averageSpeed.toFixed(1)} km/h`,
      icon: '🚗',
    },
    {
      label: 'Max Speed',
      value: `${statistics.maxSpeed.toFixed(1)} km/h`,
      icon: '⚡',
    },
    {
      label: 'Idle Time',
      value: formatDuration(statistics.idleTime),
      icon: '⏸️',
    },
    {
      label: 'Fuel Consumed',
      value: statistics.fuelConsumed ? `${statistics.fuelConsumed.toFixed(2)} L` : 'N/A',
      icon: '⛽',
      show: statistics.fuelConsumed !== undefined,
    },
    {
      label: 'Stops',
      value: statistics.stops?.toString() || 'N/A',
      icon: '🛑',
      show: statistics.stops !== undefined,
    },
    {
      label: 'Hard Brakes',
      value: statistics.hardBrakes?.toString() || 'N/A',
      icon: '🚨',
      show: statistics.hardBrakes !== undefined,
      status: statistics.hardBrakes && statistics.hardBrakes > 5 ? 'warning' : undefined,
    },
    {
      label: 'Hard Accelerations',
      value: statistics.hardAccelerations?.toString() || 'N/A',
      icon: '💨',
      show: statistics.hardAccelerations !== undefined,
      status: statistics.hardAccelerations && statistics.hardAccelerations > 5 ? 'warning' : undefined,
    },
  ].filter(stat => stat.show !== false)

  return (
    <Card className={className}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Trip Statistics</h3>

        {/* Time Range */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Trip Period</div>
          <div className="text-sm font-medium">
            {new Date(statistics.startTime).toLocaleString()} → {new Date(statistics.endTime).toLocaleString()}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`p-3 rounded-lg border ${
                stat.status === 'warning'
                  ? 'border-yellow-200 bg-yellow-50'
                  : stat.status === 'danger'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{stat.icon}</span>
                <span className="text-xs text-gray-600">{stat.label}</span>
              </div>
              <div className={`text-lg font-semibold ${
                stat.status === 'warning'
                  ? 'text-yellow-800'
                  : stat.status === 'danger'
                  ? 'text-red-800'
                  : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Efficiency Score (if applicable) */}
        {statistics.hardBrakes !== undefined && statistics.hardAccelerations !== undefined && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-600 font-medium mb-1">Driving Score</div>
            <div className="text-2xl font-bold text-blue-900">
              {Math.max(0, 100 - (statistics.hardBrakes + statistics.hardAccelerations) * 5)}/100
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Based on smooth driving behavior
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
