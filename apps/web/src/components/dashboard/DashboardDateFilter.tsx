import { useState } from 'react'
import { useDashboardStore } from '../../stores/dashboardStore'
import { Button, Card } from '@fleet/ui-web'

type DatePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom'

interface DateRange {
  from: Date
  to: Date
}

const DATE_PRESETS: Array<{ value: DatePreset; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' },
]

function getDateRangeFromPreset(preset: DatePreset): DateRange | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (preset) {
    case 'today': {
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return { from: today, to: end }
    }
    case 'yesterday': {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const end = new Date(yesterday)
      end.setHours(23, 59, 59, 999)
      return { from: yesterday, to: end }
    }
    case 'last7days': {
      const from = new Date(today)
      from.setDate(from.getDate() - 6)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return { from, to: end }
    }
    case 'last30days': {
      const from = new Date(today)
      from.setDate(from.getDate() - 29)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return { from, to: end }
    }
    case 'thisMonth': {
      const from = new Date(today.getFullYear(), today.getMonth(), 1)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return { from, to: end }
    }
    case 'lastMonth': {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const to = new Date(today.getFullYear(), today.getMonth(), 0)
      to.setHours(23, 59, 59, 999)
      return { from, to }
    }
    case 'custom':
      return null
  }
}

export function DashboardDateFilter() {
  const { dateRange, setDateRange } = useDashboardStore()
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('today')
  const [showCustom, setShowCustom] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const handlePresetChange = (preset: DatePreset) => {
    setSelectedPreset(preset)

    if (preset === 'custom') {
      setShowCustom(true)
      return
    }

    setShowCustom(false)
    const range = getDateRangeFromPreset(preset)
    if (range) {
      setDateRange(range)
    }
  }

  const handleCustomApply = () => {
    if (!customFrom || !customTo) return

    const from = new Date(customFrom)
    from.setHours(0, 0, 0, 0)
    const to = new Date(customTo)
    to.setHours(23, 59, 59, 999)

    if (from <= to) {
      setDateRange({ from, to })
      setShowCustom(false)
    }
  }

  const formatDateRange = (range: DateRange) => {
    // Convert to Date objects if they're strings (from localStorage)
    const from = range.from instanceof Date ? range.from : new Date(range.from)
    const to = range.to instanceof Date ? range.to : new Date(range.to)

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: from.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }
    return `${from.toLocaleDateString(undefined, options)} - ${to.toLocaleDateString(undefined, options)}`
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Date Range</h3>
          <span className="text-xs text-gray-600">{formatDateRange(dateRange)}</span>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DATE_PRESETS.map(preset => (
            <Button
              key={preset.value}
              size="sm"
              variant={selectedPreset === preset.value ? 'default' : 'outline'}
              onClick={() => handlePresetChange(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range */}
        {showCustom && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                />
              </div>
            </div>
            <Button size="sm" onClick={handleCustomApply} className="w-full">
              Apply Custom Range
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
