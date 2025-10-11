import { MapMarker, LatLng } from './types'

interface LastKnownLocationIndicatorProps {
  position: LatLng
  timestamp: string
  label?: string
  vehicleId: string
}

export function createLastKnownLocationMarker({
  position,
  timestamp,
  label,
  vehicleId,
}: LastKnownLocationIndicatorProps): MapMarker {
  const now = new Date()
  const lastUpdate = new Date(timestamp)
  const minutesAgo = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000 / 60)

  let statusColor: string
  let statusText: string

  if (minutesAgo < 5) {
    statusColor = 'green'
    statusText = 'Live'
  } else if (minutesAgo < 30) {
    statusColor = 'yellow'
    statusText = `${minutesAgo}m ago`
  } else if (minutesAgo < 60) {
    statusColor = 'orange'
    statusText = `${minutesAgo}m ago`
  } else {
    const hoursAgo = Math.floor(minutesAgo / 60)
    statusColor = 'red'
    statusText = `${hoursAgo}h ago`
  }

  return {
    id: `last-known-${vehicleId}`,
    position,
    label: `${label || 'Vehicle'}\n${statusText}\nLast seen: ${lastUpdate.toLocaleTimeString()}`,
    data: {
      vehicleId,
      timestamp,
      minutesAgo,
      statusColor,
      statusText,
    },
  }
}

interface LastKnownLocationBadgeProps {
  timestamp: string
  className?: string
}

export function LastKnownLocationBadge({ timestamp, className = '' }: LastKnownLocationBadgeProps) {
  const now = new Date()
  const lastUpdate = new Date(timestamp)
  const minutesAgo = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000 / 60)

  let badgeColor: string
  let statusText: string

  if (minutesAgo < 5) {
    badgeColor = 'bg-green-100 text-green-800 border-green-200'
    statusText = '🟢 Live'
  } else if (minutesAgo < 30) {
    badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200'
    statusText = `🟡 ${minutesAgo}m ago`
  } else if (minutesAgo < 60) {
    badgeColor = 'bg-orange-100 text-orange-800 border-orange-200'
    statusText = `🟠 ${minutesAgo}m ago`
  } else {
    const hoursAgo = Math.floor(minutesAgo / 60)
    badgeColor = 'bg-red-100 text-red-800 border-red-200'
    statusText = `🔴 ${hoursAgo}h ago`
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badgeColor} ${className}`}>
      <span>{statusText}</span>
      <span className="ml-2 text-xs opacity-75">
        {lastUpdate.toLocaleTimeString()}
      </span>
    </div>
  )
}
