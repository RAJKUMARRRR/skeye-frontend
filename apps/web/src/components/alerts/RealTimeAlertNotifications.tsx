import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useWebSocket } from '../../hooks/useWebSocket'
import toast from 'react-hot-toast'
import { Card } from '@fleet/ui-web'

interface Alert {
  id: string
  type: 'speeding' | 'geofence_exit' | 'geofence_enter' | 'harsh_braking' | 'harsh_acceleration' | 'maintenance_due' | 'low_fuel' | 'engine_fault' | 'offline'
  severity: 'low' | 'medium' | 'high' | 'critical'
  vehicleId: string
  vehicleName: string
  message: string
  timestamp: string
  data?: Record<string, unknown>
}

const ALERT_ICONS: Record<Alert['type'], string> = {
  speeding: '⚠️',
  geofence_exit: '🚫',
  geofence_enter: '✅',
  harsh_braking: '🚨',
  harsh_acceleration: '💨',
  maintenance_due: '🔧',
  low_fuel: '⛽',
  engine_fault: '⚙️',
  offline: '📡',
}

const SEVERITY_COLORS: Record<Alert['severity'], string> = {
  low: 'bg-blue-50 border-blue-200 text-blue-900',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  high: 'bg-orange-50 border-orange-200 text-orange-900',
  critical: 'bg-red-50 border-red-200 text-red-900',
}

function AlertToast({ alert }: { alert: Alert }) {
  return (
    <Card className={`p-4 border ${SEVERITY_COLORS[alert.severity]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{ALERT_ICONS[alert.type]}</span>
        <div className="flex-1">
          <div className="font-semibold mb-1">{alert.vehicleName}</div>
          <div className="text-sm">{alert.message}</div>
          <div className="text-xs opacity-75 mt-1">
            {new Date(alert.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface RealTimeAlertNotificationsProps {
  enabled?: boolean
  severityFilter?: Alert['severity'][]
  typeFilter?: Alert['type'][]
  onAlertReceived?: (alert: Alert) => void
}

export function RealTimeAlertNotifications({
  enabled = true,
  severityFilter,
  typeFilter,
  onAlertReceived,
}: RealTimeAlertNotificationsProps) {
  const queryClient = useQueryClient()

  const { data: message } = useWebSocket<{ type: string; alert?: Alert }>({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',
    enabled,
  })

  useEffect(() => {
    if (!enabled || !message || message.type !== 'alert' || !message.alert) {
      return
    }

    const alert = message.alert

    // Apply filters
    if (severityFilter && !severityFilter.includes(alert.severity)) {
      return
    }

    if (typeFilter && !typeFilter.includes(alert.type)) {
      return
    }

    // Show toast notification
    const shouldAutoClose = alert.severity === 'low' || alert.severity === 'medium'
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}
          onClick={() => toast.dismiss(t.id)}
        >
          <AlertToast alert={alert} />
        </div>
      ),
      {
        duration: shouldAutoClose ? 5000 : Infinity,
        position: 'top-right',
      }
    )

    // Play notification sound for critical alerts
    if (alert.severity === 'critical') {
      try {
        const audio = new Audio('/sounds/alert.mp3')
        audio.play().catch(() => {
          // Ignore errors if sound file doesn't exist
        })
      } catch (error) {
        // Ignore errors
      }
    }

    // Invalidate alerts query to refresh the list
    queryClient.invalidateQueries({ queryKey: ['alerts'] })

    // Call custom handler
    onAlertReceived?.(alert)
  }, [message, enabled, severityFilter, typeFilter, onAlertReceived, queryClient])

  // This component doesn't render anything
  return null
}

// Hook to manage alert notifications
export function useAlertNotifications(options?: RealTimeAlertNotificationsProps) {
  const notifications = RealTimeAlertNotifications(options || {})
  return notifications
}
