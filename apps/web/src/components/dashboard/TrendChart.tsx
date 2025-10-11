import { Card, ChartContainer, ChartTooltip, ChartLegend } from '@fleet/ui-web'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

interface TrendDataPoint {
  timestamp: string
  value: number
  label?: string
}

interface TrendChartProps {
  title: string
  data: TrendDataPoint[]
  chartType?: 'line' | 'area'
  color?: string
  comparisonData?: TrendDataPoint[]
  comparisonColor?: string
  valueFormatter?: (value: number) => string
  className?: string
}

export function TrendChart({
  title,
  data,
  chartType = 'line',
  color = '#3b82f6',
  comparisonData,
  comparisonColor = '#94a3b8',
  valueFormatter = (value) => value.toString(),
  className,
}: TrendChartProps) {
  // Merge data for comparison view
  const chartData = data.map((point, index) => ({
    timestamp: point.timestamp,
    current: point.value,
    comparison: comparisonData?.[index]?.value,
    label: point.label,
  }))

  const chartConfig = {
    current: {
      label: 'Current Period',
      color,
    },
    ...(comparisonData && {
      comparison: {
        label: 'Comparison Period',
        color: comparisonColor,
      },
    }),
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className={className}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {comparisonData && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comparisonColor }} />
                <span>Comparison</span>
              </div>
            </div>
          )}
        </div>

        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={valueFormatter}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null
                    return (
                      <Card className="p-3 shadow-lg">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {formatTimestamp(payload[0].payload.timestamp)}
                          </div>
                          {payload.map((entry, index) => (
                            <div key={index} className="text-sm">
                              <span style={{ color: entry.color }}>●</span>{' '}
                              {entry.name}: {valueFormatter(entry.value as number)}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                {comparisonData && (
                  <Line
                    type="monotone"
                    dataKey="comparison"
                    stroke={comparisonColor}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: comparisonColor, r: 4 }}
                  />
                )}
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={valueFormatter}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null
                    return (
                      <Card className="p-3 shadow-lg">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {formatTimestamp(payload[0].payload.timestamp)}
                          </div>
                          {payload.map((entry, index) => (
                            <div key={index} className="text-sm">
                              <span style={{ color: entry.color }}>●</span>{' '}
                              {entry.name}: {valueFormatter(entry.value as number)}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                />
                {comparisonData && (
                  <Area
                    type="monotone"
                    dataKey="comparison"
                    stroke={comparisonColor}
                    fill={comparisonColor}
                    fillOpacity={0.2}
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  )
}
