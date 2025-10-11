import { Card } from '@fleet/ui-web'

interface TelemetryData {
  speed: number
  heading: number
  altitude?: number
  battery?: number
  fuel?: number
  engineTemp?: number
  rpm?: number
  odometer?: number
  satellites?: number
  signalStrength?: number
}

interface VehicleTelemetryProps {
  data: TelemetryData
  className?: string
}

export function VehicleTelemetry({ data, className }: VehicleTelemetryProps) {
  const telemetryItems = [
    {
      label: 'Speed',
      value: `${data.speed} km/h`,
      icon: '🚀',
      show: true,
    },
    {
      label: 'Heading',
      value: `${data.heading}°`,
      icon: '🧭',
      show: true,
    },
    {
      label: 'Altitude',
      value: data.altitude ? `${data.altitude} m` : 'N/A',
      icon: '⛰️',
      show: data.altitude !== undefined,
    },
    {
      label: 'Battery',
      value: data.battery ? `${data.battery}%` : 'N/A',
      icon: '🔋',
      show: data.battery !== undefined,
      status: data.battery && data.battery < 20 ? 'warning' : undefined,
    },
    {
      label: 'Fuel',
      value: data.fuel ? `${data.fuel}%` : 'N/A',
      icon: '⛽',
      show: data.fuel !== undefined,
      status: data.fuel && data.fuel < 20 ? 'warning' : undefined,
    },
    {
      label: 'Engine Temp',
      value: data.engineTemp ? `${data.engineTemp}°C` : 'N/A',
      icon: '🌡️',
      show: data.engineTemp !== undefined,
      status: data.engineTemp && data.engineTemp > 100 ? 'danger' : undefined,
    },
    {
      label: 'RPM',
      value: data.rpm ? `${data.rpm}` : 'N/A',
      icon: '⚙️',
      show: data.rpm !== undefined,
    },
    {
      label: 'Odometer',
      value: data.odometer ? `${data.odometer.toLocaleString()} km` : 'N/A',
      icon: '📊',
      show: data.odometer !== undefined,
    },
    {
      label: 'Satellites',
      value: data.satellites ? `${data.satellites}` : 'N/A',
      icon: '🛰️',
      show: data.satellites !== undefined,
      status: data.satellites && data.satellites < 4 ? 'warning' : undefined,
    },
    {
      label: 'Signal',
      value: data.signalStrength ? `${data.signalStrength}%` : 'N/A',
      icon: '📶',
      show: data.signalStrength !== undefined,
      status: data.signalStrength && data.signalStrength < 30 ? 'warning' : undefined,
    },
  ].filter(item => item.show)

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-4">Vehicle Telemetry</h3>
      <div className="grid grid-cols-2 gap-4">
        {telemetryItems.map((item) => (
          <div
            key={item.label}
            className={`p-3 rounded-lg border ${
              item.status === 'warning'
                ? 'border-yellow-200 bg-yellow-50'
                : item.status === 'danger'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{item.icon}</span>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
            <div className={`text-lg font-semibold ${
              item.status === 'warning'
                ? 'text-yellow-800'
                : item.status === 'danger'
                ? 'text-red-800'
                : 'text-gray-900'
            }`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
