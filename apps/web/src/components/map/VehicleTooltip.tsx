interface VehicleTelemetry {
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  timestamp: string
  battery?: number
  altitude?: number
}

interface VehicleTooltipProps {
  name: string
  status: 'active' | 'inactive' | 'maintenance' | 'offline'
  device_type: string
  location?: VehicleTelemetry
  onClose?: () => void
}

export function VehicleTooltip({ name, status, device_type, location, onClose }: VehicleTooltipProps) {
  const statusConfig = {
    active: { color: '#14b8a6', label: 'Active' },
    inactive: { color: '#f59e0b', label: 'Inactive' },
    maintenance: { color: '#ef4444', label: 'Maintenance' },
    offline: { color: '#6b7280', label: 'Offline' }
  }

  const statusStyle = statusConfig[status] || statusConfig.offline

  return (
    <div className="relative">
      {/* Main Card */}
      <div
        className="bg-white rounded shadow-lg p-3 w-[220px]"
        style={{
          border: `3px solid ${statusStyle.color}`
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{name}</h3>
            <span
              className="text-xs font-medium"
              style={{ color: statusStyle.color }}
            >
              {statusStyle.label}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Telemetry Data */}
        {location ? (
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Speed</span>
              <span className="font-semibold text-gray-900">
                {location.speed?.toFixed(1) || '0.0'} km/h
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Heading</span>
              <span className="font-semibold text-gray-900">
                {location.heading?.toFixed(0) || '0'}°
              </span>
            </div>

            {location.battery !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Battery</span>
                <span className="font-semibold text-gray-900">
                  {location.battery.toFixed(0)}%
                </span>
              </div>
            )}

            <div className="flex justify-between pt-1 border-t border-gray-100">
              <span className="text-gray-500">Last Update</span>
              <span className="font-medium text-gray-900">
                {new Date(location.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 text-gray-400">
            <p className="text-xs">No data</p>
          </div>
        )}
      </div>

      {/* Caret pointing down */}
      <div
        className="absolute left-1/2 -bottom-2 transform -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `8px solid ${statusStyle.color}`
        }}
      />
    </div>
  )
}
