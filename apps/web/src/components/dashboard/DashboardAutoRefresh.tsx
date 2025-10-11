import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDashboardStore } from '../../stores/dashboardStore'
import { Button, Card } from '@fleet/ui-web'

const REFRESH_INTERVALS = [
  { value: 10, label: '10s' },
  { value: 30, label: '30s' },
  { value: 60, label: '1m' },
  { value: 300, label: '5m' },
  { value: 600, label: '10m' },
]

export function DashboardAutoRefresh() {
  const queryClient = useQueryClient()
  const { autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval } = useDashboardStore()

  useEffect(() => {
    if (!autoRefresh) return

    const intervalId = setInterval(() => {
      // Invalidate all queries to trigger refetch
      queryClient.invalidateQueries()
    }, refreshInterval * 1000)

    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval, queryClient])

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Auto Refresh</h3>
          <Button
            size="sm"
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '⏸️ Pause' : '▶️ Start'}
          </Button>
        </div>

        {autoRefresh && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Refresh Interval</p>
            <div className="grid grid-cols-5 gap-2">
              {REFRESH_INTERVALS.map(interval => (
                <Button
                  key={interval.value}
                  size="sm"
                  variant={refreshInterval === interval.value ? 'default' : 'outline'}
                  onClick={() => setRefreshInterval(interval.value)}
                >
                  {interval.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
