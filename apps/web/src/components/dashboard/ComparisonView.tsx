import { useMemo } from 'react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { Card } from '@fleet/ui-web'

interface MetricComparison {
  label: string
  currentValue: number
  previousValue: number
  formatter?: (value: number) => string
}

interface ComparisonViewProps {
  metrics: MetricComparison[]
  className?: string
}

export function ComparisonView({ metrics, className }: ComparisonViewProps) {
  const { comparisonMode, dateRange, comparisonDateRange } = useDashboardStore()

  const comparisonMetrics = useMemo(() => {
    return metrics.map(metric => {
      const difference = metric.currentValue - metric.previousValue
      const percentageChange =
        metric.previousValue !== 0
          ? (difference / metric.previousValue) * 100
          : 0

      const isPositive = difference > 0
      const isNegative = difference < 0

      return {
        ...metric,
        difference,
        percentageChange,
        isPositive,
        isNegative,
        formattedCurrent: metric.formatter
          ? metric.formatter(metric.currentValue)
          : metric.currentValue.toLocaleString(),
        formattedPrevious: metric.formatter
          ? metric.formatter(metric.previousValue)
          : metric.previousValue.toLocaleString(),
        formattedDifference: metric.formatter
          ? metric.formatter(Math.abs(difference))
          : Math.abs(difference).toLocaleString(),
      }
    })
  }, [metrics])

  if (!comparisonMode) {
    return null
  }

  return (
    <Card className={className}>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Period Comparison</h3>
          <div className="text-sm text-gray-600">
            <div>
              Current: {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
            </div>
            {comparisonDateRange && (
              <div>
                Previous: {comparisonDateRange.from.toLocaleDateString()} -{' '}
                {comparisonDateRange.to.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {comparisonMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  {metric.isPositive && (
                    <span className="text-green-600 text-sm">↑</span>
                  )}
                  {metric.isNegative && (
                    <span className="text-red-600 text-sm">↓</span>
                  )}
                  <span
                    className={`text-sm font-medium ${
                      metric.isPositive
                        ? 'text-green-600'
                        : metric.isNegative
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {metric.percentageChange > 0 ? '+' : ''}
                    {metric.percentageChange.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Current Period</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.formattedCurrent}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Previous Period</div>
                  <div className="text-2xl font-bold text-gray-500">
                    {metric.formattedPrevious}
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  Difference:{' '}
                  <span
                    className={`font-medium ${
                      metric.isPositive
                        ? 'text-green-600'
                        : metric.isNegative
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {metric.isPositive ? '+' : metric.isNegative ? '-' : ''}
                    {metric.formattedDifference}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
