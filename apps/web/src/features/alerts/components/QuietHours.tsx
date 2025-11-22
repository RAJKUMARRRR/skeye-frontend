import { useState } from 'react'
import {
  Card,
  Button,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@fleet/ui-web'
import { Moon } from 'lucide-react'

interface QuietHourRule {
  id: string
  name: string
  startTime: string
  endTime: string
  days: string[]
  excludedSeverities: string[]
  enabled: boolean
}

const DAYS_OF_WEEK = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
]

export function QuietHours() {
  const [rules] = useState<QuietHourRule[]>([
    {
      id: '1',
      name: 'Night Hours',
      startTime: '22:00',
      endTime: '06:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      excludedSeverities: ['low', 'medium'],
      enabled: true,
    },
    {
      id: '2',
      name: 'Weekend Quiet Hours',
      startTime: '00:00',
      endTime: '23:59',
      days: ['sat', 'sun'],
      excludedSeverities: ['low'],
      enabled: false,
    },
  ])

  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('22:00')
  const [endTime, setEndTime] = useState('06:00')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [excludedSeverities, setExcludedSeverities] = useState<string[]>(['low'])

  const handleAddRule = () => {
    if (!name.trim() || selectedDays.length === 0) {
      alert('Please fill all required fields')
      return
    }

    console.log('Adding quiet hours rule:', {
      name,
      startTime,
      endTime,
      days: selectedDays,
      excludedSeverities,
    })

    // Reset form
    setName('')
    setStartTime('22:00')
    setEndTime('06:00')
    setSelectedDays([])
    setExcludedSeverities(['low'])
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const toggleSeverity = (severity: string) => {
    setExcludedSeverities((prev) =>
      prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
    )
  }

  const getDayLabel = (dayValue: string) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayValue)?.label || dayValue
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Moon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Quiet Hours</h4>
            <p className="text-sm text-gray-600 mt-1">
              Suppress non-critical alerts during specified hours. Critical alerts will always be
              delivered regardless of quiet hours settings.
            </p>
          </div>
        </div>
      </Card>

      {/* Add Quiet Hours Rule */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Quiet Hours Rule</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Rule Name *</Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Night Hours"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <Label>Start Time *</Label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <Label>End Time *</Label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Active Days *</Label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.value}
                  size="sm"
                  variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <Label>Suppress Alert Severities</Label>
            <div className="flex gap-2 mt-2">
              {['low', 'medium', 'high'].map((severity) => (
                <Button
                  key={severity}
                  size="sm"
                  variant={excludedSeverities.includes(severity) ? 'default' : 'outline'}
                  onClick={() => toggleSeverity(severity)}
                >
                  {severity}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Critical alerts are always delivered
            </p>
          </div>
        </div>

        <Button onClick={handleAddRule}>Add Rule</Button>
      </Card>

      {/* Existing Rules */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quiet Hours Rules</h3>

        {rules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No quiet hours rules configured
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Time Range</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Suppressed Severities</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    {rule.startTime} - {rule.endTime}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.days.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {getDayLabel(day).substring(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.excludedSeverities.map((severity) => (
                        <Badge key={severity} variant="outline">
                          {severity}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.enabled ? 'default' : 'outline'}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
